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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, rollNo, password } = req.body;
        if (!firstName || !rollNo || !email || !password) {
            res
                .status(400)
                .json({
                success: false,
                message: "Please provide all required fields.",
            });
            return;
        }
        else {
            // check if student already exists
            const existingStudent = yield userModel_1.userModel.findOne({
                $or: [{ user_id: rollNo }, { email: email }],
            });
            if (existingStudent) {
                res
                    .status(400)
                    .json({ success: false, message: "Student already exists." });
                return;
            }
            // ✅ HASH THE PASSWORD
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            // create new user -> student
            yield userModel_1.userModel.create({
                firstName,
                lastName,
                email,
                user_id: rollNo,
                password: hashedPassword,
                role: "student",
                enrolledSubjects: [],
                status: "inactive",
            });
            res
                .status(201)
                .json({ success: true, message: "Student created successfully" });
            return;
        }
    }
    catch (error) {
        console.error("Error creating Student:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
}));
