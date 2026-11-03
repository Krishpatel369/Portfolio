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
})();
