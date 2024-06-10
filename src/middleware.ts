import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/site", "/api/uploadthing"],
  async beforeAuth(auth, req) {
    // Optional logic to handle actions before authentication (e.g., analytics)
  },
  async afterAuth(auth, req) {
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    const hostname = req.headers.get("host");

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    // Subdomain handling with improved validation
    const customSubDomain = hostname
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];
    if (customSubDomain && /^[a-zA-Z0-9-]+$/.test(customSubDomain)) {
      // Validate subdomain format
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    // Redirect logic for "/sign-in" and "/sign-up" with clearer target path
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL("/agency/sign-in", req.url));
    }

    // Handle root path and "/site" on main domain
    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    // Handle paths starting with "/agency" or "/subaccount"
    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }

    // If none of the above conditions match, return NextResponse.next()
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
