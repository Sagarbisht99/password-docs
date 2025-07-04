// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // This line ensures the middleware runs on relevant paths
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
  // THIS IS THE KEY PART: Declare your custom auth routes as public
  publicRoutes: ['/sign-in(.*)', '/sign-up(.*)'],
}