import { Link } from "react-router-dom"
import { ROUTES } from "@/shared/constants"
import { cn } from "@/shared/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  const sizes = {
    sm: "h-8 w-8 text-base",
    md: "h-10 w-10 text-lg",
    lg: "h-12 w-12 text-xl"
  }

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  }

  return (
    <Link 
      to={ROUTES.HOME} 
      className={cn("flex items-center gap-2 transition-opacity hover:opacity-80", className)}
    >
      <div className={cn(
        "relative flex items-center justify-center rounded-lg font-bold",
        "bg-gradient-to-br from-blue-600 to-purple-600",
        "text-white shadow-lg",
        sizes[size]
      )}>
        <span className="relative z-10">CL</span>
        <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
      </div>
      
      {showText && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
          textSizes[size]
        )}>
          CyberLabs
        </span>
      )}
    </Link>
  )
}

export default Logo
