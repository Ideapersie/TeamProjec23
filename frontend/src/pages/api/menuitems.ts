import type {NextApiRequest, NextApiResponse} from 'next'
import {MenuItem} from "@/types";

type ResponseData = {
    message: string,
    data: {
        menuItems: MenuItem[]
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const response = await fetch("http://127.0.0.1:5000/api/menuitems/${menuitem_id}");
    const menuItems = (await response.json()) as MenuItem[];

    return res.status(200).json({
        message: 'Successfully fetched menuitems',
        data: {
            menuItems
        }
    });
}