// Voice recognition and translation
const startBtn = document.getElementById("start-btn");
const inputLangSelect = document.getElementById("input-lang-select");
const languageSelect = document.getElementById("language-select");
const inputText = document.querySelector("#input-text .text");
const outputText = document.querySelector("#output-text .text");

// Initialize Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = false;

startBtn.addEventListener("click", () => {
  // Set the recognition language dynamically
  const inputLang = inputLangSelect.value;
  recognition.lang = inputLang;

  recognition.start();
});

// When speech is recognized
recognition.addEventListener("result", async (event) => {
  const spokenText = event.results[0][0].transcript;
  inputText.textContent = spokenText;

  // Get the selected target language
  const targetLang = languageSelect.value;

  // Translate the text
  const translatedText = await translateText(spokenText, targetLang);
  outputText.textContent = translatedText;
});

// Translation using Google Translate API
async function translateText(text, targetLang) {
  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data[0][0][0]; // Extract translated text
  } catch (error) {
    console.error("Translation failed:", error);
    return "Translation Error!";
  }
}

// Handle errors
recognition.addEventListener("error", (event) => {
  console.error("Speech recognition error:", event.error);
  alert("Speech recognition failed. Please try again.");
});