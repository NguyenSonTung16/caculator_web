// --- DOM Elements ---
const resultBox = document.getElementById("result");
const expr = document.getElementById("expression");
const historyList = document.getElementById("historyList");
const notification = document.getElementById("notification");

// --- State ---
let current = "";
let previous = "";
let operator = null;
let resetOnNextInput = false;
let justCalculated = false;  //AI assisted: track if last action was calculation

// --- ASSIGN EVENT TO BUTTON --- AI-assisted with code(AI prompt)

document.querySelectorAll("[data-num]").forEach(btn => {
  btn.addEventListener("click", () => appendNumber(btn.dataset.num));
});

document.querySelectorAll("[data-op]").forEach(btn => {
  btn.addEventListener("click", () => chooseOperation(btn.dataset.op));
});
//AI assisted: suggest using addEventListener 
document.getElementById("calculateBtn").addEventListener("click", compute);
document.getElementById("clearHistory").addEventListener("click", clearHistory);
document.getElementById("backspaceBtn").addEventListener("click", backspace);
document.getElementById("cBtn").addEventListener("click", clearAll);
document.getElementById("ceBtn").addEventListener("click", clearEntry);
document.getElementById("negateBtn").addEventListener("click", negate);

// --- ERROR FUNCTION --- AI-assisted with code(AI prompt)
function showError(msg) {
  notification.textContent = msg;
}
function clearError() {
  notification.textContent = "";
}

// --- MAIN FUNTCION ---
function appendNumber(num) {
  clearError();
  //logic handling 'justCalculated' and 'resetOnNextInput' is added by AI
  if (resetOnNextInput || justCalculated) {
    current = "";
    resetOnNextInput = false;
    justCalculated = false;
  }

  if (num === "." && current === "") current = "0";
  if (num === "." && current.includes(".")) return;
  if (current === "0" && num !== ".") current = "";

  // lenght limit input added by AI assistant
  if (current.length > 15) return;

  current += num;
  updateDisplay();
}

function chooseOperation(op) {
  clearError();
  justCalculated = false;

  //SQRT logic block is written by AI
  if (op === "sqrt") {
    let valStr = current || previous;
    let val = parseFloat(valStr);

    if (isNaN(val)) return;
    if (val < 0) {
      showError("Không thể lấy căn số âm!");
      return;
    }
    let result = Math.sqrt(val);
    addHistory(`√(${val}) = ${result}`);
    current = result.toString();
    updateDisplay();
    return;
  }

  if (op === "%") {
    if (current === "") return;
    let val = parseFloat(current);

    // AI fixed: Process percentages based on current operation
    if (operator && previous !== "") {
      let base = parseFloat(previous);
      if (operator === "+" || operator === "-") {
        val = (base * val) / 100;
      }
      else if (operator === "*" || operator === "/") {
        val = val / 100;
      }
    }
    else {
      val = val / 100;
    }

    current = val.toString();
    updateDisplay();
    return;
  }

  if (current === "" && previous === "") return;

  if (operator && current !== "") {
    compute();
    justCalculated = false; // AI assisted: reset justCalculated after compute
  }

  operator = op;
  if (current !== "") {
    previous = current;
  }
  current = "";
  updateDisplay();
}

function compute() {
  clearError();

  let a = parseFloat(previous);
  let b = parseFloat(current);

  // AI assisted: handle cases where only one operand is provided
  if (isNaN(b) && !isNaN(a)) b = a;

  if (isNaN(a) || isNaN(b)) return;
  if (!operator) return;

  let result;

  if (operator === "+") {
    result = a + b;
  } else if (operator === "-") {
    result = a - b;
  } else if (operator === "*") {
    result = a * b;
  } else if (operator === "/") {
    if (b === 0) {
      showError("Không thể chia cho 0!");
      return;
    }
    result = a / b;
  } else {
    return; 
  }

  // AI assisted: limit result precision to avoid floating-point issues
  result = parseFloat(result.toPrecision(15));

  addHistory(`${a} ${operator} ${b} = ${result}`); //AI suggest syntax fix
  current = result.toString();
  operator = null;
  previous = "";
  justCalculated = true;
  updateDisplay();
}

function updateDisplay() {
  resultBox.value = current || previous || "0";
  expr.textContent = previous && operator ? `${previous} ${operator}` : "";
}

function negate() { //AI prompted
  clearError();
  if (current !== "") {
    current = (-parseFloat(current)).toString();
  } else if (previous !== "" && operator === null) {
    previous = (-parseFloat(previous)).toString();
    current = previous; 
    previous = "";
  }
  updateDisplay();
}

function backspace() {
  //AI fixed: add logic return to 0 if all digits are deleted
  clearError();
  if (current !== "") {
    current = current.slice(0, -1);
    if (current === "") current = "0"; 
  }
  updateDisplay();
}

function clearEntry() {
  clearError();
  current = "0";
  resetOnNextInput = true; //AI assisted: reset on next input by adding this flag
  updateDisplay();
}

function clearAll() { //Reset new state variables added by AI
  clearError();
  current = "";
  previous = "";
  operator = null;
  resetOnNextInput = false;
  justCalculated = false;
  updateDisplay();
}

function addHistory(text) {
  //Logic displays history added by AI
  if (historyList.querySelector("p")) historyList.innerHTML = "";
  let item = document.createElement("div");
  item.className = "bg-white border border-gray-200 rounded-md p-2 text-sm text-gray-700 break-words";
  item.textContent = text;
  historyList.prepend(item); 
  historyList.scrollTop = 0; 
}

function clearHistory() {
  historyList.innerHTML = `<p class="text-gray-400 text-sm text-center">Chưa có phép tính nào</p>`;
}

document.addEventListener("keydown", (e) => {
  // AI assisted: AI suggests ways to recognize keys and associate keys with computer actions
  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
  } else if (e.key === ".") {
    appendNumber(".");
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); //Prevents the browser's default behavior when an event occurs.
    compute();
  } else if (e.key === "Backspace") {
    e.preventDefault(); 
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "Delete") {
    clearEntry();
  } else if (e.key === "+") {
    chooseOperation("+");
  } else if (e.key === "-") {
    chooseOperation("-");
  } else if (e.key === "*") {
    chooseOperation("*");
  } else if (e.key === "/") {
    e.preventDefault(); 
    chooseOperation("/");
  } else if (e.key === "%") {
    chooseOperation("%");
  }
});