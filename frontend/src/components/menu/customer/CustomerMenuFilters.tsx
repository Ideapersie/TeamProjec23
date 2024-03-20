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
    const [open, setOpen] = useState(false)

    // State for managing which filters are enabled
    const [filters, setFilters] = useState(loadFromUrl);

    /**
     * Gets allergies stored as URL params.
     * This function is used to initialise the component when it is first mounted.
     *
     * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
     */
    function loadFromUrl(): {enabled: boolean, name: string}[] {

        const urlAllergiesString: string = router.query.allergies as string || "";
        const urlAllergies = urlAllergiesString.split(",").map(i => i.trim()).filter(i => i);

        // Opening filter if allergies loaded from url
        if (urlAllergies.length > 0) {
            setOpen(true);
        }

        return allergens.map((allergenName) => ({
            name: allergenName,
            enabled: urlAllergies.includes(allergenName)
        }));
    }

    /**
     * Function to handle click events on filters.
     * @param name
     */
    async function clickFilter(name: string) {
        const updatedFilters = filters.map((item) => {
            if (item.name === name) {
                return {...item, enabled: !item.enabled}; // Toggle the enabled state
            }
            return item;
        });

        setFilters(updatedFilters);

        // Filter out only the enabled filters
        const enabledFilters = updatedFilters.filter(item => item.enabled).map(item => item.name);

        const url = new URL(window.location.href);

        if (enabledFilters.length > 0) {
            url.searchParams.set('allergies', enabledFilters.join(','));
        } else {
            url.searchParams.delete('allergies');
        }

        await router.push(url);
    }

    return (
        <div className={"select-none"}>
            <div
                role={"button"}
                className={`w-56 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset
                            bg-white hover:brightness-90 flex items-center gap-2
                            ${open ? `!bg-wahaca-light-navy text-wahaca-white fill-wahaca-white` : ''}
                `}
                onClick={() => setOpen(!open)}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     height={"1rem"}
                     viewBox="0 0 512 512">
                    {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                    <path
                        d="M64 32C28.7 32 0 60.7 0 96s28.7 64 64 64h1c3.7 88.9 77 160 167 160h56V128H264 88.8 64c-17.7 0-32-14.3-32-32s14.3-32 32-32H464c8.8 0 16-7.2 16-16s-7.2-16-16-16H64zM224 456c0 13.3 10.7 24 24 24h72V407.8l-64.1-22.4c-12.5-4.4-26.2 2.2-30.6 14.7s2.2 26.2 14.7 30.6l4.5 1.6C233 433.9 224 443.9 224 456zm128 23.3c36.4-3.3 69.5-17.6 96.1-39.6l-86.5-34.6c-3 1.8-6.2 3.2-9.6 4.3v69.9zM472.6 415c24.6-30.3 39.4-68.9 39.4-111c0-12.3-1.3-24.3-3.7-35.9L382.8 355.1c.8 3.4 1.2 7 1.2 10.6c0 4.6-.7 9-1.9 13.1L472.6 415zM336 128H320V320h18.3c9.9 0 19.1 3.2 26.6 8.5l133.5-92.4C471.8 172.6 409.1 128 336 128zM168 192a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/>
                </svg>
                {open ? 'Hide' : 'Show'} allergen filter
            </div>

            {open && (
                <div className="mt-2 rounded-md bg-wahaca-light-navy text-white shadow p-7">
                    <div
                        onClick={() => setOpen(false)}
                        role={"button"}
                    >
                        <div className="text-wahaca-light-blue text-sm">
                            <strong>Click</strong> any of the allergens below to filter them out from the items on this
                            page:
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-3 mt-7">
                        {filters.map((item) => (
                            <div
                                role={"button"}
                                key={item.name}
                                className={`rounded-md text-sm text-wahaca-white hover:text-wahaca-white ${item.enabled ? 'font-bold' : 'text-opacity-50'}`}
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