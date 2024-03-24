export const env = {
    apiHost: process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:5000",
    jwtSecret: process.env.JWT_SECRET || "1234567890"
}