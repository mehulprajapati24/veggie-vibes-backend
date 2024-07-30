const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT;


app.use(express.json());
app.use(cors());

async function main(){
    await mongoose.connect(process.env.CONNECTION_STRING);

    app.get("/", (req, res)=>{
        res.send("Veggie-Vibes app server running...");
    });
}

main().then(()=>{console.log("MongoDB connected successfully")}).catch(err => console.log(err));

const ItemRoutes = require("./src/routes/itemRoute");
const CategoryRoutes = require('./src/routes/categoryRoute')
const UserRoutes = require('./src/routes/userRoute')

app.use('/api', ItemRoutes);
app.use('/api', CategoryRoutes);
app.use('/user', UserRoutes);

app.listen(port, ()=>{
    console.log(`Veggie-Vibes app listening on port ${port}`);
});