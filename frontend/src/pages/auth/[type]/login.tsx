import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {GetStaticPaths, GetStaticProps} from "next";

interface PageProps {
    loginType: "customer" | "staff"
}

/**
 * A component for rendering the login page
 *
 * @author Vincent Chapman (zlac465@live.rhul.ac.uk)
 */
export default function LoginPage(props: PageProps) {

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

        const res = await fetch(`/api/auth/${props.loginType}/login`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (res.status === 200) {
            await router.push('/');

        } else if (res.status === 409) {
            const data = await res.json();
            setError(data.message);

        } else if (res.status === 401) {
            setError("Incorrect email or password given!");
        }
    }

    return (
        <div className={"bg-wahaca-yellow min-h-screen flex"}>
            <div className={"bg-white rounded-xl shadow p-10 m-auto"}>
                <PageTitle>LOGIN ({props.loginType})</PageTitle>
                <PageSubtitle>Enter your email and password below to login, or <Link
                    href={"/auth/signup"}
                    className={"underline text-wahaca-blue"}
                >create an account</Link> here.</PageSubtitle>
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

export const getStaticPaths = (async () => {
    return {
        paths: [
            {params: {type: 'customer'}},
            {params: {type: 'staff'}},
        ],
        fallback: false
    }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
    const loginType = context.params?.type as "customer" | "staff"
    return {props: {
        loginType
    }}
}) satisfies GetStaticProps<PageProps>