
import express  from "express";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import { render } from "ejs";
import jwt from "jsonwebtoken" 

const app =express()

mongoose.connect("mongodb://127.0.0.1:27017/",{dbName:"user"}).then(()=>{
    console.log("database is connected")
}).catch((e)=>{
    console.log(e)
})

const userSchema=new mongoose.Schema({
    name:String,
    email:String
})

const isAuth=async(req,r,next)=>{
    const{token}=req.cookies;
    if(token){
       const usrs= jwt.verify(token,"sdfhsdkfdjkdkfhs")
       req.users =await Users.findById(usrs._id)
       next()
    }else{
        r.render("login")
    }
}

const Users= mongoose.model("user",userSchema)

app.set("view engine","ejs")

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(path.resolve(),"public")))


app.get("/",isAuth,(req,res)=>{
    res.render("logout",{name:req.users.name})
})

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.redirect("/")

})

app.post("/login",async(req,res)=>{

   const {name,email}=req.body;
const users = await Users.create({name:name,email:email})
 const token =jwt.sign({_id:users._id},"sdfhsdkfdjkdkfhs")

    res.cookie("token",token,{
        httpOnly:true,

    })
    res.redirect("/")

})

app.listen(4000,()=>{
    console.log("server start on http://localhost:4000")
})