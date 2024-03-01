import type {NextApiRequest, NextApiResponse} from 'next'
import {Session} from "@/components/auth/session";
import {sessionCookieName} from "@/components/auth/helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(500).json({
            message: "Please send a POST request."
        });
    }

    const {email, password} = req.body;

    if (password !== 'test') {
        return res.status(401).json({
            message: "Incorrect password"
        });
    }

    const session = new Session();
    session.email = email;
    session.firstName = "Test";
    session.lastName = "Account";

    res.setHeader('Set-Cookie', `${sessionCookieName}=${session.toString()}; Path=/`);

    res.status(200).json({
        message: 'Successfully logged in!',
        session: session.json
    });
}