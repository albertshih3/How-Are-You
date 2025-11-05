"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
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

  // Convex hooks
  const hasSetup = useQuery(api.users.hasEncryptionSetup) ?? false;
  const encryptionKeyData = useQuery(api.users.getEncryptionKey);
  const storeEncryptionKeyMutation = useMutation(api.users.storeEncryptionKey);

  const isLoading = hasSetup === undefined || encryptionKeyData === undefined;
  const isUnlocked = decryptionKey !== null;

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
      } catch (err) {
        console.error("Failed to unlock encryption:", err);
        setError("Incorrect passphrase. Please try again.");
        throw err;
      }
    },
    [encryptionKeyData]
  );

  /**
   * Lock encryption by clearing the decryption key from memory.
   */
  const lock = useCallback(() => {
    setDecryptionKey(null);
    setError(null);
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
