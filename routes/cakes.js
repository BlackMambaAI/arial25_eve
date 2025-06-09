const express = require("express");

const { CakeModel, validateCake } = require("../models/cakeModel");
const router = express.Router();

router.get("/",async(req,res) => {
  try {
    const data = await CakeModel.find({});
    res.json(data);
  } catch (error) {
    console.log(error)
    return res.status(502).json(error);
  }
})

router.post("/",async(req,res) => {
  // בדיקה שהמידע בבאדי לפי הסכימה של הג'וי
  const validBody = validateCake(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    // מייצרים רשומה בזכרון
    const cake = new CakeModel(req.body)
    // נוסיף לרשומה מאפיין של האיי די של המשתמש

    // שמירת הרשומה במסד
    await cake.save()
    res.status(201).json(cake)
  }
  catch (error) {
    console.log(error)
    return res.status(502).json(error);
  }
})

router.put("/:id",async(req,res) =>{
  const validBody = validateCake(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id
    const data = await CakeModel.updateOne({_id:id},req.body)
    // modfiedCount:1 אם הצליח
    res.json(data)
  }
  catch (error) {
    console.log(error)
    return res.status(502).json(error);
  }
})

router.delete("/:id",async(req,res) => {
  try{
    const id = req.params.id
    const data = await CakeModel.deleteOne({_id:id})
    // deletedCount:1 אם הצליח
    res.json(data)
  }
  catch (error) {
    console.log(error)
    return res.status(502).json(error);
  }
})


module.exports = router;