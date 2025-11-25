"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@convex/_generated/api";
import {
  generateEncryptionKey,
  deriveKeyFromPassphrase,
  wrapKey,
  unwrapKey,
  generateSalt,
  arrayBufferToBase64,
  base64ToArrayBuffer,
  getPbkdf2Iterations,
} from "@/lib/crypto/encryption";

// Storage key for persisting encryption key
const STORAGE_KEY = "howareyou_encryption_key";

/**
 * Save CryptoKey to storage as base64-encoded raw key material.
 * @param key - The CryptoKey to save
 * @param remember - If true, save to localStorage (persistent). If false, save to sessionStorage (session only).
 */
async function saveKeyToStorage(key: CryptoKey, remember: boolean): Promise<void> {
  try {
    // Export key as raw ArrayBuffer
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    // Convert to base64 for storage
    const base64Key = arrayBufferToBase64(rawKey);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, base64Key);
      // Clear session storage to avoid duplicates/confusion
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, base64Key);
      // Clear local storage to ensure we respect the "don't remember" choice
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save key to storage:", error);
  }
}

/**
 * Load CryptoKey from storage (local or session) and import back to CryptoKey format.
 * Checks localStorage first, then sessionStorage.
 */
async function loadKeyFromStorage(): Promise<CryptoKey | null> {
  try {
    // Check localStorage first (persistent)
    let base64Key = localStorage.getItem(STORAGE_KEY);

    // Fallback to sessionStorage
    if (!base64Key) {
      base64Key = sessionStorage.getItem(STORAGE_KEY);
    }

    if (!base64Key) {
      return null;
    }

    // Convert base64 back to ArrayBuffer
    const rawKey = base64ToArrayBuffer(base64Key);

    // Import as AES-GCM key
    const key = await window.crypto.subtle.importKey(
      "raw",
      rawKey,
      { name: "AES-GCM", length: 256 },
      true, // extractable
      ["encrypt", "decrypt"]
    );

    return key;
  } catch (error) {
    console.error("Failed to load key from storage:", error);
    // Clear corrupted data
    clearKeyFromStorage();
    return null;
  }
}

/**
 * Clear encryption key from both storages.
 */
function clearKeyFromStorage(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear key from storage:", error);
  }
}

interface EncryptionContextType {
  decryptionKey: CryptoKey | null;
  isUnlocked: boolean;
  isLoading: boolean;
  hasSetup: boolean;
  setupEncryption: (passphrase: string, shouldRemember?: boolean) => Promise<void>;
  unlockWithPassphrase: (passphrase: string, shouldRemember?: boolean) => Promise<void>;
  lock: () => void;
  error: string | null;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const [decryptionKey, setDecryptionKey] = useState<CryptoKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Clerk user hook to detect sign-out
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  // Convex hooks
  const hasSetup = useQuery(api.users.hasEncryptionSetup) ?? false;
  const encryptionKeyData = useQuery(api.users.getEncryptionKey);
  const storeEncryptionKeyMutation = useMutation(api.users.storeEncryptionKey);

  const isLoading = hasSetup === undefined || encryptionKeyData === undefined || isInitializing;
  const isUnlocked = decryptionKey !== null;

  /**
   * Load encryption key from storage on mount.
   */
  useEffect(() => {
    async function initializeKey() {
      try {
        const storedKey = await loadKeyFromStorage();
        if (storedKey) {
          setDecryptionKey(storedKey);
        }
      } catch (error) {
        console.error("Failed to initialize encryption key:", error);
      } finally {
        setIsInitializing(false);
      }
    }

    initializeKey();
  }, []);

  /**
   * Clear encryption key when user signs out.
   */
  useEffect(() => {
    if (userLoaded && !isSignedIn) {
      // User has signed out
      setDecryptionKey(null);
      clearKeyFromStorage();
      setError(null);
    }
  }, [isSignedIn, userLoaded]);

  /**
   * Setup encryption for the first time.
   */
  const setupEncryption = useCallback(
    async (passphrase: string, shouldRemember: boolean = false) => {
      try {
        setError(null);

        // Generate random DEK (Data Encryption Key)
        const dek = await generateEncryptionKey();

        // Generate random salt for PBKDF2
        const salt = generateSalt();
        const saltB64 = arrayBufferToBase64(salt);

        // Derive KEK (Key Encryption Key) from passphrase
        const kek = await deriveKeyFromPassphrase(passphrase, salt);

        // Wrap DEK with KEK
        const { wrappedKey, iv } = await wrapKey(dek, kek);

        // Store wrapped key in Convex
        await storeEncryptionKeyMutation({
          encryptedKey: wrappedKey,
          salt: saltB64,
          iv: iv,
          iterations: getPbkdf2Iterations(),
        });

        // Cache DEK in memory
        setDecryptionKey(dek);

        // Persist DEK to storage
        await saveKeyToStorage(dek, shouldRemember);
      } catch (err) {
        console.error("Failed to setup encryption:", err);
        setError("Failed to setup encryption. Please try again.");
        throw err;
      }
    },
    [storeEncryptionKeyMutation]
  );

  /**
   * Unlock encryption with user's passphrase.
   */
  const unlockWithPassphrase = useCallback(
    async (passphrase: string, shouldRemember: boolean = false) => {
      try {
        setError(null);

        if (!encryptionKeyData) {
          throw new Error("No encryption key found");
        }

        if (
          !encryptionKeyData.encryptedKey ||
          !encryptionKeyData.salt ||
          !encryptionKeyData.iv
        ) {
          throw new Error("Incomplete encryption key data");
        }

        // Derive KEK from passphrase using stored salt
        const salt = base64ToArrayBuffer(encryptionKeyData.salt);
        const kek = await deriveKeyFromPassphrase(passphrase, new Uint8Array(salt));

        // Unwrap DEK
        const dek = await unwrapKey(
          encryptionKeyData.encryptedKey,
          encryptionKeyData.iv,
          kek
        );

        // Cache DEK in memory
        setDecryptionKey(dek);

        // Persist DEK to storage
        await saveKeyToStorage(dek, shouldRemember);
      } catch (err) {
        console.error("Failed to unlock encryption:", err);
        setError("Incorrect passphrase. Please try again.");
        throw err;
      }
    },
    [encryptionKeyData]
  );

  /**
   * Lock encryption by clearing the decryption key from memory and storage.
   */
  const lock = useCallback(() => {
    setDecryptionKey(null);
    setError(null);
    clearKeyFromStorage();
  }, []);

  const value: EncryptionContextType = {
    decryptionKey,
    isUnlocked,
    isLoading,
    hasSetup,
    setupEncryption,
    unlockWithPassphrase,
    lock,
    error,
  };

  return <EncryptionContext.Provider value={value}>{children}</EncryptionContext.Provider>;
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error("useEncryption must be used within an EncryptionProvider");
  }
  return context;
}
