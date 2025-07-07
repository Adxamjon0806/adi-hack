import DeepseekOpenai from "../OpenAI Connects/DeepseekopenAi.js";

const DeepseekSolveTest = async (req, res) => {
  try {
    const fullStart = Date.now();
    const { htmlContent } = req.body; // HTML-код теста с фронтенда
    const imageUrl = req.body?.imageUrl;
    console.log(htmlContent);
    console.log(imageUrl);

    // Формируем промпт так, чтобы модель возвращала ТОЛЬКО букву ответа
    const prompt = `
            Дана страница с тестом. Вот её HTML-код:
            ${htmlContent}

            Найди активный вопрос (тот, который отображается пользователю и не скрыт).  
            Извлеки текст вопроса и все варианты ответов.  
            Определи правильный ответ.  
            Верни только одну букву правильного варианта ответа (например: A, B, C, D).  
            Не добавляй никаких пояснений, текста, комментариев — только одну букву.
        `;

    const aiStart = Date.now();
    // Отправляем запрос в DeepSeek API
    const response = await DeepseekOpenai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [{ role: "user", content: prompt }],
    });
    const aiEnd = Date.now();

    const answer = response.choices[0].message.content.trim();

    res.json({ answer });
    const fullEnd = Date.now();
    console.log("Время нейросети:", aiEnd - aiStart, "мс");
    console.log("Полное время запроса:", fullEnd - fullStart, "мс");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process the test" });
  }
};

export default DeepseekSolveTest;
