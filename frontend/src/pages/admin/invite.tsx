import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useRef, useState} from "react";
import {useRouter} from "next/router";

/**
 * A function for rendering the invite page component.
 * This is a page for inviting new staff to the platform.
 *
 * @author Vincent Chapman (zlac465@live.rhul.ac.uk)
 */
export default function InvitePage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const inputEmail = useRef<HTMLInputElement>(null);

    // Handler for form submission event
    async function handleInvite(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // Construct payload object from form data.
        const payload = {
            email: formData.get("input-email")
        }

        const res = await fetch("/api/auth/invite", {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.status === 200) {
            alert("Success! The user will receive an invite link shortly.");
            await router.push("/admin/staff")
        } else {
            alert("Something went wrong :(");
        }
    }

    return (
        <div className={"bg-wahaca-teal min-h-screen flex p-10"}>
            <div className={"bg-wahaca-white rounded-xl shadow p-10 m-auto w-full max-w-3xl"}>
                <PageTitle><span className={"text-wahaca-pink"}>INVITE</span></PageTitle>
                <PageSubtitle>
                    Invite a new staff member to the platform by entering their email address below.
                </PageSubtitle>
                <hr/>

                <form onSubmit={handleInvite} className={"flex flex-col gap-5 mt-5"}>
                    <label>
                        Email address
                        <input
                            ref={inputEmail}
                            type={"text"}
                            name={"input-email"}
                            placeholder={"Enter your email address"}
                            required
                        />
                    </label>

                    <div>
                        <button className={"bg-wahaca-blue text-wahaca-yellow"}>Send link</button>
                    </div>
                </form>

                {error !== null &&
                    <p className={"bg-red-300 text-white p-3 rounded"}>
                        {error}
                    </p>
                }
            </div>
        </div>
    )
}