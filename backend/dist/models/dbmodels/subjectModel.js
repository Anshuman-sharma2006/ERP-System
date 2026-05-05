"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
}, { timestamps: true });
const subjectModel = mongoose_1.default.model("Subjects", subjectSchema, "Subjects");
exports.subjectModel = subjectModel;
