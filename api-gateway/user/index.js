import { Router } from "express";
import { sendToAuthQueueAction } from "./controller.js";
//import { sendToAuthQueue } from "./controller.js";

const router = Router();

router.post("/", sendToAuthQueueAction);

export { router };