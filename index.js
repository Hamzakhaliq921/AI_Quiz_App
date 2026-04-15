let timerInterval;
let selectedQuestions = 5;
let selectedDifficulty = "easy";
let currentQuiz = [];
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

async function generateAIQuiz(topic, numQuestions, difficulty) {

  const systemPrompt = `
You are a quiz generator AI.

Generate ${numQuestions} multiple-choice questions.

Rules:
- Topic: ${topic}
- Difficulty: ${difficulty}
- Each question must have 4 options
- Only ONE correct answer
- Format strictly like JSON
Return ONLY raw JSON array.
No explanation.
No markdown.

NO missing fields allowed.

Return format:
[
  {
   "question": "",
    "options": ["A", "B", "C", "D"],
    "answer": "exact option text"
  }
]


Return format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]
`;
  try {
    const response = await fetch(CONFIG.OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CONFIG.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-OpenRouter-Title": "AI Quiz Generator"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-small-3.2-24b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate quiz on ${topic}` }
        ]
      })
    });
    const data = await response.json();
    let content = data.choices[0].message.content;

    console.log("RAW AI:", content);

    // remove markdown
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();

    // extract JSON array
    let start = content.indexOf("[");
    let end = content.lastIndexOf("]") + 1;

    if (start === -1 || end === 0) {
      throw new Error("Invalid AI response");
    }

    let clean = content.slice(start, end);

    const quizdata = JSON.parse(clean);

    return quizdata;
  } catch (error) {
    console.error("AI Error:", error);
    alert("Failed to generate quiz");
    return [];
  }
}

let startquiz = document.querySelector('.generate-btn');

startquiz.addEventListener('click', async function () {

  const topic = document.getElementById('topic').value;

  if (!topic) {
    alert("Please enter a topic");
    return;
  }

  document.getElementById("loader").style.display = "flex";
  document.getElementById("quiz-container").innerHTML = "";

  const quiz = await generateAIQuiz(topic, selectedQuestions, selectedDifficulty);

  document.getElementById("loader").style.display = "none";
  document.getElementById("home").style.display = "none";
  document.getElementById("quiz-page").style.display = "block";

  console.log("QUIZ DATA:", quiz);
  currentQuiz = quiz;
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

  document.getElementById("result").innerText =
    `🎯 Your Score: ${score} / ${currentQuiz.length}`;
});