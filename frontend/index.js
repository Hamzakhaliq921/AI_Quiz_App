let timerInterval;
let globaltopic = "";
let selectedQuestions = 5;
let selectedDifficulty = "easy";
let currentQuiz = [];

// =============================================
// ✅ BACKEND URL - Yahan apna Render URL daalo
// Local testing ke liye: http://localhost:3000
// Production ke liye: https://your-app.onrender.com
// =============================================
const BACKEND_URL = "http://localhost:3000";

function setQuestions(num) {
  selectedQuestions = num;
  document.getElementById("num").value = num;
  document.querySelectorAll(".mcq-buttons button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

document.addEventListener('DOMContentLoaded', function () {
  let input = document.getElementById('num')
  input.addEventListener('input', function () {
    const value = this.value
    console.log(value);
    if (value > 0 && value < 50) {
      selectedQuestions = value
      document.querySelectorAll(".mcq-buttons button")
        .forEach(btn => btn.classList.remove("active"));
    }
  });
});

function setDifficulty(format) {
  selectedDifficulty = format
  document.querySelectorAll(".difficulty-buttons button")
    .forEach(btn => btn.classList.remove("active"));
  event.target.classList.add('active')
}

// =============================================
// ✅ UPDATED - Ab API key backend pe hai
// Frontend se sirf topic, questions, difficulty
// bheja jata hai - key kabhi expose nahi hoti
// =============================================
async function generateAIQuiz(topic, numQuestions, difficulty) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic, numQuestions, difficulty })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server error");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    console.log("QUIZ DATA from backend:", data.quiz);
    return data.quiz;

  } catch (error) {
    console.error("Error:", error);

    // Helpful error messages
    if (error.message.includes("Failed to fetch")) {
      alert("❌ Server is not conntected!\nMake sure backend server is wording:\ncd backend && node server.js");
    } else {
      alert("❌ Quiz generate karne mein error: " + error.message);
    }
    return [];
  }
}

let startquiz = document.querySelector('.generate-btn');

startquiz.addEventListener('click', async function () {

  const topic = document.getElementById('topic').value.trim();
  globaltopic = topic;

  if (!topic) {
    alert("Please enter a topic");
    return;
  }

  document.getElementById("loader").style.display = "flex";
  document.getElementById("quiz-container").innerHTML = "";

  const quiz = await generateAIQuiz(topic, selectedQuestions, selectedDifficulty);

  document.getElementById("loader").style.display = "none";

  if (!quiz || quiz.length === 0) return;

  document.getElementById("home").style.display = "none";
  document.getElementById("quiz-page").style.display = "block";

  console.log("QUIZ DATA:", quiz);
  currentQuiz = quiz;

  // Download button ka text update karo topic ke saath
  document.getElementById("download-btn").innerText = `⬇ Download ${globaltopic} Report`;

  displayQuiz(quiz);
});

function displayQuiz(quiz) {
  const container = document.getElementById('quiz-container');
  container.innerHTML = "";
  if (!quiz || quiz.length === 0) {
    container.innerHTML = "<h3>No quiz generated ❌</h3>";
    return;
  }
  quiz.forEach((q, index) => {

    let html = `
      <div class="question" style="display:none;">
        <p><b>Q${index + 1}: ${q.question}</b></p>
    `;

    q.options.forEach(opt => {
      html += `
        <label>
          <input type="radio" name="q${index}" value="${opt}" >
          ${opt}
        </label><br>
      `;
    });

    html += `</div><hr>`;
    container.innerHTML += html;

  });
}

let starttime = document.getElementById('start-quiz-btn')
starttime.addEventListener('click', function () {

  document.querySelectorAll(".question").forEach(q => {
    q.style.display = "block";
  });

  const timerBox = document.getElementById("timer-box");
  timerBox.style.display = "block";
  document.getElementById("submit-btn").style.display = "inline-block";

  this.style.display = "none";
  let totalTime = currentQuiz.length * 15;

  startTimer(totalTime);
})

function startTimer(time) {

  const timerDisplay = document.getElementById("timer");
  const timerBox = document.getElementById("timer-box");

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    timerDisplay.innerText = `${time}s`;
    if (time <= 10) {
      timerBox.classList.add("timer-warning");
    }
    time--;

    if (time < 0) {
      clearInterval(timerInterval);
      alert("⏰ Time's up! Auto submitting...");
      document.getElementById("submit-btn").click();
    }

  }, 1000);
}

document.getElementById("submit-btn").addEventListener("click", function () {

  clearInterval(timerInterval);

  this.classList.add("glow-btn");

  setTimeout(() => {
    this.classList.remove("glow-btn");
  }, 1200);

  let score = 0;

  currentQuiz.forEach((q, index) => {

    const options = document.querySelectorAll(`input[name="q${index}"]`);
    const selected = document.querySelector(`input[name="q${index}"]:checked`);

    if (selected && selected.value === q.answer) {
      score++;
    }

    options.forEach(input => {
      const label = input.parentElement;
      label.classList.remove("correct", "wrong");

      if (input.value === q.answer) label.classList.add("correct");
      if (input.checked && input.value !== q.answer) label.classList.add("wrong");
    });

  });

  const resultText = document.getElementById("result");
  resultText.innerText = `🎯 Your Score: ${score} / ${currentQuiz.length}`;

  if (score === currentQuiz.length) {
    resultText.innerText += "\n🏆 Perfect Score!";

    const sound = new Audio('audio/successsound.mp3');
    sound.volume = 0.9;
    sound.play().catch(err => console.log(err));

    if (window.confetti) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        zIndex: 1001
      });
    }
  }

  document.getElementById("download-btn").style.display = "block";
  document.getElementById("downloadblank-Quiz-btn").style.display = "inline-block";
});

// =============================================
// PDF DOWNLOAD - Answer Report
// =============================================
let downloadbtn = document.getElementById("download-btn");
downloadbtn.addEventListener("click", generatePDF);

function generatePDF() {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${globaltopic}` + " QUIZ REPORT", 105, y, { align: "center" });

  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Topic: ${globaltopic}`, 10, y);
  y += 7;

  doc.text(`Total Questions: ${currentQuiz.length}`, 10, y);
  y += 10;

  doc.line(10, y, 200, y);
  y += 10;

  currentQuiz.forEach((q, index) => {

    doc.setFontSize(10);
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 180, 290);

    if (y > 260) {
      doc.addPage();
      y = 15;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Q${index + 1}. ${q.question}`, 10, y);
    y += 8;

    doc.setFont("times", "normal");

    const labels = ["A", "B", "C", "D"];

    q.options.forEach((opt, i) => {
      doc.text(`${labels[i]}) ${opt}`, 12, y);
      y += 6;
    });

    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const selectedAnswer = selected ? selected.value : "Not Answered";

    y += 2;

    doc.setTextColor(0, 128, 0);
    doc.text(`✔ Correct: ${q.answer}`, 10, y);
    y += 6;

    if (selectedAnswer !== q.answer) {
      doc.setTextColor(255, 0, 0);
    } else {
      doc.setTextColor(0, 128, 0);
    }

    doc.text(`Your Answer: ${selectedAnswer}`, 10, y);
    y += 8;

    doc.setTextColor(0, 0, 0);
    doc.line(10, y, 200, y);
    y += 8;

  });

  doc.save(`${globaltopic}_quiz-report.pdf`);
};

// =============================================
// PDF DOWNLOAD - Blank Quiz
// =============================================
document.getElementById("downloadblank-Quiz-btn").addEventListener("click", function () {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${globaltopic}` + " QUIZ ", 105, y, { align: "center" });

  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Topic: ${globaltopic}`, 10, y);
  y += 7;

  doc.text(`Total Questions: ${currentQuiz.length}`, 10, y);
  y += 10;

  doc.line(10, y, 200, y);
  y += 10;

  currentQuiz.forEach((q, index) => {

    if (y > 260) {
      doc.addPage();
      y = 15;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Q${index + 1}. ${q.question}`, 10, y);
    y += 8;

    doc.setFont("times", "normal");

    const labels = ["A", "B", "C", "D"];

    q.options.forEach((opt, i) => {
      const cleanText = opt.replace(/&/g, "");
      doc.text(`${labels[i]}) ${cleanText}`, 12, y);
      y += 7;
    });

    y += 5;
    doc.line(10, y, 200, y);
    y += 10;

  });

  doc.save(`${globaltopic}_blank-quiz.pdf`);
});