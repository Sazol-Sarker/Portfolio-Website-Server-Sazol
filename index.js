const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://web-portfolio-3cd6a.firebaseapp.com",
      "https://web-portfolio-3cd6a.firebaseapp.com",
    ],
  })
);
app.use(express.json());

// mongodb connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // DB+collection
    const InboxMessageCollection = client
      .db("WebPortfolioDB")
      .collection("InboxMessageCollection");

    // APIs
    // InboxMessageCollection
    // POST single
    app.post("/contactMsg", async (req, res) => {
      const newMsg = req.body;
      const result = await InboxMessageCollection.insertOne(newMsg);

      res.send(result);
    });
    // GET all
    app.get("/contactMsg", async (req, res) => {
      const result = await InboxMessageCollection.find().toArray();
      res.send(result);
    });

    // nodemailer email
    app.post("/send-email", async (req, res) => {
      const { name,myEmail, email, msg } = req.body;

      // nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:  process.env.NODEMAILER_SENDER_EMAIL,
          pass: process.env.NODEMAILER_SENDER_EMAIL_PWD,
        },
      });

      const mailOption = {
        from: myEmail,
        to: email,
        subject: `Thank You, ${name}, for Reaching Out!`,
        text: `Hi ${name},
      
      Thank you for getting in touch!
      
      I’ve received your message and will do my best to get back to you as soon as possible. Here’s a quick summary of what you sent:
      
      -----------------------------------------
      Name: ${name}
      Email: ${email}
      Message: ${msg}
      -----------------------------------------
      
      If your message is urgent, feel free to reach out to me directly at this email address.
      
      Thanks again, and I look forward to connecting with you!
      
      Best regards,  
      Sazol Sarker  
      Web Developer  
      GitHub: https://github.com/Sazol-Sarker  
      LinkedIn: https://www.linkedin.com/in/sazol-sarker-63832818b`,
      };
      

      try {
        await transporter.sendMail(mailOption);
        res.status(200).send({ msg: "Email sent!" });
      } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ message: "Email failed to send" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Portfolio is running...");
});

app.listen(port, () => {
  console.log("Listening on port=>", port);
});
