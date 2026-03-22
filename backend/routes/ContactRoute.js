import express from "express";
const router = express.Router();
import { saveContact } from "../controller/ContactController.js";

router.post("/save", saveContact);

export default router;
