const express = require("express");
// ספריית הצפנה חד כיוונית לסיסמאות
const bcrypt = require("bcrypt");

const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Users endpoint" })
})


// auth, -> פונקציית מידל וואר/אמצע שפועל לפני הפוקנציה שאנחנו רוצים להפעיל באותו ראוט לבדיקת משתמש
router.get("/userInfo",auth,async(req,res) => {
  try{

    const data = await UserModel.find({_id:req.tokenData._id},{password:0})
    res.json(data);
  }
  catch(err){
    console.log(err)
    return res.status(502).json(err);
  }
})

// ראוטר שמחזיר את כל המשתמשים במערכת , ומאפשר רק לאדמין להיות כאן
router.get("/list",authAdmin,async(req,res) => {
  try{

    const data = await UserModel.find({},{password:0})
    res.json(data);
  }
  catch(err){
    console.log(err)
    return res.status(502).json(err);
  }
})

// הרשמה של משתמש
router.post("/", async (req, res) => {
  const validBody = validateUser(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    const user = new UserModel(req.body);
    // להצפין את הסיסמא
    user.password = await bcrypt.hash(user.password, 10);
    await user.save()
    // דואג שהצד לקוח לא ידע איך הסיסמא מוצפנת
    user.password = "******"
    res.status(201).json(user)
  }
  catch (error) {
    // בודק שגיאה של אימייל שקיים כבר במערכת לאחר שהגדרנו אינדקס במסד
    if (error.code == 11000) {
      return res.status(401).json({ err: "Email already in system" });
    }
    console.log(error)
    return res.status(502).json(error);
  }
})

router.post("/login", async (req, res) => {
  const validBody = validateLogin(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details)
  }
  try {
    // אם בכלל קיים משתמש עם המייל שנשלח
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Email not found" })
    }
    // אם הסיסמא שנשלחה בבאדי זהה לסיסמא המוצפנת במסד
    const passValid = await bcrypt.compare(req.body.password, user.password)
    if (!passValid) {
      return res.status(401).json({ msg: "Email or password not found/match" })
    }
    // נשלח טוקן
    const token = createToken(user._id,user.role)
    // res.json({token:token})
    res.json({ token })
  }
  catch (error) {
    console.log(error)
    return res.status(502).json(error);
  }
})

module.exports = router;

// תייצרו ראוטר של הראוטס
//products
// localshot:3001/products