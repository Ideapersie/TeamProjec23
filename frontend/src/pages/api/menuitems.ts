import type {NextApiRequest, NextApiResponse} from 'next'
import {MenuItem} from "@/types";
import {env} from "../../../env.config";

type ResponseData = {
    message: string,
    data: {
        menuItems: MenuItem[]
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const response = await fetch(env.BACKEND_HOST + '/api/menuitems');
    const menuItems = (await response.json()) as MenuItem[];

    return res.status(200).json({
        message: 'Successfully fetched menuitems',
        data: {
            menuItems
        }
    });
}