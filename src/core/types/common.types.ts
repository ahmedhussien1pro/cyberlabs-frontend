export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type AsyncFunction<T = void> = () => Promise<T>

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

export type Language = "en" | "ar"

export type Theme = "light" | "dark" | "system"
