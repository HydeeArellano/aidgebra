const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

const student = new Schema({
    // credentials
    email : { type : String, unique : true },
    password : { type : String },
    // specifications
    student_id : { type : String, unique : true },
    fullname : { type : String },
    // customize
    avatar : [],
    // mod
    date_created : { type : Date, default : Date.now },
    date_modified : { type : Date, default : Date.now },
    refreshToken : { type : String },
    refreshTokenDate : { type : Date },
    status : {
        type : String,
        default : "ACTIVE"
    }
})

student.plugin(mongoosePaginate)

module.exports = {
    student : mongoose.model("student",student)
}