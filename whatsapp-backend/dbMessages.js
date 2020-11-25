import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
});

export default mongoose.model('messagecontent', whatsappSchema);
// const URI = "mongodb+srv://admin:vhPmqC05Rchn6QqP@cluster0.snwrx.mongodb.net/db?retryWrites=true&w=majority"
