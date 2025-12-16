/* TrixTech s.r.o. @2025 */

(function () {
  function deepQueryAll(root, selector) {
    var found = [];
    var stack = [root];

    while (stack.length) {
      var node = stack.pop();

      try {
        if (node && node.querySelectorAll) {
          found = found.concat([].slice.call(node.querySelectorAll(selector)));
        }
      } catch (e) {}

      if (node && node.tagName === 'IFRAME') {
        try {
          if (node.contentDocument) stack.push(node.contentDocument);
        } catch (e) {}
      }

      if (node && node.shadowRoot) stack.push(node.shadowRoot);
    }

    return found;
  }

  function setAttrIfDiff(el, name, value) {
    var cur = el.getAttribute(name);
    if (cur !== value) el.setAttribute(name, value);
  }

  function translateButtons() {
    var sendSelector = [
      'button[title="Send"]',
      'button[aria-label="Send"]',
      'button[title*="Send"]',
      'button[aria-label*="Send"]',
      'button[title="Odeslat"]',
      'button[aria-label="Odeslat"]',
      'button[title*="Odeslat"]',
      'button[aria-label*="Odeslat"]'
    ].join(', ');

    var sendButtons = deepQueryAll(document, sendSelector);
    for (var i = 0; i < sendButtons.length; i++) {
      var btn = sendButtons[i];
      if (btn.__trixTranslatedSend) continue;
      btn.__trixTranslatedSend = true;

      if (btn.title !== 'Odeslat') btn.title = 'Odeslat';
      setAttrIfDiff(btn, 'aria-label', 'Odeslat');
      setAttrIfDiff(btn, 'data-balloon', 'Odeslat');
      setAttrIfDiff(btn, 'aria-live', 'polite');

      var txt = (btn.textContent || '').trim();
      if (txt && txt !== 'Odeslat') btn.textContent = 'Odeslat';
    }

    var launcherSelector = [
      'button.vfrc-launcher',
      'button[title*="Open chat"]',
      'button[aria-label*="Open chat"]',
      'button[title*="chat agent"]',
      'button[aria-label*="chat agent"]',
      'button[title*="Otevřít chat"]',
      'button[aria-label*="Otevřít chat"]'
    ].join(', ');

    var launcherButtons = deepQueryAll(document, launcherSelector);
    for (var j = 0; j < launcherButtons.length; j++) {
      var lb = launcherButtons[j];
      if (lb.__trixTranslatedLauncher) continue;
      lb.__trixTranslatedLauncher = true;

      var label = 'Otevřít chat';
      if (lb.title !== label) lb.title = label;
      setAttrIfDiff(lb, 'aria-label', label);
      setAttrIfDiff(lb, 'data-balloon', label);
      setAttrIfDiff(lb, 'aria-live', 'polite');

      var t = (lb.textContent || '').trim();
      if (t && t !== label) lb.textContent = label;

      var icons = lb.querySelectorAll ? lb.querySelectorAll('img, svg') : [];
      for (var k = 0; k < icons.length; k++) {
        setAttrIfDiff(icons[k], 'alt', label);
        setAttrIfDiff(icons[k], 'aria-label', label);
        setAttrIfDiff(icons[k], 'title', label);
      }
    }
  }

  function run() {
    var scheduled = false;

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        translateButtons();
      });
    }

    schedule();

    var observer = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].type === 'childList' && muts[i].addedNodes && muts[i].addedNodes.length) {
          schedule();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();