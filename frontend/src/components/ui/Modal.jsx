import { useEffect } from "react";

function Modal({ isOpen, onClose, title, children }) {

    // Close modal when Escape is pressed
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };

    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }
    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                px-4
            "
            onMouseDown={onClose}
        >

            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-white
                    p-6
                    shadow-xl
                "
                onMouseDown={(event) => {
                    event.stopPropagation();
                }}
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-xl
                            leading-none
                            text-gray-400
                            hover:text-gray-700
                        "
                    >
                        ×
                    </button>
                </div>
                {/* Content */}
                <div className="mt-4">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Modal;