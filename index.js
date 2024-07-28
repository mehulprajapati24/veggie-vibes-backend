const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// mehulprajapati1661
// rnSwXUL6Ybj8kCBN

app.use(express.json());
app.use(cors());

async function main(){
    await mongoose.connect("mongodb+srv://mehulprajapati1661:rnSwXUL6Ybj8kCBN@veggie-vibes-react-app.pyil4jp.mongodb.net/Veggie-Vibes-react-app?retryWrites=true&w=majority&appName=Veggie-Vibes-react-app");

    app.get("/", (req, res)=>{
        res.send("Veggie-Vibes app server running...");
    });
}

main().then(()=>{console.log("MongoDB connected successfully")}).catch(err => console.log(err));

const ItemRoutes = require("./src/routes/itemRoute");
const CategoryRoutes = require('./src/routes/categoryRoute')

app.use('/api', ItemRoutes);
app.use('/api', CategoryRoutes);

app.listen(port, ()=>{
    console.log(`Veggie-Vibes app listening on port ${port}`);
});