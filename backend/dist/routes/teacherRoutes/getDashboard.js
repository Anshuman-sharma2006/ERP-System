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
const batchModel_1 = require("../../models/dbmodels/batchModel");
const router = express_1.default.Router();
exports.router = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = req.query.email;
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" });
            return;
        }
        const teacher = yield userModel_1.userModel.findOne({ email });
        if (!teacher || teacher.role !== "teacher") {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        // Fetch all batches this teacher teaches
        const batches = yield batchModel_1.batchModel
            .find({ teacher: teacher._id, completion: { $lt: 100 } })
            .populate("subject", "name code")
            .populate("room", "name")
            .populate("students", "_id firstName lastName email")
            .sort({ createdAt: -1 });
        const subjectMap = new Map();
        const studentSet = new Set();
        const dayCountMap = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0,
        };
        const upcomingBatches = [];
        const studentCountPerBatch = [];
        for (const batch of batches) {
            // Subjects
            const subject = batch.subject;
            if (subject && !subjectMap.has(subject._id.toString())) {
                subjectMap.set(subject._id.toString(), {
                    name: subject.name,
                    code: subject.code,
                });
            }
            // Students
            const students = batch.students || [];
            for (const s of students) {
                studentSet.add(s._id.toString());
            }
            // Days
            if ((_a = batch.schedule) === null || _a === void 0 ? void 0 : _a.day) {
                for (const day of batch.schedule.day) {
                    if (dayCountMap[day] !== undefined) {
                        dayCountMap[day]++;
                    }
                }
            }
            // Student count per batch
            studentCountPerBatch.push({
                batch: batch.name,
                students: students.length,
            });
            // Upcoming batches (limit 5)
            if (upcomingBatches.length < 5) {
                upcomingBatches.push({
                    name: batch.name,
                    subject: (subject === null || subject === void 0 ? void 0 : subject.name) || "N/A",
                    room: ((_b = batch.room) === null || _b === void 0 ? void 0 : _b.name) || "N/A",
                    time: ((_c = batch.schedule) === null || _c === void 0 ? void 0 : _c.time) || "N/A",
                    days: ((_d = batch.schedule) === null || _d === void 0 ? void 0 : _d.day) || [],
                });
            }
        }
        const daywiseBatchData = Object.entries(dayCountMap).map(([day, count]) => ({
            day,
            count,
        }));
        const recentStudents = Array.from(batches
            .flatMap((batch) => batch.students)
            .slice(0, 5)
            .map((student) => ({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
        })));
        res.status(200).json({
            success: true,
            data: {
                createdAt: teacher.createdAt,
                stats: {
                    totalBatches: batches.length,
                    totalSubjects: subjectMap.size,
                    totalStudents: studentSet.size,
                    upcomingThisWeek: upcomingBatches.length,
                },
                daywiseBatchData,
                subjectList: Array.from(subjectMap.values()),
                recentStudents,
                upcomingBatches,
                studentCountPerBatch,
            },
        });
        return;
    }
    catch (error) {
        console.error("Error in teacher dashboard:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
    }
}));
