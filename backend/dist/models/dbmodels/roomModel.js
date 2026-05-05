"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, default: 0 },
}, { timestamps: true });
const roomModel = mongoose_1.default.model("Rooms", roomSchema, "Rooms");
exports.roomModel = roomModel;
