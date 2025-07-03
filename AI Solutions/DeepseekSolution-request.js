import DeepseekOpenai from "../OpenAI Connects/DeepseekopenAi.js";

const DeepseekSolveTest = async (req, res) => {
  try {
    const { htmlContent } = req.body; // HTML-код теста с фронтенда

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

    // Отправляем запрос в DeepSeek API
    const response = await DeepseekOpenai.chat.completions.create({
      model: "deepseek/deepseek-r1",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = response.choices[0].message.content.trim();

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process the test" });
  }
};

export default DeepseekSolveTest;
