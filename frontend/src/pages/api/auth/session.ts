import type {NextApiRequest, NextApiResponse} from 'next'
import {Session} from "@/components/auth/session";
import {sessionCookieName} from "@/components/auth/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(500).json({
            message: "Please send a GET request."
        });
    }

    if (!(req.cookies?.[sessionCookieName])) {
        return res.status(401).json({
            message: "Not logged in",
            session: null
        });
    }

    const cookie = JSON.parse(req.cookies[sessionCookieName]);
    const session = new Session({cookie});

    res.status(200).json({
        message: 'Successfully fetched session!',
        session: session.json
    });
}