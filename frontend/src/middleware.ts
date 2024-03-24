import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {sessionCookieName} from "@/components/auth/helpers";

const whiteList = ["/_next", "/api"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    // Skip whitelisted paths
    for (const path of whiteList) {
        if (request.nextUrl.pathname.startsWith(path)) {
            return NextResponse.next();
        }
    }

    const cookie = request.cookies.get(sessionCookieName);
    const isAuthenticated = cookie !== undefined;

    console.log("Is Authenticated:", isAuthenticated);

    // If already logged in, redirect away from /auth routes.
    if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
        console.log("Middleware: REDIRECT to /");
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If not logged in and not on /auth route, redirect to /auth/login route.
    if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/auth")) {
        console.log("Middleware: REDIRECT to /auth/customer/login");
        return NextResponse.redirect(new URL('/auth/customer/login', request.url));
    }


    // console.log("Running middleware:", request.nextUrl.pathname);

    // if (request.url)

    // return NextResponse.redirect(new URL('/', request.url))


    return NextResponse.next();
}