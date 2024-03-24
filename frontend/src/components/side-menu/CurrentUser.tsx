import UserProfileIcon from "@/components/common/icons/UserCircle";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {AuthSessionResponse, SessionJWT} from "@/pages/api/auth/session";
import Link from "next/link";

/**
 * A component that displays the user currently logged in
 */
export default function CurrentUser() {

    const [session, setSession] = useState<SessionJWT | undefined | null>(undefined);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json() as Promise<AuthSessionResponse>)
            .then(data => {
                setSession(data.session);
            });
    }, []);

    async function handleLogout() {
        const res = await fetch('/api/auth/logout');

        if (res.status === 200) {
            await router.push(`/auth/${session?.session_type}/login`);
        }
    }

    return (
        <div className={"bg-wahaca-blue px-5 py-3 h-16 text-sm fill-white text-sky-100 flex gap-3 items-center current-user-bg relative"}
             role={"button"}
             onClick={handleLogout}>
            <div className={`relative flex flex-col items-center ${session?.user.role ? "-mt-1" : ""}`}>
                <UserProfileIcon/>
                {
                    session?.user.role &&
                        <span className={"absolute bottom-0 -mb-3"}>
                            <span className={"bg-wahaca-yellow text-wahaca-navy font-bold rounded"}
                                  style={{fontSize: "0.6rem", padding: "1px 3px"}}>
                                {session.user.role}
                            </span>
                        </span>
                }
            </div>

            {session === undefined ?
                <span>Loading...</span>
                : session === null ?
                    <div className={"flex flex-col"}>
                        <span className={"text-white font-bold"}>No session</span>
                        <Link href={'/auth/customer/login'}
                              className={"text-xs text-wahaca-light-blue"}
                            >
                            Log in
                        </Link>
                    </div>
                    :
                    <span>
                        <div className={"text-wahaca-white font-bold flex gap-2 items-center"}>
                            <span>{session.user.first_name} {session.user.last_name}</span>
                        </div>
                        <div className={"text-xs text-wahaca-light-blue"}>
                            {session.user.email}
                        </div>
                    </span>
            }
        </div>
    );
}