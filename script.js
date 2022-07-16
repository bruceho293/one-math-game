/* If you're feeling fancy you can add interactivity
    to your site with Javascript */

// Class.
class Equation {
  constructor(lhs, rhs, op) {
    // lhs and rhs can be an Equation or Number
    this.lhs = lhs;
    this.rhs = rhs;
    this.op = op;
    this.parentheses = true; // Enforce brackets. Ex: (1 + 1) * 1
  }

  // Bug: Incorrect Result from calculateEquation() because of parentheses enforcements.
  // Status: Fixed
  calculateEquation() {
    let lhs_result = 0;
    let rhs_result = 0;

    if (this.lhs instanceof Equation) lhs_result = this.lhs.calculateEquation();
    else if (this.lhs instanceof Number) lhs_result = this.lhs.getValue();

    if (this.rhs instanceof Equation) rhs_result = this.rhs.calculateEquation();
    else if (this.rhs instanceof Number) rhs_result = this.rhs.getValue();

    let result = 0;
    switch (this.op) {
      case "+":
        result = lhs_result + rhs_result;
        break;
      case "-":
        result = lhs_result - rhs_result;
        break;
      case "*":
        result = lhs_result * rhs_result;
        break;
      case "/":
        // Check if rhs_result is Infinity.
        // If so, final result should be Undefined.
        // Since Underfined and Infiity are valuated the same, reassign the value to Infinity.
        if (rhs_result == Infinity) result = Infinity;
        else result = lhs_result / rhs_result;
        break;
      default:
        throw "Unsupported Operator.";
    }
    return result;
  }

  // Bug: Incorrect Result from calculateEquation() because of parentheses enforcements.
  // Status: Fixed
  getFinalResult() {
    let final_result = 0;
    try {
      final_result = this.calculateEquation();
      final_result = Math.abs(final_result);
      if (final_result >= 10) final_result -= 10;
      return final_result;
    } catch (e) {
      console.log(e);
    }
  }

  switchOperator() {
    if (this.lhs instanceof Equation && this.rhs instanceof Equation) {
      this.lhs.switchOperator();
      this.rhs.switchOperator();
    } else if (this.lhs instanceof Equation) this.lhs.switchOperator();
    else if (this.rhs instanceof Equation) this.rhs.switchOperator();
    else {
      // When both lhs and rhs are Numbers.
      if (this.op == "+") this.op = "-";
      if (this.op == "*") this.op = "/";
    }
  }

  // calculateEquationEval() {
  //   return Math.abs(eval(this.toString()));
  //   // return eval(this.toString());
  // }

  toString() {
    if (
      this.lhs instanceof Equation &&
      (this.lhs.op == "*" || this.lhs.op == "/") &&
      (this.op == "+" || this.op == "-")
    )
      this.lhs.parentheses = false;
    if (
      this.rhs instanceof Equation &&
      (this.rhs.op == "*" || this.rhs.op == "/") &&
      (this.op == "+" || this.op == "-")
    )
      this.rhs.parentheses = false;

    let left_bracket = "";
    let right_bracket = "";
    if (
      this.rhs instanceof Equation &&
      this.rhs.parentheses &&
      this.op == "-" &&
      this.rhs.op == "+" &&
      this.op == "/" &&
      this.rhs.op == "*" &&
      Math.random() >= 0.5
    ) {
      this.rhs.parentheses = false;
      if (this.op == "-" && this.rhs.op == "+") this.rhs.op = "-";
      if (this.op == "/" && this.rhs.op == "*") this.rhs.op = "/";

      if (this.rhs.lhs instanceof Equation) this.rhs.lhs.switchOperator();
      if (this.rhs.rhs instanceof Equation) this.rhs.rhs.switchOperator();
    }

    let lhs_expression = this.lhs.toString();
    let rhs_expression = this.rhs.toString();

    if (Math.random() >= 0.5 || this.parentheses) {
      left_bracket = "(";
      right_bracket = ")";
    }

    return `${left_bracket}${lhs_expression} ${this.op} ${rhs_expression}${right_bracket}`;
  }
}

class Number {
  constructor(v) {
    this.value = v;
  }

  setValue(v) {
    this.value = v;
  }

  getValue() {
    return this.value;
  }

  toString() {
    return this.value.toString();
  }
}

// Node in LinkedList to connect and form Equation and Number.
class Node {
  constructor(obj) {
    this.value = obj;
    this.next = undefined;
  }
}

// End of Custom Class.

// Constant values.
const OPERATORS = ["+", "-", "*", "/"];
const NUMBER = 1;

// Key for localStorage.
const LEVEL_KEY = "level";
const SOLVE_TIME_KEY = "sTime";
const GAME_TIME_KEY = "gTime";

// Dictionary for matching value-id for radio inputs.
const VALUE_TO_ID = {
  // Game Level
  5: "normal",
  6: "hard",
  7: "extreme",

  // Solve Time
  // 0.5: "0.5s",
  1: "1s",
  1.5: "1.5s",
  2: "2s",
  2.5: "2.5s",
  3: "3s",
  5: "5s",
  10: "10s",

  // Game Time
  10: "10s",
  15: "15s",
  20: "20s",
  25: "25s",
  30: "30s",
  60: "60s",
};

// The quantity of num 1s in the equation by default.
const MAX_NUM = 5;
const MIN_NUM = 3;

// All the time are in seconds.
const MIN_SOLVE_TIME = 0.5;
const MAX_SOLVE_TIME = 10.0;

const MIN_GAME_TIME = 10;
const MAX_GAME_TIME = 60;

// Defauly setup.
var currentNums = MAX_NUM;

function changeRadioSelected(id) {
  const radio = document.getElementById(id);
  radio.checked = true;
}

function getValueFromRadioInputs(name) {
  const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
  for (const radioButton of radioButtons) {
    if (radioButton.checked) return radioButton.value;
  }
}

// Reference: https://www.w3schools.com/graphics/game_sound.asp#:~:text=How%20to%20Add%20Sounds%3F,and%20music%20to%20your%20games.
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

var soundSrc =
  "https://cdn.glitch.global/79700202-9bb0-4a94-a27b-5285525350ec/Point.wav?v=1656871945671";
var pointSound;

var losingSoundSrc =
  "https://cdn.glitch.global/79700202-9bb0-4a94-a27b-5285525350ec/mixkit-8-bit-lose-2031.wav?v=1657740227535";
var losingSound;

function generateOperator() {
  let op_i = Math.floor(Math.random() * OPERATORS.length);
  return OPERATORS[op_i];
}

function generateEquation() {
  let num_qnty = Math.floor(Math.random() * (currentNums - MIN_NUM) + MIN_NUM);

  let equation;
  let operand = new Number(NUMBER);

  // 1 for Equation, 0 for Number
  let arr = new Array(num_qnty).fill(0);
  arr.forEach((part, index) => {
    if (Math.random() >= 0.5) arr[index] = 1;
  }, arr);

  let idx = 0;
  let head;
  let object =
    arr[idx] == 1
      ? new Equation(operand, operand, generateOperator())
      : new Number(NUMBER);
  idx = arr[idx] == 1 ? idx + 2 : idx + 1;
  head = new Node(object);
  let tail = head;
  // Create the LinkedList of Equations and Numbers.
  while (idx < num_qnty) {
    let object =
      arr[idx] == 1
        ? new Equation(operand, operand, generateOperator())
        : new Number(NUMBER);
    tail.next = new Node(object);
    tail = tail.next;
    idx = arr[idx] == 1 ? idx + 2 : idx + 1;
  }

  // Compress the LinkedList of Equations and Numbers into a single Equation.
  while (head.next != undefined) {
    let temp_head = head;
    while (temp_head != undefined) {
      if (Math.random() >= 0.5 && temp_head.next != undefined) {
        let lhs_obj = temp_head.value;
        let rhs_obj = temp_head.next.value;

        temp_head.next = temp_head.next.next;

        let swap = Math.random() >= 0.5;
        if (swap)
          temp_head.value = new Equation(rhs_obj, lhs_obj, generateOperator());
        else
          temp_head.value = new Equation(lhs_obj, rhs_obj, generateOperator());
      }
      temp_head = temp_head.next;
    }
  }
  equation = head.value;

  return equation;
}

function validatePlayerChoice(playerChoice, equationResult) {
  if (
    playerChoice == -1 &&
    (equationResult == NaN || equationResult == Infinity)
  )
    return true;
  return playerChoice == equationResult;
}

//Source: https://stackoverflow.com/a/31111035/13615736
function runTimerBar(id, duration, callback) {
  // Select the div which is a timer bar.
  let timerbar = document.getElementById(id);

  // Get the div that can change the width to show the countdown.
  let timerbarinner = timerbar.querySelector(".inner");

  // Set the timer bar animation
  timerbarinner.style.animationDuration = duration + "s";

  // Eventually couple a callback
  if (typeof callback === "function") {
    timerbarinner.addEventListener("animationend", callback);
  }

  // When everything is set up we start the animation
  timerbarinner.style.animationPlayState = "running";
}

function resetTimer(id) {
  let timerbar = document.getElementById(id);
  let timerbarinner = timerbar.querySelector(".inner");
  timerbarinner.style.animationName = "none";
  timerbarinner.style.animationPlayState = "paused";

  requestAnimationFrame(() => {
    setTimeout(() => {
      timerbarinner.style.animationName = "";
    });
  });
}

function generateScore(solve_time, game_time, max_ones) {
  let base_score = 100;
  let bonus_short_time = 250 * (3 / solve_time);
  let bonus_short_game_time = 100 * (30 / game_time);
  let bonus_max_ones = 100 * (max_ones - 4);

  return base_score + bonus_short_time + bonus_short_game_time + bonus_max_ones;
}

function showGuide() {
  const guide = document.getElementById("guide");

  function showModalBox() {
    window.location.href = "#guide-modal";
  }

  guide.addEventListener("click", showModalBox);
}

function startGame() {
  if (pointSound == null)
      pointSound = new sound(soundSrc);
  if (losingSound == null)
      losingSound = new sound(losingSoundSrc);

  let solveTime = parseInt(getValueFromRadioInputs("solve-timer-value"));
  let gameTime = parseInt(getValueFromRadioInputs("game-timer-value"));
  currentNums = parseInt(getValueFromRadioInputs("game-level"));

  let score = 0;
  let scoreGain = generateScore(solveTime, gameTime, currentNums);

  let equationBoard = document.getElementById("equation");
  let scoreBoard = document.getElementById("score");
  let btnStartGame = document.getElementById("btnStart");

  let gameOver = false;
  let gameStarted = false;
  let countDown = 3;
  let countDownTick = 0;

  let solveTimer = null;
  let gameTimer = null;
  let equation = null;
  let playerChoice = -2;
  let gameInterval = null;

  resetTimer("solve-timer");
  resetTimer("game-timer");

  scoreBoard.innerHTML = "Your Score: 0";

  function waitForPlayerChoice() {
    const inputDiv = document.getElementById("key-input");
    const inputs = inputDiv.getElementsByClassName("btn");
    for (let i = 0; i < inputs.length; i++) {
      let currentInput = inputs[i];
      let createSubmissionClick = function (row) {
        return function () {
          let value = row.getAttribute("data-value");
          playerChoice = value;
        };
      };

      currentInput.onclick = createSubmissionClick(currentInput);
    }
    // const board = document.getElementById("game-board");
    window.addEventListener("keydown", (event) => {
      if (event.isComposing || event.keyCode === 229) {
        return;
      }

      let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      if (
        event.key == "-" ||
        event.key == "." ||
        event.keyCode == 189 ||
        event.keyCode == 110
      )
        playerChoice = -1;
      if (event.keyCode && event.keyCode >= 96 && event.keyCode <= 105)
        playerChoice = event.keyCode - 96;
      else if (event.keyCode && event.keyCode >= 48 && event.keyCode <= 57)
        playerChoice = event.keyCode - 48;
      else if (keys.indexOf(event.key) > 0) playerChoice = event.key;
    });
  }

  function gameEnd() {
    losingSound.play();
    resetTimer("solve-timer");
    resetTimer("game-timer");
    gameOver = true;
    clearTimeout(solveTimer);
    clearTimeout(gameTimer);
    clearInterval(gameInterval);
    solveTimer = null;
    gameTimer = null;
    gameInterval = null;
    btnStartGame.disabled = false;
  }

  function gamePlay() {
    // Count down before the game starts.
    if (countDown != 0) {
      countDownTick += 5;
      if (countDownTick % 1000 == 0) {
        countDown -= 1;
        equationBoard.innerHTML = countDown;
      }
    } else {
      gameStarted = true;
    }

    // Generate new equation.
    if (gameStarted && !gameOver && equation == null) {
      equation = generateEquation();
      let result = equation.getFinalResult();
      while (
        result != NaN &&
        result != Infinity &&
        !(result == Math.round(result))
      ) {
        equation = generateEquation();
        result = equation.getFinalResult();
      }
      equationBoard.innerHTML = `${equation.toString()}`;
      // console.log("Correct Answer: " + result);
    }

    // If there's a timer and player give an answer.
    if (gameStarted && playerChoice != -2 && equation != null) {
      let rightAnswer = validatePlayerChoice(
        playerChoice,
        equation.getFinalResult()
      );
      if (rightAnswer) {
        score += scoreGain;
        pointSound.play();
        scoreBoard.innerHTML = "Your Score: " + score;
        resetTimer("solve-timer");
        clearTimeout(solveTimer);
        solveTimer = null;
      } else {
        gameEnd();
      }
      playerChoice = -2;
      equation = null;
    }

    // Start the timer for player to solve the equation.
    if (gameStarted && !gameOver && solveTimer == null) {
      runTimerBar("solve-timer", solveTime, resetTimer("solve-timer"));
      solveTimer = setTimeout(gameEnd, solveTime * 1000);
    }

    // Start the timer for the whole game session.
    if (gameStarted && !gameOver && gameTimer == null) {
      runTimerBar("game-timer", gameTime, resetTimer("game-timer"));
      gameTimer = setTimeout(gameEnd, gameTime * 1000);
    }
  }

  // Set Up
  waitForPlayerChoice();
  btnStartGame.disabled = true;
  equationBoard.innerHTML = countDown;
  gameInterval = setInterval(gamePlay, 5);
}

// Action
// handleValueChosen();
showGuide();

// Reference: https://stackoverflow.com/a/55384108
window.EventTarget.prototype.addDelegatedListener = function (
  type,
  delegateSelector,
  listener
) {
  this.addEventListener(type, function (event) {
    if (event.target && event.target.matches(delegateSelector)) {
      listener.call(event.target, event);
    }
  });
};

let parent = document.getElementById("configuration");
parent.addDelegatedListener("click", "input[type='radio']", function (event) {
  if (this.name == "game-level") localStorage.setItem(LEVEL_KEY, this.value);
  else if (this.name == "solve-timer-value")
    localStorage.setItem(SOLVE_TIME_KEY, this.value);
  else if (this.name == "game-timer-value")
    localStorage.setItem(GAME_TIME_KEY, this.value);
  else alert("Something went wrong while trying to save configuration");
});

window.onload = function () {
  if (localStorage.getItem(LEVEL_KEY) == null)
    localStorage.setItem(LEVEL_KEY, MAX_NUM);
  if (localStorage.getItem(SOLVE_TIME_KEY) == null)
    localStorage.setItem(SOLVE_TIME_KEY, MAX_SOLVE_TIME);
  if (localStorage.getItem(GAME_TIME_KEY) == null)
    localStorage.setItem(GAME_TIME_KEY, MAX_GAME_TIME);

  let level = localStorage.getItem(LEVEL_KEY);
  let playerSolveTime = localStorage.getItem(SOLVE_TIME_KEY);
  let playerGameTime = localStorage.getItem(GAME_TIME_KEY);

  let radioLevelId = VALUE_TO_ID[level];
  let radioSolveTimeId = VALUE_TO_ID[playerSolveTime];
  let radioGameTimeId = VALUE_TO_ID[playerGameTime];

  changeRadioSelected(radioLevelId);
  changeRadioSelected(radioSolveTimeId);
  changeRadioSelected(radioGameTimeId);
};

// Source: https://github.com/coding-in-public/light-dark/tree/main
// Theme setting
const themeBtn = document.querySelector(".theme");

function getCurrentTheme() {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  localStorage.getItem("game.theme")
    ? (theme = localStorage.getItem("game.theme"))
    : null;

  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(":root");
  if (theme === "light") {
    themeBtn.value = "Da";
  } else {
    themeBtn.value = "Li";
  }

  root.setAttribute("color-theme", `${theme}`);
  localStorage.setItem("game.theme", `${theme}`);
}

themeBtn.addEventListener("click", () => {
  let theme = getCurrentTheme();
  theme = theme === "dark" ? "light" : "dark";
  loadTheme(theme);
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentTheme());
});

if (location.protocol != 'https:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
