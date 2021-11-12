const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzy7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('carzoo')
        const productsCollection = database.collection('products')
        const buyCollection = database.collection('buyProduct')
        const reviewCollection = database.collection('userReview')


        //Get Api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray()
            res.send(products)
        })
        //Get review
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
        //add products to explore page
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product)
            console.log(result)
            res.json(result)
        })
        //get single product to Buy products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query)
            res.json(product)
        })
        //Add buying
        app.post('/buyProduct', async (req, res) => {
            const result = await buyCollection.insertOne(req.body);
            res.send(result)
        })
        //Add Review
        app.post('/userReview', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result)
        })
        //My Booking
        app.get('/myBuying/:email', async (req, res) => {
            const result = await buyCollection.find({
                email: req.params.email
            }).toArray();
            res.send(result)
        })
        //Delete Buying
        app.delete('/deleteBuyNow/:id', async (req, res) => {
            const result = await buyCollection.deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.send(result)
        })
        //Delete Products
        app.delete('/deleteProduct/:id', async (req, res) => {
            const result = await productsCollection.deleteOne({
                _id: ObjectId(req.params.id)
            })
            res.send(result)
        })
        //Get All booking
        app.get('/allBuying', async (req, res) => {
            const result = await buyCollection.find({}).toArray()
            res.send(result)
        })
        //Update Deal Status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const filter = {_id :ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: status
                },
              };
            const result = await buyCollection.updateOne(filter, updateDoc, options);
            res.json(result)
            
        })
    }
    finally {
        //  await client.close()
    }
}

run().catch(console.dir)

console.log(uri)
app.get('/', (req, res) => {
    res.send('Hello Carzoo!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})