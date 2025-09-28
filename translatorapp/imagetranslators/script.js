const imageInput = document.getElementById("image-input");
const extractBtn = document.getElementById("extract-btn");
const sourceLangSelect = document.getElementById("source-language-select");
const targetLangSelect = document.getElementById("target-language-select");
const translateBtn = document.getElementById("translate-btn");
const speakBtn = document.getElementById("speak-btn");
const extractedTextElem = document.querySelector("#extracted-text .text");
const translatedTextElem = document.querySelector("#translated-text .text");

// Extract Text Using Tesseract.js
extractBtn.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please upload an image.");
    return;
  }

  const sourceLang = sourceLangSelect.value;

  extractedTextElem.textContent = "Extracting text...";
  Tesseract.recognize(file, sourceLang, {
    logger: info => console.log(info), // Logs OCR progress
  })
    .then(({ data: { text } }) => {
      extractedTextElem.textContent = text || "No text detected in the image.";
    })
    .catch(err => {
      console.error(err);
      alert("Error extracting text. Please try again.");
      extractedTextElem.textContent = "Error extracting text.";
    });
});

// Translate Text Using MyMemory API (No API Key Required)
translateBtn.addEventListener("click", async () => {
  const extractedText = extractedTextElem.textContent.trim();
  if (!extractedText) {
    alert("No text to translate.");
    return;
  }

  const targetLang = targetLangSelect.value;
  const sourceLang = sourceLangSelect.value;

  translatedTextElem.textContent = "Translating text...";

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        extractedText
      )}&langpair=${sourceLang}|${targetLang}`
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    translatedTextElem.textContent =
      result.responseData.translatedText || "No translation available.";
  } catch (err) {
    console.error(err);
    alert("Error translating text. Please try again.");
    translatedTextElem.textContent = "Error translating text.";
  }
});

// Text-to-Speech
speakBtn.addEventListener("click", () => {
  const translatedText = translatedTextElem.textContent.trim();
  if (!translatedText) {
    alert("No translated text to speak.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(translatedText);
  utterance.lang = targetLangSelect.value;
  window.speechSynthesis.speak(utterance);
});
