import CryptoJS from "crypto-js"
import { ENV } from "@/shared/constants"

type StorageType = "local" | "session"

class StorageManager {
  private prefix: string
  private encryptionKey: string

  constructor(prefix: string = ENV.STORAGE_PREFIX, encryptionKey: string = ENV.ENCRYPTION_KEY) {
    this.prefix = prefix
    this.encryptionKey = encryptionKey
  }

  private getStorage(type: StorageType): Storage {
    return type === "local" ? localStorage : sessionStorage
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.encryptionKey).toString()
  }

  private decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.encryptionKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  set<T>(key: string, value: T, type: StorageType = "local", encrypt: boolean = false): void {
    try {
      const storage = this.getStorage(type)
      const fullKey = this.getKey(key)
      let stringValue = JSON.stringify(value)

      if (encrypt) {
        stringValue = this.encrypt(stringValue)
      }

      storage.setItem(fullKey, stringValue)
    } catch (error) {
      console.error(`Error setting ${key} in ${type}Storage:`, error)
    }
  }

  get<T>(key: string, type: StorageType = "local", encrypted: boolean = false): T | null {
    try {
      const storage = this.getStorage(type)
      const fullKey = this.getKey(key)
      let value = storage.getItem(fullKey)

      if (!value) return null

      if (encrypted) {
        value = this.decrypt(value)
      }

      return JSON.parse(value) as T
    } catch (error) {
      console.error(`Error getting ${key} from ${type}Storage:`, error)
      return null
    }
  }

  remove(key: string, type: StorageType = "local"): void {
    try {
      const storage = this.getStorage(type)
      const fullKey = this.getKey(key)
      storage.removeItem(fullKey)
    } catch (error) {
      console.error(`Error removing ${key} from ${type}Storage:`, error)
    }
  }

  clear(type: StorageType = "local"): void {
    try {
      const storage = this.getStorage(type)
      const keys = Object.keys(storage).filter((key) => key.startsWith(this.prefix))
      
      keys.forEach((key) => storage.removeItem(key))
    } catch (error) {
      console.error(`Error clearing ${type}Storage:`, error)
    }
  }

  clearAll(): void {
    this.clear("local")
    this.clear("session")
  }
}

export const storage = new StorageManager()
export default storage
