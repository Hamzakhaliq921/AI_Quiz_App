<img width="389" height="59" alt="image" src="https://github.com/user-attachments/assets/6fc01362-241e-4b50-9da2-9d355685026f" />
<img width="892" height="536" alt="image" src="https://github.com/user-attachments/assets/3fd7aa02-2037-4c5b-9a06-1c245f001a49" />
<img width="784" height="473" alt="image" src="https://github.com/user-attachments/assets/8084adbd-6c52-418a-b41c-666b2b61613b" />
<img width="993" height="311" alt="image" src="https://github.com/user-attachments/assets/b1b728e1-7a54-4032-a6cb-f6121513ee1d" />
<img width="1326" height="718" alt="image" src="https://github.com/user-attachments/assets/affa09be-c24e-450d-8031-9839af5c4b50" />
<img width="1143" height="612" alt="image" src="https://github.com/user-attachments/assets/54f1f9db-da35-4c4c-83b3-fb3284da6d4c" />



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
- **Secure Backend API** — API key is hidden on the server, never exposed in the browser
- **Node.js + Express Server** — Handles all AI requests safely
- **Environment Variables** — API key stored in `.env` file, not in code

---

## 📁 Project Structure

```
ai-quiz-generator/
├── frontend/
│   ├── index.html              # Main HTML structure
│   ├── style.css               # All styles and animations
│   ├── index.js                # Core quiz logic (now calls backend)
│   └── audio/
│       └── successsound.mp3    # Celebration sound for perfect scores
├── backend/
│   ├── server.js               # Express server (handles API key securely)
│   ├── .env                    # Secret API key — NEVER push this!
│   ├── .env.example            # Template for contributors
│   ├── .gitignore              # Hides .env and node_modules from GitHub
│   └── package.json            # Node dependencies
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-quiz-generator.git
cd ai-quiz-generator
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Configure API Key

Create a `.env` file inside the `backend/` folder:

```env
OPENROUTER_API_KEY=your-actual-api-key-here
PORT=3000
```

> 🔑 Get your free API key at [openrouter.ai](https://openrouter.ai)  
> ⚠️ Never share or commit this file to GitHub!

### 4. Start the Backend Server

```bash
node server.js
# ✅ Server running on http://localhost:3000
```

### 5. Open the Frontend

Open `frontend/index.html` in your browser — the app is ready!

---

## 🛠️ How It Works

1. **Enter a topic** in the input field (e.g., *JavaScript*, *World War II*, *Biology*)
2. **Select the number of questions** using the preset buttons or the custom input
3. **Choose a difficulty** — Easy, Medium, or Hard
4. **Click "Generate Quiz"** — Request goes to your backend, which calls the AI securely
5. **Press "Start Quiz"** to reveal questions and begin the countdown timer
6. **Submit your answers** before time runs out
7. **View your score** and download a PDF report

---

## 🔐 How the Backend Works

```
Browser → Backend Server → .env (API key hidden) → OpenRouter
```

The frontend sends only the topic, number of questions, and difficulty to the backend. The backend uses the secret API key stored in `.env` to call OpenRouter — the key is never sent to the browser.

---

## 🤖 AI Model

This app uses **Mistral Small 3.2 24B Instruct** via [OpenRouter](https://openrouter.ai), which generates structured JSON quiz data based on your topic and difficulty settings.

---

## 📦 Dependencies

### Frontend (CDN — no install needed)

| Library | Purpose |
|---|---|
| jsPDF | PDF generation and download |
| canvas-confetti | Confetti animation on perfect score |

### Backend (npm)

| Package | Purpose |
|---|---|
| express | Web server framework |
| cors | Allows frontend to talk to backend |
| dotenv | Loads API key from `.env` file |
| node-fetch | Makes API calls to OpenRouter |

---

## 📄 PDF Export

After submitting the quiz, two download options appear:

- **📄 Download Report** — Full PDF with questions, your answers, and correct answers highlighted
- **⬇ Download Blank Quiz** — Clean PDF with questions and options only (no answers), perfect for printing

---

## ⚙️ Configuration Options

| Setting | Values | Default |
|---|---|---|
| Number of Questions | 1–40 | 5 |
| Difficulty | Easy / Medium / Hard | Easy |
| Timer | 15 seconds × number of questions | Auto |

---

## 🌐 Deployment

### Backend → Render.com (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo and set these options:
   ```
   Root Directory:  backend
   Build Command:   npm install
   Start Command:   node server.js
   ```
4. Add Environment Variable in Render dashboard:
   ```
   OPENROUTER_API_KEY = your-actual-api-key
   ```
5. Deploy → you get a live URL:
   ```
   https://your-app.onrender.com
   ```

### Frontend → GitHub Pages / Netlify

Before deploying frontend, update `BACKEND_URL` in `index.js`:

```javascript
// Change this one line in index.js
const BACKEND_URL = "https://your-app.onrender.com";
```

Then deploy the `frontend/` folder via GitHub Pages or Netlify drag & drop.

### Full Deployment Flow

```
User Browser → GitHub Pages (Frontend) → Render.com (Backend) → OpenRouter API
```

---


## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Hamza Khaliq**

> ⭐ If you found this project helpful, please give it a star on GitHub!
