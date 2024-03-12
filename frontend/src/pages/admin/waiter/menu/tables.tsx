import PageHeader from "@/components/common/text/PageHeader";
import PageTitle from "@/components/common/text/PageTitle";
import styles from "@/components/menu/admin/Tables.module.css";
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
                    TABLES
                </PageTitle>
            </PageHeader>
            
        
            <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                    <div
                        key={index}
                        className={styles.tableItem}
                        onClick={() => handleClick(index + 1)}
                    >
                        {index + 1}
                </div>
                ))}
            </div>

            {isSidebarOpen && (
                <div className="absolute top-0 right-0 h-full w-1/3">
                    <button className="absolute top-4 right-4" onClick={handleCloseSidebar}>Close</button>
                    <div className="w-3/4 mx-auto mt-20 bg-white h-3/4 flex justify-center">
                        <div className="mt-4">
                            <p className="text-wahaca-teal font-title text-lg">Table {selectedItemId}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}