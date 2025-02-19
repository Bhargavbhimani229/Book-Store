const express = require("express");
const db = require("./configs/database");
const adminModel = require("./models/adminschema");
const Book = require("./models/bookSchema");
const app = express();
const port = 8059;
let users = [];
let loginUser = {
  username: "bhargav@123",
  password: "bhargav@123",
};

app.set("view engine", "ejs"); 
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); 

// ---------------------- Home Route ----------------------
app.get("/", (req, res) => {
  Book.find({})
    .then((allBooks) => {
      const bestSeller = allBooks.filter(book => book.bestseller === true);
      const popular = allBooks.filter(book => book.bestseller === false);
      
      res.render("index", { bestSeller, popular });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error fetching books");
    });
});

// ---------------------- Login Route ----------------------
app.get("/login", (req, res) => {
  res.render("login", { error: null }); 
});

// ---------------------- Book Form Route ----------------------
app.get("/bookform", (req, res) => {
  return res.render("bookform"); 
});

// ---------------------- Logout Route ----------------------
app.get("/logout", (req, res) => {
  res.redirect("/login"); 
});

// ---------------------- Edit Book (GET) ----------------------
app.get('/book/edit/:id', (req, res) => {
  const { id } = req.params;
  Book.findById(id)
    .then((book) => {
      return res.render('editbook', { book }); 
    })
    .catch((err) => {
      console.log(err.message);
      return res.render('editbook', { book: [] }); 
    });
});

// ---------------------- Edit Book (POST) ----------------------
app.post('/book/edit', (req, res) => {
  const { id, bookName, author, price, description, imageUrl, bestseller } = req.body;
  Book.findByIdAndUpdate(id, {
    bookName,
    author,
    price,
    description,
    imageUrl,
    bestseller: bestseller === 'on' 
  })
  .then(() => {
    return res.redirect('/bookList'); 
  })
  .catch((err) => {
    console.log(err.message);
    return res.redirect('/bookList'); 
  });
});

// ---------------------- Book List Route ----------------------
app.get("/bookList", (req, res) => {
  Book.find({})
    .then((books) => {
      res.render("bookList", { books }); 
    })
    .catch((err) => {
      res.render("bookList", { books: [] }); 
    });
});

// ---------------------- Delete Book Route ----------------------
app.get('/book/delete/:id', (req, res) => {
  const { id } = req.params;

  Book.findByIdAndDelete(id)
    .then(() => {
      return res.redirect(req.get("Referrer") || '/bookList'); 
    })
    .catch((err) => {
      console.log(err.message);
      return res.redirect(req.get("Referrer") || '/bookList'); 
    });
});

// ---------------------- Login Authentication (POST) ----------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "bhargav@123" && password === "bhargav@123") {
    return res.render("bookform"); 
  } else {
    res.render("login", { error: "Invalid username or password" }); 
  }
});

// ---------------------- Add Book Route ----------------------
app.post("/addbook", (req, res) => {  
  req.body.bestseller = req.body.bestseller === 'on'; 

  Book.create(req.body)
    .then((data) => {
      res.redirect("/bookList"); 
    })
    .catch((err) => {
      console.log(err.message);
      res.render("bookform"); 
    });
});

// ---------------------- Start Server ----------------------
app.listen(port, (err) => {
  if (!err) {
    console.log("Server started on this Port");
    console.log("http://localhost:" + port); 
  }
});
