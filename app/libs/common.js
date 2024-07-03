document.addEventListener('DOMContentLoaded', () => {
  // тестирую. код

  // початок темної теми
  if (localStorage.getItem('theme') == null) {
    localStorage.setItem('theme', 'light');
    document.body.classList.add(localStorage.getItem('theme'));
  }

  document.querySelector('#dark-theme').addEventListener('click', () => {
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
    document.body.classList.add(localStorage.getItem('theme'));
  });

  document.querySelector('#light-theme').addEventListener('click', () => {
    localStorage.setItem('theme', 'light');
    document.body.classList.remove('dark');
    document.body.classList.add(localStorage.getItem('theme'));
  });

  // кінець темної теми

  document
    .querySelector('.toggle-style-switcher')
    .addEventListener('click', () => {
      document.querySelector('.style-switcher').classList.toggle('open');
    });

  if (localStorage.getItem('scenetheme') == null) {
    localStorage.setItem('scenetheme', 'css/pink.css');
  } else {
    document.querySelector('#change__style').href =
      localStorage.getItem('scenetheme');
  }

  // на pink колір
  document.querySelector('#scene__pink').addEventListener('click', () => {
    document.querySelector('#change__style').href = 'css/pink.css';
    localStorage.setItem('scenetheme', 'css/pink.css');
  });

  // на blue колір
  document.querySelector('#scene__blue').addEventListener('click', () => {
    document.querySelector('#change__style').href = 'css/blue.css';
    localStorage.setItem('scenetheme', 'css/blue.css');
  });

  // на orange колір
  document.querySelector('#scene__orange').addEventListener('click', () => {
    document.querySelector('#change__style').href = 'css/orange.css';
    localStorage.setItem('scenetheme', 'css/orange.css');
  });

  // на yellow колір
  document.querySelector('#scene__yellow').addEventListener('click', () => {
    document.querySelector('#change__style').href = 'css/yellow.css';
    localStorage.setItem('scenetheme', 'css/yellow.css');
  });
  // на зелений колір
  document.querySelector('#scene__green').addEventListener('click', () => {
    document.querySelector('#change__style').href = 'css/green.css';
    localStorage.setItem('scenetheme', 'css/green.css');
  });
});
