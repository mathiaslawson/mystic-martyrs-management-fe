// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Log headers for debugging
  console.log("Incoming Request Headers:", Object.fromEntries(request.headers));

  // Optional: Modify headers
  const response = NextResponse.next();

  // Explicitly set CORS headers
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://churchbackend-management.onrender.com"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  return response;
}

// Optional: Specify which routes this middleware applies to
export const config = {
  matcher: "/api/:path*",
};
