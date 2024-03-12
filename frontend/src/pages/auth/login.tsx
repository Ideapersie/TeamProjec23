import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";

/**
 * A component for rendering the login page
 *
 * @author Vincent Chapman (zlac465@live.rhul.ac.uk)
 */
export default function LoginPage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // Handler for form submission event
    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            email: formData.get("input-email"),
            password: formData.get("input-password")
        }

        console.log("Payload:", payload);

        const res = await fetch("/api/auth/login", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status === 200) {
            await router.push('/');
            
        } else if (res.status === 401) {
            setError("Incorrect password given. Please try again.")
        }

        // try {
        //     const res = await fetch("http://127.0.0.1:5000/api/login", {
        //         method: "POST",
        //         body: JSON.stringify(payload),
        //         mode: "no-cors",
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });
        //
        //     const data = await res.json();
        //
        //     console.log("Response data:", data);
        //
        // } catch (e) {
        //     console.error(e);
        // }
    }

    return (
        <div className={"bg-wahaca-yellow min-h-screen flex"}>
            <div className={"bg-white rounded-xl shadow p-10 m-auto"}>
                <PageTitle>LOGIN</PageTitle>
                <PageSubtitle>Enter your email and password below to login</PageSubtitle>
                <hr/>

                <form onSubmit={handleLogin} className={"flex flex-col gap-3 mt-5"}>
                    <label>
                        Email address
                        <input
                            type={"text"}
                            name={"input-email"}
                            placeholder={"Enter your email address"}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type={"password"}
                            name={"input-password"}
                            placeholder={"Enter your password"}
                            required
                        />
                    </label>

                    <div>
                        <button>Log in</button>
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