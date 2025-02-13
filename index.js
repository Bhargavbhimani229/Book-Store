const express = require("express");
const db = require("./configs/database");
const adminModel = require("./models/adminschema");
const Book = require("./models/bookSchema");
const app = express();
const port = 8055;
let users = [];
let loginUser = {
  username: "bhargav@123",
  password: "bhargav@123",
};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  Book.find()
    .then((allBooks) => {
      res.render("index", { books: allBooks });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error fetching books");
    });
});

app.get("/login", (req, res) => {

  res.render("login",{error:null});
});
app.get("/bookform", (req, res) => {
  return res.render("bookform");
});
app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.get("/bookList", (req, res) => {
  Book.find({})
    .then((books) => {
      res.render("bookList", { books });
    })
    .catch((err) => {
      console.log(err.message);
      res.render("bookList", { books: [] });
    });
});

app.get('/book/delete/:id',(req,res)=>{
  const {id} = req.params;

  Book.findByIdAndDelete(id).then(()=>{
    return res.redirect(req.get("Referrer") || '/bookList');
  }).catch((err)=>{
    console.log(err.message);
    return res.redirect(req.get("Referrer") || '/bookList');
  })
})


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "bhargav@123" && password === "bhargav@123") {
    return res.render("bookform");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

app.post("/addbook", (req, res) => {
  Book.create(req.body)
    .then(() => {
      console.log("Book Created");
      res.redirect("/bookList"); 
    })
    .catch((err) => {
      console.log(err.message);
      res.render("bookform");
    });
});


app.listen(port, (err) => {
  if (!err) {
    console.log("Server started on this Port");
    console.log("http://localhost:" + port);
  }
});
