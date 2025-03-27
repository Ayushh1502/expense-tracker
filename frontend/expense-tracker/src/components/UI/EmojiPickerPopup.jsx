import React, {useState, useRef, useEffect} from "react";
import EmojiPicker from "emoji-picker-react";
import {LuImage , LuX} from "react-icons/lu";

const EmojiPickerPopup = ({icon, onSelect}) => {

    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);

    const handleEmojiClick = (event, emojiObject) => {
        onSelect(emojiObject.emoji);
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div
             className="flex items-center gap-4 cusror-pointer"
             onClick={() => setIsOpen(true)}
             >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
                    {icon ? (
                        <img src={icon} alt="icon" className="w-12 h-12" />
                    ) : (
                        <LuImage />
                    )}
                </div>

                <p className="">{icon ? "Change Icon" : "Pick Icon"}</p>
             </div>

             {isOpen && (
                <div ref={pickerRef} className="relative top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg">
                    <button
                     className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-92 z-10 cusror-pointer"
                     onClick={() => setIsOpen(false)}
                     >
                        <LuX />
                     </button>

                     <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-lg rounded-lg" >
                        <EmojiPicker
                        open={isOpen}
                        onEmojiClick={(emoji) => onSelect(emoji.imageUrl || "")} />
                    </div>
                </div>
             )}
        </div>
    )
}

export default EmojiPickerPopup;


