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
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subjects } = req.body;
        if (!email || !subjects || !Array.isArray(subjects)) {
            res.status(400).json({ success: false, message: "Invalid request data" });
            return;
        }
        const user = yield userModel_1.userModel.findOne({ email });
        if (!user || user.role !== "student") {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        for (const course of subjects) {
            const subject = yield subjectModel_1.subjectModel.findOne({
                code: course,
            });
            if (!subject)
                continue;
            const alreadyEnrolled = user.enrolledSubjects.some((id) => id.toString() === subject._id.toString());
            if (!alreadyEnrolled) {
                user.enrolledSubjects.push(subject._id);
            }
        }
        yield user.save();
        res.status(200).json({ success: true, message: "Enrolled for subject(s) successfully" });
    }
    catch (error) {
        console.error("Error enrolling for subject(s):", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
}));
