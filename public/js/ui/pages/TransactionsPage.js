/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ='' ) {
    if (element != '') {
    this.element = element
    this.registerEvents()
    } else {
      let err = 'Ошибка'
      return err
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(sessionStorage.getItem('lastOptions'))
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {

    //    document.querySelector(".remove-account").addEventListener ('click', e => {
    //     e.preventDefault();
    //    this.removeAccount()
    //  });
       document.querySelector(".remove-account").onclick = e => {
       
        this.removeAccount()
     }



      let transactionRemove = document.querySelectorAll(".transaction__remove")
      if (transactionRemove) {
        for (let i=0; i< transactionRemove.length; i++ ){
   
          transactionRemove[i].onclick = e => {
            this.removeTransaction(transactionRemove[i].getAttribute('data-id'))
          }
      }
     }
  
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
   removeAccount() {
    if (sessionStorage.getItem('lastOptions') != 'null' && sessionStorage.getItem('lastOptions') != null) {
      let nameAccount = sessionStorage.getItem('lastOptions')
        let accountDelete = confirm("Вы действительно хотите удалить счет?")
        if (accountDelete) {
          Account.remove({id: sessionStorage.getItem('lastOptions')}, (err, resp) => {
            if ( resp && resp.success) {
              sessionStorage.removeItem('lastOptions')
              this.clear()
              App.updateWidgets() 
              App.updateForms()
            }
          })
        }
    } else {
      alert ('Счет не выбран, необходимо выбрать счет')
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let accountDelete = confirm("Вы действительно хотите удалить транзакцию?")
    if (accountDelete) {
      Transaction.remove({id: id}, (err, resp) => {
        App.update()
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options =''){
    if (options != ''){
      sessionStorage.setItem('lastOptions', options)
        Account.get(options, (err, resp) => {
          if(resp && resp.success){
            this.renderTitle(resp.data.name)
            // console.log(resp)

            Transaction.list({account_id: resp.data.id, user_id: resp.data.user_id}, (err, resp1) => {
            this.renderTransactions(resp1)
          })
        }
      })
    }
  }




  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions()
    this.renderTitle('Название счета')
   
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector ('.content-title').textContent = name
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){

   // date ("2022-07-24T11:13:26.213Z")

  let  dateNew = new Date(date);
  let month = new Array();
  month[0] = "января";
  month[1] = "февраля";
  month[2] = "марта";
  month[3] = "аперля";
  month[4] = "мая";
  month[5] = "июня";
  month[6] = "июля";
  month[7] = "августа";
  month[8] = "сентября";
  month[9] = "октября";
  month[10] = "ноября";
  month[11] = "мая";

   let time = (dateNew.getUTCDate()+ "  "+ month[dateNew.getUTCMonth()]+"  "+ dateNew.getUTCFullYear()+" г. в "+dateNew.getUTCHours()+":"+dateNew.getUTCMinutes())

    return time
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    // {
    //   "account_id": "1",
    //   "created_at": "2019-09-19 20:12:02",
    //   "id": "3",
    //   "name": "Копилка",
    //   "sum": 1500,
    //   "type": "income",
    //   "user_id": "1"
    // }

  
    return `

      <!-- либо transaction_expense, либо transaction_income -->

      <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${item.name}</h4>
                <!-- дата -->
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
            <!--  сумма -->
                ${item.sum} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <!-- в data-id нужно поместить id -->
              <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
      `;

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    document.querySelector('.content').innerHTML=""
  
    if (data && data.data.length > 0){
      let spisokTransactionHTML
      for (let i =0; i < data.data.length ; i++){ 
        if (i==0) {
          spisokTransactionHTML = this.getTransactionHTML(data.data[i])
        } else{
          spisokTransactionHTML += this.getTransactionHTML(data.data[i])}
      }
      document.querySelector('.content').insertAdjacentHTML('beforeend', spisokTransactionHTML)
      
    }
    this.registerEvents() 
  }
}