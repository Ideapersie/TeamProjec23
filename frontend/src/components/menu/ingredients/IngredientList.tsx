import {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import IngredientItemField from "@/components/menu/ingredients/IngredientItemField";

/**
 * The data stored in the ingredients useState hook.
 */
export type IngredientState = {
    [key: number]: {
        name: string,
        allergen: string | null
    }
}

/**
 * States to be made available to child components.
 */
export const IngredientListContext = createContext<{
    ingredients: IngredientState,
    setIngredients: Dispatch<SetStateAction<IngredientState>>
} | null>(null);

/**
 * Component props.
 */
interface Props {
    ingredients: IngredientState,
    setIngredients: Dispatch<SetStateAction<IngredientState>>
}

export default function IngredientList({ingredients, setIngredients}: Props) {

    // TODO: Remove, this is just for debugging
    useEffect(() => {
        console.log("ingredients:", ingredients);
    }, [ingredients]);

    function handleAddIngredient() {
        setIngredients({
            ...ingredients,
            [Date.now()]: {
                name: "",
                allergen: null
            }
        });
    }

    return (
        <IngredientListContext.Provider value={{
            ingredients,
            setIngredients
        }}>

            <div className={"flex flex-col gap-2"}>
                {Object.keys(ingredients).length === 0 ?
                    <div className={"bg-gray-50 border rounded-lg px-3 py-2 text-xs text-gray-400"}>
                        No items added
                    </div>
                    :
                    Object.entries(ingredients).map(([time, name], index) => (
                        <IngredientItemField
                            key={time}
                            fieldKey={parseInt(time)}
                            fieldIndex={index}
                        />
                    ))
                }
            </div>

            <div className={"text-right"}>
                <button
                    type={"button"}
                    onClick={handleAddIngredient}
                    className={"bg-wahaca-blue text-xs"}
                >
                    + Add ingredient
                </button>
            </div>

        </IngredientListContext.Provider>
    )
}