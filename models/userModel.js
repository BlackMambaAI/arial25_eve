const mongoose = require("mongoose");
const Joi = require("joi");
// ספרייה של ניהול וייצור טוקנים
const jwt = require("jsonwebtoken");
require("dotenv").config()

const schema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  // מאפיין שקובע את תפקיד המשתמש אם רגיל או אדמין
  role:{
    type:String, default:"user"
  }
},{timestamps:true})

exports.UserModel = mongoose.model("users",schema);

// role - תפקיד של המשתמש אם אדמין או רגיל
exports.createToken = (user_id,role) => {
  const token = jwt.sign({_id:user_id,role}, process.env.TOKEN, {expiresIn:"60mins"})
  return token
}


exports.validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).max(20).required(),
    // email() -> בודק שהמייל בפורמט נכון
    email:Joi.string().min(2).max(100).email().required(),
    password:Joi.string().min(3).max(20).required(),
  })
  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    // email() -> בודק שהמייל בפורמט נכון
    email:Joi.string().min(2).max(100).email().required(),
    password:Joi.string().min(3).max(20).required(),
  })
  return joiSchema.validate(_reqBody);
}