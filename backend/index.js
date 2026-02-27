require("dotenv").config();
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://KashyapK:Iamkash2272@cluster0.v8dhv.mongodb.net/e-commerce");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

connectDB();

// app.get("/", (req, res) => {
//   res.send("Express App is Running");
// });

// Image upload

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
  res.json({
    success: 1,
    image_url: `${backendUrl}/images/${req.file.filename}`,
  });
});

// Product schema

const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

app.post("/addproduct", async (req, res) => {
  const products = await Product.find({});
  const id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

  const product = new Product({
    id,
    name: req.body.name,
    image: req.body.image,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

app.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.get("/newcollections", async (req, res) => {
  const products = await Product.find({});
  res.send(products.slice(1).slice(-8));
});

app.get("/popular", async (req, res) => {
  const products = await Product.find({}).sort({ views: -1 }).limit(10);
  res.send(products);
});

app.get("/mostliked", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ likes: -1 }).limit(10);
    res.send(products);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/incrementviews", async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findOne({ id });
    if (product) {
      product.views += 1;
      await product.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/like", async (req, res) => {
  const { id } = req.body;
  try {
    const product = await Product.findOne({ id });
    if (product) {
      product.likes += 1;
      await product.save();
      res.json({ success: true, likes: product.likes });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// User schema

const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  isAdmin: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

// Auth middleware

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

app.post("/signup", async (req, res) => {
  const existing = await Users.findOne({ email: req.body.email });
  if (existing) {
    return res.status(400).json({ success: false, errors: "An account with this email already exists" });
  }

  const cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    cartData: cart,
  });

  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token });
});

app.post("/login", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, errors: "Invalid email address" });
  }
  if (req.body.password !== user.password) {
    return res.json({ success: false, errors: "Invalid password" });
  }
  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token, isAdmin: user.isAdmin || false });
});

// Admin login — same as login but verifies admin flag
app.post("/adminlogin", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, errors: "Invalid email address" });
  }
  if (req.body.password !== user.password) {
    return res.json({ success: false, errors: "Invalid password" });
  }
  if (!user.isAdmin) {
    return res.json({ success: false, errors: "You do not have admin privileges" });
  }
  const token = jwt.sign({ user: { id: user.id } }, "secret_ecom");
  res.json({ success: true, token, isAdmin: true });
});

// Check if current user is admin
app.get("/isadmin", fetchUser, async (req, res) => {
  const user = await Users.findOne({ _id: req.user.id });
  if (user) {
    res.json({ isAdmin: user.isAdmin || false });
  } else {
    res.json({ isAdmin: false });
  }
});

app.post("/addtocart", fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

app.post("/removefromcart", fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

app.post("/getcart", fetchUser, async (req, res) => {
  const userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Serve frontend and admin in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));
//   app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));

//   app.get('/admin/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../admin/dist/index.html'));
//   });

//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
//   });
// }

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.error("Error starting server:", error);
  }
});
