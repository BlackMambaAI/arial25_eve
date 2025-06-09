const express = require("express");
const { CarModel, validCar } = require("../models/carModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/",async(req,res) => {
  const limit = 10;
  const skip = req.query.skip || 0;
  const sort = req.query.sort || "_id"
  const reverse = req.query.reverse == "yes" ? 1 : -1;
  try {
    // SELECT * FROM cars LIMIT 0,10;
    const data = await CarModel
    .find({})
    // הגבלה של כמות רשומות שיוצגו
    .limit(limit)
    // דילוג על רשומות
    .skip(skip)
    // מיון - אחד מהקטן לגדול, מינוס אחד ההפך
    // [sort] ייקח באובייקט כמאפיין את הערך של הסורט 
    .sort({[sort]:reverse})
    res.json(data);
  } 
  catch (error) {
    console.log(error);
    return res.status(502).json({error})
  }
})

// /cars/search?s=
router.get("/search",async(req,res) => {
  try {
    const queryS = req.query.s;
    // מונע בעיית קייס סינסטיב - אותיות גדולות/קטנות
    const searchExp = new RegExp(queryS,"i");
    // const data = await CarModel.find({company:searchExp});
    // $or -> מאפשר לחפש בשני מאפיינים שונים
    const data = await CarModel.find({$or:[{company:searchExp},{color:searchExp}]});
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(502).json({error})
  }
})

router.get("/count",async(req,res) => {
  try{
    const limit = req.query.limit || 10;
    // יחזיר את כמות הרשומות בקולקשן/טבלה
    const count = await CarModel.countDocuments({})
    res.json({count,pages:Math.ceil(count/limit)});
  }
  catch (error) {
    console.log(error);
    return res.status(502).json({error})
  }
})

router.post("/",auth, async(req,res) => {
  const validBody = validCar(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const car = new CarModel(req.body);
    car.user_id = req.tokenData._id
    await car.save();
    res.status(201).json(car);
  }
  catch(err){
    console.log(error);
    return res.status(502).json({error})
  }
})

router.put("/:id",auth,async(req,res) => {
  const validBody = validCar(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id;
    const data = await CarModel.updateOne({_id:id,user_id:req.tokenData._id},req.body)
    res.json(data);
  }
  catch(err){
    console.log(error);
    return res.status(502).json({error})
  }
})

router.delete("/:id",auth,async(req,res) => {
  try{
    const id = req.params.id;
    const data = await CarModel.deleteOne({_id:id,user_id:req.tokenData._id})
    res.json(data);
  }
  catch(err){
    console.log(error);
    return res.status(502).json({error})
  }
})


module.exports = router;