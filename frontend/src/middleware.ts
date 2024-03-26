import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {sessionCookieName} from "@/components/auth/helpers";
import {SessionJWT} from "@/pages/api/auth/session";
import {env} from "../env.config";

const whiteList = ["/_next", "/api"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // Skip whitelisted paths
    for (const path of whiteList) {
        if (request.nextUrl.pathname.startsWith(path)) {
            return NextResponse.next();
        }
    }

    const cookie = request.cookies.get(sessionCookieName);
    const isAuthenticated = cookie !== undefined;

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

    const sessionType = request.cookies.get('type')?.value || "customer";

    if (request.nextUrl.pathname === "/") {
        if (sessionType === "staff") {
            console.log("Middleware: REDIRECT to /admin/waiter/menu/view");
            return NextResponse.rewrite(new URL('/admin/waiter/menu/view', request.url));

        } else {
            console.log("Middleware: REDIRECT to /menu");
            return NextResponse.rewrite(new URL('/menu', request.url));
        }
    }

    return NextResponse.next();
}