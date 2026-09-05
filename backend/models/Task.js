const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
    {
        user:
        {
            type :mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true
        },
        title : {
            type : String,
            required : true
        },
        description : 
        {
            type: String,
            trim:true
        },
        status: 
        { 
            type: String, 
            enum: ['pending', 'completed'], 
            default: 'pending' 
        },
        priority:
        {
            type:String,
            enum:["Low" , "Medium","High"],
            default:"Low"
        },
        dueDate: { type: Date }
    },
    {timestamps:true}
)
module.exports = mongoose.model("Task" , taskSchema)