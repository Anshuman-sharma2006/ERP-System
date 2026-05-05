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
const userModel_1 = require("../../../models/dbmodels/userModel");
const roomModel_1 = require("../../../models/dbmodels/roomModel");
const router = express_1.default.Router();
exports.router = router;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const subjectCode = req.query.subjectCode;
        const roomName = req.query.roomName;
        if (!email || !subjectCode || !roomName) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
            });
            return;
        }
        else {
            const user = yield userModel_1.userModel.findOne({ email: email });
            if (!user) {
                res
                    .status(400)
                    .json({ success: false, message: "No such admin exists" });
                return;
            }
            else if (user.role !== "admin") {
                res.status(400).json({ success: false, message: "Access denied" });
                return;
            }
            const room = yield roomModel_1.roomModel.findOne({ name: roomName });
            if (!room || room.capacity === 0) {
                res.status(200).json({ success: true, data: [] });
                return;
            }
            let students = yield userModel_1.userModel
                .find({ role: "student" })
                .populate([
                {
                    path: "enrolledSubjects",
                    select: "name code",
                },
            ])
                .select("firstName lastName user_id enrolledSubjects")
                .sort({ firstName: 1 })
                .limit(room.capacity);
            students = students.filter((student) => {
                var _a;
                return (_a = student.enrolledSubjects) === null || _a === void 0 ? void 0 : _a.some((subject) => subject.code === subjectCode);
            });
            res.status(200).json({ success: true, data: students });
            return;
        }
    }
    catch (error) {
        console.error("Error retrieving teachers:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
}));
