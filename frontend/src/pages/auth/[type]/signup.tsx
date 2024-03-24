import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useRef, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";

/**
 * A function for rendering the signup page component.
 * This is a page for new customers to create accounts.
 *
 * @author Vincent Chapman (zlac465@live.rhul.ac.uk)
 */
export default function SignupPage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const inputEmail = useRef<HTMLInputElement>(null);

    // Handler for form submission event
    async function handleSignup(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // Construct payload object from form data.
        const payload = {
            email: formData.get("input-email"),
            password: formData.get("input-password"),
            first_name: formData.get("input-first-name"),
            last_name: formData.get("input-last-name"),
            token: router.query.token
        }

        // Check if password confirmed correctly.
        if (payload.password !== formData.get("input-password-2")) {
            setError("Passwords do not match!");
            return;
        }

        const res = await fetch("/api/auth/signup", {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.status === 201) {
            const res = await fetch("/api/auth/login", {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password
                })
            });
            await router.push('/');

        } else if (res.status === 409) {
            setError("A customer with this email address already exists");
            inputEmail.current?.focus();

        } else if (res.status === 401) {
            setError("Incorrect password given. Please try again.");
        }
    }

    return (
        <div className={"bg-wahaca-pink min-h-screen flex p-10"}>
            <div className={"bg-white rounded-xl shadow p-10 m-auto w-full max-w-3xl"}>
                <PageTitle>SIGN UP</PageTitle>
                <PageSubtitle>
                    Register with your email and password below, or <Link
                    href={"/auth/customer/login"}
                    className={"underline text-wahaca-blue"}
                >log in</Link> if you already have an account
                </PageSubtitle>
                <hr/>

                <form onSubmit={handleSignup} className={"grid grid-cols-2 gap-5 mt-5"}>
                    <div className={"flex flex-col gap-4"}>
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

                        <label>
                            First name
                            <input
                                type={"text"}
                                name={"input-first-name"}
                                placeholder={"Enter your first name"}
                                required
                            />
                        </label>

                        <label>
                            Last name
                            <input
                                type={"text"}
                                name={"input-last-name"}
                                placeholder={"Enter your last name"}
                                required
                            />
                        </label>
                    </div>

                    <div className={"flex flex-col gap-4"}>
                        <label>
                            Password
                            <input
                                type={"password"}
                                name={"input-password"}
                                placeholder={"Enter your password"}
                                required
                            />
                        </label>

                        <label>
                            Confirm password
                            <input
                                type={"password"}
                                name={"input-password-2"}
                                placeholder={"Enter your password again"}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <button className={"bg-wahaca-yellow text-wahaca-teal"}>Create account</button>
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