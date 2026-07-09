import { Router } from "express";
// import IdsController from "./IdsController.js";
import ChatGPTsolveTest from "./AI Solutions/ChatGPTSolution-request.js";
import DeepseekSolveTest from "./AI Solutions/DeepseekSolution-request.js";
import mailEntrance, { mailIdEntrance } from "./mailEntrance.js";
import path from "path";
import { __dirname } from "./index.js";

const router = new Router();

// router.get("/t/:id", IdsController.getTheChatScript);
// router.get("/d/:id", IdsController.getTheDeepScript);
// router.get("/s/:id", IdsController.getChatingScript);
router.get("/t", (_, res) => {
  mailIdEntrance(null, "t");
  res.sendFile(path.join(__dirname, "assets", "hacking.js"));
});
router.get("/d", (_, res) => {
  mailIdEntrance(null, "d");
  res.sendFile(path.join(__dirname, "assets", "deepHacking.js"));
});
router.get("/s", (_, res) => {
  res.sendFile(path.join(__dirname, "assets", "chatingScript.js"));
});
router.post("/entered", mailEntrance);
// router.post("/test", IdsController.createId);
// router.get("/all-ids", IdsController.getAll);
router.post("/chat-solve-test", ChatGPTsolveTest);
router.post("/deep-solve-test", DeepseekSolveTest);
// router.delete("/test/:id", IdsController.delete);
router.get("/answers-panel", (_, res) => {
  res.sendFile(path.join(__dirname, "assets", "answers-panel.html"));
});

export default router;
