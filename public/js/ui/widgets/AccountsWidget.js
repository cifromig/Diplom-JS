/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element 
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents() 
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element != undefined){
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw "Отсутствует параметр"
      return
   }
}

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   *(которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    
    let createAccount = document.querySelector(".create-account")
    document.querySelector(".create-account").onclick = e => {
     // console.log(createAccount)
     // e.preventDefault()
      App.getModal("createAccount").open()
    }

    this.element.onclick = e => {
      e.preventDefault();
        const element = e.target.closest('li');
        if(element.classList.contains("header")) {
          return;
        }
      
      this.onSelectAccount(element)
                              
    };
  }

  /**
   * Метод доступен только авторизованным пользователям
   *(User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    Account.list(localStorage.getItem('user'),(err, resp) => {
      if(resp && resp.success) {
        this.clear();
        resp.data.forEach(data => this.renderItem(data));
      }
    })
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach(element => element.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {

   this.element.querySelectorAll(".account").forEach(element => element.classList.remove("active"));

   element.classList.add("active")
  
    App.showPage('transactions', element.getAttribute('data-id') ) 
  
}

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `
    <li class="account" data-id=${item.id}>
        <a href="#">
            <span>${item.name}</span> /
            <span>${item.sum}</span>
        </a>
    </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
  this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(data))
  }
}
