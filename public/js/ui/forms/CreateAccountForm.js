/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    // data.user_id = "3sp4bagcl5z83dda11"
       Account.create (data, (err, resp) => {
       if (resp) {
          App.getModal('createAccount').close();
          App.update()
       } else {
        alert (err.error+' надо ввести дргое имя счета')
       }
    })
  }

} 

