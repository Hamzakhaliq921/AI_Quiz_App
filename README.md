
# 🧠 AI Quiz Generator

An intelligent, browser-based quiz application that generates custom multiple-choice questions on any topic using AI — complete with a live timer, instant scoring, and PDF export.

---

## ✨ Features

- **AI-Powered Question Generation** — Enter any topic and get unique MCQs instantly  
- **Customizable Quiz Settings** — Choose 5, 10, 15, or 20 questions, or enter a custom number (up to 50)  
- **Three Difficulty Levels** — Easy, Medium, and Hard  
- **Live Countdown Timer** — Auto-submits when time runs out (15 seconds per question)  
- **Instant Results & Feedback** — Color-coded correct/wrong answers after submission  
- **Confetti Celebration** — Perfect score triggers a confetti animation 🎉  
- **PDF Export** — Download a full quiz report (with answers) or a blank quiz sheet  
- **Smooth Animations** — Questions fade in with staggered slide-up animations  
- **Fully Responsive** — Works on desktop and mobile  

---

## 📁 Project Structure

```

ai-quiz-generator/
├── index.html           # Main HTML structure
├── style.css            # All styles and animations
├── index.js             # Core quiz logic (generation, timer, scoring, PDF)
├── config.js            # API configuration (keys & endpoints)
└── audio/
└── successsound.mp3 # Celebration sound for perfect scores

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-quiz-generator.git
cd ai-quiz-generator
````

### 2. Configure the API

Create a `config.js` file in the root directory:

```javascript
const CONFIG = {
  OPENROUTER_API_URL: "https://openrouter.ai/api/v1/chat/completions",
  OPENROUTER_API_KEY: "your-openrouter-api-key-here"
};
```

> 🔑 Get your free API key at [https://openrouter.ai](https://openrouter.ai)

### 3. Run the App

Open `index.html` directly in your browser — no build step or server required.

```bash
# Option 1: Open directly
open index.html
```

---

## 🛠️ How It Works

1. **Enter a topic** in the input field (e.g., *JavaScript*, *World War II*, *Biology*)
2. **Select the number of questions** using the preset buttons or the custom input
3. **Choose a difficulty** — Easy, Medium, or Hard
4. **Click "Generate Quiz"** — The AI generates your questions via the OpenRouter API
5. **Press "Start Quiz"** to reveal questions and begin the countdown timer
6. **Submit your answers** before time runs out
7. **View your score** and download a PDF report

---

## 🤖 AI Model

This app uses **Mistral Small 3.2 24B Instruct** via OpenRouter, which generates structured JSON quiz data based on your topic and difficulty settings.

---

## 📦 Dependencies

All dependencies are loaded via CDN — no `npm install` needed.

| Library         | Purpose                             |
| --------------- | ----------------------------------- |
| jsPDF           | PDF generation and download         |
| canvas-confetti | Confetti animation on perfect score |
| OpenRouter API  | AI quiz question generation         |

---

## 📄 PDF Export

After submitting the quiz, two download options appear:

* **📄 Download Report** — Full PDF with questions, your answers, and correct answers highlighted
* **⬇ Download Blank Quiz** — Clean PDF with questions and options only (no answers), perfect for printing

---

## ⚙️ Configuration Options

| Setting             | Values                           | Default |
| ------------------- | -------------------------------- | ------- |
| Number of Questions | 1–Custom Number                  | 5       |
| Difficulty          | Easy / Medium / Hard             | Easy    |
| Timer               | 15 seconds × number of questions | Auto    |

---

## 🔒 Security Note

Never commit your `config.js` with a real API key to a public repository. Add it to `.gitignore`:

```
# .gitignore
config.js
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Hamza Khaliq
