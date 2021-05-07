let name = localStorage.getItem('userName')
let select = document.getElementById('select')
let start = document.getElementById('start')
let welcome = document.getElementById('welcome')
let exit = document.getElementById('exit')
let n = 0
let selectValue = 0
let score = document.getElementById('score')
let lastScore = localStorage.getItem('lastScore')

if (localStorage.getItem('notFirstTime') != 1) {
welcome.innerHTML = `Добро пожаловать, ${name}`}
else {welcome.innerHTML = `Попробуем еще раз, ${name}?`
      score.innerHTML = `Ваша статистика за поход: ${lastScore}`}

select.addEventListener(`change`, event => {
    let n = select.options.selectedIndex
    let selectValue = select.options[n].value
    localStorage.setItem('topic', selectValue)
  }, false)

start.addEventListener('click', event => {
  if (select.options.selectedIndex != 0) {
    document.location.href="/game.html"
  }
  else {
    alert('Выберите тему')
  }
}, false)

exit.addEventListener('click', event => {
 localStorage.removeItem('name')
 localStorage.removeItem('topic')
 localStorage.setItem('notFirstTime', 0)
 document.location.href="/enter.html"
}, false)