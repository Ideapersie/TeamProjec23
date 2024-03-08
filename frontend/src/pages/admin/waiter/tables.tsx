import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";

/**
 * View table numbers and the corresponding waiters assigned to them.
 * 
 * @returns 
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

export default function ViewTablesPage() {



    /**
     * TODO: Fetch data from API route
     */

    /**
     * Present the list of tables.
     * 
     */
    return (
        <>
            <PageHeader>
                <PageTitle>
                    Tables
                </PageTitle>
                <PageSubtitle>
                    View tables and their associated waiters.
                </PageSubtitle>
            </PageHeader>
        
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 1</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 2</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 3</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 4</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 5</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 6</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 7</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 8</div>
                <div className="bg-custom-blue p-4 h-32 text-white font-semibold text-lg">Table 9</div>
            </div>
        </>
    )
}