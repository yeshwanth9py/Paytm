const express = require("express");
const mongoose = require("mongoose")
const Account = require("../db/accountSchema");
const auth = require("../middlewares/auth");
const accountRouter = express.Router();

accountRouter.get("/balance", auth,  async (req, res)=>{
    console.log((req.userd._id));
    const from_id = req.userd._id;
    const accd = await Account.findOne({userId: from_id});
    console.log(accd);
    res.json({
        balance: accd.balance
    })
})


accountRouter.post("/transfer", auth, async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to} = req.body;
    const account = await Account.findOne({userId: req.userd._id}).session(session);
    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    console.log("transferring 100 from ",req.userd._id, "to", to);

    await Account.updateOne({ userId: req.userd._id }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });

})

module.exports = accountRouter;