"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    user_id: { type: String, unique: true }, // roll No for students, teacher Id for teachers and admin Id for admins
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"],
        default: "student",
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    enrolledSubjects: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Subjects" }], //for students
    batches: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Batches" }], //for teachers and students
}, { timestamps: true });
const userModel = mongoose_1.default.model("Users", userSchema, "Users");
exports.userModel = userModel;
