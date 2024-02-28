
import { MenuItem } from "@/types";
import { GetServerSidePropsContext } from "next";
import { useMemo, useState } from "react"


// Array of filter options
const FILTERS = [
  'Vegan',
  'Low calories to high',
  'Low price to high'
]

// filter component
export function CustomerMenuFilters(){
  // State for managing dropdown
  const [open, setOpen] = useState(true)

  // State for managing which filters are enabled
  const [filters, setFilters] = useState(() => {
    return FILTERS.map((str) => {
      return {
        name: str,
        enabled: false
      };
    })
  });

  // Function to handle click events on filters
  const clickFilter = (name: string) => {
    setFilters(filters.map((item) => {
        if (item.name === name) {
            return { ...item, enabled: !item.enabled };
        } else {
            return { ...item, enabled: false };
        }
    }));
};

  return (
    <div>
      <div 
        onClick={() => setOpen(!open)}>
        Filter Our Menu
      </div>
      <div>
          {filters.map((item) => 
            <div 
              key={item.name} 
              onClick={() => clickFilter(item.name)}>
                {item.name}
            </div>
          )}
      </div>
    </div>
  );
}