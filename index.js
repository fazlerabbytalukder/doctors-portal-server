const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cnnr8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db("doctors_portal");
        const appointmentsCollection = database.collection("appointments");

        //POST APPOINTMENT DATA
        app.post('/appointments', async (req, res) => {
            //ei comment diye dekha databackend e aise kina
            // const appointment = req.body;
            // console.log(appointment);
            // res.json({message:'hello'})

            const appointment = req.body;
            const result = await appointmentsCollection.insertOne(appointment);
            console.log(result);
            res.json(result)
        })
        //GET APPOINTMENT SPECIFIC USER DATA
        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            // console.log(date);
            const query = {email:email, date:date}
            const cursor = appointmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('i am from doctors portal server');
})

app.listen(port, () => {
    console.log('running server on port', port);
})