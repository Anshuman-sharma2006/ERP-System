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
const router = express_1.default.Router();
exports.router = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
            });
            return;
        }
        else {
            const teacher = yield userModel_1.userModel
                .findOne({ email: email })
                .populate("batches");
            if (!teacher) {
                res
                    .status(400)
                    .json({ success: false, message: "No such teacher exists" });
                return;
            }
            else if (teacher.role !== "teacher") {
                res.status(400).json({ success: false, message: "Access denied" });
                return;
            }
            // Get batch IDs where this user is the teacher
            const teacherBatchIds = teacher.batches.map((batch) => batch._id);
            // Find students who are in at least one of the teacher's batches
            const students = yield userModel_1.userModel
                .find({
                role: "student",
                batches: { $in: teacherBatchIds },
            })
                .populate([
                {
                    path: "batches",
                    select: "name",
                },
                {
                    path: "enrolledSubjects",
                    select: "name code",
                },
            ])
                .select("-_id -createdAt -updatedAt -__v -password -role")
                .sort({ firstName: 1 });
            // After fetching students
            const filteredStudents = students.map((student) => {
                return Object.assign(Object.assign({}, student.toObject()), { batches: student.batches.filter((batch) => teacherBatchIds.some((id) => id.equals(batch._id))) });
            });
            res.status(200).json({ success: true, data: filteredStudents });
            return;
        }
    }
    catch (error) {
        console.error("Error retrieving teachers:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
}));
