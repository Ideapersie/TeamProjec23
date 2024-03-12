import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import { useState } from "react";

/**
 * View table numbers and the corresponding waiters assigned to them.
 * 
 * @returns 
 * @author Madeleine Huebner (Madeleine.Huebner.2022@live.rhul.ac.uk)
 */

export default function ViewTablesPage() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleClick = (id) => {
        setSelectedItemId(id);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

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
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(1)}>Table 1</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(2)}>Table 2</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(3)}>Table 3</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(4)}>Table 4</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(5)}>Table 5</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(6)}>Table 6</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(7)}>Table 7</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(8)}>Table 8</div>
                <div className="bg-wahaca-blue p-4 h-32 text-white font-semibold text-lg cursor-pointer" onClick={() => handleClick(9)}>Table 9</div>
            </div>
            {isSidebarOpen && (
                <div className="absolute top-0 right-0 h-full bg-wahaca-yellow w-1/3 shadow-md">
                    <button className="absolute top-4 right-4" onClick={handleCloseSidebar}>Close</button>
                    <div className="w-3/4 mx-auto mt-20 bg-white h-3/4 flex justify-center">
                        <div className="mt-4">
                            <p className="text-wahaca-teal font-semibold text-lg">Table {selectedItemId}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}