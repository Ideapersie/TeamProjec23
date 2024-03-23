import { useState } from "react";

export function NotificationBar(){
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '1000' }}>
            <button onClick={() => setIsOpen(!isOpen)}>notification</button>
            {isOpen && (
                <div className="dropdownContent">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                </div>
            )}
            <style jsx>{`
                .dropdownContent {
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    padding: 12px 16px;
                    z-index: 1;
                }
            `}</style>
        </div>
    )
}