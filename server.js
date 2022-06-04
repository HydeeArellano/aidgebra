require('dotenv').config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const app = express()
const server = require("http").createServer(app)
const port = process.env.PORT || 3001
const mongoose = require("mongoose")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors({
    credentials : true
}))
app.use(cookieParser())

mongoose.connect(process.env.MONGODB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const connection = mongoose.connection
connection.once("open", () => console.log("connected to mongoDB"));

app.get("/test",async (req, res) => {
    try{
        return res.json({status:true})
    }
    catch(error){
        console.log(error)
        return res.json({status:true, error})
    }
})

app.use("/api/student", require("./routes/student/routes"))

server.listen(port, () => console.log(`server runs at ${port}`))