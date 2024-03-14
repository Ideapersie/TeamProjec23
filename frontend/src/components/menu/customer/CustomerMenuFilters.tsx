import { allergens } from "@/components/allergens/helper";
import { useState } from "react"


// Array of filter options
const FILTERS = allergens;

// filter component
export function CustomerMenuFilters(){
  // State for managing dropdown
  const [open, setOpen] = useState(true)

  // State for managing which filters are enabled
  const [filters, setFilters] = useState(() => {
    return FILTERS.map((string) => {
      return {
        name: string,
        enabled: false
      };
    })
  });

  // Function to handle click events on filters
  const clickFilter = (name: string) => {
    setFilters(filters.map((item) => {
      if (item.name == name) return {...item, enabled: !item.enabled}
      else return {...item}
  }))
  }


  return (
    <div>
      <div 
        className="w-56 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-inset hover:bg-gray-100"
        onClick={() => setOpen(!open)}>
        ALLERGENS FILTER
      </div>
      <div className={`w-56 rounded-md bg-white shadow-lg py-1 ${open ? '' : 'hidden'}`}>
          Does not contain:
          {filters.map((item) => 
            <div 
              key={item.name} 
              className={`w-56 rounded-md text-gray-700 block px-3 py-2 text-sm ${item.enabled ? 'bg-violet-400 hover:bg-violet-300': 'hover:bg-gray-100'}`}
              onClick={() => clickFilter(item.name)}>
                {item.name}
            </div>
          )}
      </div>
    </div>
  );
}