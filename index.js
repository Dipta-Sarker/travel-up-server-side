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
        const reviewsCollection = client.db('travelUp').collection('reviews')

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

         app.post('/addService', async(req,res)=>{
            const service = req.body;
            console.log(service)
            const result = await travelCollection.insertOne(service)
            res.send(result)
        })

        app.post('/addReview',async(req,res)=>{
          const review = req.body;
          const result = await reviewsCollection.insertOne(review)
          res.send(result)
          
        })
        app.get('/allReviews', async(req,res)=>{
          const query = {}
          const cursor = reviewsCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
        })
        app.get('/myReview', async(req,res)=>{
          const email = req.query.email
          let query ={}
          if(email){
            query = {email:email}
          }
          const cursor = reviewsCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
        })

        app.delete('/reviews/:id', async(req,res)=>{
          const id = req.params.id
          const query = {_id:ObjectId(id)}
          const result = await reviewsCollection.deleteOne(query)
          res.send(result)
        })

        app.patch('/reviews/:id',async(req,res)=>{
          const id = req.params.id
          const query = {_id:ObjectId(id)}
          const update = {
            $set:{
              review:'5'
            }
          }
          const result = await reviewsCollection.updateOne(query,update)
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