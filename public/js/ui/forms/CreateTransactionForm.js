// const { response } = require("express")

/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList()
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
   Account.list(localStorage.getItem('user'), (err, resp) =>{

    document.querySelector('#expense-accounts-list').innerHTML = ""
    document.querySelector('#income-accounts-list').innerHTML = ""
//  console.log('проверка : ',  resp.data, expenseAccountsList)
    let html
    for (let i=0; i < resp.data.length ; i++){
    // console.log (resp.data[i])
    if (i == 0 ){
        html = `<option value="${resp.data[i].id}">${resp.data[i].name}</option>`
    } else {
        html += `<option value="${resp.data[i].id}">${resp.data[i].name}</option>`
    }
  // где id - идентификатор полученного счета, name - имя счета */
    }
    document.querySelector('#expense-accounts-list').insertAdjacentHTML('beforeend', html)
    document.querySelector('#income-accounts-list').insertAdjacentHTML('beforeend', html)
  // console.log (expenseAccountsList)
  })

}

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {

     Transaction.create (data, (err, resp) => {
       if (resp) {        
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update()
        } else {
          alert (err.error + ' (допустимы только числа)')
        }
    });
    App.update()
  }
}

// static initPages() {
//   this.pages = {
//     transactions: new TransactionsPage(this.content),
//   };
// }

// /**
//  * Инициализирует всплывающие окна
//  * */
// static initModals() {
//   this.modals = {
//     register: new Modal(document.querySelector("#modal-register")),
//     login: new Modal(document.querySelector("#modal-login")),
//     createAccount: new Modal(document.querySelector("#modal-new-account")),
//     newIncome: new Modal(document.querySelector("#modal-new-income")),
//     newExpense: new Modal(document.querySelector("#modal-new-expense")),
//   };
// }

// /**
//  * Инициализирует виджеты
//  * */
// static initWidgets() {
//   this.widgets = {
//     accounts: new AccountsWidget(document.querySelector(".accounts-panel")),
//     transactions: new TransactionsWidget(
//       document.querySelector(".transactions-panel")
//     ),
//     user: new UserWidget(document.querySelector(".user-panel")),
//   };
// }