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
        const addcontentCollection = client.db("contestDB").collection("contents");

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
        // roll
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
        // all contest
        app.get('/allcontests', async (req, res) => {
            const result = await addcontentCollection.find().toArray()
            res.send(result)
        })
        // all contest diteals
        app.get('/diteals/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const cursor = addcontentCollection.findOne(quary);
            const result = await cursor;
            res.send(result)

        })
        // home page search
        app.get('/allcontstsearch', async (req, res) => {
            const search = req.query;
            // console.log(search)
            const quary = {
                contest_name: { $regex: search.search, $options: 'i' }
            }
            const result = await addcontentCollection.find(quary).sort({ attempt: -1 }).toArray()
            res.send(result)
        })
        // app.patch('/updatecontestss/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const updateData = req.body
            
        //     const options = { upsert: true }
        //     const updateDoc = {
        //         $inc: {
        //             attempt: 1,
        //         },
        //     }
        //     const result = await addcontentCollection.updateOne(query, updateDoc, options)
        //     res.send(result)
        //     console.log(updateDoc)
        // })
        // admincontrol
        app.delete('/userdelete/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(quary)
            res.send(result)
        })
        // admincontrol
        app.get('/userRole/:id', async (req, res) => {
            // console.log('cookirss',req.cookies)
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const cursor = userCollection.findOne(quary);
            const result = await cursor;
            res.send(result)
        })
        // admincontrol
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
        // admincontrol
        app.get('/managecontent', async (req, res) => {
            const result = await addcontentCollection.find().toArray()
            res.send(result)
        })
        // admincontrol
        app.delete('/contentcrdelete/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await addcontentCollection.deleteOne(quary)
            res.send(result)
        })
        // admincontrol
        app.get('/conformss/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const cursor = addcontentCollection.findOne(quary);
            const result = await cursor;
            res.send(result)
        })
        // admincontrol
        app.put('/updatecontests/:id', async (req, res) => {
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
            const result = await addcontentCollection.updateOne(query, updateDoc, options)
            res.send(result)
            console.log(updateDoc)
        })
        //contentcreatercontrole
        app.post('/addcontents', async (req, res) => {
            const infouser = req.body;
            console.log()
            const result = await addcontentCollection.insertOne(infouser);
            res.send(result)

        })
        //contentcreatercontrole
        app.get('/addcontentss/:email', async (req, res) => {
            const email = req.params.email;
            const quary = { email: email }
            const result = await addcontentCollection.find(quary).toArray();
            res.send(result)
        })
        //contentcreatercontrole
        app.delete('/addsubdelete/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await addcontentCollection.deleteOne(quary)
            res.send(result)
        })
        //contentcreatercontrole
        app.get('/updatecontest/:id', async (req, res) => {
            // console.log('cookirss',req.cookies)
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const cursor = addcontentCollection.findOne(quary);
            const result = await cursor;
            res.send(result)
        })
        //contentcreatercontrole
        app.put('/updatecontests/:id', async (req, res) => {
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
            const result = await addcontentCollection.updateOne(query, updateDoc, options)
            res.send(result)
            console.log(updateDoc)
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