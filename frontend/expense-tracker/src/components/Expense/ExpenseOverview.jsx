import React, {useState, useEffect} from "react";
import {LuPlus} from "react-icons/lu";
import {prepareExpenseLineChartData} from "../../Utils/helper";
import CustomLineChat from "../Charts/CustomLineChat";

const ExpenseOverview = ({transactions, onExpenseIncome}) => {
    const [charData, setCharData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions)
        setCharData(result);

        return () => {}
    }, [transactions]);

    return <div className="card">
        <div className="flex items-center  justify-between">
            <div className="">
                <h5 className="text-lg">Expense Overview</h5>
                <p className="text-xs text-gray-400 mt-0.5">
                    Track Your Spending Trends Over Time and Gain Insights into Your Financial Habits.
                </p>
            </div>

            <button className="add-btn" onClick={onExpenseIncome}>
                <LuPlus className="text-lg"/>
                Add Expense
            </button>
        </div>

        <div className="mt-10">
            <CustomLineChat data={charData}/>
        </div>
    </div>
}

export default ExpenseOverview;
