class ExpenseCalculator extends HTMLElement {
    constructor() {
        super();

        this.expenses = [];
        this.total = 0;

        this.attachShadow({ mode: 'open' });

        this.render();
        this.setupListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <div id="expense-form">
                <label for="expense-name">Название расхода:</label>
                <input type="text" id="expense-name">
                <label for="expense-amount">Сумма:</label>
                <input type="number" id="expense-amount">
                <button id="add-expense">Добавить расход</button>

                <div id="expenses-list"></div>

                <div class="total">Общая сумма расходов: ${this.total}</div>
            </div>
        `;
        this.updateExpensesList();
    }

    updateExpensesList() {
        const expensesList = this.shadowRoot.getElementById('expenses-list');
        expensesList.innerHTML = '';

        this.expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            expenseItem.innerHTML = `
                <span>${expense.name}: ${expense.amount}</span>
                <button class="delete-expense" data-index="${index}">Удалить</button>
            `;
            expensesList.appendChild(expenseItem);
        });

        const totalElement = this.shadowRoot.querySelector('.total');
        totalElement.textContent = `Общая сумма расходов: ${this.total}`;
    }

    setupListeners() {
        const addButton = this.shadowRoot.getElementById('add-expense');
        const expensesList = this.shadowRoot.getElementById('expenses-list');

        addButton.addEventListener('click', () => this.addExpense());
        expensesList.addEventListener('click', (event) => this.handleExpenseDelete(event));
    }

    addExpense() {
        const nameInput = this.shadowRoot.getElementById('expense-name');
        const amountInput = this.shadowRoot.getElementById('expense-amount');

        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (name && !isNaN(amount)) {
            this.expenses.push({ name, amount });
            this.total += amount;

            nameInput.value = '';
            amountInput.value = '';

            this.updateExpensesList();
        }
    }

    handleExpenseDelete(event) {
        if (event.target.classList.contains('delete-expense')) {
            const index = event.target.dataset.index;
            const deletedAmount = this.expenses[index].amount;

            this.expenses.splice(index, 1);
            this.total -= deletedAmount;

            this.updateExpensesList();
        }
    }
}

customElements.define('expense-calculator', ExpenseCalculator);
