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
const roomModel_1 = require("../../../models/dbmodels/roomModel");
const userModel_1 = require("../../../models/dbmodels/userModel");
const router = express_1.default.Router();
exports.router = router;
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, rooms } = req.body;
        if (!email || !rooms || !Array.isArray(rooms)) {
            res.status(400).json({ success: false, message: "Invalid request data" });
            return;
        }
        else {
            const user = yield userModel_1.userModel.findOne({ email: email });
            if (!user || user.role !== "admin") {
                res.status(403).json({ success: false, message: "Access denied" });
                return;
            }
            else {
                yield Promise.all(rooms.map((room) => __awaiter(void 0, void 0, void 0, function* () {
                    const existingRoom = yield roomModel_1.roomModel.findOne({
                        name: room.name,
                    });
                    if (!existingRoom) {
                        yield roomModel_1.roomModel.create({
                            name: room.name,
                            capacity: room.capacity,
                        });
                    }
                })));
                res.status(200).json({ success: true, message: "Room(s) added successfully" });
                return;
            }
        }
    }
    catch (error) {
        console.error("Error adding Room(s):", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
        return;
    }
}));
