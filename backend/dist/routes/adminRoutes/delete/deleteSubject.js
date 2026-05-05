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
const subjectModel_1 = require("../../../models/dbmodels/subjectModel");
const userModel_1 = require("../../../models/dbmodels/userModel");
const batchModel_1 = require("../../../models/dbmodels/batchModel");
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subjectCode } = req.body;
        if (!email || !subjectCode) {
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
                const subject = yield subjectModel_1.subjectModel.findOne({ code: subjectCode });
                if (!subject) {
                    res
                        .status(400)
                        .json({ success: false, message: "Subject not found" });
                    return;
                }
                // remove batches linked with that subject
                yield batchModel_1.batchModel.deleteMany({ subject: subject._id });
                //  remove subject from user enrolled subjects
                yield userModel_1.userModel.updateMany({ enrolledSubjects: subject._id }, { $pull: { enrolledSubjects: subject._id } });
                yield subjectModel_1.subjectModel.findByIdAndDelete(subject._id);
                res
                    .status(200)
                    .json({ success: true, message: "Subject deleted successfully" });
                return;
            }
        }
    }
    catch (error) {
        console.error("Error deleting Subject:", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
        return;
    }
}));
