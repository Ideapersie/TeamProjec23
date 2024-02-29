import type {NextApiRequest, NextApiResponse} from 'next'
import {sessionCookieName} from "@/components/auth/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(500).json({
            message: "Please send a GET request."
        });
    }

    res.setHeader('Set-Cookie', `${sessionCookieName}=''; Path=/; Max-Age=0`);

    res.status(200).json({
        message: 'Successfully logged out!'
    });
}