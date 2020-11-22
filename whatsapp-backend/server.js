import express from 'express';
import mongoose from 'mongoose';
import dbMessages from './dbMessages.js';
// 6q8rHzRnfN1mht3k
const app = express();
const port = process.env.PORT || 9000;

const URI = "mongodb+srv://admin:6q8rHzRnfN1mht3k@cluster0.snwrx.mongodb.net/db?retryWrites=true&w=majority"
mongoose.connect(URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.get('/',(req, res) =>res.status(200).send("hello world"));

app.post('/api/v1/messsage/new', (req, res) => {
    const dbMessage = req.body;

    dbMessages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(`new message created: \n ${data}`);
        }
    })
})

app.listen(port, ()=>console.log(`Listening on localhost:${port}`));