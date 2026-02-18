interface EncryptionResult {
  encrypted: string;
  error?: string;
}

interface DecryptionResult {
  decrypted: string | null;
  error?: string;
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const sessionKeyId = '__cyb_sk';
  let keyMaterial = sessionStorage.getItem(sessionKeyId);

  if (!keyMaterial) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    keyMaterial = Array.from(randomBytes, (byte) =>
      byte.toString(16).padStart(2, '0'),
    ).join('');
    sessionStorage.setItem(sessionKeyId, keyMaterial);
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyMaterial);
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);

  return crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encrypt(plaintext: string): Promise<EncryptionResult> {
  try {
    if (!crypto.subtle) {
      throw new Error('Crypto API not available');
    }

    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data,
    );

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    const encrypted = btoa(String.fromCharCode(...combined));

    return { encrypted };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Token encryption failed');
  }
}

async function decrypt(ciphertext: string): Promise<DecryptionResult> {
  try {
    if (!crypto.subtle) {
      throw new Error('Crypto API not available');
    }

    const key = await getEncryptionKey();

    const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData,
    );

    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedBuffer);

    return { decrypted };
  } catch (error) {
    console.error('Decryption error:', error);
    return {
      decrypted: null,
      error: 'Decryption failed',
    };
  }
}

function isEncrypted(token: string): boolean {
  try {
    if (token.split('.').length === 3) {
      return false;
    }

    atob(token);
    return true;
  } catch {
    return false;
  }
}

export const tokenCrypto = {
  async encryptToken(token: string): Promise<string> {
    if (!token) {
      throw new Error('Token is required for encryption');
    }

    const result = await encrypt(token);

    if (result.error) {
      throw new Error(result.error);
    }

    return result.encrypted;
  },

  async decryptToken(encryptedToken: string): Promise<string | null> {
    if (!encryptedToken) return null;

    if (!isEncrypted(encryptedToken)) {
      return encryptedToken;
    }

    const result = await decrypt(encryptedToken);

    if (result.error) {
      console.error('Token decryption failed:', result.error);
      return null;
    }

    return result.decrypted;
  },

  isAvailable(): boolean {
    return typeof crypto !== 'undefined' && !!crypto.subtle;
  },

  isEncrypted(token: string): boolean {
    return isEncrypted(token);
  },

  clearSessionKey(): void {
    sessionStorage.removeItem('__cyb_sk');
  },
};
