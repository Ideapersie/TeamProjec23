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
            <div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    insert item_id
                                </td>
                                <td>
                                    item_quantity
                                </td>
                                <td>
                                    item_price
                                </td>
                                <td>
                                    <button>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <div>
                        <ul>
                            <li>
                                <div>
                                    Subtotal: £
                                </div>
                            </li>
                            <li>
                                <button>
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
