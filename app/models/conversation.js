const { default: mongoose } = require("mongoose");
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    image: { type: String },
    message: { type: String },
    dateTime: { type: Number },
});
const locationSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "user" },
    location: { type: Object, default: {} },
    dateTime: { type: Number },
});
const roomSchema = new mongoose.Schema({
    name: { type: String, },
    description: { type: String, },
    image: { type: String },
    locations: { type: [locationSchema], default: [] },
    messages: { type: [messageSchema], default: [] },
});
const conversationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    endpoint: {
        type: String,
        required: true,
    },
    rooms: {
        type: [roomSchema],
        default: [],
    }
});
const conversationModel = mongoose.model("conversationModel", conversationSchema)
module.exports = conversationModel