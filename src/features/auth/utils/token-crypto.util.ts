interface EncryptionResult {
  encrypted: string;
  error?: string;
}

interface DecryptionResult {
  decrypted: string | null;
  error?: string;
}

async function getDeviceKey(): Promise<CryptoKey> {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    'cyberlabs-auth-2026',
  ].join('|');

  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

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
      return {
        encrypted: plaintext,
        error: 'Crypto API not available',
      };
    }

    const key = await getDeviceKey();
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
    return {
      encrypted: plaintext,
      error: 'Encryption failed',
    };
  }
}

async function decrypt(ciphertext: string): Promise<DecryptionResult> {
  try {
    if (!crypto.subtle) {
      return {
        decrypted: ciphertext,
        error: 'Crypto API not available',
      };
    }

    const key = await getDeviceKey();

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
    if (!token) return token;

    const result = await encrypt(token);

    if (result.error) {
      console.warn('Token encryption not available, storing plaintext');
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
      console.error('Token decryption failed');
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
};
