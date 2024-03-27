import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";

/**
 * Renders a page that tells the user they tried to access a page they aren't authorised to access.
 *
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function UnauthorisedPage() {
    return (
        <div className={"bg-white p-5 rounded-xl shadow flex-grow"}>
            <PageHeader>
                <PageTitle>Unauthorised</PageTitle>
                <PageSubtitle>You are not authorised to access this page</PageSubtitle>
            </PageHeader>
        </div>
    )
}