const { pretest } = require("../../models/classes/pretest.schema");
const { lesson } = require("../../models/classes/lesson.schema");
const { question } = require("../../models/classes/question.schema");

const mongoose = require("mongoose");

const pretestController = {
  all: async (req, res) => {
    try {
      const filter = {};

      if (req.params.lesson) {
        filter.lesson = req.params.lesson;
      }

      const entry = await pretest.find(filter);

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  view: async (req, res) => {
    try {
      const entry = await pretest
        .findOne({ _id: req.params.id })
        .populate([
          "concept1",
          "concept2",
          "concept3",
          "concept4",
          "concept5",
          "question1",
          "question2",
          "question3",
          "question4",
          "question5",
          "question6",
          "question7",
          "question8",
          "question9",
          "question10",
          "question11",
          "question12",
          "question13",
          "question14",
          "question15",
          "question16",
          "question17",
          "question18",
          "question19",
          "question20",
        ]);

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  create: async (req, res) => {
    const data = req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (req.user.role != "ADMIN") throw "You are not an admin";

      if (!data.lesson) throw "Lesson is required!";
      if (!data.concept1) throw "Concept 1 is required!";
      if (!data.concept2) throw "Concept 2 is required!";
      if (!data.concept3) throw "Concept 3 is required!";
      if (!data.concept4) throw "Concept 4 is required!";
      if (!data.concept5) throw "Concept 5 is required!";

      if (!data.question1) throw "Question 1 is required!";
      if (!data.question2) throw "Question 2 is required!";
      if (!data.question3) throw "Question 3 is required!";
      if (!data.question4) throw "Question 4 is required!";
      if (!data.question5) throw "Question 5 is required!";
      if (!data.question6) throw "Question 6 is required!";
      if (!data.question7) throw "Question 7 is required!";
      if (!data.question8) throw "Question 8 is required!";
      if (!data.question9) throw "Question 9 is required!";
      if (!data.question10) throw "Question 10 is required!";
      if (!data.question11) throw "Question 11 is required!";
      if (!data.question12) throw "Question 12 is required!";
      if (!data.question13) throw "Question 13 is required!";
      if (!data.question14) throw "Question 14 is required!";
      if (!data.question15) throw "Question 15 is required!";
      if (!data.question16) throw "Question 16 is required!";
      if (!data.question17) throw "Question 17 is required!";
      if (!data.question18) throw "Question 18 is required!";
      if (!data.question19) throw "Question 19 is required!";
      if (!data.question20) throw "Question 20 is required!";

      // create many questions in questions collection
      const questions = [];

      // put questions in an array
      let count = 1;
      while (count <= 20) {
        const q = data[`question${count}`];
        questions.push({ q });
        count++;
      }

      // mass insert the questions
      const questionEntries = await question.insertMany(questions, { session });

      // create pretest document and attach the questions
      const entry = await pretest.create(
        [
          {
            lesson: data.lesson,
            concept1: data.concept1,
            concept2: data.concept2,
            concept3: data.concept3,
            concept4: data.concept4,
            concept5: data.concept5,
            question1: questionEntries[0]._id,
            question2: questionEntries[1]._id,
            question3: questionEntries[2]._id,
            question4: questionEntries[3]._id,
            question5: questionEntries[4]._id,
            question6: questionEntries[5]._id,
            question7: questionEntries[6]._id,
            question8: questionEntries[7]._id,
            question9: questionEntries[8]._id,
            question10: questionEntries[9]._id,
            question11: questionEntries[10]._id,
            question12: questionEntries[11]._id,
            question13: questionEntries[12]._id,
            question14: questionEntries[13]._id,
            question15: questionEntries[14]._id,
            question16: questionEntries[15]._id,
            question17: questionEntries[16]._id,
            question18: questionEntries[17]._id,
            question19: questionEntries[18]._id,
            question20: questionEntries[19]._id,
          },
        ],
        { session }
      );

      // add to the pretest to the lesson
      const id = entry[0]._id;
      await lesson.findOneAndUpdate(
        { _id: data.lesson },
        { $set: { pretest: id } },
        { new: true, session }
      );

      await session.commitTransaction();
      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      return res.json({ status: false, error });
    } finally {
      session.endSession();
    }
  },
  update: async (req, res) => {
    try {
      const data = req.body;

      if (req.user.role != "ADMIN") throw "You are not an admin";

      if (!data.concept1) throw "Concept 1 is required!";
      if (!data.concept2) throw "Concept 2 is required!";
      if (!data.concept3) throw "Concept 3 is required!";
      if (!data.concept4) throw "Concept 4 is required!";
      if (!data.concept5) throw "Concept 5 is required!";

      const entry = await pretest.findOneAndUpdate(
        { _id: req.params.id },
        {
          concept1: data.concept1,
          concept2: data.concept2,
          concept3: data.concept3,
          concept4: data.concept4,
          concept5: data.concept5,
        },
        { new: true, runValidators: true }
      );

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
};

module.exports = pretestController;
