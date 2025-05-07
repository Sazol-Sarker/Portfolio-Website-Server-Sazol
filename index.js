const express = require("express");
const cors=require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors({origin:['http://localhost:5173']}))
app.use(express.json())


// mongodb connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uomr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const InboxMessageCollection = client.db("WebPortfolioDB").collection("InboxMessageCollection");




    // APIs
    // InboxMessageCollection
    // POST single
    app.post('/contactMsg',async(req,res)=>{
        const newMsg=req.body
        const result=await InboxMessageCollection.insertOne(newMsg)

        res.send(result)
    })
    // GET all
    app.get('/contactMsg',async(req,res)=>{
      const result=await InboxMessageCollection.find().toArray()
      res.send(result)
    })








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
