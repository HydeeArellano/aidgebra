const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const posttest = new Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "lesson" },
    concepts: [
      {
        concept: { type: Schema.Types.ObjectId, ref: "concept" },
        questions: [
          {
            question: { type: Schema.Types.ObjectId, ref: "question" },
            order: { type: Number, min: 1, max: 4 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

posttest.plugin(mongoosePaginate);

module.exports = {
  posttest: mongoose.model("posttest", posttest),
};
