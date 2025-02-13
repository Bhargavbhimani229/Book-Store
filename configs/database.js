const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb+srv://bhargavbhimani229:12345@cluster0.p15lg.mongodb.net/book-store');

const db = mongoose.connection;

db.on('connected',(err)=>{
  if(!err)
  {
    console.log("Database connected...");
  }
})

module.exports = db;