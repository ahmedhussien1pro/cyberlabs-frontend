import DOMPurify from "dompurify"

interface SanitizeOptions {
  ALLOWED_TAGS?: string[]
  ALLOWED_ATTR?: string[]
  ALLOW_DATA_ATTR?: boolean
}

export const sanitize = {
  /**
   * Sanitize HTML string to prevent XSS attacks
   */
  html(dirty: string, options?: SanitizeOptions): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: options?.ALLOWED_TAGS || [
        "p", "br", "strong", "em", "u", "a", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
      ],
      ALLOWED_ATTR: options?.ALLOWED_ATTR || ["href", "title", "target", "rel"],
      ALLOW_DATA_ATTR: options?.ALLOW_DATA_ATTR || false,
    })
  },

  /**
   * Sanitize user input (strip all HTML)
   */
  input(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    })
  },

  /**
   * Sanitize URL to prevent javascript: and data: URLs
   */
  url(url: string): string {
    try {
      const parsed = new URL(url)
      
      // Only allow http and https protocols
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return ""
      }
      
      return parsed.toString()
    } catch {
      return ""
    }
  },
}

export default sanitize
