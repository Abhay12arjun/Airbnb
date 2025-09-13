// const mongoose = require("mongoose");
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username:{type:String,required:true,unique:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
export default User;
