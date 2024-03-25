import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import React, {useEffect, useState} from "react";


interface Props {
    name: string
    price: string
    menuitem_id: number
};

export default function OrderConfirmationPage(props:Props) {
    return (
        <div className={"flex-grow flex flex-col"}>
            <PageHeader>
                <PageTitle>Your order has been received!</PageTitle>
                <PageSubtitle>Order Id: 9340</PageSubtitle>
            </PageHeader>

            <hr/>

            <div className={"bg-white mt-5 shadow rounded-xl flex flex-grow overflow-hidden"}>
                {/*Left column - basket*/}
                <div className={"flex-grow p-10"}>
                    <h4>Ordered items</h4>
                </div>

                {/*Right column - Order status*/}
                <div className={"p-10 bg-wahaca-navy flex-grow max-w-lg text-wahaca-white"}>
                    <h4 className={"text-wahaca-white"}>Track your order</h4>
                    <div>Displays check list for tracking order</div>
                </div>
            </div>
            <div>
                {/* Need to change to order menu ID */}
                <button onClick={() => { window.location.href = `/customer/orders/${1}/payment` }}> 
                    Pay bill
                </button>
            </div>
        </div>
    )
}