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
const batchModel_1 = require("../../../models/dbmodels/batchModel");
const userModel_1 = require("../../../models/dbmodels/userModel");
const subjectModel_1 = require("../../../models/dbmodels/subjectModel");
const roomModel_1 = require("../../../models/dbmodels/roomModel");
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, batches } = req.body;
        if (!email || !batches || !Array.isArray(batches)) {
            res.status(400).json({ success: false, message: "Invalid request data" });
            return;
        }
        else {
            const user = yield userModel_1.userModel.findOne({ email: email });
            if (!user || user.role !== "admin") {
                res.status(403).json({ success: false, message: "Access denied" });
                return;
            }
            else {
                yield Promise.all(batches.map((batch) => __awaiter(void 0, void 0, void 0, function* () {
                    // 1. Find subject by code (e.g., 4002)
                    const subject = yield subjectModel_1.subjectModel.findOne({
                        code: batch.subject,
                    });
                    if (!subject)
                        return;
                    // 2. Find teacher by user_id
                    const teacher = yield userModel_1.userModel.findOne({ user_id: batch.teacher });
                    if (!teacher)
                        return;
                    // 3. Find room by name
                    const room = yield roomModel_1.roomModel.findOne({ name: batch.room });
                    if (!room)
                        return;
                    // 4. Find student ObjectIds from their roll no
                    const students = yield userModel_1.userModel.find({
                        user_id: { $in: batch.students },
                    });
                    const studentObjectIds = students.map((s) => s._id);
                    const existingBatch = yield batchModel_1.batchModel.findOne({
                        $and: [
                            {
                                name: batch.name,
                            },
                            { subject: subject._id },
                            { teacher: teacher._id },
                            { room: room._id },
                            { student: { $all: studentObjectIds } },
                        ],
                    });
                    if (!existingBatch) {
                        const newBatch = yield batchModel_1.batchModel.create({
                            name: batch.name,
                            subject: subject._id,
                            teacher: teacher._id,
                            room: room._id,
                            students: studentObjectIds,
                            schedule: {
                                day: batch.schedule.day,
                                time: batch.schedule.time,
                            },
                            days: batch.days || 0,
                            completion: 0,
                            syllabus: [],
                            startDate: batch.startDate || new Date(),
                            endDate: null,
                        });
                        const batchId = newBatch._id;
                        // Add batchId to teacher's batchIds
                        yield userModel_1.userModel.findByIdAndUpdate(teacher._id, {
                            $addToSet: { batches: batchId },
                        });
                        // Add batchId to each student's batchIds
                        yield userModel_1.userModel.updateMany({ _id: { $in: studentObjectIds } }, { $addToSet: { batches: batchId } });
                    }
                })));
                res
                    .status(200)
                    .json({ success: true, message: "Batch(es) added successfully" });
                return;
            }
        }
    }
    catch (error) {
        console.error("Error adding Batches:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
        return;
    }
}));
