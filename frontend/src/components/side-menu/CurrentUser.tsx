import UserProfileIcon from "@/components/common/icons/UserCircle";
import {WavesWebShape} from "@/components/common/webshapes/Waves";
import React from "react";

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

    return (
        <div className={"border-t border-t-sky-700 px-5 py-3 text-sm mt-auto fill-sky-50 text-sky-100 flex gap-2 items-center current-user-bg relative"}>
            <div className={"absolute left-0 w-full bottom-10 -z-10"}>
                <WavesWebShape/>
            </div>
            <UserProfileIcon />

            {session === undefined ?
                <span>Loading...</span>
                : session === null ?
                    <span>No session</span>
                    :
                    <span>
                        <strong className={"font-medium"}>{session.firstName} {session.lastName}</strong>
                        <div className={"text-xs text-sky-300"}>
                            {session.email}
                        </div>
                    </span>
            }

            <style jsx>{`
                .current-user-bg {
                    background-color: var(--grey-2);
                }
            `}</style>
        </div>
    );
}