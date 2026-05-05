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
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
            });
            return;
        }
        else {
            //  check if the user exists or not
            let user = yield userModel_1.userModel.findOne({ email: email });
            if (!user) {
                res.status(400).json({
                    success: false,
                    message: "User with this email does not exist.",
                });
                return;
            }
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                user_id: user.user_id,
                role: user.role,
                status: user.status
            };
            res.status(200).json({ success: true, user: userData, message: "User fetched successfully." });
            return;
        }
    }
    catch (error) {
        console.error("Error Signing in user:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
        return;
    }
}));
