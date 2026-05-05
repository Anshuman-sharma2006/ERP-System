"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userModel_1 = require("../../models/dbmodels/userModel");
const subjectModel_1 = require("../../models/dbmodels/subjectModel");
const batchModel_1 = require("../../models/dbmodels/batchModel");
const attendanceModel_1 = require("../../models/dbmodels/attendanceModel");
const router = express_1.default.Router();
exports.router = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }
        const student = yield userModel_1.userModel
            .findOne({ email })
            .populate("enrolledSubjects", "name code");
        if (!student || student.role !== "student") {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        const allSubjectsCount = yield subjectModel_1.subjectModel.countDocuments();
        const enrolledBatches = yield batchModel_1.batchModel
            .find({ students: student._id })
            .populate("subject", "name code")
            .populate("teacher", "firstName lastName email")
            .populate("room", "name")
            .select("name schedule subject teacher room completion");
        const dayCountMap = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0,
        };
        enrolledBatches.forEach((batch) => {
            var _a;
            if ((_a = batch.schedule) === null || _a === void 0 ? void 0 : _a.day) {
                batch.schedule.day.forEach((day) => {
                    if (dayCountMap[day] !== undefined) {
                        dayCountMap[day]++;
                    }
                });
            }
        });
        const daywiseBatchData = Object.entries(dayCountMap).map(([day, count]) => ({
            day,
            count,
        }));
        // Get unique teachers
        const uniqueTeachers = enrolledBatches.reduce((acc, batch) => {
            const teacher = batch.teacher;
            if (teacher && !acc.find((t) => t.email === teacher.email)) {
                acc.push({
                    name: `${teacher.firstName} ${teacher.lastName}`,
                    email: teacher.email,
                });
            }
            return acc;
        }, []);
        // Get unique subjects student has opted
        const optedSubjects = student.enrolledSubjects || [];
        // get attendance per batch (active batches: completion<100)
        // Filter active batches
        const activeEnrolledBatches = enrolledBatches.filter((batch) => batch.completion < 100);
        const attendanceStats = {};
        for (const batch of activeEnrolledBatches) {
            const totalSessions = yield attendanceModel_1.attendanceModel.countDocuments({
                batchId: batch._id,
            });
            const presentCount = yield attendanceModel_1.attendanceModel.countDocuments({
                batchId: batch._id,
                records: {
                    $elemMatch: {
                        studentId: student._id,
                        status: "present",
                    },
                },
            });
            const percentage = totalSessions === 0
                ? 0
                : Math.round((presentCount / totalSessions) * 100);
            attendanceStats[batch.name] = percentage;
        }
        res.status(200).json({
            success: true,
            data: {
                createdAt: student.createdAt,
                daywiseBatchData,
                batchesCount: enrolledBatches.length,
                uniqueTeachers,
                subjectStats: {
                    totalSubjects: allSubjectsCount,
                    optedSubjects: optedSubjects.length,
                },
                attendanceStats,
            },
        });
        return;
    }
    catch (error) {
        console.error("Error in student dashboard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
