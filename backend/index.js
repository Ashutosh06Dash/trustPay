const express =require('express')
const rootRouter=require('./routes/index')
require('dotenv').config();
const cors=require("cors");
const app=express();
const PORT=process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


app.use("/api/v1",rootRouter);

app.listen(PORT);