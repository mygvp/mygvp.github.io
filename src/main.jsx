import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

function typeTitle(prefix, titles, typingSpeed, pauseBetweenTitles) {
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function updateTitle() {
    const currentTitle = titles[titleIndex];
    const displayedTitle = isDeleting
      ? prefix + currentTitle.substring(0, charIndex--)
      : prefix + currentTitle.substring(0, charIndex++);

    document.title = displayedTitle;

    if (!isDeleting && charIndex === currentTitle.length) {
      setTimeout(() => (isDeleting = true), pauseBetweenTitles);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }

    const timeout = isDeleting ? typingSpeed  : typingSpeed;
    setTimeout(updateTitle, timeout);
  }

  updateTitle();
}

const prefix = "MyGvp";
const titles = [""," - Created by Kumar", ""];

typeTitle(prefix, titles, 100, 20000);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
