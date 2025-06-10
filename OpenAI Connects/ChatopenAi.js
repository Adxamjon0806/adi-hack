import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config(); // нужно, если используешь .env здесь напрямую

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Не указан OPENAI_API_KEY в .env");
}
const ChatOpenai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default ChatOpenai;
