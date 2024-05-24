const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.seykns5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//console.log(process.env.DB_PASS)

 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

         const toyCollection = client.db('nainaToys').collection('toys');
 


              //toys
        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //categories
        app.get('/soft', async (req, res) => {
            const cursor = toyCollection.find({ sub_category: "Soft Animals"});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/plastic', async (req, res) => {
            const cursor = toyCollection.find({ sub_category: "Plastic Animals"});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/musical', async (req, res) => {
            const cursor = toyCollection.find({ sub_category: "Musical Animals"});
            const result = await cursor.toArray();
            res.send(result);
        })

        //Single toy
         app.get('/toy/:id', async (req, res) => {
          const id = req.params.id;
           const query = { _id: new ObjectId(id) }
             const result = await toyCollection.findOne(query);
             res.send(result);
         })

         // add toy 
         app.post('/toys', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })
//my toys
        app.get('/my-toys', async (req, res) => {
            const userEmail = req.query.email; 
            console.log('Email',userEmail);
            if (!userEmail) {
        return res.status(400).send('Email query parameter is required');
            }
        const query = { seller_email: userEmail }; 
        const result = await toyCollection.find(query).toArray();
            res.send(result);
        })

//update toys
        app.put('/toy/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedToy = req.body;

            const toy = {
                $set: {
                    price: updatedToy.price, 
                    available_quantity: updatedToy.available_quantity, 
                    description: updatedToy.description, 
                    
                }
            }

            const result = await toyCollection.updateOne(filter, toy, options);
            res.send(result);
        })

        //delete toy

        app.delete('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
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



app.get('/', (req, res) => {
    res.send('Toy is running')
})

app.listen(port, () => {
    console.log(`Naina Toys Server is running on port ${port}`)
})