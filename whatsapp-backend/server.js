// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1111232",
    key: "5619e67fb9fb13caeb5e",
    secret: "b7083512ec7f32631e9e",
    cluster: "ap2",
    useTLS: true
}); 

// middleware
app.use(express.json());
// everything will accepted for testing purpose
app.use(cors());

// DB config (MongoDb)
const connection_url = `mongodb+srv://admin:vhPmqC05Rchn6QqP@cluster0.snwrx.mongodb.net/db?retryWrites=true&w=majority`
mongoose.connect(connection_url, {
    userCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
    console.log('DB is connected');
    //make sure the collection name matches the one in Database
    const msgCollection = db.collection ('messagecontents');
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change) => {
        //console.log('change', change);
        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',
                {
                    name: messageDetails.name,
                    message: messageDetails.message,
                    timestamp: messageDetails.timestamp,
                    received: messageDetails.received,
                });
        } else {
            console.log('Error trigger Pusher');
        }
    });
});


// API Routes
app.get('/',(req, res)=>res.status(200).send('hello world'));
// status(200) -> okay
// get back/download all message from server to the client
app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})
// push all messages to the database/server
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if(err) {
            // status(500) -> internal server error
            res.status(500).send(err)
        } else {
            // status(201) -> created okay
            res.status(201).send(data)
        }
    })
})
// Listen 
app.listen(port,() =>console.log(`Listening on localhost:${port}`));    