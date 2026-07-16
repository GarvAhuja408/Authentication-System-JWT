const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt  = require("bcrypt");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/auth')
}

main()
    .then( ()=>{
        console.log("Database Connection Successfull");
    })
    .catch( (err)=>{
        console.log(err);
    })

app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))






app.get("/",(req,res)=>{
    res.render("home.ejs");
})

app.get("/register",(req,res)=>{
    res.render("register.ejs");
})

app.post("/register",async(req,res)=>{
    let {username,password} = req.body;

    let userExists = await User.findOne({username});

    if(userExists){
        return res.send("User already exists");
    }

    let hash = await bcrypt.hash(password,10);

    let user = new User({
        username:username,
        password:hash,
    })

    await user.save();
    console.log("User has been saved in DB");
    res.redirect("/login");
})


app.get("/login",(req,res)=>{
    res.render("login.ejs");
})


app.listen(port,()=>{
    console.log("Listening to port 8080");
})