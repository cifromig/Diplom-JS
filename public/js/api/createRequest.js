/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {

let xhr = new XMLHttpRequest;
let formDate = new FormData();
let queryParams = '';

xhr.responseType = "json";

// console.log (options.data)

// {account_id: '1', user_id: '1'}  =  

if (options.data) {
    if (options.method === "GET") {
        queryParams = "?"+ Object.entries (options.data).map(
            ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        ).join('&');
       // console.log (queryParams)
    } else {
        Object.entries (options.data).forEach(v => formDate.append(...v));
    }
}

xhr.onreadystatechange = () => {
if (xhr.readyState === XMLHttpRequest.DONE) {
    let err = null;
    let resp = null;

        if (xhr.status === 200) {
            if(xhr.response?.success) {
                resp = xhr.response;
            } else {
                err = xhr.response;
            }
        } else {
            err = new Error('...');
        }

        if (options.callback) {
            options.callback (err, resp);
        }
        // console.log (err, resp);

    }

};

xhr.open (options.method, options.url + queryParams);
xhr.send (formDate);
// console.log (formDate.keys)


return xhr;

};
