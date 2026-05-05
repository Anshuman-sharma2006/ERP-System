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
const batchModel_1 = require("../../../models/dbmodels/batchModel");
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, teacherId } = req.body;
        if (!email || !teacherId) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
            return;
        }
        else {
            const user = yield userModel_1.userModel.findOne({ email: email });
            if (!user || user.role !== "admin") {
                res.status(403).json({ success: false, message: "Access denied" });
                return;
            }
            else {
                const teacher = yield userModel_1.userModel.findOne({ user_id: teacherId });
                if (!teacher) {
                    res
                        .status(400)
                        .json({ success: false, message: "Teacher not found" });
                    return;
                }
                // Set teacher field in batches to null
                yield batchModel_1.batchModel.updateMany({ teacher: teacher._id }, { $set: { teacher: null } });
                // Remove the teacher user
                yield userModel_1.userModel.findByIdAndDelete(teacher._id);
                res
                    .status(200)
                    .json({ success: true, message: "Teacher deleted successfully" });
                return;
            }
        }
    }
    catch (error) {
        console.error("Error deleting Teacher:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
        return;
    }
}));
