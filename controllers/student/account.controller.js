const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {student} = require("../../models/student/student.schema")
const mongoose = require("mongoose")

const studentController = {
    create : async (req, res) => {
        const data = req.body
        const session = await mongoose.startSession()

        try{
            session.startTransaction()

            if(!data.password) throw "Password is required!"
            if(data.password != data.confirm_password) throw "Password not match!"
            if(!data.email) throw "Email is required!"
            if(!data.fullname) throw "Fullname is required!"

            const count = await student.find({}).count()
            const student_id = (count + 1).toString().padStart(4,"0")

            const validateEmail = await student.findOne({email:data.email})
            if(validateEmail) throw "Email is already taken."

            const entry = await student.create([{
                email : data.email,
                password : data.password,
                student_id,
                fullname : data.fullname,
                avatar : []
            }])

            await session.commitTransaction()
            return res.json({status: true, data : entry})
        }
        catch(error){
            console.log(error)
            await session.abortTransaction()
            return res.json({status: false, error})
        }
        finally{
            session.endSession()
        }
    },
    login : async (req, res) => {
        try{
            if(!req.body.email) throw "Email is required!"
            if(!req.body.password) throw "Password is required!"

            const plainTextPassword = req.body.password

            const entry = await user.findOne({ email : req.body.email }).lean()

            if(!entry) throw "Invalid credentials"
            if(entry.status != "ACTIVE") throw "Your account is deactivated"

            if(await bcrypt.compare(plainTextPassword, entry.password)){
                const token = jwt.sign({
                    id : entry._id,
                    email : entry.email,
                    student_id : entry.student_id,
                    role : "STUDENT",
                    fullname : entry.fullname,
                    refreshToken : entry.refreshToken,
                    status : entry.status
                }, process.env.JWT_SECRET)
    
                res.cookie("token", token, {
                    httpOnly : true,
                    // secure : true,
                    // signed : true
                })
                console.log(token)
                return res.json({status : true, token : token})
            }
            else{
                return res.json({status : false, error : "Incorrect password"})
            }
        }
        catch(error){
            console.log(error)
            return res.json({status:false, error})
        }
    },
}

module.exports = studentController
