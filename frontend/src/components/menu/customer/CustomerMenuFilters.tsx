import {allergens} from "@/components/allergens/helper";
import {useState} from "react"
import {useRouter} from 'next/router';

/**
 * A component that customers can use to filter Menu Items based on their allergies.
 *
 * @author Alvis Wang
 * @constructor
 */
export function CustomerMenuFilters() {

    const router = useRouter();

    // State for managing dropdown
    const [open, setOpen] = useState(true)

    // State for managing which filters are enabled
    const [filters, setFilters] = useState(() => {
        return allergens.map((string) => {
            return {
                name: string,
                enabled: false
            };
        })
    });

    // Function to handle click events on filters
    const clickFilter = (name: string) => {
        const updatedFilters = filters.map((item) => {
            if (item.name === name) {
                return {...item, enabled: !item.enabled}; // Toggle the enabled state
            }
            return item;
        });

        setFilters(updatedFilters);

        // Filter out only the enabled filters
        const enabledFilters = updatedFilters.filter(item => item.enabled).map(item => item.name);

        // Check if there are any enabled filters and construct the URL accordingly
        const url = enabledFilters.length > 0
            ? `http://localhost:3000/menu/Sides?allergies=${enabledFilters.join(',')}`
            : 'http://localhost:3000/menu/';

        router.push(url);
    };

    return (
        <div>
            <div
                className="w-56 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset hover:bg-gray-100"
                onClick={() => setOpen(!open)}>
                ALLERGENS FILTER
            </div>

            {open && (
                <div className="rounded-md bg-white shadow-lg">
                    <div className="px-3 py-2">Does not contain:</div>
                    <div className="grid grid-cols-9 gap-1 p-3">
                        {filters.map((item) => (
                            <div
                                key={item.name}
                                className={`w-40 rounded-md text-gray-700 block px-3 py-2 text-sm ${item.enabled ? 'bg-violet-400 hover:bg-violet-300' : 'hover:bg-gray-100'}`}
                                onClick={() => clickFilter(item.name)}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}