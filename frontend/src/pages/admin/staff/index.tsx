import {env} from "../../../../env.config";
import PageTitle from "@/components/common/text/PageTitle";
import PageHeader from "@/components/common/text/PageHeader";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import StaffMember from "@/components/staff/StaffMember";
import SectionHeading from "@/components/common/text/SectionHeading";
import {FormEvent} from "react";

interface Props {
    staffMembers: StaffMemberType[]
}

/**
 * Renders a page for viewing all staff
 * @param props
 * @constructor
 */
export default function ViewStaffPage(props: Props) {

    async function handleInvite(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const payload = {
            'email': form.get('input-email')
        }

        const response = await fetch('/api/invite', {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (response.status === 200) {
            alert("Success");
        } else {
            alert("Failed");
        }
    }

    return (
        <>
            <PageHeader>
                <PageTitle>View staff</PageTitle>
                <PageSubtitle>Use this page to manage all staff in your shop</PageSubtitle>
            </PageHeader>

            <div className={"bg-white shadow p-5 rounded-xl mb-4"}>
                <SectionHeading>Invite new staff</SectionHeading>
                <form onSubmit={handleInvite} className={"flex gap-2 items-stretch"}>
                    <input name={"input-email"}
                           type="email"
                           className={"flex-grow"}
                           placeholder={"Enter email address"}
                           required={true}
                    />
                    <button className={"m-0"}>Invite</button>
                </form>
            </div>

            <div className={"bg-white shadow p-5 rounded-xl"}>
                <SectionHeading>Existing staff</SectionHeading>
                {
                    props.staffMembers.length === 0 ?
                        <>No staff members</>
                        :
                        <table className={"table-auto w-full text-left"}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Role</th>
                                    <th>Admin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody className={"text-xs"}>
                                {
                                    props.staffMembers.slice().reverse().map((member) => (
                                        <StaffMember
                                            key={member.id}
                                            data={member}
                                        />
                                    ))
                                }
                            </tbody>
                        </table>
                }
            </div>
        </>
    )
}

/**
 * The Staff Member object returned by /api/staff/all
 */
export interface StaffMemberType {
    admin: boolean,
    email: string,
    first_name: string,
    id: number,
    last_name: string,
    role: 'Waiter' | 'Kitchen'
}

interface StaffAllResponse {
    staff_members: StaffMemberType[]
}

/**
 * Fetches a list of staff members from backend.
 */
export async function getServerSideProps(): Promise<{ props: { staffMembers: StaffMemberType[] } }> {

    const response = await fetch(env.apiHost + "/api/staff/all");
    const data: StaffAllResponse = await response.json();

    const staffMembers = data.staff_members;

    return {
        props: {
            staffMembers
        }
    }
}