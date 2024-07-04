const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: axios } = require("axios");

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    const discountCollections = client
      .db("e-commerce-perform")
      .collection("discounts");
    const bestSellerCollections = client
      .db("e-commerce-perform")
      .collection("bestSeller");
    const addToCartCollections = client
      .db("e-commerce-perform")
      .collection("addToCart");
    const allOrderCollections = client
      .db("e-commerce-perform")
      .collection("allOrders");
    const vegitableCollections = client
      .db("e-commerce-perform")
      .collection("vegitables");
    const FreshFruitCollections = client
      .db("e-commerce-perform")
      .collection("FreshFruit");
    const SpecialOfferCollections = client
      .db("e-commerce-perform")
      .collection("SpecialOffer");
    const dontMissCollections = client
      .db("e-commerce-perform")
      .collection("dontMiss");
    const userCollections = client.db("e-commerce-perform").collection("users");
    const paymentCollections = client.db("e-commerce-perform").collection("payments");

    app.post("/users", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await userCollections.insertOne(item);
      res.send(result);
    });

    app.post("/addToCart", async (req, res) => {
      const item = req.body;
      console.log({ item });
      const result = await addToCartCollections.insertOne(item);
      res.send(result);
    });
    app.post("/order", async (req, res) => {
      const item = req.body;
      console.log({ item });
      const result = await allOrderCollections.insertOne(item);
      res.send(result);
    });

    app.patch('/myCartStatus/:id', async (req, res) => {
      const id = req.params.id; // Correctly parse the ID
      const { status } = req.body; // Destructure status from request body
      console.log(id, status);
    
      try {
        const filter = { _id: new ObjectId(id) }; // Convert ID to ObjectId
        const updateDoc = {
          $set: {
            status: status
          }
        };
    
        const result = await addToCartCollections.updateOne(filter, updateDoc, {upsert: true});
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating order status', error });
      }
    });


    app.get("/userInfo/:email", async (req, res) => {
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
        console.error("Error fetching user info:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.get("/myCart/:email", async (req, res) => {
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
        console.error("Error fetching user info:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.get("/order/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      try {
        const filter = { "orderProduct.email": email };
        const result = await allOrderCollections.find(filter).toArray();
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.delete("/cartDelete/:id", async (req, res) => {
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
        console.error("Error deleting item:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.delete("/orderDelete/:id", async (req, res) => {
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
        console.error("Error deleting item:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.get("/allMenus", async (req, res) => {
      try {
        const result = await menuCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/vegitables", async (req, res) => {
      try {
        const result = await vegitableCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get("/freshFruit", async (req, res) => {
      try {
        const result = await FreshFruitCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/specialItem", async (req, res) => {
      try {
        const result = await SpecialOfferCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/allOrders", async (req, res) => {
      try {
        const result = await allOrderCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/allUser", async (req, res) => {
      try {
        const result = await userCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/notMiss", async (req, res) => {
      try {
        const result = await dontMissCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/allDiscount", async (req, res) => {
      try {
        const result = await discountCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get("/bestSellers", async (req, res) => {
      try {
        const result = await bestSellerCollections.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menus:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/create-payment", async (req, res) => {
      try {
        const {orderDetails, user} = req.body;
        console.log(orderDetails, user);
        const trxId= new ObjectId().toString().toLocaleUpperCase().slice(0,12)
    
        const initiatData = {
          store_id: "jewel6682a64b2eda6",  // Ensure this is correct
          store_passwd: "jewel6682a64b2eda6@ssl",  // Ensure this is correct
          total_amount: 100,
          currency: "EUR",
          tran_id: trxId,
          success_url: "http://localhost:5000/success-payment",
          fail_url: "http://yoursite.com/fail.php",
          cancel_url: "http://yoursite.com/cancel.php",
          cus_name: "Customer Name",
          cus_email: "cust@yahoo.com",
          cus_add1: "Dhaka",
          cus_add2: "Dhaka",
          cus_city: "Dhaka",
          cus_state: "Dhaka",
          cus_postcode: 1000,
          cus_country: "Bangladesh",
          cus_phone: "01711111111",
          cus_fax: "01711111111",
          shipping_method: 'NO',
          product_name: "Fruits",
          product_category: "Fruits",
          product_profile: "general",
          multi_card_name: "mastercard,visacard,amexcard",
          value_a: "ref001_A",
          value_b: "ref002_B",
          value_c: "ref003_C",
          value_d: "ref004_D",
        };
    
        const response = await axios({
          method: 'POST',
          url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
          data: new URLSearchParams(initiatData).toString(),
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        });
    
        
        
        const saveData = {

          Customer_info: user,
          paymentId: initiatData.tran_id,
          amount: orderDetails.amount,
          details: orderDetails,
          status: 'pending',
          Date: new Date(),
          Invoice:{
            title: 'Tasty-Daily Ltd.',
            logo: 'https://cdn.dribbble.com/users/1926893/screenshots/15607636/media/94d1d671c414ad83abf126c019825e28.png',
            address: 'Uttara sector-10, Dhaka, Bangladesh',
            Status: "Paid",
            PaymentMethod: "Bkash"

          }
        }


        const successPayment= await paymentCollections.insertOne(saveData)
        if(successPayment){
          res.send({
            paymentUrl:response.data.GatewayPageURL
          });

        }

      } catch (error) {
        console.error(error);
        res.status(500).send("Payment initiation failed");
      }
    });
    
    app.post("/success-payment", async (req, res) => {
      const successData = req.body;
      if(successData.status !== "VALID"){
        res.status(500).json({ error: "Internal Payment" });
      }

      //update database
      const query = {paymentId : successData.tran_id }
      const update={
        $set: {
          status:'success'
        }
      }
      const updateDate = await paymentCollections.updateOne(query, update)


      console.log('success payment', successData, updateDate);
      res.redirect("http://localhost:5173/dashboard/Payment")
    });


    app.get('/paidItem/:email', async(req, res)=>{
      const {email} = req.params
      console.log("hello",email);
      const filter = {'Customer_info.email': email}
      const result = await paymentCollections.find(filter).toArray()
      res.send(result)

    })

    app.patch('/paidOrder/:id', async (req, res) => {
  const id = req.params.id; // Correctly parse the ID
  const { status } = req.body; // Destructure status from request body
  console.log(id, status);

  try {
    const filter = { _id: new ObjectId(id) }; // Convert ID to ObjectId
    const updateDoc = {
      $set: {
        status: status
      }
    };

    const result = await allOrderCollections.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating order status', error });
  }
});

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("An error occurred while connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
