import { AuthWrapper } from "@/components/auth-wrapper"
import { MobileApp } from "@/components/mobile-app"

export default function HomePage() {
  return (
    <AuthWrapper>
      <MobileApp />
    </AuthWrapper>
  )
}
