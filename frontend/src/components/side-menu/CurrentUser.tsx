import UserProfileIcon from "@/components/common/icons/UserCircle";
import {WavesWebShape} from "@/components/common/webshapes/Waves";
import React, {useEffect, useState} from "react";
import {Session} from "@/components/auth/session";
import {useRouter} from "next/router";

/**
 * A component that displays the user currently logged in
 */
export default function CurrentUser() {

    const [session, setSession] = useState<Session | undefined | null>(undefined);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                setSession(data.session);
            });
    }, []);

    async function handleLogout() {
        const res = await fetch('/api/auth/logout', {
            method: "POST"
        });

        if (res.status === 200) {
            await router.push('/auth/login');
        }
    }

    return (
        <div className={"bg-wahaca-teal px-5 py-3 h-16 text-sm mt-auto fill-white text-sky-100 flex gap-2 items-center current-user-bg relative"}
             role={"button"}
             onClick={handleLogout}>
            <UserProfileIcon />

            {session === undefined ?
                <span>Loading...</span>
                : session === null ?
                    <span>No session</span>
                    :
                    <span>
                        <strong className={"text-white font-l"}>{session.firstName} {session.lastName}</strong>
                        <div className={"text-xs text-white"}>
                            {session.email}
                        </div>
                    </span>
            }
        </div>
    );
}