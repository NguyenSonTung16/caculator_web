document.getElementById("calculateBtn").addEventListener("click", calculate);
document.getElementById("clearHistory").addEventListener("click", clearHistory);
let lastSelected = null;
document.querySelectorAll("input[name='operator']").forEach(radio => {
    radio.addEventListener("click", function () {
        // Nếu click lại cùng radio đang chọn → bỏ chọn
        if (lastSelected === this) {
            this.checked = false;
            lastSelected = null;
        } else {
            lastSelected = this;
        }
    });
});
function calculate() {
    let num1 = document.getElementById("num1").value.trim();
    let num2 = document.getElementById("num2").value.trim();
    let operator = document.querySelector("input[name='operator']:checked");
    let resultBox = document.getElementById("result");
    let notification = document.getElementById("notification");
    let historyList = document.getElementById("historyList");
    let firstnum = Number(num1);
    let secondnum = Number(num2);
    // Kiểm tra nhập
    if (num1 === "" || num2 === "") {
        notification.textContent = "Vui lòng nhập đầy đủ hai số!";
        resultBox.value = "";
        return;
    }
    if (isNaN(firstnum) || isNaN(secondnum)) {
        notification.textContent = "Giá trị nhập vào phải là số!";
        resultBox.value = "";
        return;
    }
    if (!operator) {
        notification.textContent = "Vui lòng chọn phép toán!";
        return;
    }
    // Tính
    let result;
    if (operator.value === "+") result = firstnum + secondnum;
    else if (operator.value === "-") result = firstnum - secondnum;
    else if (operator.value === "*") result = firstnum * secondnum;
    else if (operator.value === "/") {
        if (secondnum === 0) {
            alert("Không thể chia cho 0!");
            return;
        }
        result = firstnum / secondnum;
    }
    resultBox.value = result;
    notification.textContent = "";
    // Thêm vào lịch sử
    if (historyList.querySelector("p")) historyList.innerHTML = ""; // xóa dòng “chưa có phép tính”
    let item = document.createElement("div");
    item.className = "p-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700 text-sm";
    item.textContent = `${firstnum} ${operator.value} ${secondnum} = ${result}`;
    historyList.appendChild(item);
    historyList.scrollTop = historyList.scrollHeight;
}
function clearHistory() {
    document.getElementById("historyList").innerHTML =
        `<p class="text-gray-400 text-sm text-center">Chưa có phép tính nào</p>`;
}
