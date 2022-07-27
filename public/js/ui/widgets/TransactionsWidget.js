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
    if (element != undefined){
      this.element = element
      this.registerEvents()
    } else {
      return err
    }
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
      //console.log(createIncomeButton)
      e.preventDefault();

     if(document.querySelector('#expense-accounts-list').innerHTML != "") { //Данная проверка перкращает вызов формы  Расход в том случае если у пользвателя отсутвуют счета и выдает предупреждение
      App.getModal('newIncome').open(); 
      //App.getModal('newExpense').open(); 
    } else {
      swal("Внимание!!!", "Нет ни одного доступного счета для добаления ДОХОДА", "success");
    }

    });
    let createExpenseButton = document.querySelector('.create-expense-button')

      createExpenseButton.addEventListener("click", e => {
      //console.log(createExpenseButton)
      e.preventDefault();
    if(document.querySelector('#income-accounts-list').innerHTML != "") { //Данная проверка перкращает вызов формы Доход в том случае если у пользвателя отсутвуют счета и выдает предупреждение
      App.getModal('newExpense').open(); 

    } else {
      swal("Внимание!!!","Нет ни одного доступного счета для добаления РАСХОДА", "success");
      }
    });
  }
}
