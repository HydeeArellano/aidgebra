const { classes } = require("../../models/classes/classes.schema");
const { teacher } = require("../../models/teacher/teacher.schema");

const generator = require("../../helpers/code-generator");

const mongoose = require("mongoose");

const classesController = {
  paginate: async (req, res) => {
    const page = req.query.page || 1;

    try {
      if (req.user.role != "ADMIN") throw "You are not an admin";

      const options = {
        sort: { createdAt: "desc" },
        page,
        limit: req.body.count || 25,
      };

      let query = {
        status: req.body.status || "",
      };

      if (req.query.search) {
        let regex = new RegExp(req.body.search, "i");
        query = {
          ...query,
          $and: [
            {
              $or: [{ code: regex }, { name: regex }],
            },
          ],
        };
      }

      if (!req.query.status || req.query.status == "ALL")
        delete query["status"];

      const entry = await classes.paginate(query, options);

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  all: async (req, res) => {
    try {
      if (req.user.role != "ADMIN") throw "You are not an admin";

      const entry = await classes.find({}).populate("lessons");

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  view: async (req, res) => {
    try {
      if (req.user.role != "ADMIN") throw "You are not an admin";

      const entry = await classes.findOne({ _id: req.params.id });

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

      allowedRoles = ["ADMIN", "TEACHER"];
      if (!allowedRoles.includes(req.user.role))
        throw "You are not allowed to create a class";

      if (req.user.role == "ADMIN") {
        if (!data.teacher) throw "Teacher is required!";
      }

      if (req.user.role == "TEACHER") {
        data.teacher = req.user.id;
      }

      if (!data.name) throw "Name is required!";

      // generate 6 digit code and check if unique
      let code = generator.classCode();
      let checkCode = await classes.findOne({ code });
      while (checkCode) {
        code = generator.classCode();
        checkCode = await classes.findOne({ code });
      }

      const entry = await classes.create([
        {
          name: data.name,
          code,
          teacher: data.teacher,
          status: data.status || "ACTIVE",
        },
      ]);

      await session.commitTransaction();
      const teacherEntry = await teacher.findOneAndUpdate(
        {
          _id: data.teacher,
        },
        {
          $push: {
            classes: entry._id,
          },
        }
      );
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
    const data = req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (!data.name) throw "Name is required!";
      if (!data.status) throw "Status is required!";
      if (!data.teacher) throw "Teacher is required!";

      if (req.user.role != "ADMIN") throw "You are not an admin";

      // Check if teacher is changed
      const classEntry = await classes.findOne({ _id: req.params.id });
      if (classEntry.teacher != data.teacher) {
        // add class to new teacher and remove from old teacher
        const teacherEntry = await teacher.findOne({ _id: data.teacher });
        teacherEntry.classes.push(entry._id);
        await teacherEntry.save();

        const oldTeacherEntry = await teacher.findOne({ _id: entry.teacher });
        oldTeacherEntry.classes.pull(entry._id);
        await oldTeacherEntry.save();
      }

      const entry = await classes.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: data.name,
          status: data.status,
        },
        { new: true }
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
};

module.exports = classesController;
