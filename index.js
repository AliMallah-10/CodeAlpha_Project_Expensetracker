document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("expense-form");
  const expensesList = document.getElementById("expenses-list");
  const confirmDeleteForm = document.getElementById("confirm-delete-form");
  const submitButton = document.getElementById("submit-button");
  let currentIndexToDelete = null;
  let currentIndexToUpdate = null;

  // Load expenses from local storage
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Render expenses
  function renderExpenses() {
    expensesList.innerHTML = "";
    expenses.forEach(function (expense, index) {
      const expenseItem = document.createElement("div");
      expenseItem.classList.add("expense-item");
      const truncatedDescription = expense.description
        .split(" ")
        .slice(0, 2)
        .join(" ");
      const displayDescription =
        expense.description.length > 0 ? truncatedDescription + "..." : "";
      expenseItem.innerHTML = `
      <span>${expense.name}</span>
      <span>${expense.category}</span>
      <span>$${expense.amount}</span>
      <span>${expense.date}</span>
      <span>${displayDescription}</span>

      <button class="action-button update-button" data-index="${index}">Update</button>
      <button class="action-button delete-button" data-index="${index}">Delete</button>
    `;
      expensesList.appendChild(expenseItem);
    });
  }

  renderExpenses();

  // Handle form submission
  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("expense-name").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;

    if (currentIndexToUpdate !== null) {
      // Update existing expense
      expenses[currentIndexToUpdate] = {
        name,
        category,
        amount,
        date,
        description,
      };
      submitButton.value = "Add Expense";
      currentIndexToUpdate = null;
    } else {
      // Add new expense
      expenses.push({ name, category, amount, date, description });
    }

    // Save expenses to local storage
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Render updated expenses
    renderExpenses();

    // Reset form fields
    expenseForm.reset();
  });

  // Handle update button click
  expensesList.addEventListener("click", function (event) {
    if (event.target.classList.contains("update-button")) {
      const index = event.target.getAttribute("data-index");
      const expenseToUpdate = expenses[index];
      document.getElementById("expense-name").value = expenseToUpdate.name;
      document.getElementById("category").value = expenseToUpdate.category;
      document.getElementById("amount").value = expenseToUpdate.amount;
      document.getElementById("date").value = expenseToUpdate.date;
      document.getElementById("description").value =
        expenseToUpdate.description;
      submitButton.value = "Update Expense";
      currentIndexToUpdate = index;
      currentIndexToDelete = null; // Reset the index to delete
    }
  });

  // Handle delete button click
  expensesList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      currentIndexToDelete = event.target.getAttribute("data-index");
      confirmDeleteForm.style.display = "block";
    }
  });

  // Handle confirm delete button click
  document
    .getElementById("confirm-delete")
    .addEventListener("click", function () {
      if (currentIndexToDelete !== null) {
        expenses.splice(currentIndexToDelete, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
        currentIndexToDelete = null;
        confirmDeleteForm.style.display = "none";
      }
    });

  // Handle cancel delete button click
  document
    .getElementById("cancel-delete")
    .addEventListener("click", function () {
      currentIndexToDelete = null;
      confirmDeleteForm.style.display = "none";
    });
});
