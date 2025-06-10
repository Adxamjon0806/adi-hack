import path from "path";
import { __dirname } from "./index.js";
import IdsService from "./IdsService.js";

class IdsController {
  async createId(req, res) {
    const id = await IdsService.create(req.body);
    return res.json(id);
  }
  async getTheChatScript(req, res) {
    const id = await IdsService.findOne({ idOFLink: req.params.id });
    if (id) {
      res.sendFile(path.join(__dirname, "assets", "hacking.js"));
    } else {
      res.status(400);
      res.send("");
    }
  }
  async getTheDeepScript(req, res) {
    const id = await IdsService.findOne({ idOFLink: req.params.id });
    if (id) {
      res.sendFile(path.join(__dirname, "assets", "deepHacking.js"));
    } else {
      res.status(400);
      res.send("");
    }
  }
  async getAll(req, res) {
    const ids = await IdsService.getAll();
    return res.json(ids);
  }
  async delete(req, res) {
    const id = await IdsService.delete(req.params.id);
    return res.json(id);
  }
}

export default new IdsController();
