(() => {
  const root=document.documentElement;
  const button=document.querySelector('#design-theme');
  function apply(theme){root.dataset.theme=theme;button.textContent=theme==='dark'?'☀ Light / लाइट':'☾ Dark / डार्क';button.setAttribute('aria-pressed',String(theme==='dark'));button.setAttribute('aria-label',theme==='dark'?'Switch to light theme / लाइट थीम चालू करें':'Switch to dark theme / डार्क थीम चालू करें');}
  let theme='light';try{theme=localStorage.getItem('sahifayda-theme')==='dark'?'dark':'light';}catch{}
  apply(theme);
  button.addEventListener('click',()=>{theme=root.dataset.theme==='dark'?'light':'dark';apply(theme);try{localStorage.setItem('sahifayda-theme',theme);}catch{}});
})();
