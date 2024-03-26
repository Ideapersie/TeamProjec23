import {Dispatch, FormEvent, SetStateAction} from "react";
import {useRouter} from "next/router";
import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";

interface Props {
    order_id: number,
    setShowPaymentWindow: Dispatch<SetStateAction<boolean>>
}

/**
 * Renders a payment popup for paying the bill.
 *
 * @param props
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function PaymentPopup(props: Props) {

    const router = useRouter();

    async function handlePayBill(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const payload = {
            holder_name: form.get("input-card-name"),
            card_number: form.get("input-card-number"),
            expiration_date: form.get("input-card-expiry")
        }

        const response = await fetch(`/api/payment/pay_bill/${props.order_id}`, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (response.status === 200) {
            router.reload()

        } else {
            alert("Payment failed!");
        }
    }

    return (
        <div className={"fixed bg-black bg-opacity-50 inset-0 z-50 flex"}>
            <div className="absolute inset-0 -z-10" onClick={() => props.setShowPaymentWindow(false)}/>
            <div className={"m-auto bg-white shadow rounded-xl p-10 w-full max-w-lg"}>
                <PageHeader>
                    <PageTitle>Payment</PageTitle>
                    <PageSubtitle>Pay your bill before you leave</PageSubtitle>
                </PageHeader>

                <div className={"flex-grow mt-10"}>
                    <form onSubmit={handlePayBill} className={"flex flex-col gap-5"}>
                        <label>
                            Cardholder name
                            <input type="text"
                                   name={"input-card-name"}
                                   required/>
                        </label>

                        <label>
                            Card number
                            <input type="text"
                                   name={"input-card-number"}
                                   required/>
                        </label>

                        <label>
                            Expiry date
                            <input type="text"
                                   name={"input-card-expiry"}
                                   required/>
                        </label>

                        <button>Pay bill</button>
                    </form>
                </div>
            </div>
        </div>
    )
}