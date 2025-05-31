const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
const port = 3000;
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Отдаём js файл по конкретному пути
app.get("/custom-script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "assets", "hacking.js"));
});

app.post("/solve-test", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Нет HTML в теле запроса" });
    }

    const prompt = `
  Вот HTML-код страницы, содержащей тест.
  Извлеки вопрос и варианты ответа из этого HTML и определи правильный вариант.
  Ответ должен быть только в виде буквы (A, B, C и т.д.).
  Никаких пояснений не добавляй. Если варианты представлены не в виде букв то просто напиши номер ответа по его порядку в списке ответов, например если ответ был первым то просто напиши - 1 и так далее.
  А если ты не найдёшь тесты в HTML-коде просто напиши - тестов нет
  
  HTML:
  ${html}
  Ответ:
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "system",
          content:
            "Ты помощник, который отвечает на тесты. Возвращай только правильный ответ (A, B, C и т.д.)",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error("Ошибка GPT:", error.message);
    res.status(500).json({ error: "Ошибка при обращении к GPT" });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
