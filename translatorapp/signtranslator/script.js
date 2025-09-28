const textInput = document.getElementById('textInput');
const output = document.getElementById('output');
const voiceInputButton = document.getElementById('voiceInputButton');
const imageInput = document.getElementById('imageInput');
const processImageButton = document.getElementById('processImageButton');

// Map characters to gesture images
const signLanguageMap = {
  A: "gestures/a.jpg", B: 'gestures/b-sign-language-.webp', C: 'gestures/c1.jpg',
  D: 'gestures/d-sign-language-42c327b8-4712cc47-640w.webp', E: 'gestures/e1.jpg', F: 'gestures/f-sign-language-17795960-95b4d8f7-640w.webp',
  G: 'gestures/g1.jpg', H: 'gestures/h1.jpg', I: 'gestures/i1.jpg',
  J: 'gestures/j1.jpg', K: 'gestures/k1.jpg', L: 'gestures/l1.jpg',
  M: 'gestures/m1.jpg', N: 'gestures/n1.jpg', O: 'gestures/o-sign-language-4475ac86-949c93fc-640w.webp',
  P: 'gestures/p1.jpg', Q: 'gestures/q1.jpg', R: 'gestures/r1.jpg',
  S: 'gestures/magicwords.jpg', T: 'gestures/t1.jpg', U: 'gestures/u1.jpg',
  V: 'gestures/v1.jpg', W: 'gestures/w1.jpg', X: 'gestures/istockphoto-155224676-612x612.jpg',
  Y: 'gestures/finger-spelling-the-alphabet-in-american-sign-language-asl-letter-y-2BFHGA3.jpg', Z: 'gestures/z1.jpg'
};

// Function to update the translation
const updateTranslation = (text) => {
  const upperText = text.toUpperCase();
  output.innerHTML = ''; // Clear previous output

  // Translate each character
  for (let char of upperText) {
    if (signLanguageMap[char]) {
      const sign = document.createElement('div');
      sign.className = 'sign';

      // Create an image element for the gesture
      const img = document.createElement('img');
      img.src = signLanguageMap[char];
      img.alt = char;

      sign.appendChild(img);
      output.appendChild(sign);
    } else if (char === ' ') {
      const space = document.createElement('div');
      space.className = 'sign';
      space.textContent = '␣'; // Represent space
      output.appendChild(space);
    }
  }
};

// Update translation for text input
textInput.addEventListener('input', () => {
  updateTranslation(textInput.value);
});

// Voice input functionality
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

voiceInputButton.addEventListener('click', () => {
  recognition.start();
});

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  textInput.value = spokenText; // Update the textarea
  updateTranslation(spokenText); // Translate voice input
};

// Image processing functionality (OCR)
processImageButton.addEventListener('click', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      Tesseract.recognize(
        reader.result,
        'eng',
        { logger: (m) => console.log(m) }
      ).then(({ data: { text } }) => {
        textInput.value = text; // Update the textarea with extracted text
        updateTranslation(text); // Translate extracted text
      });
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image first.');
  }
});