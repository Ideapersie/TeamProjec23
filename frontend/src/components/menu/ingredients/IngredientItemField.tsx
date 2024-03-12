import {allergens} from "@/components/allergens/helper";
import {ChangeEvent, useContext} from "react";
import {IngredientListContext, IngredientState} from "@/components/menu/ingredients/IngredientList";

/**
 * The props required by this component.
 */
interface Props {
    fieldKey: number
    fieldIndex: number
}

/**
 * Represents an item field in the ingredient list form
 *
 * @param props
 * @constructor
 * @author Vincent Chapman-Andrews (zlac465@live.rhul.ac.uk)
 */
export default function IngredientItemField(props: Props) {

    // Getting ingredient list context
    const context = useContext(IngredientListContext);

    // Removes this ingredient item field from the list
    function handleRemoveIngredient() {

        // Checking context has been set
        if (!context) {
            return;
        }

        // Modifying clone of state object
        const temp = JSON.parse(JSON.stringify(context.ingredients)); // Create clone
        delete temp[props.fieldKey];

        // Setting state object to new updated version
        context.setIngredients(temp);
    }

    function cloneIngredientState(): IngredientState {
        return JSON.parse(JSON.stringify(context?.ingredients));
    }

    function updateIngredientState(temp: IngredientState) {
        context?.setIngredients(temp);
    }

    function handleChangeIngredientName(e: ChangeEvent<HTMLInputElement>) {
        const temp = cloneIngredientState();
        temp[props.fieldKey].name = e.currentTarget.value;
        updateIngredientState(temp);
    }

    function handleChangeAllergenGroup(e: ChangeEvent<HTMLSelectElement>) {
        const temp = cloneIngredientState();
        temp[props.fieldKey].allergen = e.currentTarget.value;
        updateIngredientState(temp);
    }

    return (
        context === null ?
            <div>Loading...</div>
            :
            <div className={"flex gap-2 items-center text-xs"}>
                <div className={"font-medium text-gray-400"}>
                    {props.fieldIndex + 1}
                </div>

                {/*Ingredient name*/}
                <input
                    type={"text"}
                    className={"flex-grow"}
                    placeholder={"Ingredient name"}
                    value={context.ingredients[props.fieldKey].name || ""}
                    onChange={handleChangeIngredientName}
                    required
                />

                {/*Allergen groups (if applicable)*/}
                <select
                    value={context.ingredients[props.fieldKey].allergen || ""}
                    onChange={handleChangeAllergenGroup}
                    required
                >
                    <option value={""}>No allergens</option>

                    {allergens.map(allergenName => (
                        <option key={allergenName}>{allergenName}</option>
                    ))}
                </select>

                <button
                    className={"m-0 bg-sky-600"}
                    onClick={handleRemoveIngredient}
                    type={"button"}
                >
                    Remove
                </button>
            </div>
    )
}