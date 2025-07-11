let isUserEvent = false; // Флаг для игнорирования автособытий
const allHtml = document.documentElement.outerHTML;

fetch("https://jaad.onrender.com/entered", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ allHtml }),
});

async function fetchAndReturn(html, imageUrl = "") {
  isUserEvent = false; // Перед обновлением выключаем реакцию
  fetch("https://jaad.onrender.com/chat-solve-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, imageUrl }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Ответ:", data.answer); // например "B"
      if (document.getElementById("draggable")) {
        document.getElementById("draggable").textContent = data.answer;
      } else {
        const block = document.createElement("div");
        block.textContent = data.answer;
        block.id = "draggable";

        // Слежение за нажатыми клавишами
        const keysPressed = new Set();

        document.addEventListener("keydown", (e) => {
          keysPressed.add(e.key.toLowerCase());

          // Если нажаты J и K одновременно
          if (keysPressed.has("j") && keysPressed.has("k")) {
            block.style.visibility === "hidden"
              ? (block.style.visibility = "visible")
              : (block.style.visibility = "hidden");
          }
        });

        document.addEventListener("keyup", (e) => {
          keysPressed.delete(e.key.toLowerCase());
        });

        // Устанавливаем стили через JavaScript
        Object.assign(block.style, {
          //   width: "30px",
          //   height: "30px",
          padding: "2px",
          backgroundColor: "transparent",
          color: "black",
          // fontSize: "24px",
          textAlign: "center",
          // lineHeight: "40px",
          position: "absolute",
          top: "100px",
          left: "100px",
          cursor: "grab",
          userSelect: "none",
          borderRadius: "8px",
          border: "0.5px solid gray",
          zIndex: 1000,
        });

        // Добавляем блок на страницу
        document.body.appendChild(block);

        // Логика перетаскивания
        let offsetX, offsetY;
        let isDragging = false;

        block.addEventListener("mousedown", (e) => {
          isDragging = true;
          offsetX = e.clientX - block.offsetLeft;
          offsetY = e.clientY - block.offsetTop;
          block.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            block.style.left = `${e.clientX - offsetX}px`;
            block.style.top = `${e.clientY - offsetY}px`;
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          block.style.cursor = "grab";
        });
      }
    });
  isUserEvent = true;
}

async function fetchAndRender() {
  const htmlContent = document.body.innerHTML;
  const allQuestions = document.querySelectorAll(
    '[class*="table-test"], [class*="tab-pane"]'
  );
  const OnlyQuestions = document.querySelectorAll('[class*="test-question"]');

  let visibleQuestion = null;
  let visibleOnlyQuestion = null;

  allQuestions.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      el.offsetParent !== null
    ) {
      visibleQuestion = el;
    }
  });
  OnlyQuestions.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      el.offsetParent !== null
    ) {
      visibleOnlyQuestion = el;
    }
  });

  if (visibleQuestion && visibleOnlyQuestion) {
    const questionHTML = visibleQuestion.outerHTML;
    const imgEl = visibleOnlyQuestion.querySelector("img");

    let imageUrl = null;

    if (imgEl && imgEl.getAttribute("src")) {
      let src = imgEl.getAttribute("src");

      // Проверяем: если это data:image
      if (src.startsWith("data:image")) {
        console.log("Изображение в формате base64");
        imageUrl = src; // Можно прямо отправлять
      } else {
        // Проверяем: относительный или абсолютный путь
        try {
          const parsed = new URL(src);
          // Если не упадёт — значит абсолютный
          console.log("Абсолютный URL:", parsed.href);
          imageUrl = parsed.href;
        } catch (e) {
          // Относительный путь, собираем полный URL
          const domain = window.location.origin;
          const fullSrc = new URL(src, domain).href;
          console.log("Сформирован полный URL:", fullSrc);
          imageUrl = fullSrc;
        }
      }
    }
    await fetchAndReturn(questionHTML, imageUrl);
  } else {
    await fetchAndReturn(htmlContent);
  }
}

// Первый запуск
fetchAndRender();

// Универсальный обработчик любых событий
document.addEventListener("click", handleEvent, true);
document.addEventListener("change", handleEvent, true);

let timeout;
function handleEvent(event) {
  navigator.clipboard
    .writeText("")
    .then(() => console.log("Скопировано!"))
    .catch((err) => console.error("Ошибка при копировании:", err));

  if (!isUserEvent) return; // игнорировать, если это автоматическая отрисовка

  // Дебаунс — чтобы не спамить запросами
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log("Обнаружено пользовательское действие:", event.type);
    fetchAndRender();
  }, 1000); // ждать немного перед отправкой
}
