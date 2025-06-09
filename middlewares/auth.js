const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.auth = (req,res,next) => {
  // בדיקה אם בכלל נשלח טוקן
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need to send token"})
  }
  try{
    // לנסות לדיקודד את הטוקן
    const decode = jwt.verify(token,process.env.TOKEN);
    req.tokenData = decode;
    // לעבור לפונקציה הבאה בשרשור
    next();
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired"})
  }
}
// אימות של אדמין
exports.authAdmin = (req,res,next) => {
  // בדיקה אם בכלל נשלח טוקן
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need to send token"})
  }
  try{
    // לנסות לדיקודד את הטוקן
    const decode = jwt.verify(token,process.env.TOKEN);
    // בודק אם המשתמש לא אדמין ומחזיר לו שגיאה
    if(decode.role != "admin"){
      return res.status(401).json({err:"You need to be admin to be here"})
    }
    req.tokenData = decode;
    // לעבור לפונקציה הבאה בשרשור
    next();
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired"})
  }
}