import {useEffect, useState} from "react";

export default function Vince() {

    // Creates a React useState hook with an initial value of zero
    const [count, setCount] = useState<number>(0);

    // This will only run the first time the page loads
    useEffect(() => {
        console.log("Component mounted!");
    }, []);

    // This runs the first time the component loads on the page AND whenever the button click count changes
    useEffect(() => {
        console.log("New button count ->", count); // Open browser developer console and you should see this message being logged every time you click the buttono
    }, [count]);

    function handleClick() {
        setCount(count + 1);
    }

    // Everything inside the "return" statement is what actually gets displayed on the page, everything above is "logic"
    return (
        <div>
            <h1>Hello, my name is Vince</h1>
            <button onClick={handleClick}>
                Click me!
            </button>
            <p>Button has been clicked {count} times</p>
        </div>
    )
}