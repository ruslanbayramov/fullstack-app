const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const nodeMailer = require("nodemailer");

// For stripe payment
const stripe = require("stripe")("stripe secret key");

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// use EJS as an engine
app.set("view engine", "ejs");
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // check if user already exist
  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.send("User already exist. Please choose a different username.");
  } else {
    // hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // replace the hash password woth original password

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("user name cannot found");
    }

    // compare the hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("Wrong details");
  }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on Port: ${port}`));

// Mail sender
app.post("/contact", (req, res) => {
  console.log(req.body);

  const html = `
  <h1>${req.body.name}</h1>
  <h3>Customer email: ${req.body.email}</h3>
  <h5>Costomer hear about us in: ${req.body.message}</h5>
  `;

  async function main() {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your app password",
      },
    });

    const info = await transporter.sendMail({
      from: `${req.body.name} <${req.body.email}>`,
      to: "yourgmail@gmail.com",
      subject: "Customer Info",
      html: html,
    });

    console.log("Message sent: " + info.messageId);
    console.log(info.accepted);
    console.log(info.rejected);
  }

  main().catch((err) => console.log(err));
});

// Stripe payment integration

const DOMAIN = "http://localhost:5000";
app.use(express.static("public"));
app.use(express.json());
app.post("/payment", async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${DOMAIN}/success.html`,
    cancel_url: `${DOMAIN}/cancel.html`,
  });

  res.json({ id: session.id });
});
