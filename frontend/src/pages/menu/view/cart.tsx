import React from "react";
import Link from "next/link";

/**
 * A component that displays the user currently logged in
 */
export default function Cart() {
    return (
        <div className={""}>
			<Link href={"/menu"} className={"text-base text-sky-500 hover:text-sky-600  hover:translate-x-1 hover:ease-in"}>
                    Go back to all items
            </Link>
			<h1>CART</h1>
            <div className="grid md:grid-cols-4 md:gap-5">
                <div className="overflow-x-auto md:col-span-3">
                    <table className="min-w-full">
                        <thead className="border-b">
                            <tr className="border-b">
                                <th className="p-5 text-left">Product</th>
                                <th className="p-5 text-right">Quantity</th>
                                <th className="p-5 text-right">Price</th>
                                <th className="p-5">Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td>
                                    insert item_id
                                </td>
                                <td className="p-5 text-right">
                                    item_quantity
                                </td>
                                <td className="p-5 text-right">
                                    item_price
                                </td>
                                <td className="p-5 text-center">
                                    <button className="default-button">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <div className="card p-5">
                        <ul>
                            <li>
                                <div className="pb-3 text-xl">
                                    Subtotal: £
                                </div>
                            </li>
                            <li>
                                <button className="primary-button w-full">
                                    Proceed to checkout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
