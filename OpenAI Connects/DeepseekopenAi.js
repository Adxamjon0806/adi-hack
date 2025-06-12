import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const DeepseekOpenai = new OpenAI({
  baseURL: process.env.OPEN_ROUTER_DEEPSEEK_API_URL,
  apiKey: process.env.OPEN_ROUTER_DEEPSEEK_API_KEY,
});

export default DeepseekOpenai;
