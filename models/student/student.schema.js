const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const student = new Schema(
  {
    // credentials
    email: { type: String, unique: true },
    password: { type: String },
    // specifications
    student_id: { type: String, unique: true },
    fullname: { type: String },
    contact: { type: String },
    // customize
    avatar: [],

    // contents
    // Moved to classes
    // classes: [
    //   {
    //     class: { type: Schema.Types.ObjectId, ref: "classes" },
    //     status: {
    //       type: String,
    //       default: "PENDING",
    //       uppercase: true,
    //       enum: {
    //         values: ["PENDING", "ENROLLED", "DROPPED"],
    //         message: "Invalid Enrollment Status",
    //       },
    //     },
    //   },
    // ],
    // mod
    refreshToken: { type: String },
    refreshTokenDate: { type: Date },
    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

student.plugin(mongoosePaginate);

module.exports = {
  student: mongoose.model("student", student),
};
