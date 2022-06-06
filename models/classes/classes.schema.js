const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const classes = new Schema(
  {
    code: { type: String, unique: true },
    name: { type: String, minlength: 3, maxlength: 255 },
    description: { type: String, minlength: 3, maxlength: 255 },
    teacher: { type: Schema.Types.ObjectId, ref: "teacher" },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "lesson",
      },
    ],
    enrolled: [
      {
        student: { type: Schema.Types.ObjectId, ref: "student" },
        status: { type: String, default: "PENDING" },
        completed_lessons: [{ type: Schema.Types.ObjectId, ref: "lesson" }],
        alt_concept_lectures: [{ type: Schema.Types.ObjectId, ref: "concept" }],
        pretest_score: {
          questions: [
            {
              question: { type: Schema.Types.ObjectId, ref: "question" },
              mark: {
                type: String,
                uppercase: true,
                enum: {
                  values: ["CORRECT", "INCORRECT"],
                  message: "Invalid Mark",
                },
              },
            },
          ],
          total_score: { type: Number, default: 0 },
          concept_mastery: {
            concept: { type: Schema.Types.ObjectId, ref: "concept" },
            mastery: {
              type: String,
              uppercase: true,
              enum: {
                values: ["MASTERED", "UNMASTERED"],
                message: "Invalid Mastery",
              },
            },
          },
        },

        assesment_sessions: [
          {
            concept: { type: Schema.Types.ObjectId, ref: "concept" },
            questions: [
              {
                question: { type: Schema.Types.ObjectId, ref: "question" },
                mark: {
                  type: String,
                  uppercase: true,
                  enum: {
                    values: ["CORRECT", "INCORRECT"],
                    message: "Invalid Mark",
                  },
                },
              },
            ],
          },
        ],

        posttest_attemps: [
          {
            attempt: { type: Number },
            total_score: { type: Number },
            status: {
              uppercase: true,
              enum: {
                values: ["PASS", "FAILED"],
                message: "Invalid Status",
              },
            },
            concepts: [
              {
                concept: { type: Schema.Types.ObjectId, ref: "concept" },
                score: { type: Number },
                questions: [
                  {
                    question_number: { type: Number },
                    question: { type: String, minlength: 3, maxlength: 255 },
                    mark: {
                      uppercase: true,
                      enum: {
                        values: ["CORRECT", "INCORRECT"],
                        message: "Invalid Mark",
                      },
                    },
                  },
                ],
              },
            ],
            concept_mastery: {
              concept: { type: Schema.Types.ObjectId, ref: "concept" },
              mastery: {
                type: String,
                uppercase: true,
                enum: {
                  values: ["MASTERED", "UNMASTERED"],
                  message: "Invalid Mastery",
                },
              },
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

classes.plugin(mongoosePaginate);

module.exports = {
  classes: mongoose.model("classes", classes),
};
