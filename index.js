const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

async function run() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    // Connect the client to the server
    await client.connect();

    const menuCollections = client.db("e-commerce-perform").collection("menus");
    const discountCollections = client.db("e-commerce-perform").collection("discounts");
    const bestSellerCollections = client.db("e-commerce-perform").collection("bestSeller");
    const addToCartCollections = client.db("e-commerce-perform").collection("addToCart");
    const allOrderCollections = client.db("e-commerce-perform").collection("allOrders");
    const vegitableCollections = client.db("e-commerce-perform").collection("vegitables");
    const FreshFruitCollections = client.db("e-commerce-perform").collection("FreshFruit");
    const SpecialOfferCollections = client.db("e-commerce-perform").collection("SpecialOffer");
    const dontMissCollections = client.db("e-commerce-perform").collection("dontMiss");
    const userCollections = client.db("e-commerce-perform").collection("users");


    app.post('/users', async(req, res)=>{
      const item = req.body;
      console.log(item);
      const result = await userCollections.insertOne(item);
      res.send(result)
    })

    app.post('/addToCart', async(req, res)=>{
      const item = req.body;
      console.log({item});
      const result = await addToCartCollections.insertOne(item);
      res.send(result)
    })
    app.post('/order', async(req, res)=>{
      const item = req.body;
      console.log({item});
      const result = await allOrderCollections.insertOne(item);
      res.send(result)
    })

    app.get('/userInfo/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);
  try {
    const filter = { email: email };
    const result = await userCollections.findOne(filter);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

    app.get('/myCart/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);
  try {
    const filter = { email: email };
    const result = await addToCartCollections.find(filter).toArray();
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

    app.get('/order/:email', async (req, res) => {
  const email = req.params.email;
  console.log(email);
  try {
    const filter = { 'orderProduct.email': email };
    const result = await allOrderCollections.find(filter).toArray();
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.delete('/cartDelete/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const filter = { _id: new ObjectId(id) };
    const result = await addToCartCollections.deleteOne(filter);
    if (result.deletedCount > 0) {
      res.send({ message: "Item successfully deleted", result });
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.delete('/orderDelete/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const filter = { _id: new ObjectId(id) };
    const result = await allOrderCollections.deleteOne(filter);
    if (result.deletedCount > 0) {
      res.send({ message: "Item successfully deleted", result });
    } else {
      res.status(404).send({ message: "Item not found" });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send({ message: "Internal server error" });
  }
});


app.get('/allMenus', async (req, res) => {
  try {
    const result = await menuCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/vegitables', async (req, res) => {
  try {
    const result = await vegitableCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/freshFruit', async (req, res) => {
  try {
    const result = await FreshFruitCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/specialItem', async (req, res) => {
  try {
    const result = await SpecialOfferCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/allOrders', async (req, res) => {
  try {
    const result = await allOrderCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/allUser', async (req, res) => {
  try {
    const result = await userCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get('/notMiss', async (req, res) => {
  try {
    const result = await dontMissCollections.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


    app.get('/allDiscount', async (req, res) => {
      try {
        const result = await discountCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get('/bestSellers', async (req, res) => {
      try {
        const result = await bestSellerCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (error) {
    console.error("An error occurred while connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
