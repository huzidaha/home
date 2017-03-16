import run from './gen'

let isRunning = false;

const init = () =>  {
  listen()
  play();
}

function listen () {
  document.getElementById('head').addEventListener('click', function() {
    if (isRunning) return
    play()
  })
}

function play () {
  const head = document.getElementById('head')
  const history = run('Too young, too simple. Sometimes, naive.').history
  isRunning = true;
  let i = 0;
  history.forEach((text, i) => {
    setTimeout(function () {
      head.innerText = text
      if (++i === history.length) isRunning = false;
    }, i * 30)
  })
}

init()
