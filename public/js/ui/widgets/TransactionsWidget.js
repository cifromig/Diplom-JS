/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) { 
      this.element = element
      this.registerEvents()
    }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    let createIncomeButton = document.querySelector('.create-income-button')

    createIncomeButton.addEventListener("click", e => {
      //console.log (createIncomeButton)
      e.preventDefault();

     if(document.querySelector('#expense-accounts-list').innerHTML != "undefined") {

      App.getModal('newIncome').open(); 
    } else {
      alert ("Нет ни одного доступного счета для добаления Дохода")
    }

    });
    let createExpenseButton = document.querySelector('.create-expense-button')

      createExpenseButton.addEventListener("click", e => {
      //console.log (createExpenseButton)
      e.preventDefault();
    if(document.querySelector('#income-accounts-list').innerHTML != "undefined") {
      App.getModal('newExpense').open();
    } else {
      alert ("Нету ни одного доступного счета для добаления Расхода")
    }
    });
  }
}
