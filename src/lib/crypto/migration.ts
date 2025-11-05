/**
 * Migration utilities for converting plaintext entries to encrypted entries.
 *
 * This module handles the one-time migration of existing plaintext journal entries
 * to encrypted format after the user sets up encryption for the first time.
 */

import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { encryptEntry } from "./encryption";
import { Id } from "@convex/_generated/dataModel";

/**
 * Migrate all existing plaintext entries to encrypted format.
 *
 * This function:
 * 1. Fetches all user entries
 * 2. Identifies entries that have plaintext data (notes or tags)
 * 3. Encrypts the plaintext data
 * 4. Updates each entry with encrypted data and clears plaintext fields
 * 5. Reports progress via callback
 *
 * Note: This function must be called from a React component context
 * because it uses Convex hooks.
 */
export async function migrateExistingEntries(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // This is a placeholder - the actual implementation will be in a hook
  // because we need access to Convex queries/mutations
  throw new Error(
    "migrateExistingEntries should be called via useMigrateEntries hook"
  );
}

/**
 * Custom hook for migrating entries.
 * Must be used within a React component with EncryptionContext available.
 */
export function useMigrateEntries() {
  const getAllEntries = useQuery(api.entries.getAllUserEntries);
  const updateEntryEncryption = useMutation(api.entries.updateEntryEncryption);

  const migrateEntries = async (
    decryptionKey: CryptoKey,
    onProgress?: (current: number, total: number) => void
  ): Promise<void> => {
    if (!getAllEntries) {
      throw new Error("Cannot fetch entries");
    }

    // Find entries that have plaintext data
    const entriesToMigrate = getAllEntries.filter(
      (entry) =>
        (entry.notes && entry.notes.trim().length > 0) ||
        (entry.tags && entry.tags.length > 0)
    );

    const total = entriesToMigrate.length;

    if (total === 0) {
      // No entries to migrate
      onProgress?.(0, 0);
      return;
    }

    // Migrate each entry
    for (let i = 0; i < entriesToMigrate.length; i++) {
      const entry = entriesToMigrate[i];

      // Extract plaintext data
      const notes = entry.notes ?? "";
      const tags = entry.tags ?? [];

      // Encrypt the data
      const { encryptedNotes, encryptedTags, iv } = await encryptEntry(
        notes,
        tags,
        decryptionKey
      );

      // Update the entry in Convex
      await updateEntryEncryption({
        entryId: entry._id,
        encryptedNotes,
        encryptedTags,
        iv,
      });

      // Report progress
      onProgress?.(i + 1, total);
    }
  };

  return migrateEntries;
}

/**
 * Check if a user has any unmigrated plaintext entries.
 */
export function useHasUnmigratedEntries(): boolean {
  const getAllEntries = useQuery(api.entries.getAllUserEntries);

  if (!getAllEntries) {
    return false;
  }

  return getAllEntries.some(
    (entry) =>
      (entry.notes && entry.notes.trim().length > 0) ||
      (entry.tags && entry.tags.length > 0)
  );
}
