const Income = require("../models/Income")
const Expense = require("../models/Expense")

const { isValidObjectId , Types } = require("mongoose")

// Dashboard data
exports.getDashboardData = async(req,res)=>{
    try {
        const userId = req.user.id
        const userObjectId = new Types.ObjectId(String(userId))

        // fetch total income and expense

        const totalIncome = await Income.aggregate([
            { $match : { userId : userObjectId } },
            { $group : { _id : null , total : { $sum : "$amount" } } }
        ])

        // console.log("totalIncome", {totalIncome,  userId : isValidObjectId(userId)})

        const totalExpense = await Expense.aggregate([
            { $match : { userId : userObjectId } },
            { $group : { _id : null , total : { $sum : "$amount" } } }
        ])

        // Get Income transaction in the last 60 days

        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date : { $gte : new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({date : -1})

        // Get total income in last 60 days

        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum,transaction) => sum + transaction.amount , 0)


        // Get Expense transactions in the last 30 days

        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date : { $gte : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({date : -1})

        // get total expenses for last 30 days

        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum,transaction) => sum + transaction.amount,
            0
        )

        // fetch last 5 transaction (income + expense)

        const lastTransactions = [
            ...(await Income.find({userId}).sort({date : -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type : "income"
                })
            ),
            ...(await Expense.find({userId}).sort({date : -1}).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type : "expense"
                })
            )
        ].sort((a,b) => b.date - a.date) // sort latest.first

        // final response

        res.status(200).json({
            totalBalance : (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome : totalIncome[0]?.total || 0,
            totalExpense : totalExpense[0]?.total || 0,
            last30DaysExpenses : {
                total : expensesLast30Days,
                transactions : last30DaysExpenseTransactions,
            },
            last60DaysIncome : {
                total : incomeLast60Days,
                transactions : last60DaysIncomeTransactions
            },
            recentTransactions : lastTransactions
        })
    } catch (err) {
        res.status(500).json({message : "Server Error" , err})
    }
}