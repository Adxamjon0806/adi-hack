import dotenv from "dotenv";

dotenv.config();

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
    const response = await fetch(process.env.DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEKAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Уточните модель
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Минимум случайности
        max_tokens: 1, // Ограничиваем вывод до 1 символа
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    // Убедимся, что ответ - это одна буква (A/B/C/D)
    const cleanAnswer = answer.match(/[A-D]/i)?.[0] || "Error";
    res.json({ answer: cleanAnswer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process the test" });
  }
};

export default DeepseekSolveTest;
