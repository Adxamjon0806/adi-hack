const html = document.documentElement.outerHTML;

fetch("http://localhost:3000/solve-test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ html }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Ответ:", data.answer); // например "B"
  });
