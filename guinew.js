// gui.js
(function () {
  function wrap(el) {
    // already wrapped?
    if (
      el.parentElement &&
      el.parentElement.classList.contains("gui-glass-wrap")
    ) {
      return;
    }
    const wrap = document.createElement("div");
    wrap.className = "gui-glass-wrap";
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    // neutralize dat.GUI's own absolute pos so the wrapper controls placement
    el.style.position = "static";
  }

  function tryWrap() {
    const el = document.querySelector(".dg"); // dat.GUI root
    if (el) wrap(el);
  }

  // 1) Try now (in case GUI is already there)
  tryWrap();

  // 2) Try on load
  window.addEventListener("load", tryWrap);

  // 3) Watch for it if created later
  const obs = new MutationObserver(() => {
    const el = document.querySelector(".dg");
    if (el) {
      wrap(el);
      obs.disconnect();
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
