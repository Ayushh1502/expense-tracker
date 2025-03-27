const xlsx = require("xlsx")
const Income = require("../models/Income")

// add income source
exports.addIncome = async(req,res)=>{
    const userId = req.user.id;

    try {
        const { icon , source , amount , date } = req.body

        // Validation: check for missing fields

        if(!source || !amount || !date){
            return res.status(400).json({message : "All Fields are Required"})
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date : new Date(date)
        })

        await newIncome.save()

        res.status(200).json({newIncome})
    } catch (err) {
        res.status(500).json({message : "Server Error" , error : err.message})
    }
}

// get all income source
exports.getAllIncome = async(req,res)=>{
    const userId = req.user.id

    try {
        const income = await Income.find({userId}).sort({date : -1})
        res.status(200).json(income)
    } catch (err) {
        res.status(500).json({message : "Server Error"})
    }
}

// delete income source
exports.deleteIncome = async(req,res)=>{
    try {
        await Income.findByIdAndDelete(req.params.id)
        res.status(200).json({message : "Income deleted successfully"})
    } catch (err) {
        res.status(500).json({message : "Server Error"})
    }
}

// download excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        // Generate the Excel file as a buffer (without saving it)
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set headers for file download
        res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        // Send the file as a response
        res.send(buffer);

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
