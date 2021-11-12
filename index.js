const express=require('express');
const cors=require('cors');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()

const app=express();
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.axhaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
       await client.connect();
        console.log("Database connected");
        const database = client.db("drone_bd");
        const productsCollection = database.collection("products");
        const orderCollection=database.collection('orders');
        const reviewCollection=database.collection('reviews');
        const userCollection=database.collection('users');

        // Getting all products  
        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const result=await cursor.toArray();
            res.send(result)

        })
        // getting single product 
        app.get('/products/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.send(result)
        })
            // getting order details 
        app.get('/orders',async(req,res)=>{
            const email=req.query.email;
            if(email){
                const query={email:email};
                const cursor=  orderCollection.find(query);
                const result=await cursor.toArray();
                res.send(result)
            }
                else{
                    const cursor=orderCollection.find({});
                    const result=await cursor.toArray()
                    res.send(result);
                }
                
               
            }
        )
        // getting single order 

        app.get('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await orderCollection.findOne(query);
            res.send(result);
        })

        // Getting all review 
        app.get('/reviews',async(req,res)=>{
            const cursor=reviewCollection.find({});
            const result= await cursor.toArray();
            res.send(result);
        })
        // Posting Product 

        app.post('/products',async(req,res)=>{
            const product=req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })

        // Posting order 
        app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        // Posting Review
        app.post('/reviews',async(req,res)=>{
            const review=req.body;
            const result= await reviewCollection.insertOne(review);
            res.json(result);
        })

        // Posting user 
        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result= await userCollection.insertOne(user);
            res.json(result);
        })
        // Updating status at order 

        app.put('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const updatedOrder=req.body;
            const query={_id:ObjectId(id)};
            const updateDoc = {
                $set: {
                 status:updatedOrder.status
                },
              };
              const result = await orderCollection.updateOne(query, updateDoc);
              console.log(result);
              res.json(result);

        })

        //Making admin 
        app.put('/users/admin',async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                 role:"admin"
                },
              };
              const result = await userCollection.updateOne(filter, updateDoc, options);
              res.json(result)
        })

          // Checking if an user is admin 

         app.get('/users/:email',async(req,res)=>{
        const email=req.params.email;
        const filter={email:email};
        const user=await userCollection.findOne(filter);
        let isAdmin=false;
        if(user?.role==="admin"){
          isAdmin=true;
        }
        res.send({admin:isAdmin})
      })

        //Deleting A Product
        app.delete('/products/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // Deleting an order 
        app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{

    }
}

run().catch(console.dir)

app.get('/',async(req,res)=>{
    res.send('Hello from Drone BD');
})

app.listen(port,()=>{
    console.log('Listening at',port);
})