import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEncryption } from "@/contexts/EncryptionContext";
import { decryptBlob } from "@/lib/crypto/encryption";

/**
 * Custom hook to fetch and decrypt encrypted images from Convex storage.
 *
 * @param storageId - Convex storage ID for the encrypted image
 * @param iv - Base64-encoded initialization vector used during encryption
 * @returns Object with decrypted image URL, loading state, and error message
 */
export function useDecryptedImage(
  storageId: string | undefined,
  iv: string | undefined
): { imageUrl: string | null; isLoading: boolean; error: string | null } {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { decryptionKey, isUnlocked } = useEncryption();

  // Fetch the encrypted image URL from Convex
  const encryptedImageUrl = useQuery(
    api.entries.getImageUrl,
    storageId ? { storageId } : "skip"
  );

  useEffect(() => {
    // Reset state when inputs change
    if (!storageId || !iv) {
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Check if encryption is unlocked
    if (!isUnlocked || !decryptionKey) {
      setError("Encryption not unlocked");
      setIsLoading(false);
      return;
    }

    // Wait for Convex query to complete
    if (encryptedImageUrl === undefined) {
      setIsLoading(true);
      return;
    }

    if (!encryptedImageUrl) {
      setError("Image not found");
      setIsLoading(false);
      return;
    }

    let currentUrl: string | null = null;

    // Decrypt the image
    const decryptImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the encrypted blob
        const response = await fetch(encryptedImageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch encrypted image");
        }

        const encryptedArrayBuffer = await response.arrayBuffer();

        // Decrypt the blob
        const decryptedArrayBuffer = await decryptBlob(
          encryptedArrayBuffer,
          iv,
          decryptionKey
        );

        // Create object URL from decrypted data
        const blob = new Blob([decryptedArrayBuffer]);
        const url = URL.createObjectURL(blob);

        currentUrl = url;
        setImageUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to decrypt image:", err);
        setError("Unable to decrypt image");
        setIsLoading(false);
      }
    };

    decryptImage();

    // Cleanup: Revoke object URL on unmount to prevent memory leaks
    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [storageId, iv, encryptedImageUrl, decryptionKey, isUnlocked]);

  return { imageUrl, isLoading, error };
}
