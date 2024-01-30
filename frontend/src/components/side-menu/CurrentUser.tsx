import UserProfileIcon from "@/components/common/icons/UserCircle";
import {WavesWebShape} from "@/components/common/webshapes/Waves";
import React from "react";

/**
 * A component that displays the user currently logged in
 */
export default function CurrentUser() {
    return (
        <div className={"border-t border-t-sky-700 px-5 py-3 text-sm mt-auto fill-sky-50 text-sky-100 flex gap-2 items-center current-user-bg relative"}>
            <div className={"absolute left-0 w-full bottom-10 -z-10"}>
                <WavesWebShape/>
            </div>
            <UserProfileIcon />
            <span>
                <strong className={"font-medium"}>Full Name</strong>
                <div className={"text-xs text-sky-300"}>
                    example@gmail.com
                </div>
            </span>

            <style jsx>{`
                .current-user-bg {
                    background-color: var(--grey-2);
                }
            `}</style>
        </div>
    );
}