const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");


//middlewares

app.use(express.json());
app.use(cors());


const tourschema = mongoose.Schema({
   
    location:{
        type: String,
        required:[true, "please provide tour Location"],
        trim: true,
    },
    

    touristname:{
        type: String,
        required:true
    },
    visite:{
        type: Number,
        required:true
    },
   
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true,
        min: [0, 'Price dose not exist negative'],
    },
    day:{
        type: Number,
        required:true,
        min: [0, 'booking day dose not exist negative'],
    },
    roomquantity:{
        type: Number,
        required:true,
        min: [0, 'pice dose not exist negative'],

    },
    roomstauts:{
        type: String,
        required: true,
        enum:{
            values:["in-stock", "out-of-stock"],
            
        },
        
    },
   
    
},{
    timestamps: true
})

const Tour = mongoose.model('Tour', tourschema)


app.get("/", (req, res)=>{
    res.send("Route is working...!");
})



 //for get data in mongoodb

app.get("/api/v1/tours", async(req, res, next)=>{
    try{
        const tours = await Tour.find({});
        res.status(200).json({
            status: "success",
            data: tours
        })

    }catch(error){

        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error:error.message,
        })
    }
})

//get data use in id
app.get("/api/v1/tours/:_id", async(req, res, next)=>{
    try{
        const tours = await Tour.findById(req.params._id);
        res.status(200).json({
            status: "success",
            data: tours
        })

    }catch(error){

        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error:error.message,
        })
    }
})

//update data 
app.patch("/api/v1/tours/:id", async(req, res, next)=>{
    try{
        const {id}=req.params;
        const result = await Tour.updateOne({_id:id},{$set: req.body});
        res.status(200).json({
            status: "success",
            message: "update succefully",
            data: result.message
        })

    }catch(error){

        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error:error.message,
        })
    }
})




//Get top 3 cheapest tours
app.get("/api/v1/tour/cheapest", async(req, res, next)=>{
    try{
        const tours = await Tour.find({}).sort({price: 1}).limit(3);
        res.status(200).json({
            status: "success",
            data: tours
        })

    }catch(error){

        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error:error.message,
        })
    }
})

// top 3 vewed.......
app.get("/api/v1/tour/trending", async(req, res, next)=>{
    try{
        const tours = await Tour.find({}).sort({visite: -1}).limit(2);
        res.status(200).json({
            status: "success",
            data: tours
        })

    }catch(error){

        res.status(400).json({
            status: "fail",
            message: "can't get the data",
            error:error.message,
        })
    }
})


// posting data in databage 
app.post('/api/v1/tours',async(req, res, next)=>{
  
    try{
    const tour = new Tour(req.body)

    // const result = await Tour.create(req.body)
        if(tour.roomquantity ==0){
            tour.roomstauts ="out-of-stock"
        }
    

    const result= await tour.save()
    res.status(200).json({
        status:'success',
        message: 'Data inserted',
        data: result
    })

    }catch(error){

        res.status(400).json({
            status:'bad',
            message: 'Data Dosenot inserted',
            error:error.message
        })
    }  

})

module.exports = app;


