const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
  company: String,
  model:String,
  color: String,
  year: Number,
  user_id:String
},{timestamps:true});

exports.CarModel = mongoose.model("cars",schema);

exports.validCar = (_reqBody) => {
  const JoiSchema = Joi.object({
    company:Joi.string().min(2).max(100).required(),
    model:Joi.string().min(2).max(100).allow(null,""),
    color:Joi.string().min(2).max(100).required(),
    year:Joi.number().min(1900).max(2060).required(),

  })
  return JoiSchema.validate(_reqBody);
}