import { Router } from "express";
import IdsController from "./IdsController.js";
import solveTest from "./solution-request.js";

const router = new Router();

router.post("/test", IdsController.createId);
router.get("/test/:id", IdsController.getTheScript);
router.get("/all-ids", IdsController.getAll);
router.post("/solve-test", solveTest);
router.delete("/test/:id", IdsController.delete);

export default router;
