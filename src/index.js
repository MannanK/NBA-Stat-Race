import "./styles/reset.scss";
import "./styles/index.scss";

const testObj = {
  key1: "hi",
  key2: {
    key3: "Hello"
  }
};

const greeting = testObj?.key2?.key3 || testObj.key1;
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("center");
  const card = document.createElement("div");
  card.classList.add("card", "center");
  card.innerHTML = `<h2>${greeting} World!</h2>`;
  document.body.append(card);
});