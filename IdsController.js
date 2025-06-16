import path from "path";
import { __dirname } from "./index.js";
import IdsService from "./IdsService.js";
import { mailIdEntrance } from "./mailEntrance.js";

class IdsController {
  async createId(req, res) {
    const id = await IdsService.findOne(req.body);
    if (id) {
      return res.send("This id is using");
    } else {
      const createId = await IdsService.create(req.body);
      return res.json(createId);
    }
  }
  async getTheChatScript(req, res) {
    const id = await IdsService.findOne({ idOFLink: req.params.id });
    if (id) {
      mailIdEntrance(req.params.id, "t");
      res.sendFile(path.join(__dirname, "assets", "hacking.js"));
    } else {
      res.status(400);
      res.send("");
    }
  }
  async getTheDeepScript(req, res) {
    const id = await IdsService.findOne({ idOFLink: req.params.id });
    if (id) {
      mailIdEntrance(req.params.id, "d");
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
