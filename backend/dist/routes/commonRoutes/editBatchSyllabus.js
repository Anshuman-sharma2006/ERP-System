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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, batchName, syllabus } = req.body;
        if (!email || !batchName || !syllabus || !Array.isArray(syllabus)) {
            res.status(400).json({ success: false, message: "Invalid request data" });
            return;
        }
        const user = yield userModel_1.userModel.findOne({ email: email });
        if (!user || (user.role !== "admin" && user.role !== "teacher")) {
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        const batch = yield batchModel_1.batchModel.findOne({ name: batchName });
        if (!batch) {
            res.status(404).json({ success: false, message: "Batch not found" });
            return;
        }
        // Create a map of existing titles to their done status
        const existingDoneMap = {};
        for (const item of batch.syllabus || []) {
            existingDoneMap[item.title] = item.done;
        }
        // Build new syllabus, preserving done for existing titles
        const formattedSyllabus = syllabus.map((title) => {
            var _a;
            return ({
                title,
                done: (_a = existingDoneMap[title]) !== null && _a !== void 0 ? _a : false,
            });
        });
        const result = yield batchModel_1.batchModel.updateOne({ name: batchName }, { $set: { syllabus: formattedSyllabus } });
        if (result.modifiedCount === 0) {
            res.status(404).json({
                success: false,
                message: "Batch not found or syllabus unchanged",
            });
            return;
        }
        res
            .status(200)
            .json({ success: true, message: "Syllabus updated successfully" });
        return;
    }
    catch (error) {
        console.error("Error updating Syllabus:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
        return;
    }
}));
