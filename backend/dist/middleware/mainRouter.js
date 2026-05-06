"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
// common routes
const signIn_1 = require("../routes/commonRoutes/signIn");
const logout_1 = require("../routes/commonRoutes/logout");
const fetchUser_1 = require("../routes/commonRoutes/fetchUser");
const getSubjects_1 = require("../routes/commonRoutes/getSubjects");
const getTeachersName_1 = require("../routes/commonRoutes/getTeachersName");
const editBatchSyllabus_1 = require("../routes/commonRoutes/editBatchSyllabus");
// admin routes
const addTeacher_1 = require("../routes/adminRoutes/add/addTeacher");
const addSubjects_1 = require("../routes/adminRoutes/add/addSubjects");
const addRooms_1 = require("../routes/adminRoutes/add/addRooms");
const addBatch_1 = require("../routes/adminRoutes/add/addBatch");
const getTeachers_1 = require("../routes/adminRoutes/get/getTeachers");
const getStudents_1 = require("../routes/adminRoutes/get/getStudents");
const getSubjectStudents_1 = require("../routes/adminRoutes/get/getSubjectStudents");
const getBatches_1 = require("../routes/adminRoutes/get/getBatches");
const getRooms_1 = require("../routes/adminRoutes/get/getRooms");
const deleteRoom_1 = require("../routes/adminRoutes/delete/deleteRoom");
const deleteSubject_1 = require("../routes/adminRoutes/delete/deleteSubject");
const deleteBatch_1 = require("../routes/adminRoutes/delete/deleteBatch");
const deleteTeacher_1 = require("../routes/adminRoutes/delete/deleteTeacher");
const getDashboard_1 = require("../routes/adminRoutes/get/getDashboard");
// student routes
const addStudent_1 = require("../routes/studentRoutes/addStudent");
const enrollSubject_1 = require("../routes/studentRoutes/enrollSubject");
const getEnrolledSubjects_1 = require("../routes/studentRoutes/getEnrolledSubjects");
const deleteEnrollment_1 = require("../routes/studentRoutes/deleteEnrollment");
const getStudentBatches_1 = require("../routes/studentRoutes/getStudentBatches");
const getDashboard_2 = require("../routes/studentRoutes/getDashboard");
// teacher routes
const getDashboard_3 = require("../routes/teacherRoutes/getDashboard");
const getTeacherBatches_1 = require("../routes/teacherRoutes/getTeacherBatches");
const getTeacherOngoingBatches_1 = require("../routes/teacherRoutes/getTeacherOngoingBatches");
const getStudents_2 = require("../routes/teacherRoutes/getStudents");
const addAttendance_1 = require("../routes/teacherRoutes/addAttendance");
const mainRouter = express_1.default.Router();
exports.mainRouter = mainRouter;
mainRouter.use("/", (req, res, next) => {
    res.send("Server is running ✅");
    console.log(`${req.method} ${req.url}`);
    next();
});
// Middleware to log requests
// common routes
mainRouter.use("/signin", signIn_1.router);
mainRouter.use("/fetchuser", fetchUser_1.router);
mainRouter.use("/logout", logout_1.router);
mainRouter.use("/editbatchsyllabus", editBatchSyllabus_1.router); // for admin as well as teacher
mainRouter.use("/getteachersname", getTeachersName_1.router);
mainRouter.use("/getsubjects", getSubjects_1.router);
// admin routes
mainRouter.use("/addsubject", addSubjects_1.router);
mainRouter.use("/addroom", addRooms_1.router);
mainRouter.use("/addbatch", addBatch_1.router);
mainRouter.use("/addteacher", addTeacher_1.router);
mainRouter.use("/deleteroom", deleteRoom_1.router);
mainRouter.use("/deletesubject", deleteSubject_1.router);
mainRouter.use("/deletebatch", deleteBatch_1.router);
mainRouter.use("/deleteteacher", deleteTeacher_1.router);
mainRouter.use("/getadmindashboard", getDashboard_1.router);
mainRouter.use("/getteachers", getTeachers_1.router);
mainRouter.use("/getstudents", getStudents_1.router);
mainRouter.use("/getbatches", getBatches_1.router);
mainRouter.use("/getrooms", getRooms_1.router);
mainRouter.use("/getsubjectstudents", getSubjectStudents_1.router);
// teacher routes
mainRouter.use("/getteacherstudents", getStudents_2.router);
mainRouter.use("/addattendance", addAttendance_1.router);
mainRouter.use("/getteacherdashboard", getDashboard_3.router);
mainRouter.use("/getteacherbatches", getTeacherBatches_1.router);
mainRouter.use("/getteacherongoingbatches", getTeacherOngoingBatches_1.router);
// student routes
mainRouter.use("/addstudent", addStudent_1.router);
mainRouter.use("/enrollsubject", enrollSubject_1.router);
mainRouter.use("/getenrolledsubjects", getEnrolledSubjects_1.router);
mainRouter.use("/deleteenrollment", deleteEnrollment_1.router);
mainRouter.use("/getstudentbatches", getStudentBatches_1.router);
mainRouter.use("/getstudentdashboard", getDashboard_2.router);
