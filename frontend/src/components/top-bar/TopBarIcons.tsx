import {CallWaiterButton} from "@/components/top-bar/call-button";
import {CartButton} from "@/components/top-bar/cart-button";
import {NotificationButton} from "@/components/top-bar/notification-button";
import React, {useEffect, useState} from "react";
import {AuthSessionResponse, SessionJWT} from "@/api.types";

export default function TopBarIcons() {

    const [session, setSession] = useState<SessionJWT | null>(null);

    useEffect(() => {
        fetch("/api/auth/session")
            .then(res => res.json() as Promise<AuthSessionResponse>)
            .then(data => {
                setSession(data.session)
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className={`flex gap-5 items-center transition-opacity duration-500 ${session ? "opacity-100" : "opacity-0"}`}>
            {session &&
                <>
                    {session.session_type === "customer" ?
                        <>
                            <CallWaiterButton/>
                            <CartButton/>
                        </>
                        :
                        <NotificationButton/>
                    }
                </>
            }
        </div>
    )
}