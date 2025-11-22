/**
 * End-to-End Encryption Utilities
 *
 * This module provides client-side encryption/decryption utilities using the Web Crypto API.
 *
 * Architecture:
 * - AES-256-GCM for data encryption (authenticated encryption)
 * - PBKDF2 for key derivation from user passphrase
 * - Wrapped key approach: Random DEK (Data Encryption Key) per user, encrypted with KEK (Key Encryption Key)
 *
 * Security Properties:
 * - 256-bit encryption keys
 * - Unique IV per encryption operation (prevents pattern analysis)
 * - AES-GCM provides both confidentiality and integrity
 * - PBKDF2 with 100,000+ iterations (OWASP recommendation)
 */

// --- Constants ---

/** PBKDF2 iterations (OWASP 2023 recommendation: 100,000 minimum for PBKDF2-SHA256) */
const PBKDF2_ITERATIONS = 100000;

/** AES-GCM IV size in bytes (12 bytes / 96 bits is recommended by NIST) */
const AES_GCM_IV_SIZE = 12;

/** PBKDF2 salt size in bytes (128 bits minimum) */
const SALT_SIZE = 16;

// --- Key Generation and Management ---

/**
 * Generate a random 256-bit AES-GCM encryption key.
 * This is the DEK (Data Encryption Key) used for encrypting user data.
 *
 * @returns CryptoKey with usage: ["encrypt", "decrypt"]
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable (needed for wrapping)
    ["encrypt", "decrypt"]
  );
}

/**
 * Derive a 256-bit AES-GCM key from a user passphrase using PBKDF2.
 * This is the KEK (Key Encryption Key) used for wrapping/unwrapping the DEK.
 *
 * @param passphrase - User's passphrase (should be at least 12 characters)
 * @param salt - Random salt (16 bytes)
 * @returns CryptoKey with usage: ["wrapKey", "unwrapKey"]
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  // Import passphrase as raw key material
  const encoder = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive AES-256-GCM key using PBKDF2
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passphraseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false, // not extractable (KEK should never leave crypto module)
    ["wrapKey", "unwrapKey"]
  );
}

/**
 * Wrap (encrypt) a key using another key.
 * Used to encrypt the DEK with the KEK before storing it.
 *
 * @param keyToWrap - The DEK to be wrapped
 * @param wrappingKey - The KEK used for wrapping
 * @returns Object with base64-encoded wrapped key and IV
 */
export async function wrapKey(
  keyToWrap: CryptoKey,
  wrappingKey: CryptoKey
): Promise<{ wrappedKey: string; iv: string }> {
  // Generate random IV for this wrapping operation
  const iv = window.crypto.getRandomValues(new Uint8Array(AES_GCM_IV_SIZE));

  // Wrap the key using AES-GCM
  const wrappedKeyBuffer = await window.crypto.subtle.wrapKey(
    "raw",
    keyToWrap,
    wrappingKey,
    {
      name: "AES-GCM",
      iv: iv,
    }
  );

  return {
    wrappedKey: arrayBufferToBase64(wrappedKeyBuffer),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Unwrap (decrypt) a wrapped key.
 * Used to decrypt the DEK using the KEK.
 *
 * @param wrappedKeyB64 - Base64-encoded wrapped key
 * @param ivB64 - Base64-encoded IV used during wrapping
 * @param unwrappingKey - The KEK used for unwrapping
 * @returns Unwrapped CryptoKey with usage: ["encrypt", "decrypt"]
 * @throws Error if the passphrase is incorrect or data is corrupted
 */
export async function unwrapKey(
  wrappedKeyB64: string,
  ivB64: string,
  unwrappingKey: CryptoKey
): Promise<CryptoKey> {
  const wrappedKeyBuffer = base64ToArrayBuffer(wrappedKeyB64);
  const iv = base64ToArrayBuffer(ivB64);

  try {
    return await window.crypto.subtle.unwrapKey(
      "raw",
      wrappedKeyBuffer,
      unwrappingKey,
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // extractable (needed for future re-wrapping if needed)
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    // Unwrapping fails if passphrase is wrong or data is corrupted
    throw new Error("Failed to unwrap key. Incorrect passphrase or corrupted data.");
  }
}

// --- Data Encryption/Decryption ---

/**
 * Encrypt data using AES-GCM.
 *
 * @param data - String data to encrypt
 * @param key - AES-GCM encryption key (DEK)
 * @returns Object with base64-encoded ciphertext and IV
 */
export async function encryptData(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  // Generate unique random IV for this encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(AES_GCM_IV_SIZE));

  // Encode data as UTF-8
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Encrypt with AES-GCM
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    dataBuffer
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypt data using AES-GCM.
 *
 * @param ciphertextB64 - Base64-encoded ciphertext
 * @param ivB64 - Base64-encoded IV
 * @param key - AES-GCM decryption key (DEK)
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails (wrong key, corrupted data, or tampered ciphertext)
 */
export async function decryptData(
  ciphertextB64: string,
  ivB64: string,
  key: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(ciphertextB64);
  const iv = base64ToArrayBuffer(ivB64);

  try {
    // Decrypt with AES-GCM
    const plaintextBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      ciphertext
    );

    // Decode as UTF-8
    const decoder = new TextDecoder();
    return decoder.decode(plaintextBuffer);
  } catch (error) {
    // Decryption fails if key is wrong, data is corrupted, or auth tag doesn't match
    throw new Error("Failed to decrypt data. Wrong key or corrupted data.");
  }
}

/**
 * Encrypt binary data (Blob/ArrayBuffer) using AES-GCM.
 *
 * @param data - ArrayBuffer data to encrypt
 * @param key - AES-GCM encryption key (DEK)
 * @returns Object with encrypted ArrayBuffer and base64-encoded IV
 */
export async function encryptBlob(
  data: ArrayBuffer,
  key: CryptoKey
): Promise<{ encryptedData: ArrayBuffer; iv: string }> {
  // Generate unique random IV for this encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(AES_GCM_IV_SIZE));

  // Encrypt with AES-GCM
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  return {
    encryptedData: encryptedBuffer,
    iv: arrayBufferToBase64(iv),
  };
}

/**
 * Decrypt binary data (Blob/ArrayBuffer) using AES-GCM.
 *
 * @param encryptedData - Encrypted ArrayBuffer
 * @param ivB64 - Base64-encoded IV
 * @param key - AES-GCM decryption key (DEK)
 * @returns Decrypted ArrayBuffer
 */
export async function decryptBlob(
  encryptedData: ArrayBuffer,
  ivB64: string,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const iv = base64ToArrayBuffer(ivB64);

  try {
    // Decrypt with AES-GCM
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      encryptedData
    );
  } catch (error) {
    throw new Error("Failed to decrypt blob. Wrong key or corrupted data.");
  }
}

// --- Entry-Specific Helpers ---

/**
 * Encrypt a mental health entry's sensitive fields (notes and tags).
 * Uses a single IV for both fields since they're part of the same logical entry.
 *
 * @param notes - Entry notes (free text)
 * @param tags - Entry tags (array of strings)
 * @param key - AES-GCM encryption key (DEK)
 * @returns Object with encrypted notes, encrypted tags (as JSON string), and shared IV
 */
export async function encryptEntry(
  notes: string,
  tags: string[],
  key: CryptoKey
): Promise<{ encryptedNotes: string; encryptedTags: string; iv: string }> {
  // Generate single IV for this entry
  const iv = window.crypto.getRandomValues(new Uint8Array(AES_GCM_IV_SIZE));
  const ivB64 = arrayBufferToBase64(iv);

  // Encrypt notes
  const encoder = new TextEncoder();
  const notesBuffer = encoder.encode(notes);
  const encryptedNotesBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    notesBuffer
  );

  // Encrypt tags (as JSON string)
  const tagsJson = JSON.stringify(tags);
  const tagsBuffer = encoder.encode(tagsJson);
  const encryptedTagsBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    tagsBuffer
  );

  return {
    encryptedNotes: arrayBufferToBase64(encryptedNotesBuffer),
    encryptedTags: arrayBufferToBase64(encryptedTagsBuffer),
    iv: ivB64,
  };
}

/**
 * Decrypt a mental health entry's sensitive fields.
 *
 * @param encryptedNotes - Base64-encoded encrypted notes (optional)
 * @param encryptedTags - Base64-encoded encrypted tags JSON (optional)
 * @param iv - Base64-encoded IV
 * @param key - AES-GCM decryption key (DEK)
 * @returns Object with plaintext notes and tags array
 */
export async function decryptEntry(
  encryptedNotes: string | undefined,
  encryptedTags: string | undefined,
  iv: string,
  key: CryptoKey
): Promise<{ notes: string; tags: string[] }> {
  const decoder = new TextDecoder();
  const ivBuffer = base64ToArrayBuffer(iv);

  let notes = "";
  let tags: string[] = [];

  try {
    // Decrypt notes if present
    if (encryptedNotes) {
      const notesBuffer = base64ToArrayBuffer(encryptedNotes);
      const decryptedNotesBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(ivBuffer),
        },
        key,
        notesBuffer
      );
      notes = decoder.decode(decryptedNotesBuffer);
    }

    // Decrypt tags if present
    if (encryptedTags) {
      const tagsBuffer = base64ToArrayBuffer(encryptedTags);
      const decryptedTagsBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: new Uint8Array(ivBuffer),
        },
        key,
        tagsBuffer
      );
      const tagsJson = decoder.decode(decryptedTagsBuffer);
      tags = JSON.parse(tagsJson);
    }

    return { notes, tags };
  } catch (error) {
    // If decryption fails, return safe defaults
    console.error("Failed to decrypt entry:", error);
    throw new Error("Failed to decrypt entry. Data may be corrupted.");
  }
}

// --- Utility Functions ---

/**
 * Generate a random salt for PBKDF2.
 *
 * @returns 16-byte random salt
 */
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
}

/**
 * Convert ArrayBuffer or ArrayBufferView to Base64 string.
 *
 * @param buffer - ArrayBuffer or ArrayBufferView to convert
 * @returns Base64-encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer | ArrayBufferView): string {
  let bytes: Uint8Array;
  if (ArrayBuffer.isView(buffer)) {
    bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else {
    bytes = new Uint8Array(buffer);
  }

  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to ArrayBuffer.
 *
 * @param base64 - Base64-encoded string
 * @returns ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Get the PBKDF2 iteration count used by this library.
 * Exposed for storing in database alongside wrapped keys.
 */
export function getPbkdf2Iterations(): number {
  return PBKDF2_ITERATIONS;
}
