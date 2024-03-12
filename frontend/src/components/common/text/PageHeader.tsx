import {JSX} from "react";

interface Props {
    children: JSX.Element | JSX.Element[]
    className?: string
}

export default function PageHeader(props: Props) {
    return (
        <div className={`mb-5 ${props.className || ''}`}>
            {props.children}
        </div>
    );
}