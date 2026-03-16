import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},{timestamps:true})


userschema.methods.comparePassword=function(password){
    return bcrypt.compare(password,this.password)
}

const User=mongoose.models.User || mongoose.model("User",userschema)


export default User
