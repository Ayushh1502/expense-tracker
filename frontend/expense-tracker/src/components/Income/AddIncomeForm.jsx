import React, {useState} from "react";
import Input from "../inputs/input"
import EmojiPickerPopup from "../UI/EmojiPickerPopup";

const AddIncomeForm = ({onAddIncome}) => {

    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: ""
    });
    
    const handleChange = (key,value) => setIncome({...income, [key]: value});

    
    return (
        <div>

            <EmojiPickerPopup
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.source}
                onChange={(event) => handleChange("source", event.target.value)}
                label="Income Source"
                placeholder="Freelance, Salary etc"
                type="text"
            />

            <Input
                value={income.amount}
                onChange={(event) => handleChange("amount", event.target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={income.date}
                onChange={(event) => handleChange("date", event.target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end">
                <button 
                type="button"
                className="add-btn add-btn-fill"
                onClick={() => onAddIncome(income)}
                >
                    Add Income
                </button>
            </div>
        </div>
    )
}

export default AddIncomeForm;
