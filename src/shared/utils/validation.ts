export const validation = {
  /**
   * Check if email is valid
   */
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Check if password is strong
   * At least 8 chars, 1 uppercase, 1 lowercase, 1 number
   */
  isStrongPassword(password: string): boolean {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber
  },

  /**
   * Check if username is valid (alphanumeric and underscore only)
   */
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  },

  /**
   * Check if URL is valid
   */
  isURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Check if phone number is valid (international format)
   */
  isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone.replace(/[\s-()]/g, ""))
  },

  /**
   * Check if string contains only Arabic characters
   */
  isArabic(text: string): boolean {
    const arabicRegex = /^[\u0600-\u06FF\s]+$/
    return arabicRegex.test(text)
  },

  /**
   * Check if string contains only English characters
   */
  isEnglish(text: string): boolean {
    const englishRegex = /^[a-zA-Z\s]+$/
    return englishRegex.test(text)
  },
}

export default validation
