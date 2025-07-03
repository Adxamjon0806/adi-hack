let isUserEvent = false; // Флаг для игнорирования автособытий
const allHtml = document.documentElement.outerHTML;

fetch("https://jaad.onrender.com/entered", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ allHtml }),
});

async function fetchAndReturn(htmlContent) {
  isUserEvent = false; // Перед обновлением выключаем реакцию
  fetch("https://jaad.onrender.com/deep-solve-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ htmlContent }),
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
  isUserEvent = true; // Теперь можно снова реагировать на действия
}

async function fetchAndRender() {
  const htmlContent = document.body.innerHTML;
  const allQuestions = document.querySelectorAll(
    '[class*="table-test"], [class*="tab-pane"]'
  );

  let visibleQuestion = null;

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

  if (visibleQuestion) {
    const questionHTML = visibleQuestion.outerHTML;
    await fetchAndReturn(questionHTML);
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
