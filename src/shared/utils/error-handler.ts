import { ApiError } from "@/core/types"
import { toast } from "sonner"

interface ErrorHandlerOptions {
  showToast?: boolean
  customMessage?: string
  onError?: (error: ApiError) => void
}

export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): ApiError => {
  const { showToast = true, customMessage, onError } = options

  // Default error
  let apiError: ApiError = {
    message: "An unexpected error occurred",
    statusCode: 500,
  }

  // Parse error
  if (typeof error === "object" && error !== null) {
    if ("message" in error && "statusCode" in error) {
      // ApiError format
      apiError = error as ApiError
    } else if (error instanceof Error) {
      // JavaScript Error
      apiError.message = error.message
    }
  }

  // Use custom message if provided
  if (customMessage) {
    apiError.message = customMessage
  }

  // Show toast notification
  if (showToast) {
    toast.error(apiError.message)
  }

  // Execute custom error handler
  if (onError) {
    onError(apiError)
  }

  // Log error in development
  if (import.meta.env.DEV) {
    console.error("Error:", apiError)
  }

  return apiError
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message)
  }
  return "An unexpected error occurred"
}

export default handleError
