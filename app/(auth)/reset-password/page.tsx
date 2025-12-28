import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { ResetPasswordFormFallback } from "@/components/auth/reset-password-form-fallback"

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<ResetPasswordFormFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}

export default ResetPasswordPage
