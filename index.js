const { onRequest } = require("firebase-functions/v2/https");
const express = require ("express");
const cors = require ("cors")
const dotenv = require ("dotenv");
dotenv.config();
const stripe = require ("stripe")(process.env.STRIPE_KEY);

const app = express()
app.use(cors({origin:true,credentials:true}));

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"sucess !"
    });
});
app.post("/payment/create", async(req,res)=>{
    const total = parseInt(req.query.total);

    if(total>0){
       
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        })
        console.log(paymentIntent);

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } else {
      res.status(403).json({
        message:"total must be greater than 0"
      });
    }
});

app.listen(5100,(err)=>{
if(err) throw err;
console.log(`Amazone server Running on Port:http://localhost:${process.env.PORT}`);
});

exports.api = onRequest(app);
