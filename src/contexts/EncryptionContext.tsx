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

// SessionStorage key for persisting encryption key
const STORAGE_KEY = "howareyou_encryption_key";

/**
 * Save CryptoKey to sessionStorage as base64-encoded raw key material.
 * This allows the key to persist across page navigation within the same session.
 */
async function saveKeyToSession(key: CryptoKey): Promise<void> {
  try {
    // Export key as raw ArrayBuffer
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    // Convert to base64 for storage
    const base64Key = arrayBufferToBase64(rawKey);
    // Store in sessionStorage (cleared on tab close)
    sessionStorage.setItem(STORAGE_KEY, base64Key);
  } catch (error) {
    console.error("Failed to save key to session:", error);
    // Non-fatal: If storage fails, user just needs to unlock again on next navigation
  }
}

/**
 * Load CryptoKey from sessionStorage and import back to CryptoKey format.
 * Returns null if no key exists or if import fails.
 */
async function loadKeyFromSession(): Promise<CryptoKey | null> {
  try {
    const base64Key = sessionStorage.getItem(STORAGE_KEY);
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
    console.error("Failed to load key from session:", error);
    // Clear corrupted data
    clearKeyFromSession();
    return null;
  }
}

/**
 * Clear encryption key from sessionStorage.
 * Called on lock() and sign-out.
 */
function clearKeyFromSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear key from session:", error);
  }
}

interface EncryptionContextType {
  decryptionKey: CryptoKey | null;
  isUnlocked: boolean;
  isLoading: boolean;
  hasSetup: boolean;
  setupEncryption: (passphrase: string) => Promise<void>;
  unlockWithPassphrase: (passphrase: string) => Promise<void>;
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
   * Load encryption key from sessionStorage on mount.
   * This allows key to persist across navigation within the same session.
   */
  useEffect(() => {
    async function initializeKey() {
      try {
        const storedKey = await loadKeyFromSession();
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
   * This ensures the key doesn't persist after logout.
   */
  useEffect(() => {
    if (userLoaded && !isSignedIn) {
      // User has signed out
      setDecryptionKey(null);
      clearKeyFromSession();
      setError(null);
    }
  }, [isSignedIn, userLoaded]);

  /**
   * Setup encryption for the first time.
   * Generates a new DEK, wraps it with KEK derived from passphrase, and stores it.
   */
  const setupEncryption = useCallback(
    async (passphrase: string) => {
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

        // Persist DEK to sessionStorage for this session
        await saveKeyToSession(dek);
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
   * Derives KEK from passphrase and unwraps the stored DEK.
   */
  const unlockWithPassphrase = useCallback(
    async (passphrase: string) => {
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

        // Persist DEK to sessionStorage for this session
        await saveKeyToSession(dek);
      } catch (err) {
        console.error("Failed to unlock encryption:", err);
        setError("Incorrect passphrase. Please try again.");
        throw err;
      }
    },
    [encryptionKeyData]
  );

  /**
   * Lock encryption by clearing the decryption key from memory and sessionStorage.
   */
  const lock = useCallback(() => {
    setDecryptionKey(null);
    setError(null);
    clearKeyFromSession();
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
