import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import { useEffect, useState } from "react";

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

        </>
    )
}