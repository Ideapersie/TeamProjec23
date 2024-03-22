import {StaffMemberType} from "@/pages/admin/staff";
import {useEffect, useState} from "react";

interface Props {
    data: StaffMemberType
}

export default function StaffMember(props: Props) {

    const [isAdmin, setIsAdmin] = useState<boolean>(props.data.admin);
    const [role, setRole] = useState<string>(props.data.role);
    const [firstName, setFirstName] = useState<string>(props.data.first_name);
    const [lastName, setLastName] = useState<string>(props.data.last_name);
    const [email, setEmail] = useState<string>(props.data.email);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    useEffect(() => {
        if (email !== props.data.email) {
            setHasUnsavedChanges(true);

        } else if (firstName !== props.data.first_name) {
            setHasUnsavedChanges(true);

        } else if (lastName !== props.data.last_name) {
            setHasUnsavedChanges(true);

        } else if (isAdmin !== props.data.admin) {
            setHasUnsavedChanges(true);

        } else if (role !== props.data.role) {
            setHasUnsavedChanges(true);

        } else {
            setHasUnsavedChanges(false);
        }
    }, [email, firstName, lastName, isAdmin, role]);

    async function handleSave() {
        const response = await fetch(`/api/staff/update/${props.data.id}`, {
            method: "POST",
            body: JSON.stringify({
                email,
                first_name: firstName,
                last_name: lastName,
                is_admin: isAdmin,
                role
            })
        });

        if (response.status === 200) {
            setHasUnsavedChanges(false);
        } else {
            alert("Something went wrong")
        }
    }

    function handleCancelChanges() {
        setEmail(props.data.email);
        setFirstName(props.data.first_name);
        setLastName(props.data.last_name);
        setIsAdmin(props.data.admin);
        setRole(props.data.role)
    }

    return (
        <tr>
            <td>{props.data.id}</td>

            <td>
                <input type="text"
                       className={"w-full"}
                       value={email}
                       onChange={e => setEmail(e.currentTarget.value)}
                />
            </td>

            <td>
                <input type="text"
                       className={"w-full"}
                       value={firstName}
                       onChange={e => setFirstName(e.currentTarget.value)}
                />
            </td>

            <td>
                <input type="text"
                       className={"w-full"}
                       value={lastName}
                       onChange={e => setLastName(e.currentTarget.value)}
                />
            </td>

            <td>
                <select value={role}
                        onChange={e => setRole(e.currentTarget.value)}
                        className={"w-full"}
                >
                    <option>Waiter</option>
                    <option>Kitchen</option>
                </select>
            </td>

            <td>
                <select value={isAdmin ? "true" : "false"}
                        onChange={e => setIsAdmin(e.currentTarget.value === "true")}
                        className={"w-full"}
                >
                    <option value={"true"}>True</option>
                    <option value={"false"}>False</option>
                </select>
            </td>

            <td>
                <div>
                    <button disabled={!hasUnsavedChanges} className={"mr-1 bg-wahaca-blue my-0"}
                            onClick={handleSave}
                    >
                        Save changes
                    </button>

                    <button disabled={!hasUnsavedChanges}
                            onClick={handleCancelChanges}
                            className={"my-0"}
                    >
                        Cancel
                    </button>
                </div>
            </td>
        </tr>
    )
}