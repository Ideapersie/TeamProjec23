import {NextPageContext} from "next";
import {ReactPropTypes} from "react";

export default function PageTitle(props: any) {
    return (
        <h1 className={"page-title"}>{props.children}</h1>
    );
}