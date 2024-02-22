export function Modal(props: any) {
    return (
        <div className={"fixed inset-0 bg-black bg-opacity-30 flex"}>
            <div className={"bg-white rounded-lg shadow-2xl p-10 m-auto"}>
                {props.children}
            </div>
        </div>
    )
}