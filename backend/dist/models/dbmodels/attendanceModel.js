"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const attendanceSchema = new mongoose_1.default.Schema({
    batchId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Batches",
        required: true,
    },
    date: { type: Date, required: true },
    records: [
        {
            studentId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            status: {
                type: String,
                enum: ["present", "absent"],
                default: "absent"
            },
        },
    ],
}, { timestamps: true });
attendanceSchema.index({ batchId: 1, date: 1 });
attendanceSchema.index({ "records.studentId": 1 });
const attendanceModel = mongoose_1.default.model("Attendance", attendanceSchema, "Attendance");
exports.attendanceModel = attendanceModel;
