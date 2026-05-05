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
    try {
        const email = req.query.email;
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Please provide the teacher's email.",
            });
            return;
        }
        // First, find the teacher by email
        const teacher = yield userModel_1.userModel.findOne({ email });
        if (!teacher) {
            res.status(404).json({
                success: false,
                message: "Teacher not found.",
            });
            return;
        }
        // Fetch all batches this teacher teaches
        const batches = yield batchModel_1.batchModel
            .find({ teacher: teacher._id, completion: { $lt: 100 } })
            .populate("subject", "name code")
            .populate("room", "name capacity")
            .populate("teacher", "firstName lastName email")
            .populate("students", "firstName lastName email user_id")
            .sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: batches,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching teacher batches:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
        return;
    }
}));
