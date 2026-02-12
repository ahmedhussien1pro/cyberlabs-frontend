import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLogin } from "../hooks/use-auth"
import { ROUTES } from "@/shared/constants"

export function LoginForm() {
  const { t } = useTranslation()
  const login = useLogin()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({
      email: formData.email,
      password: formData.password,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth:login.email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={login.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth:login.password")}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={login.isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
            }
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
            {t("auth:login.rememberMe")}
          </Label>
        </div>
        <Link
          to={ROUTES.AUTH.FORGOT_PASSWORD}
          className="text-sm text-primary hover:underline"
        >
          {t("auth:login.forgotPassword")}
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("auth:login.submit")}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t("auth:login.noAccount")} </span>
        <Link to={ROUTES.AUTH.REGISTER} className="text-primary hover:underline font-medium">
          {t("auth:login.signUp")}
        </Link>
      </div>
    </form>
  )
}

export default LoginForm
