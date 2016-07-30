function getCookie() {
  let cookie = [];
  document.cookie.split('; ').forEach( (entry) => {
    entry = entry.split('=');
    cookie.push({
      name: entry[0],
      value: entry[1]
    });
  });
  return cookie;
}

function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

function addCookieToTable() {
  let data = {};
  data.cookieList = getCookie();
  let source = document.querySelector('#cookieRowTemplate').innerHTML,
      template = Handlebars.compile(source),
      tBodyContent = template(data);
  cookiesList.innerHTML = tBodyContent;
}

new Promise( resolve => {
  if(document.readyState == 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then( () => addCookieToTable());

cookiesList.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON') {
    let cookieName = e.target.parentNode.parentNode.firstElementChild.textContent;
    if(confirm(`Удалить cookie с именем ${cookieName} ?`)) {
      deleteCookie(cookieName);
      e.target.parentNode.parentNode.remove();
    }
  }
});

addCookie.addEventListener('click', e => {
  e.preventDefault();
  new Promise( (resolve, reject) => {
    let inputsVal = [],
        inputs = document.querySelectorAll('input:not([type="submit"])');
    for(let item of inputs) inputsVal.push(item.value);
    if(inputsVal.every( current => current.length > 0)) {
      resolve(inputsVal);
    } else {
      reject();
    }
  }).then( inputsVal => {
    ( (name, value, days) => {
      let expires;
      if(parseInt(days) == 0) {expires = 0}
      else {
        let date = new Date;
        date.setDate(date.getDate() + parseInt(days));
        expires = date.toUTCString();
      }
      value = encodeURIComponent(value);
      let newCookie = `${name}=${value};expires=${expires}`;
      document.cookie = newCookie;
    })(inputsVal[0], inputsVal[1], inputsVal[2]);
    addCookieToTable();
    let inputsToClear = document.querySelectorAll('input:not([type="submit"])');
    for(let item of inputsToClear) {item.value = ''}
  },
  () => alert('Заполните все поля формы'))
});