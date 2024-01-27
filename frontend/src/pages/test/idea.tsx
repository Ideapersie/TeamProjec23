import {useEffect, useState} from "react";

// Showcasing a Next feature, getServerSideProps allows us to run code on server-side BEFORE sending to the client
// E.g. if we want to check a user is authorised to view a page before returning the code for it.
export function getServerSideProps() {
    return { props: {
        requestTime: new Date().getTime()
    }}
}

// Our React component - all code here is rendered on the client i.e. the browser
export default function Idea(props: any) {

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
            <h1>Hello, my name is Idea</h1>

            <div className={"panel"}>
                <button className={"m-0 mb-5"} onClick={handleClick}>
                    Click me!
                </button>
                <p>Button has been clicked {count} times</p>
            </div>
            
            <style jsx>{`
                .panel {
                    background: white;
                    padding: 10px;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}

