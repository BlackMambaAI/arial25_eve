const mongoose = require('mongoose');
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
  console.log(process.env.TOKEN)
  console.log(process.env.MONGO_DB)
  //await mongoose.connect('mongodb://127.0.0.1:27017/arial25_eve');
  //await mongoose.connect('mongodb+srv://moti:gM-jueA!q9FMEzG@cluster0.vkxffzi.mongodb.net/arial25_eve');
  await mongoose.connect(process.env.MONGO_DB);
  console.log("mongo connect arial25_eve Atlas");
  

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}