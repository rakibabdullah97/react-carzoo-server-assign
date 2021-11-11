const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzy7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db('carzoo')
        const productsCollection=database.collection('products')

        app.post('/products',async (req,res)=>{
            const product = req.body
            const result = await productsCollection.insertOne(product)
            console.log(result)
            res.json(result)
        })


    }
    finally{
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