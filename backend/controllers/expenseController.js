const xlsx = require("xlsx")
const Expense = require("../models/Expense")

// add Expense
exports.addExpense = async(req,res)=>{
    const userId = req.user.id;

    try {
        const { icon , category , amount , date } = req.body

        // Validation: check for missing fields

        if(!category || !amount || !date){
            return res.status(400).json({message : "All Fields are Required"})
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date : new Date(date)
        })

        await newExpense.save()

        res.status(200).json({newExpense})
    } catch (err) {
        res.status(500).json({message : "Server Error"})
    }
}

// get all Expenses
exports.getAllExpense = async(req,res)=>{
    const userId = req.user.id

    try {
        const expense = await Expense.find({userId}).sort({date : -1})
        res.status(200).json(expense)
    } catch (err) {
        res.status(500).json({message : "Server Error"})
    }
}

// delete Expense category
exports.deleteExpense = async(req,res)=>{
    try {
        await Expense.findByIdAndDelete(req.params.id)
        res.status(200).json({message : "Expense deleted successfully"})
    } catch (err) {
        res.status(500).json({message : "Server Error"})
    }
}

// download excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => ({
            Category: item.category, // Capitalized for consistency
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Generate the Excel file as a buffer (no file saving)
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set response headers for file download
        res.setHeader("Content-Disposition", "attachment; filename=expense_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // Send the file as a response
        res.send(buffer);

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
