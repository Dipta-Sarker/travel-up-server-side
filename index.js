const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.APP_USER}:${process.env.APP_PASSWORD}@cluster0.rxjlfn3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const travelCollection = client.db('travelUp').collection('services')

        app.get('/services', async(req,res)=>{
            const query ={}
            const cursor = travelCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })
        
        app.get('/servicesDetails/:id', async(req,res)=>{
          const id = req.params.id;
          const query ={_id:ObjectId(id)}
          const cursor = travelCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
        })

        app.get('/allservices', async(req,res)=>{
            const query ={}
            const cursor = travelCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
    }
    finally{

    }

}
run().catch(e=>console.error(e))




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})