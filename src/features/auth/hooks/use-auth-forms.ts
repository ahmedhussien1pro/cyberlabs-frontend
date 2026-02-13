// src/features/auth/hooks/use-auth-forms.ts
export const useAuthForms = () => {
  // common form logic, validation, etc.
};

// src/features/auth/schemas/auth.ts (املاه)
export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword);

// src/features/auth/components/auth-layout.tsx
export function AuthLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="auth-page">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="auth-page__container">
        {/* form side + toggle */}
        {children}
      </div>
    </div>
  );
}
