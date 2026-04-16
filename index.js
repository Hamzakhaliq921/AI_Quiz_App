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
});


// i copy prompt from ui library 21st.dev and create using claude and ai tools
 (function () {
  const canvas = document.getElementById('boxes-bg');
  const ctx = canvas.getContext('2d');

  const CELL_W = 64, CELL_H = 32;
  const colors = [
    'rgb(125,211,252)',
    'rgb(249,168,212)',
    'rgb(134,239,172)',
    'rgb(253,224,71)',
    'rgb(216,180,254)',
    'rgb(147,197,253)',
    'rgb(165,180,252)',
    'rgb(196,181,253)',
  ];
  const BORDER = 'rgba(51,65,85,0.8)';

  const SKEW_X = -Math.tan((48 * Math.PI) / 180);
  const SKEW_Y = Math.tan((14 * Math.PI) / 180);
  const SCALE = 0.675;

  let cells = [], cols, rows;
  let originX, originY;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    originX = canvas.width * 0.25;
    originY = -canvas.height * 0.15;

    cols = Math.ceil((canvas.width * 2) / CELL_W) + 4;
    rows = Math.ceil((canvas.height * 2.5) / CELL_H) + 4;

    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          r, c,
          alpha: 0,
          color: colors[0],
          active: false,
          timer: 0
        });
      }
    }
  }

  function cellToScreen(c, r) {
    const lx = c * CELL_W;
    const ly = r * CELL_H;
    const sx = originX + (lx * SCALE + ly * SKEW_X * SCALE);
    const sy = originY + (lx * SKEW_Y * SCALE + ly * SCALE);
    return { sx, sy };
  }

  function screenToCell(mx, my) {
    const tx = mx - originX;
    const ty = my - originY;
    const det = SCALE * SCALE - SKEW_X * SCALE * SKEW_Y * SCALE;
    const invA = SCALE / (SCALE * SCALE);
    const invB = -SKEW_X * SCALE / (SCALE * SCALE);
    const invC = -SKEW_Y * SCALE / (SCALE * SCALE);
    const invD = SCALE / (SCALE * SCALE);
    const lx = invA * tx + invB * ty;
    const ly = invC * tx + invD * ty;
    const c = Math.floor(lx / CELL_W);
    const r = Math.floor(ly / CELL_H);
    return { c, r };
  }

  canvas.style.pointerEvents = 'auto';

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { c, r } = screenToCell(mx, my);

    for (const cell of cells) {
      if (cell.c === c && cell.r === r) {
        cell.active = true;
        cell.alpha = 1;
        cell.timer = 200;
        cell.color = colors[Math.floor(Math.random() * colors.length)];
        break;
      }
    }
  });

  function draw() {
    canvas.width = canvas.width;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(originX, originY);
    ctx.transform(SCALE, SKEW_Y * SCALE, SKEW_X * SCALE, SCALE, 0, 0);

    for (const cell of cells) {
      const x = cell.c * CELL_W;
      const y = cell.r * CELL_H;

      if (cell.active) {
        cell.timer += 16;
        if (cell.timer < 600) {
          cell.alpha = 1;
        } else if (cell.timer < 1000) {
          cell.alpha = 1 - (cell.timer - 600) / 400;
        } else {
          cell.active = false;
          cell.alpha = 0;
        }

        if (cell.alpha > 0) {
          ctx.globalAlpha = cell.alpha;
          ctx.fillStyle = cell.color;
          ctx.fillRect(x, y, CELL_W, CELL_H);
          ctx.globalAlpha = 1;
        }
      }

      ctx.strokeStyle = BORDER;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x, y, CELL_W, CELL_H);

      if (cell.r % 2 === 0 && cell.c % 2 === 0) {
        ctx.strokeStyle = 'rgba(51,65,85,0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x + CELL_W / 2, y + 4);
        ctx.lineTo(x + CELL_W / 2, y + CELL_H - 4);
        ctx.moveTo(x + 4, y + CELL_H / 2);
        ctx.lineTo(x + CELL_W - 4, y + CELL_H / 2);
        ctx.stroke();
      }
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();