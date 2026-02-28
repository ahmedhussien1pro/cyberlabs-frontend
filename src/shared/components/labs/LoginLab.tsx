import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginLab() {
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const from = (location.state as any)?.from?.pathname || "/temp-lab"

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      if (username === "user" && password === "user") {
        localStorage.setItem("lab_logged_in", "true")
        localStorage.setItem("lab_user_name", "User")
        localStorage.setItem("lab_user_email", "user@cyberlabs.com")
        localStorage.setItem("lab_user_balance", "250")
        navigate(from, { replace: true })
      } else {
        setError("Invalid credentials")
      }

      setLoading(false)
    }, 700)
  }

  const spanCount = 400

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background flex items-center justify-center">

      {/* Animated Theme Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/40 to-background animate-[gradientMove_6s_linear_infinite]" />

      {/* Grid */}
      <div className="absolute inset-0 flex flex-wrap gap-[2px]">
        {Array.from({ length: spanCount }).map((_, i) => (
          <span
            key={i}
            className="relative z-10 block w-[calc(6.25vw-2px)] h-[calc(6.25vw-2px)] bg-background transition-all duration-700 hover:bg-primary"
          />
        ))}
      </div>

      {/* Login Card */}
      <Card className="relative z-20 w-full max-w-md backdrop-blur-xl bg-card/80 border border-border shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <FieldSet>
                <FieldLegend className="text-3xl font-bold text-primary text-center">
                  Lab Sign In
                </FieldLegend>

                <FieldGroup className="mt-6 space-y-4">
                  <Field>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              {error && (
                <p className="text-sm text-destructive text-center">
                  {error}
                </p>
              )}

              <FieldSeparator />

              {/* Demo Credentials */}
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Username :</span>
                    <span className="font-semibold text-primary">
                      user
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Password :</span>
                    <span className="font-semibold text-primary">
                      user
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Field orientation="horizontal" className="gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/temp-lab")}
                  className="w-full"
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Animation */}
      <style>
        {`
          @keyframes gradientMove {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}
      </style>
    </div>
  )
}