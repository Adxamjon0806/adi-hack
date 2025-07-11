import ChatOpenai from "../OpenAI Connects/ChatopenAi.js";

const ChatGPTsolveTest = async (req, res) => {
  try {
    const fullStart = Date.now();
    const addImagePrompt = " и исползуй прикреплённое изображение ниже";
    const { html } = req.body;
    const imageUrl = req.body?.imageUrl;
    console.log(htmlContent);
    console.log(imageUrl);

    if (!html) {
      return res.status(400).json({ error: "Нет HTML в теле запроса" });
    }
    const prompt = `
Вот HTML-код страницы, содержащей несколько тестов:
${html}

Найди активный вопрос (тот, который отображается пользователю и не скрыт).  
Извлеки текст вопроса и все варианты ответов${imageUrl ? addImagePrompt : ""}.  
Определи правильный ответ.  
Верни только одну букву правильного варианта ответа (например: A, B, C, D).  
Не добавляй никаких пояснений, текста, комментариев — только одну букву.
`;

    const messages = imageUrl
      ? [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ]
      : [
          {
            role: "system",
            content:
              "Ты эксперт, который извлекает и решает тесты. Возвращай только букву правильного ответа, без пояснений.",
          },
          {
            role: "user",
            content: prompt,
          },
        ];

    const aiStart = Date.now();
    const response = await ChatOpenai.chat.completions.create({
      model: "gpt-4o",
      messages,
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
