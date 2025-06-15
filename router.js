import { Router } from "express";
import IdsController from "./IdsController.js";
import ChatGPTsolveTest from "./AI Solutions/ChatGPTSolution-request.js";
import DeepseekSolveTest from "./AI Solutions/DeepseekSolution-request.js";
import mailEntrance from "./mailEntrance.js";

const router = new Router();

router.post("/entered", mailEntrance);
router.post("/test", IdsController.createId);
router.get("/tj/:id", IdsController.getTheChatScript);
router.get("/dj/:id", IdsController.getTheDeepScript);
router.get("/all-ids", IdsController.getAll);
router.post("/chat-solve-test", ChatGPTsolveTest);
router.post("/deep-solve-test", DeepseekSolveTest);
router.delete("/test/:id", IdsController.delete);

export default router;
