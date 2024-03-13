import {Ingredient} from "@/types";
import {useEffect, useState} from "react";
import {allergens, allergens as knownAllergens} from "@/components/allergens/helper";

/**
 * The props for this component.
 */
interface Props {
    ingredients: Ingredient[]
}

export default function AllergenSummary(props: Props) {

    const [containedAllergens, setContainedAllergens] = useState<Set<string> | undefined>();

    // Checks ingredients every time props.ingredients changes
    useEffect(checkIngredients, [props.ingredients]);

    useEffect(() => {
        console.log(containedAllergens);
    }, [containedAllergens]);

    // Checks for allergens in contained ingredients
    function checkIngredients() {
        console.log("Checking ingredients")

        const newContainedAllergens = new Set<string>();

        for (const ingredient of props.ingredients) {
            if (ingredient.allergen !== null) {
                newContainedAllergens.add(ingredient.allergen);
            }
        }

        console.log(newContainedAllergens);

        setContainedAllergens(newContainedAllergens);
    }

    return (
        <>
            {containedAllergens === undefined ?
                <div>Loading...</div>
                :
                <div className={`flex flex-col gap-2 text-xs font-medium`}>
                    {knownAllergens.map(allergen => (
                        <div key={allergen}
                             className={`flex items-center gap-1.5
                                ${containedAllergens.has(allergen) ? "text-wahaca-blue" : "text-wahaca-light-blue"}
                             `}
                        >
                            <span className={`
                                transition-all
                                ${
                                containedAllergens.has(allergen) ?
                                    "fill-wahaca-blue"
                                    : "fill-wahaca-light-blue scale-75"
                                }
                            `}>
                                {containedAllergens.has(allergen) ?
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         height={"1rem"}
                                         viewBox="0 0 512 512">
                                        {/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                                        <path
                                            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         height={"1rem"}
                                         viewBox="0 0 512 512">
                                        {/*Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
                                        <path
                                            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232H328c13.3 0 24 10.7 24 24s-10.7 24-24 24H184c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                    </svg>
                                }
                            </span>
                            <span>{allergen}</span>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}