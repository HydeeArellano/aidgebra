const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { teacher } = require("../../models/teacher/teacher.schema");
const mongoose = require("mongoose");

const teacherController = {
  changePicture: async (req, res) => {
    try {
      const avatar = req.files[0] || [];

      if (req.user.role != "TEACHER") throw "You are not a teacher";

      const entry = await teacher.findOneAndUpdate(
        { _id: req.user.id },
        { avatar },
        { new: true }
      );

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  changeProfile: async (req, res) => {
    try {
      const data = req.body;
      if (!data.email) throw "Email is required";
      if (!data.fullname) throw "Fullname is required";
      if (!data.contact) throw "Contact Number is required";

      if (req.user.role != "TEACHER") throw "You are not a teacher";

      const validateEmail = await teacher.findOne({
        email: data.email,
        _id: {
          $ne: req.user.id,
        },
      });

      if (validateEmail) throw "Email is already taken.";

      const entry = await teacher.findOneAndUpdate(
        { _id: req.user.id },
        {
          email: data.email,
          fullname: data.fullname,
          contact: data.contact,
        },
        { new: true }
      );

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  changePassword: async (req, res) => {
    try {
      const data = req.body;

      if (req.user.role != "TEACHER") throw "You are not a teacher";

      if (!data.new_password) throw "Please enter your new Password";
      if (!data.confirm_password) throw "Please confirm new password";
      if (data.confirm_password != data.new_password)
        throw "Password not match!";

      const password = await bcrypt.hash(data.new_password, 10);

      const entry = await teacher.findOneAndUpdate(
        { _id: req.user.id },
        { password },
        { new: true }
      );

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  register: async (req, res) => {
    const data = req.body;
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      if (req.islogged == true)
        throw "You are already logged in, Logout first to create a new account";

      if (!data.password) throw "Password is required!";
      if (data.password != data.confirm_password) throw "Password not match!";
      if (!data.email) throw "Email is required!";
      if (!data.fullname) throw "Fullname is required!";

      const count = await teacher.find({}).count();
      const teacher_id = (count + 1).toString().padStart(4, "0");
      const password = await bcrypt.hash(data.password, 10);

      const validateEmail = await teacher.findOne({ email: data.email });
      if (validateEmail) throw "Email is already taken.";

      const entry = await teacher.create([
        {
          email: data.email,
          password,
          teacher_id,
          fullname: data.fullname,
        },
      ]);

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
  login: async (req, res) => {
    try {
      if (req.islogged == true)
        throw "You are already logged in, Logout first to change accounts";

      if (!req.body.email) throw "Email is required!";
      if (!req.body.password) throw "Password is required!";

      const plainTextPassword = req.body.password;

      const entry = await teacher.findOne({ email: req.body.email }).lean();

      if (!entry) throw "Invalid credentials";
      if (entry.status != "ACTIVE") throw "Your account is deactivated";

      if (await bcrypt.compare(plainTextPassword, entry.password)) {
        const token = jwt.sign(
          {
            id: entry._id,
            email: entry.email,
            teacher_id: entry.teacher_id,
            role: "TEACHER",
            fullname: entry.fullname,
            refreshToken: entry.refreshToken,
            status: entry.status,
          },
          process.env.JWT_SECRET
        );

        res.cookie("token", token, {
          httpOnly: true,
          // secure : true,
          // signed : true
        });
        console.log(token);
        return res.json({ status: true, token: token });
      } else {
        return res.json({ status: false, error: "Incorrect password" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  all: async (req, res) => {
    try {
      const entry = await teacher.find({});

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  view: async (req, res) => {
    try {
      const entry = await teacher.findOne({ _id: req.params.id });

      return res.json({ status: true, data: entry });
    } catch (error) {
      console.log(error);
      return res.json({ status: false, error });
    }
  },
  paginate: async (req, res) => {
    const page = req.query.page || 1;

    try {
      const options = {
        sort: { createdAt: "desc" },
        page,
        limit: req.body.count || 25,
      };

      let query = {
        role: req.body.role,
        status: req.body.status || "",
      };

      if (req.query.search) {
        let regex = new RegExp(req.body.search, "i");
        query = {
          ...query,
          $and: [
            {
              $or: [{ fullname: regex }, { email: regex }],
            },
          ],
        };
      }

      if (!req.query.roles) delete query["role"];
      if (!req.query.status || req.query.status == "ALL")
        delete query["status"];

      const entry = await teacher.paginate(query, options);

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

      if (!data.password) throw "Password is required!";
      if (data.password != data.confirm_password) throw "Password not match!";
      if (!data.email) throw "Email is required!";
      if (!data.fullname) throw "Fullname is required!";

      const count = await teacher.find({}).count();
      const teacher_id = (count + 1).toString().padStart(4, "0");
      const password = await bcrypt.hash(data.password, 10);

      const validateEmail = await teacher.findOne({ email: data.email });
      if (validateEmail) throw "Email is already taken.";

      const entry = await teacher.create([
        {
          email: data.email,
          password,
          teacher_id,
          fullname: data.fullname,
        },
      ]);

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

module.exports = teacherController;
