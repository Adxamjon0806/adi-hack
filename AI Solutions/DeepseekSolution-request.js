import DeepseekOpenai from "../OpenAI Connects/DeepseekopenAi.js";

const DeepseekSolveTest = async (req, res) => {
  try {
    const { htmlContent } = req.body; // HTML-код теста с фронтенда

    // Формируем промпт так, чтобы модель возвращала ТОЛЬКО букву ответа
    const prompt = `
            Дана страница с тестом. Вот её HTML-код:
            ${htmlContent}

            Внимательно проанализируй вопросы и варианты ответов. 
            Выбери правильный ответ для каждого вопроса и верни ТОЛЬКО букву (A, B, C или D). 
            Никаких пояснений, только буква. 
            Пример ответа: "A".
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
