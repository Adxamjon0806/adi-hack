import ChatOpenai from "../OpenAI Connects/ChatopenAi.js";

const ChatGPTsolveTest = async (req, res) => {
  try {
    const { html } = req.body;
    console.log(html);

    if (!html) {
      return res.status(400).json({ error: "Нет HTML в теле запроса" });
    }

    const structPrompt = `
      Вот HTML-код страницы, содержащей несколько тестов.
      Определи активный вопрос (тот, который отображается пользователю, не скрыт).
      Извлеки его текст и варианты ответа.
      Преобразуй в формат:

      Вопрос: ...
      A. ...
      B. ...
      ...

      Не указывай правильный ответ. Только форматированный текст.
      HTML:
      ${html}
    `;

    const structResponse = await ChatOpenai.chat.completions.create({
      model: "gpt-4-0125-preview", // самый умный для парсинга
      messages: [
        {
          role: "system",
          content:
            "Ты эксперт по HTML-тестам, задача — извлечь активный вопрос и варианты.",
        },
        {
          role: "user",
          content: structPrompt,
        },
      ],
      temperature: 0,
    });

    const formattedQuestion = structResponse.choices[0].message.content.trim();
    console.log("✅ Извлечённый вопрос:\n", formattedQuestion);

    // ✅ Шаг 2: Получаем правильный ответ (mini модель)
    const solvePrompt = `
${formattedQuestion}

Укажи правильный вариант ответа (только буква, без текста и без пояснений).
`;

    const solveResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini", // можешь заменить на gpt-3.5-turbo, если хочешь сэкономить
      messages: [
        {
          role: "system",
          content:
            "Ты эксперт, который выбирает правильный ответ. Возвращай только букву.",
        },
        {
          role: "user",
          content: solvePrompt,
        },
      ],
      temperature: 0,
    });

    const finalAnswer = solveResponse.choices[0].message.content.trim();
    console.log("✅ Ответ:", finalAnswer);

    res.json({ answer: finalAnswer });
  } catch (error) {
    console.error("Ошибка GPT:", error.message);
    res.status(500).json({ error: "Ошибка при обращении к GPT" });
  }
};

export default ChatGPTsolveTest;
