(function () {
  var root = document.documentElement;
  var toast = document.getElementById('toast');
  var timer;
  function say(msg) {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(timer); timer = setTimeout(function () { toast.hidden = true; }, 1800);
  }
  function selectNode(node) {
    var r = document.createRange(); r.selectNodeContents(node);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function copy(text, node) {
    var done = function () { say('Copied'); };
    var fail = function () { if (node) selectNode(node); say('Press Ctrl+C to copy'); };
    try { navigator.clipboard.writeText(text).then(done, fail); } catch (e) { fail(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var n = document.getElementById(b.getAttribute('data-copy'));
      copy(n.textContent.trim(), n);
    });
  });

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t !== 'light';
  }
  try { var saved = localStorage.getItem('kg-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('kg-theme', next); } catch (e) {}
  });

  // Code window buttons: red = close, yellow = minimize, green = enlarge
  var win = document.getElementById('code-window');
  var back = document.getElementById('code-backdrop');
  function setMax(on) {
    win.classList.toggle('is-max', on);
    back.hidden = !on;
    document.body.classList.toggle('has-max', on);
    document.getElementById('dot-max').setAttribute('aria-label', on ? 'Shrink code window' : 'Enlarge code window');
  }
  var dotClose = document.getElementById('dot-close');
  dotClose.addEventListener('click', function () {
    // red button keeps the layout as it is, it only gives a small shake
    dotClose.classList.remove('shake'); void dotClose.offsetWidth; dotClose.classList.add('shake');
  });
  document.getElementById('dot-min').addEventListener('click', function () {
    if (win.classList.contains('is-max')) { setMax(false); return; } // enlarged -> normal size
    win.classList.toggle('is-min');                                  // normal <-> minimized
  });
  document.getElementById('dot-max').addEventListener('click', function () {
    win.classList.remove('is-min'); setMax(!win.classList.contains('is-max'));
  });
  back.addEventListener('click', function () { setMax(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMax(false); });

  // Edit button: lets the visitor type in the code window (not saved, Reset restores it)
  var pre = document.getElementById('code-pre');
  var editBtn = document.getElementById('code-edit');
  var resetBtn = document.getElementById('code-reset');
  var original = pre.innerHTML;
  editBtn.addEventListener('click', function () {
    var on = pre.getAttribute('contenteditable') !== 'true';
    if (on) win.classList.remove('is-min');
    pre.setAttribute('contenteditable', on ? 'true' : 'false');
    pre.setAttribute('spellcheck', 'false');
    pre.setAttribute('role', 'textbox'); pre.setAttribute('aria-multiline', 'true');
    editBtn.textContent = on ? 'Done' : 'Edit';
    editBtn.classList.toggle('on', on);
    resetBtn.hidden = !on;
    if (on) pre.focus();
  });
  resetBtn.addEventListener('click', function () { pre.innerHTML = original; pre.focus(); });
})();
