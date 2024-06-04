const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 7000
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',

    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zosjqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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

        const userCollection = client.db("contestDB").collection("users");

        // Send a ping to confirm a successful connection

        app.post('/users', async (req, res) => {
            const infouser = req.body;
            console.log()
            const query = { email: infouser.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(infouser);
            res.send(result)

        })
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email
            console.log(email)
            const result = await userCollection.findOne({ email })
            res.send(result)
        })
        app.get('/userss', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        app.delete('/userdelete/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(quary)
            res.send(result)
        })
        app.get('/userRole/:id', async (req, res) => {
            // console.log('cookirss',req.cookies)
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const cursor = userCollection.findOne(quary);
            const result = await cursor;
            res.send(result)
        })
        app.put('/userupds/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const updateData = req.body
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    ...updateData,
                },
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('contest-platform Server is Running')
})

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`)
})