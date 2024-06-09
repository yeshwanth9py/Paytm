const express = require("express");
const { userRouter } = require("./userRouter");
const accountRouter = require("./accountRouter");

const apiRouter = express.Router();


apiRouter.use("/user", userRouter);
apiRouter.use("/account", accountRouter);

module.exports = apiRouter;