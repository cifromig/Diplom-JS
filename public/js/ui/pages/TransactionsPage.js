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
  constructor( element ) {
  if (element != undefined){
      this.element = element
      this.registerEvents()
    } else {
      throw "Отсутствует параметр"
      return
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

    //    document.querySelector(".remove-account").addEventListener('click', e => {
    //     e.preventDefault();
    //    this.removeAccount()
    //  });
       document.querySelector(".remove-account").onclick = e => {
       
        this.removeAccount()
     }

     document.querySelector('.content').addEventListener ('mouseover', r =>{

      let transactionRemove = document.querySelectorAll(".transaction__remove")
      if(transactionRemove) {
        for(let i=0; i< transactionRemove.length; i++ ){
   
          transactionRemove[i].onclick = e => {
            this.removeTransaction(transactionRemove[i].getAttribute('data-id'))
          }
      }
     }
     
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно(с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
   removeAccount() {
    if(sessionStorage.getItem('lastOptions') != 'null' && sessionStorage.getItem('lastOptions') != null) {
    //  let nameAccount = sessionStorage.getItem('lastOptions')

        swal({
          title: "Счет:  " + sessionStorage.getItem('lastOptionsName'),
          text: "Вы действительно хотите удалить этот счет?",
          //icon: "warning",
          buttons: ["Передумал","Подтверждаю"],// true,
         // dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            
          Account.remove({id: sessionStorage.getItem('lastOptions')},(err, resp) => {
            if( resp && resp.success) {
              sessionStorage.removeItem('lastOptions')
              this.clear()
              App.updateWidgets() 
              App.updateForms()
            }
          })
        

            swal("Счет " + sessionStorage.getItem('lastOptionsName') + " удален", {
              icon: "success",
            });
          } 
        });

    } else {
      swal("Внимание!!!", "Счет не выбран, необходимо выбрать счет", "success")
    }
  }

  /**
   * Удаляет транзакцию(доход или расход). Требует
   * подтверждеия действия(с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу(метод update) и виджет со счетами
   * */
  removeTransaction(id) {

    swal({
    //  title: sessionStorage.getItem('lastOptionsName'),
      text: "Вы действительно хотите удалить транзакцию?",
      //icon: "warning",
      buttons: ["Передумал","Подтверждаю"],
     // dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        
        Transaction.remove({id: id},(err, resp) => {
          App.update()
        })
    
        swal("Транзакция удалена", {
          icon: "success",
        });
      } 
    });

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options =''){
    if(options != ''){
      sessionStorage.setItem('lastOptions', options)
        Account.get(options,(err, resp) => {
          if(resp && resp.success){
            this.renderTitle(resp.data.name)
            sessionStorage.setItem('lastOptionsName',resp.data.name )
          }
        });
        Account.get(options,(err, resp) => {
          Transaction.list({account_id: resp.data.id, user_id: resp.data.user_id},(err, resp1) => {
          this.renderTransactions(resp1) })
        });
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
    document.querySelector('.content-title').textContent = name
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41(строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){

   // date("2022-07-24T11:13:26.213Z")

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

   let time =(dateNew.getUTCDate()+ "  "+ month[dateNew.getUTCMonth()]+"  "+ dateNew.getUTCFullYear()+" г. в "+dateNew.getUTCHours()+":"+dateNew.getUTCMinutes())

    return time
  }

  /**
   * Формирует HTML-код транзакции(дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){

  
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
    if (data != undefined) {
      let TransactionHTML  = data.data.reduce((previousValue, currentValue) => previousValue + String(this.getTransactionHTML(currentValue)), "" );
      document.querySelector('.content').insertAdjacentHTML('beforeend', TransactionHTML)
    }

  }
}