let gameState = {
  score: 0,
  correct: 0,
  wrong: 0,
  level: 1,
  currentKey: "",
  timeLeft: 5000,
  gameActive: false,
  timer: null,
  timerInterval: null,
  gameMode: "mouse", // 'mouse', 'keyboard', або 'speed'
  timeLimit: 5000, // час на кожне натискання в мілісекундах
};

// Маппінг для фізичної клавіатури
const physicalKeyMap = {
  Escape: "Esc",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  Backquote: "'",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Digit0: "0",
  Minus: "-",
  Equal: "=",
  Backspace: "Backspace",
  Tab: "Tab",
  KeyQ: "Й",
  KeyW: "Ц",
  KeyE: "У",
  KeyR: "К",
  KeyT: "Е",
  KeyY: "Н",
  KeyU: "Г",
  KeyI: "Ш",
  KeyO: "Щ",
  KeyP: "З",
  BracketLeft: "Х",
  BracketRight: "Ї",
  Backslash: "\\",
  CapsLock: "Caps",
  KeyA: "Ф",
  KeyS: "І",
  KeyD: "В",
  KeyF: "А",
  KeyG: "П",
  KeyH: "Р",
  KeyJ: "О",
  KeyK: "Л",
  KeyL: "Д",
  Semicolon: "Ж",
  Quote: "Є",
  Enter: "Enter",
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  KeyZ: "Я",
  KeyX: "Ч",
  KeyC: "С",
  KeyV: "М",
  KeyB: "И",
  KeyN: "Т",
  KeyM: "Ь",
  Comma: "Б",
  Period: "Ю",
  Slash: ".",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  MetaLeft: "Win",
  MetaRight: "Win",
  AltLeft: "Alt",
  AltRight: "Alt",
  Space: "Space",
  ContextMenu: "Menu",
};
const keyboardLayout = [
  [
    "'",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "Backspace",
  ],
  ["Tab", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ї", "\\"],
  ["Caps", "Ф", "І", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Є", "Enter"],
  ["Shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ".", "Shift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Win", "Menu", "Ctrl"],
];

// Відображення клавіш для гравця (без підписів на клавішах)
const keyDisplayNames = {
  Esc: "Escape",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  Backspace: "Backspace",
  Tab: "Tab",
  Caps: "Caps Lock",
  Enter: "Enter",
  Shift: "Shift",
  Ctrl: "Ctrl",
  Alt: "Alt",
  Win: "Win",
  Menu: "Menu",
  Space: "Пробіл",
  "'": "Апостроф",
  "-": "Мінус",
  "=": "Дорівнює",
  "\\": "Слеш",
  ".": "Крапка",
};

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  // Показуємо клавіатуру в обох режимах
  keyboard.style.display = "inline-block";

  keyboardLayout.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach((keyText) => {
      const keyDiv = document.createElement("div");
      keyDiv.className = "key";
      // Не показуємо текст на клавішах - вони порожні
      keyDiv.textContent = "";
      keyDiv.dataset.key = keyText;

      // Додаємо спеціальні класи для розміру
      if (keyText === "Space") {
        keyDiv.classList.add("space");
      } else if (["Backspace", "Enter", "Shift"].includes(keyText)) {
        keyDiv.classList.add("wide");
      } else if (["Tab", "Caps"].includes(keyText)) {
        keyDiv.classList.add("extra-wide");
      } else if (keyText.startsWith("F") && keyText.length <= 3) {
        // F-клавіші трохи менші
        keyDiv.style.minWidth = "35px";
      } else if (keyText === "Esc") {
        keyDiv.style.minWidth = "35px";
      }

      // В режимі миші дозволяємо клік
      if (gameState.gameMode === "mouse") {
        keyDiv.onclick = () => handleKeyClick(keyText);
        keyDiv.style.cursor = "pointer";
      } else if (gameState.gameMode === "speed") {
        // В швидкісному режимі дозволяємо і мишку і клавіатуру
        keyDiv.onclick = () => handleKeyClick(keyText);
        keyDiv.style.cursor = "pointer";
      } else {
        // В режимі клавіатури забираємо курсор
        keyDiv.style.cursor = "default";
      }

      rowDiv.appendChild(keyDiv);
    });

    keyboard.appendChild(rowDiv);
  });
}

function getRandomKey() {
  const allKeys = keyboardLayout.flat();
  // Фільтруємо клавіші для гри - беремо літери, цифри та основні спеціальні клавіші
  const filteredKeys = allKeys.filter(
    (key) =>
      // Українські літери
      "ЙЦУКЕНГШЩЗХЇФІВАПРОЛДЖЄЯЧСМИТЬБЮ".includes(key) ||
      // Цифри
      "1234567890".includes(key) ||
      // Спеціальні символи
      ["-", "=", "\\", ".", "'"].includes(key) ||
      // Функціональні клавіші
      ["Space", "Enter", "Tab", "Shift", "Backspace", "Esc"].includes(key) ||
      // F-клавіші
      [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ].includes(key)
  );
  return filteredKeys[Math.floor(Math.random() * filteredKeys.length)];
}

function getKeyDisplayName(key) {
  return keyDisplayNames[key] || key;
}

function displayNewKey() {
  if (!gameState.gameActive) return;

  gameState.currentKey = getRandomKey();
  document.getElementById("targetKey").textContent = getKeyDisplayName(
    gameState.currentKey
  );

  // Скидання таймера з урахуванням режиму
  gameState.timeLeft = gameState.timeLimit;
  startTimer();
}

function startTimer() {
  clearInterval(gameState.timerInterval);

  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft -= 100;
    const percentage = (gameState.timeLeft / gameState.timeLimit) * 100;
    document.getElementById("timerFill").style.width = percentage + "%";

    if (gameState.timeLeft <= 0) {
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  gameState.wrong++;
  updateStats();
  clearInterval(gameState.timerInterval);

  // Анімація помилки для літери в завданні (час вийшов)
  const targetKeyElement = document.getElementById("targetKey");
  targetKeyElement.style.color = "#f44336";
  targetKeyElement.classList.add("shake");
  setTimeout(() => {
    targetKeyElement.style.color = "#ffeb3b";
    targetKeyElement.classList.remove("shake");
  }, 500);

  // Підсвітка правильної клавіші на віртуальній клавіатурі
  const correctKey = document.querySelector(
    `[data-key="${gameState.currentKey}"]`
  );
  if (correctKey) {
    correctKey.classList.add("correct");
    setTimeout(() => correctKey.classList.remove("correct"), 1000);
  }

  setTimeout(() => {
    if (gameState.wrong >= 5) {
      endGame();
    } else {
      displayNewKey();
    }
  }, 1000);
}

function handleKeyClick(clickedKey) {
  if (!gameState.gameActive) return;

  console.log(
    "Обробка натискання клавіші:",
    clickedKey,
    "Очікується:",
    gameState.currentKey
  );

  clearInterval(gameState.timerInterval);
  const keyElement = document.querySelector(`[data-key="${clickedKey}"]`);

  if (clickedKey === gameState.currentKey) {
    // Правильна відповідь
    gameState.correct++;

    // Подвійні очки в швидкісному режимі
    let baseScore = Math.max(100, Math.floor(gameState.timeLeft / 50));
    if (gameState.gameMode === "speed") {
      baseScore *= 2;
    }
    gameState.score += baseScore;

    // Підсвітка правильної клавіші на віртуальній клавіатурі
    if (keyElement) {
      keyElement.classList.add("correct");
      setTimeout(() => keyElement.classList.remove("correct"), 500);
    }

    // Підсвітка літери в завданні
    const targetKeyElement = document.getElementById("targetKey");
    targetKeyElement.style.color = "#4caf50";
    targetKeyElement.style.transform = "scale(1.2)";
    setTimeout(() => {
      targetKeyElement.style.color = "#ffeb3b";
      targetKeyElement.style.transform = "scale(1)";
    }, 500);

    // Збільшення рівня кожні 10 правильних відповідей
    if (gameState.correct % 10 === 0) {
      gameState.level++;
    }

    setTimeout(() => displayNewKey(), 500);
  } else {
    // Неправильна відповідь
    gameState.wrong++;

    // Підсвітка неправильної клавіші на віртуальній клавіатурі
    if (keyElement) {
      keyElement.classList.add("wrong");
      setTimeout(() => keyElement.classList.remove("wrong"), 500);
    }

    // Анімація помилки для літери в завданні
    const targetKeyElement = document.getElementById("targetKey");
    targetKeyElement.style.color = "#f44336";
    targetKeyElement.classList.add("shake");
    setTimeout(() => {
      targetKeyElement.style.color = "#ffeb3b";
      targetKeyElement.classList.remove("shake");
    }, 500);

    // Підсвітка правильної клавіші на віртуальній клавіатурі
    const correctKey = document.querySelector(
      `[data-key="${gameState.currentKey}"]`
    );
    if (correctKey) {
      correctKey.classList.add("correct");
      setTimeout(() => correctKey.classList.remove("correct"), 1000);
    }

    setTimeout(() => {
      if (gameState.wrong >= 5) {
        endGame();
      } else {
        displayNewKey();
      }
    }, 1000);
  }

  updateStats();
}

function updateStats() {
  document.getElementById("score").textContent = gameState.score;
  document.getElementById("correct").textContent = gameState.correct;
  document.getElementById("wrong").textContent = gameState.wrong;
  document.getElementById("level").textContent = gameState.level;
}

function startGame(mode = "mouse") {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  // Встановлюємо режим гри
  gameState.gameMode = mode;

  // Встановлюємо час в залежності від режиму
  if (mode === "speed") {
    gameState.timeLimit = 2000; // 2 секунди для швидкісного режиму
  } else {
    gameState.timeLimit = 5000; // 5 секунд для звичайних режимів
  }

  // Оновлюємо індикатор режиму
  const modeIndicator = document.getElementById("modeIndicator");
  if (mode === "mouse") {
    modeIndicator.innerHTML = "🖱️ Режим миші";
  } else if (mode === "keyboard") {
    modeIndicator.innerHTML = "⌨️ Режим клавіатури";
  } else if (mode === "speed") {
    modeIndicator.innerHTML = "⚡ Швидкісний режим";
  }

  // Скидання стану гри
  gameState.score = 0;
  gameState.correct = 0;
  gameState.wrong = 0;
  gameState.level = 1;
  gameState.currentKey = "";
  gameState.timeLeft = gameState.timeLimit;
  gameState.gameActive = true;
  gameState.timer = null;
  gameState.timerInterval = null;

  createKeyboard();
  updateStats();
  displayNewKey();
}

function endGame() {
  gameState.gameActive = false;
  clearInterval(gameState.timerInterval);

  const accuracy =
    gameState.correct + gameState.wrong > 0
      ? Math.round(
          (gameState.correct / (gameState.correct + gameState.wrong)) * 100
        )
      : 0;

  document.getElementById("finalScore").textContent = gameState.score;
  document.getElementById("accuracy").textContent = accuracy;
  document.getElementById("gameOver").style.display = "flex";
}

function restartGame() {
  document.getElementById("gameOver").style.display = "none";
  startGame(gameState.gameMode);
}

function showStart() {
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
}

// Обробка фізичної клавіатури
document.addEventListener("keydown", (e) => {
  console.log(
    "Клавішу натиснуто:",
    e.code,
    "Режим:",
    gameState.gameMode,
    "Активна:",
    gameState.gameActive
  );

  if (
    gameState.gameActive &&
    (gameState.gameMode === "keyboard" || gameState.gameMode === "speed")
  ) {
    e.preventDefault();

    const pressedKey = physicalKeyMap[e.code];
    console.log("Маппінг клавіші:", e.code, "->", pressedKey);

    if (pressedKey) {
      handleKeyClick(pressedKey);
    } else {
      console.log("Клавішу не знайдено в маппінгу:", e.code);
    }
    return false;
  } else if (gameState.gameActive && gameState.gameMode === "mouse") {
    // Блокуємо фізичну клавіатуру в режимі миші
    e.preventDefault();
    return false;
  }
});

// Заборона контекстного меню
document.addEventListener("contextmenu", (e) => e.preventDefault());
