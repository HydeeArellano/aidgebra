const { classes } = require("../../models/classes/classes.schema");
const { lesson } = require("../../models/classes/lesson.schema");
const generator = require("../../helpers/code-generator");

const mongoose = require("mongoose");

const lessonController = {
  all: async (req, res) => {
    try {
      const filter = {};

      if (req.query.class) {
        filter.class = req.query.class;
      }

      const entry = await lesson.find(filter);

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  view: async (req, res) => {
    try {
      const entry = await lesson.findOne({ _id: req.params.id });

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

      if (!data.name) throw "Name is required!";
      if (!data.class) throw "Class is required!";
      if (!data.order) throw " Order is required!";

      // create lesson
      const entry = await lesson.create(
        [
          {
            name: data.name,
            class: data.class,
            lessonOrder: data.order,
          },
        ],
        { session }
      );

      // add lesson document to class document
      const id = entry[0]._id;
      const classEntry = await classes.findOneAndUpdate(
        { _id: data.class },
        { $push: { lessons: id } },
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

      if (!data.name) throw "Name is required!";
      if (!data.status) throw " Status is required!";

      const entry = await lesson.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: data.name,
          status: data.status,
        },
        { new: true }
      );

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  swap: async (req, res) => {
    const session = await mongoose.startSession();
    const data = req.body;

    try {
      session.startTransaction();

      if (req.user.role != "ADMIN") throw "You are not an admin";

      // swap the order of two lessons
      const entry = await lesson.findOneAndUpdate(
        { _id: data.first_id },
        { lessonOrder: data.second_order },
        { new: true, session }
      );

      const entry2 = await lesson.findOneAndUpdate(
        { _id: data.second_id },
        { lessonOrder: data.first_order },
        { new: true, session }
      );

      await session.commitTransaction();
      return res.json({ status: true, message: "swapped" });
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      return res.json({ status: false, error });
    } finally {
      session.endSession();
    }
  },
};

module.exports = lessonController;
