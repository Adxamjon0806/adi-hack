import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const DeepseekOpenai = new OpenAI({
  baseURL: process.env.DEEPSEEK_API_URL,
  apiKey: process.env.DEEPSEEKAI_API_KEY,
});

export default DeepseekOpenai;
