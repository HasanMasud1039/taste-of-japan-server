const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const port = process.env.PORT || 4000;

// const jwt = require("jsonwebtoken");

// middleware//
app.use(cors());
app.use(express.json());
app.use(helmet());


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fznkpfd.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"], // Set a default source that disallows everything
      scriptSrc: ["'self'", "'https://vercel.live'"], // Allow scripts from 'self' and 'https://vercel.live'
      // Add more directives for other content types if needed (e.g., imgSrc, styleSrc, etc.)
    },
  })
);

app.get('/', (req, res) => {
  res.send('Hi User! Welcome to Japan.')
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const chefCollection = client.db("taste-of-Japan-DB").collection("chef");
    const blogCollection = client.db("taste-of-Japan-DB").collection("blogs");

    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    app.get("/chefs", async (req, res) => {
      const result = await chefCollection.find().toArray();
      res.send(result);
    });

    app.get('/chefs/:id', async (req, res) => {
      const id = req.params.id;
      const selectedChefs = await chefCollection
        .find({
          id: req.params.id
        }).toArray();
      res.send(selectedChefs);
    })
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const selectedBlogs = await blogCollection
        .find({
          id: req.params.id
        }).toArray();
      res.send(selectedBlogs);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`Example app listening on port ${port}`)
})


// module.exports = app;
