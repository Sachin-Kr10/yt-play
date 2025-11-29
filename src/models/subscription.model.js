const mongoose = require("mongoose")

const subSchema = new mongoose.Schema(
    {
        subscriber : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        channel : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        }
    },
    {timestamps : true}
)

const  Subscription = mongoose.model("Subs", subSchema);

module.exports = Subscription
