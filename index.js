const express=require('express');
const cors=require('cors');
const app=express();
const port=process.env.PORT||5000;

app.use(cors());
app.use(express.json())

async function run(){
    try{

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