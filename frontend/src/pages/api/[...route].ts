import type {NextApiRequest, NextApiResponse} from 'next'
import {env} from "../../../env.config";

/**
 * This route server as a "wrapper" or middle-man for the backend api, in order to get around the CORS issues.
 *
 * It allows code running on the browser to contact the backend api, seemingly directly, when in actual fact it is
 * passing through this route which then forwards the request onto the backend api.
 *
 * If designed correctly this route should be completely transparent, returning a response with the same status code,
 * body, and headers as the original response from the backend server.
 *
 * @param req
 * @param res
 *
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    try {
        const segments = req.query.route as string[];
        const path = segments.join("/");

        const response = await fetch(env.apiHost + "/api/" + path, {
            method: req.method,
            body: req.body ? JSON.stringify(req.body) : undefined
        });

        // Mapping response status code
        res.status(response.status);

        // Mapping response headers
        response.headers.forEach((value, key, parent) => {
            res.setHeader(key, value);
        });

        // Mapping response body
        try {
            res.json(await response.json());

        } catch (e: any) {
            res.json({
                message: "No data return or failed to parse response body"
            });
        }

        return;

    // If any exceptions...
    } catch (e: any) {

        // Log + return error message
        console.error("Something went wrong:", e.message);
        res.status(500)
            .json({
                message: e.message
        });

        return;
    }
}