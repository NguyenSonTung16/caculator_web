const resultBox = document.getElementById("result");
const expr = document.getElementById("expression");
const historyList = document.getElementById("historyList");
const notification = document.getElementById("notification"); // <-- thêm phần thông báo

let current = "";
let previous = "";
let operator = null;
let resetOnNextInput = false;
let justCalculated = false;

// --- GÁN SỰ KIỆN CHO NÚT ---
document.querySelectorAll("[data-num]").forEach(btn => {
  btn.addEventListener("click", () => appendNumber(btn.dataset.num));
});

document.querySelectorAll("[data-op]").forEach(btn => {
  btn.addEventListener("click", () => chooseOperation(btn.dataset.op));
});

document.getElementById("calculateBtn").addEventListener("click", compute);
document.getElementById("clearHistory").addEventListener?.("click", clearHistory);
document.getElementById("backspaceBtn").addEventListener("click", backspace);
document.getElementById("cBtn").addEventListener("click", clearAll);
document.getElementById("ceBtn").addEventListener("click", clearEntry);
document.getElementById("negateBtn").addEventListener("click", negate);

// --- HÀM HIỂN THỊ LỖI ---
function showError(msg) {
  notification.textContent = msg;
}
function clearError() {
  notification.textContent = "";
}

// --- HÀM CHÍNH ---
function appendNumber(num) {
  clearError(); // Xóa thông báo khi nhập lại

  if (resetOnNextInput || justCalculated) {
    current = "";
    resetOnNextInput = false;
    justCalculated = false;
  }

  // Nếu bấm "." mà chưa có gì → tự thêm "0."
  if (num === "." && current === "") {
    current = "0.";
    updateDisplay();
    return;
  }

  if (num === "." && current.includes(".")) return;
  if (current === "0" && num !== ".") current = "";
  current += num;
  updateDisplay();
}

function chooseOperation(op) {
  clearError();
  justCalculated = false;

  if (current === "" && op !== "sqrt" && op !== "%") return;

  // √ (Căn bậc hai)
  if (op === "sqrt") {
    // Nếu đang có phép toán và đang nhập số thứ 2
    if (operator && current !== "") {
      let val = parseFloat(current);
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

    // Nếu chưa có phép toán, lấy căn của số hiện tại
    let val = parseFloat(current || previous);
    if (isNaN(val)) return;
    if (val < 0) {
      showError("Không thể lấy căn số âm!");
      return;
    }
    let result = Math.sqrt(val);
    addHistory(`√(${val}) = ${result}`);
    current = result.toString();
    previous = "";
    operator = null;
    updateDisplay();
    return;
  }

  // ✅ Xử lý % (chỉ đổi giá trị hiện tại, không tính, không reset)
  if (op === "%") {
    let val = parseFloat(current);
    if (isNaN(val)) return;
    val = val / 100;
    current = val.toString();
    updateDisplay();
    return;
  }

  // Nếu đã có phép toán trước và current có giá trị, tính trước
  if (operator && current !== "") {
    compute();
  }

  operator = op;
  previous = current;
  current = "";
  updateDisplay();
}

function compute() {
  clearError();

  let a = parseFloat(previous);
  let b = parseFloat(current);

  // Nếu chưa nhập số thứ hai → tự lấy lại số đầu
  if (isNaN(b)) b = a;
  if (isNaN(a)) return;

  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        showError("Không thể chia cho 0!");
        return;
      }
      result = a / b;
      break;
    default: return;
  }

  addHistory(`${a} ${operator} ${b} = ${result}`);
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

function negate() {
  clearError();
  if (current !== "") current = (-parseFloat(current)).toString();
  else if (previous && !current) previous = (-parseFloat(previous)).toString();
  updateDisplay();
}

function backspace() {
  clearError();
  current = current.slice(0, -1);
  updateDisplay();
}

function clearEntry() {
  clearError();
  current = "0";
  resetOnNextInput = true;
  updateDisplay();
}

function clearAll() {
  clearError();
  current = "";
  previous = "";
  operator = null;
  resetOnNextInput = false;
  justCalculated = false;
  updateDisplay();
}

function addHistory(text) {
  if (historyList.querySelector("p")) historyList.innerHTML = "";
  let item = document.createElement("div");
  item.className = "bg-white border border-gray-200 rounded-md p-2 text-sm text-gray-700";
  item.textContent = text;
  historyList.appendChild(item);
  historyList.scrollTop = historyList.scrollHeight;
}

function clearHistory() {
  historyList.innerHTML = `<p class="text-gray-400 text-sm text-center">Chưa có phép tính nào</p>`;
}
