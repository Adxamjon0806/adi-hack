const html = document.body.innerHTML;
let isUserEvent = false; // Флаг для игнорирования автособытий

async function fetchAndRender() {
  isUserEvent = false; // Перед обновлением выключаем реакцию
  fetch("https://tuit-hacking.onrender.com/solve-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Ответ:", data.answer); // например "B"
      if (document.getElementById("draggable")) {
        block.textContent = data.answer;
      } else {
        const block = document.createElement("div");
        block.textContent = data.answer;
        block.id = "draggable";

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

// Первый запуск
fetchAndRender();

// Универсальный обработчик любых событий
document.addEventListener("click", handleEvent, true);
document.addEventListener("input", handleEvent, true);
document.addEventListener("change", handleEvent, true);
document.addEventListener("keydown", handleEvent, true);

let timeout;
function handleEvent(event) {
  if (!isUserEvent) return; // игнорировать, если это автоматическая отрисовка

  // Дебаунс — чтобы не спамить запросами
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log("Обнаружено пользовательское действие:", event.type);
    fetchAndRender();
  }, 300); // ждать немного перед отправкой
}
