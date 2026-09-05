const express = require("express")
const Task = require("../models/Task")
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router()

router.use(authMiddleware)

// creating task
router.post("/",async (req, res) => {

    try {

        const task = await Task.create({...req.body,user: req.user})
        res.status(201).json(task)

    } catch (error) {

        res.status(500).json({
            message: error.message
        })
    }

})
//updating
router.put("/:id",async(req ,res)=>
{
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true})
        res.json(task)
    }
    catch(error)
    {
          res.status(500).json({
            message: error.message
        })
    }
})

// reading task
router.get("/", async (req, res) => {

    try {

        const task = await Task.find({user : req.user})
        res.json(task)

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

})


// deleting task
router.delete("/:id", async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id)

        res.json({
            message: "Task Deleted"
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
})


module.exports = router