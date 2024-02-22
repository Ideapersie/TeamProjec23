export default function PageHeader(props: any) {
    return (
        <div className={"props-header"}>
            {props.children}
            <hr style={{marginTop: 20}}/>
        </div>
    );
}