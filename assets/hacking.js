const bodyHTML = document.body.innerHTML;

fetch("https://tuit-hacking.onrender.com/solve-test", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ bodyHTML }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Ответ:", data.answer); // например "B"
  });
