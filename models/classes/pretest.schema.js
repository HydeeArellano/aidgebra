const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const pretest = new Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "lesson" },
    concepts: [
      {
        concept: { type: Schema.Types.ObjectId, ref: "concept" },
        questions: [
          {
            type: Schema.Types.ObjectId,
            ref: "question",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

pretest.plugin(mongoosePaginate);

module.exports = {
  pretest: mongoose.model("pretest", pretest),
};
