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
const userIdGenerator_1 = require("../../../utils/userIdGenerator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, teachers } = req.body;
        if (!email || !teachers || !Array.isArray(teachers)) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
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
                yield Promise.all(teachers.map((teacher) => __awaiter(void 0, void 0, void 0, function* () {
                    const existingTeacher = yield userModel_1.userModel.findOne({
                        email: teacher.email,
                    });
                    if (!existingTeacher) {
                        // Generate a unique user ID
                        let userId;
                        let isUnique = false;
                        while (!isUnique) {
                            userId = (0, userIdGenerator_1.generateUserId)();
                            const existingUser = yield userModel_1.userModel.findOne({
                                user_id: userId,
                            });
                            if (!existingUser) {
                                isUnique = true;
                            }
                        }
                        // ✅ HASH THE PASSWORD
                        const salt = yield bcryptjs_1.default.genSalt(10);
                        const hashedPassword = yield bcryptjs_1.default.hash(teacher.password, salt);
                        // Create new teacher
                        yield userModel_1.userModel.create({
                            firstName: teacher.firstName,
                            lastName: teacher.lastName,
                            email: teacher.email,
                            user_id: userId,
                            password: hashedPassword,
                            role: "teacher",
                        });
                    }
                })));
                res
                    .status(201)
                    .json({ success: true, message: "Teacher(s) added successfully" });
                return;
            }
        }
    }
    catch (error) {
        console.error("Error creating Teachers:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
}));
