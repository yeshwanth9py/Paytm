const express = require("express");
const app = express();
const connectDb = require("./db/config");
const cors = require("cors");
const apiRouter = require("./routes");


connectDb();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.use("/api/v1", apiRouter);

app.listen(3000, ()=>{
    console.log("server has started at port "+PORT);
})



