export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/timer/:path*",
    "/analytics/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
}
