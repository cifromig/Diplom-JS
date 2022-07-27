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

   Account.list(localStorage.getItem('user'),(err, resp) =>{


    document.querySelector('#expense-accounts-list').innerHTML = ""
    document.querySelector('#income-accounts-list').innerHTML = ""
   
    if (resp != undefined) {
      let transactionAccountHTML = resp.data.reduce((previousValue, currentValue) => previousValue + `<option value="${currentValue.id}">${currentValue.name}</option>`, "" );
      document.querySelector('#expense-accounts-list').insertAdjacentHTML('beforeend', transactionAccountHTML)
      document.querySelector('#income-accounts-list').insertAdjacentHTML('beforeend', transactionAccountHTML)
    }

   })

}

  /**
   * Создаёт новую транзакцию(доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {

     Transaction.create(data,(err, resp) => {
       if(resp) {        
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.update()
        } else {
          swal(err.error ,'(допустимы только числа)')
        }
    });
    App.update()
  }
}