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
        temp[props.fieldKey].allergen = e.currentTarget.value || null;
        updateIngredientState(temp);
    }

    return (
        context === null ?
            <div>Loading...</div>
            :
            <div className={"flex gap-2 items-stretch text-xs"}>
                <div className={"font-medium text-wahaca-light-navy self-center"}>
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
                    value={context.ingredients[props.fieldKey].allergen || undefined}
                    onChange={handleChangeAllergenGroup}
                    required
                >
                    <option value={undefined}>
                        No allergens
                    </option>

                    {allergens.map(allergenName => (
                        <option
                            key={allergenName}
                            value={allergenName}
                        >
                            {allergenName}
                        </option>
                    ))}
                </select>

                <button
                    className={"m-0 bg-wahaca-pink"}
                    onClick={handleRemoveIngredient}
                    type={"button"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         height={"0.7rem"}
                         className={"fill-wahaca-white"}
                         viewBox="0 0 448 512">
                        {/*!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                        <path
                            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                    </svg>
                </button>
            </div>
    )
}