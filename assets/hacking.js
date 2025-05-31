const html = document.body.innerHTML;

fetch("https://tuit-hacking.onrender.com/solve-test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ html }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Ответ:", data.answer); // например "B"
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        console.log("--- Mutation detected ---");
        // Создаем блок
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
    // Настройки наблюдателя
    const config = {
      childList: true, // добавление или удаление узлов
      attributes: true, // изменения атрибутов
      characterData: true, // изменения текстового содержимого
      subtree: true, // следить за всеми вложенными элементами
      attributeOldValue: true,
      characterDataOldValue: true,
    };

    // Запуск наблюдателя на всём теле документа
    observer.observe(document.body, config);
  });
