const ELEMENT_INPUT_BASE_NUMBER = document.getElementById("baseNumber");
const ELEMENT_INPUT_ANSWER = document.getElementById("answerInput");
const ELEMENT_CONTAINER_DONE_TASKS = document.getElementById("doneTasksBlock");
const ELEMENT_CONTAINER_CURRENT_TASK =
  document.getElementById("currentTaskBlock");
const ELEMENT_CONTAINER_COMPLETED_TASKS =
  document.getElementById("completedTaskBlock");
const ELEMENT_BUTTON_START = document.getElementById("startButton");
const ELEMENT_BUTTON_CHECK = document.getElementById("checkButton");
const ELEMENT_CONTAINER_ALL_TASKS = document.getElementById("taskSection");
const TEXT_CURRENT_TASK = document.getElementById("taskText");
const ELEMENT_CONTAINER_HITS = document.getElementById("containerHints");

let currentMultiplier;
let baseNumber;
const MAX_MULTIPLIER = 10;

// Инициализация приложения
function inittEvents() {
  ELEMENT_INPUT_BASE_NUMBER.addEventListener("input", () => {
    validateAnswerInput();
    baseNumber = parseInt(ELEMENT_INPUT_BASE_NUMBER.value);
  });

  ELEMENT_INPUT_ANSWER.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      checkAnswer(baseNumber, currentMultiplier);
    }
  });
  ELEMENT_INPUT_BASE_NUMBER.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      validateAnswerInput();
      baseNumber = parseInt(ELEMENT_INPUT_BASE_NUMBER.value);
    }
  });
  ELEMENT_INPUT_ANSWER.addEventListener("input", () => {
    validateAnswerInput();
  });
  ELEMENT_BUTTON_START.addEventListener("click", startExercise);
  ELEMENT_BUTTON_CHECK.addEventListener("click", () =>
    checkAnswer(baseNumber, currentMultiplier)
  );
}
// Начало упражнения и проверка значений, настройка условий
const startExercise = () => {
  currentMultiplier = 1;
  if (
    isNaN(baseNumber) ||
    isNaN(MAX_MULTIPLIER) ||
    baseNumber <= 0 ||
    baseNumber > MAX_MULTIPLIER ||
    MAX_MULTIPLIER <= 0
  ) {
    alert("Please enter correct values.");
    ELEMENT_INPUT_BASE_NUMBER.value = "";
    return;
  }
  addHints(baseNumber);
  ELEMENT_INPUT_ANSWER.focus();
  showExercises();
};
// Показывает нашу текущую задачу - пример.
function showCurrentTask() {
  taskText.textContent = `${baseNumber} x ${currentMultiplier} = `;
  toToggleDisabledElements([ELEMENT_BUTTON_CHECK], "true");
}
// Функция для отображения самого упражнения, для начала решения
function showExercises() {
  toDisplayElements(
    [
      ELEMENT_CONTAINER_ALL_TASKS,
      ELEMENT_CONTAINER_CURRENT_TASK,
      ELEMENT_BUTTON_CHECK,
    ],
    "flex"
  );
  toToggleDisabledElements(
    [ELEMENT_BUTTON_START, ELEMENT_INPUT_BASE_NUMBER],
    true
  );
  toAnimateElement(ELEMENT_CONTAINER_CURRENT_TASK);
  showCurrentTask();
}
// Управление активностью элементов
function toToggleDisabledElements(ArrayElements, isDisbaled) {
  if (Array.isArray(ArrayElements) || ArrayElements.length !== 0) {
    ArrayElements.forEach((element) => (element.disabled = isDisbaled));
  }
}
// Управление отображением элементов
function toDisplayElements(ArrayElements, propertyDisplay) {
  if (Array.isArray(ArrayElements)) {
    ArrayElements.forEach(
      (element) => (element.style.display = propertyDisplay)
    );
  }
}
// Проверка решения
function checkAnswer(number, multiplier) {
  const usersAnswer = parseInt(ELEMENT_INPUT_ANSWER.value);
  const correctAnswer = number * multiplier;
  if (usersAnswer === correctAnswer) {
    currentMultiplier++;
    toAddDoneTasks(number, multiplier, correctAnswer);
    toAnimateElement(ELEMENT_CONTAINER_CURRENT_TASK);
    toggleClassButtonDone(true);
    toResetAnswer("right", 1000);
    addHints(baseNumber, multiplier);
  } else {
    toResetAnswer("wrong", 1000);
    toggleClassButtonDone(false);
  }
  toCheckMultiplier();
}
// Управлением состоянием кнопки DONE
function toggleClassButtonDone(isCorrect) {
  const resultClass = isCorrect ? "right" : "wrong";
  ELEMENT_BUTTON_CHECK.classList.add(resultClass);
  setTimeout(function () {
    ELEMENT_BUTTON_CHECK.classList.remove(resultClass);
  }, 500);
}
// Изменение состояния инпута при фокусе и рассфокусе и реакция на проверку решения.
function toResetAnswer(className, delay) {
  ELEMENT_INPUT_ANSWER.classList.add(className);
  if (className === "right") {
    clearValueInput(className);
    toToggleDisabledElements([ELEMENT_BUTTON_CHECK], true);
  } else if (className === "wrong") {
    setTimeout(function () {
      clearValueInput(className);
    }, delay);
  }
}
// Очистка значения и изменения состояния кнопки для проверки результата
function clearValueInput(className) {
  ELEMENT_INPUT_ANSWER.classList.remove(className);
  toToggleDisabledElements([ELEMENT_BUTTON_CHECK], true);
  ELEMENT_INPUT_ANSWER.value = "";
  ELEMENT_INPUT_ANSWER.focus();
}
// Для анамации появления инпута для ввода - решения на текущую задачу
function toAnimateElement(element) {
  element.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 500,
    fill: "forwards",
    easing: "ease-in-out",
  });
}
// Проверяем множитель - для остановки отображения новых задач
function toCheckMultiplier() {
  if (currentMultiplier > MAX_MULTIPLIER) finishExercise();
}
// Добавляем решенную задачу в блок для выполненных задач и показываем следующую задачу.
function toAddDoneTasks(number, multiplier, answer) {
  const doneTask = document.createElement("p");
  doneTask.classList.add("doneTask");
  doneTask.textContent = `${number} x ${multiplier} = ${answer}`;
  ELEMENT_CONTAINER_COMPLETED_TASKS.appendChild(doneTask);
  showCurrentTask();
}
// Закончить задачу и обнулить значения и поля
function finishExercise() {
  ELEMENT_CONTAINER_COMPLETED_TASKS.innerHTML = "";
  ELEMENT_CONTAINER_HITS.innerHTML = "";
  ELEMENT_INPUT_BASE_NUMBER.value = "";
  baseNumber = undefined;
  toDisplayElements(
    [ELEMENT_CONTAINER_ALL_TASKS, ELEMENT_BUTTON_CHECK],
    "none"
  );
  toToggleDisabledElements(
    [ELEMENT_BUTTON_START, ELEMENT_INPUT_BASE_NUMBER],
    false
  );
}
function validateAnswerInput() {
  if (ELEMENT_INPUT_ANSWER.value !== "" && !isNaN(ELEMENT_INPUT_ANSWER.value)) {
    ELEMENT_BUTTON_CHECK.disabled = false;
  } else {
    ELEMENT_BUTTON_CHECK.disabled = true;
  }
}
function addHints(numbersDiv, currentMultiplier) {
  if (currentMultiplier >= MAX_MULTIPLIER) return;
  const ELEMENT_CONTAINER_FOR_HINTS = document.getElementById("containerHints");

  const ELEMENT_HINT = document.createElement("div");
  ELEMENT_HINT.setAttribute("id", "hints");

  let fragment = document.createDocumentFragment();
  for (let i = 0; i < numbersDiv; i++) {
    let colorBlock = document.createElement("div");
    colorBlock.setAttribute("id", "colorBlock");
    fragment.appendChild(colorBlock);
  }

  ELEMENT_HINT.appendChild(fragment);
  ELEMENT_CONTAINER_FOR_HINTS.appendChild(ELEMENT_HINT);
}

document.addEventListener("DOMContentLoaded", () => {
  inittEvents();
});
