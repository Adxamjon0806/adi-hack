import ChatOpenai from "../OpenAI Connects/ChatopenAi.js";

const ChatGPTsolveTest = async (req, res) => {
  try {
    const fullStart = Date.now();

    const { html } = req.body;
    // Вывод html кода
    // console.log(html);

    if (!html) {
      return res.status(400).json({ error: "Нет HTML в теле запроса" });
    }

    // ✅ Чёткий prompt для gpt-4o
    const prompt = `
Вот HTML-код страницы, содержащей несколько тестов.

Найди активный вопрос (тот, который отображается пользователю и не скрыт).  
Извлеки текст вопроса и все варианты ответов.  
Определи правильный ответ.  
Верни только одну букву правильного варианта ответа (например: A, B, C, D).  
Не добавляй никаких пояснений, текста, комментариев — только одну букву.

HTML:
${html}

Ответ:
`;

    const aiStart = Date.now();
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // ✅ Самый топовый и быстрый
      messages: [
        {
          role: "system",
          content:
            "Ты эксперт, который извлекает и решает тесты. Возвращай только букву правильного ответа, без пояснений.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });
    const aiEnd = Date.now();

    const answer = response.choices[0].message.content.trim();
    console.log("✅ Ответ:", answer);

    res.json({ answer });
    const fullEnd = Date.now();
    console.log("Время нейросети:", aiEnd - aiStart, "мс");
    console.log("Полное время запроса:", fullEnd - fullStart, "мс");
  } catch (error) {
    console.error("Ошибка GPT:", error.message);
    res.status(500).json({ error: "Ошибка при обращении к GPT" });
  }
};

export default ChatGPTsolveTest;
