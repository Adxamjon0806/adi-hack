import ChatOpenai from "../OpenAI Connects/ChatopenAi.js";

const ChatGPTsolveTest = async (req, res) => {
  try {
    const { html } = req.body;
    console.log(html);

    if (!html) {
      return res.status(400).json({ error: "Нет HTML в теле запроса" });
    }

    const prompt = `
      Вот HTML-код страницы, содержащей тест.
      Извлеки вопрос и варианты ответа из этого HTML и определи правильный вариант.
      Ответ должен быть только в виде буквы (A, B, C и т.д.).
      Никаких пояснений не добавляй. Если варианты представлены не в виде букв то просто напиши номер ответа по его порядку в списке вариантов, например если ответ был первым то просто напиши - 1 и так далее.
      А если ты не найдёшь тесты в HTML-коде просто напиши - тестов нет
      
      HTML:
      ${html}
      Ответ:
      `;

    const response = await ChatOpenai.chat.completions.create({
      model: "gpt-4.1-mini",
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
};

export default ChatGPTsolveTest;
