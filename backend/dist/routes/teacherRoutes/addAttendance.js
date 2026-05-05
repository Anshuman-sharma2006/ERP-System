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
const batchModel_1 = require("../../models/dbmodels/batchModel");
const userModel_1 = require("../../models/dbmodels/userModel");
const attendanceModel_1 = require("../../models/dbmodels/attendanceModel");
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, topicsCovered, attendance } = req.body;
        if (!email ||
            !topicsCovered ||
            !Array.isArray(topicsCovered) ||
            !attendance ||
            !attendance.batchId ||
            !attendance.records ||
            !attendance.date) {
            res.status(400).json({ success: false, message: "Invalid request data" });
            return;
        }
        const user = yield userModel_1.userModel.findOne({ email });
        if (!user || user.role !== "teacher") {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        const batch = yield batchModel_1.batchModel.findOne({ name: attendance.batchId });
        if (!batch) {
            res.status(404).json({ success: false, message: "Batch not found" });
            return;
        }
        const emails = attendance.records.map((r) => r.email);
        const students = yield userModel_1.userModel.find({ email: { $in: emails } });
        const emailToIdMap = {};
        students.forEach((s) => {
            emailToIdMap[s.email] = s._id.toString();
        });
        const finalRecords = attendance.records
            .map((r) => {
            const studentId = emailToIdMap[r.email];
            if (!studentId)
                return null;
            return {
                studentId,
                status: r.status || "absent",
            };
        })
            .filter(Boolean); // removes null entries
        // Normalize incoming date to midnight
        const attendanceDate = new Date(attendance.date);
        attendanceDate.setHours(0, 0, 0, 0);
        // Check if attendance already exists for that batch and date
        const existingAttendance = yield attendanceModel_1.attendanceModel.findOne({
            batchId: batch._id,
            date: attendanceDate,
        });
        if (existingAttendance) {
            // Replace the existing record
            yield attendanceModel_1.attendanceModel.updateOne({ _id: existingAttendance._id }, { records: finalRecords, updatedAt: new Date() });
        }
        else {
            // Create new attendance
            yield attendanceModel_1.attendanceModel.create({
                batchId: batch._id,
                date: attendanceDate,
                records: finalRecords,
            });
        }
        // update the topics covered of the batch in syllabus
        if (topicsCovered.length > 0) {
            yield batchModel_1.batchModel.updateOne({ _id: batch._id }, {
                $set: {
                    "syllabus.$[elem].done": true,
                },
            }, {
                arrayFilters: [{ "elem.title": { $in: topicsCovered } }],
            });
        }
        // update the completion of the batch
        const attendanceCount = yield attendanceModel_1.attendanceModel.countDocuments({
            batchId: batch._id,
        });
        // Calculate percentage
        const totalDays = batch.days;
        const completedPercentage = Math.min(Math.round((attendanceCount / totalDays) * 100), 100);
        // Prepare update fields
        const updateFields = {
            completion: completedPercentage,
        };
        // If just completed 100% and endDate isn't set, set it
        if (completedPercentage === 100 && !batch.endDate) {
            updateFields.endDate = new Date();
        }
        // Update batch
        yield batchModel_1.batchModel.updateOne({ _id: batch._id }, { $set: updateFields });
        res
            .status(200)
            .json({ success: true, message: "Attendance recorded successfully" });
    }
    catch (error) {
        console.error("Error adding attendance:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
}));
