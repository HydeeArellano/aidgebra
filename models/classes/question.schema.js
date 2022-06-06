const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const question = new Schema(
  {
    concept: { type: Schema.Types.ObjectId, ref: "concept" },
    question_number: { type: Number },

    question: { type: String, minlength: 3, maxlength: 255 },
    choices: [
      {
        text: { type: String, minlength: 3, maxlength: 255 },
        value: { type: String, minlength: 1, maxlength: 1 },
      },
    ],
    answer: { type: String, minlength: 1, maxlength: 1 },

    difficulty: {
      type: String,
      uppercase: true,
      enum: {
        values: ["EASY", "AVERAGE", "HARD"],
        message: "Invalid Difficulty",
      },
    },
  },
  { timestamps: true }
);

question.plugin(mongoosePaginate);

module.exports = {
  question: mongoose.model("question", question),
};
