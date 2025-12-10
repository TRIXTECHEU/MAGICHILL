/* TrixTech s.r.o. @2025 */

(function () {
  const deepQueryAll = (root, selector) => {
    const found = [];
    const stack = [root];
    while (stack.length) {
      const node = stack.pop();
      if (node instanceof HTMLIFrameElement && node.contentDocument) stack.push(node.contentDocument);
      if (node.querySelectorAll) found.push(...node.querySelectorAll(selector));
      if (node.shadowRoot) stack.push(node.shadowRoot);
      node.childNodes?.forEach(child => {
        if (child.nodeType === 1) stack.push(child);
      });
    }
    return found;
  };

  const translateButtons = () => {
    const sendButtons = deepQueryAll(
      document,
      'button[title="Send"], button[aria-label="Send"], button[title="Odeslat"], button[aria-label="Odeslat"], button.vfrc-button'
    );
    sendButtons.forEach(btn => {
      btn.title = 'Odeslat';
      btn.setAttribute('aria-label', 'Odeslat');
      if (btn.textContent?.trim()) btn.textContent = 'Odeslat';
      btn.setAttribute('data-balloon', 'Odeslat');
      btn.setAttribute('aria-live', 'polite');
    });

    const launcherButtons = deepQueryAll(
      document,
      'button.vfrc-launcher, button[title*="Open chat"], button[title*="Close chat"], button[aria-label*="Open chat"], button[aria-label*="Close chat"], button[title*="Otevřít chat"], button[title*="Zavřít chat"], button.vfrc-button'
    );
    launcherButtons.forEach(btn => {
      const sourceText = `${btn.title || ''} ${btn.getAttribute('aria-label') || ''} ${btn.textContent || ''}`;
      const isClose = /close|zavřít/i.test(sourceText);
      const label = isClose ? 'Zavřít chat' : 'Otevřít chat';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      if (btn.textContent?.trim()) btn.textContent = label;
      btn.setAttribute('data-balloon', label);
      btn.setAttribute('aria-live', 'polite');
      btn.querySelectorAll('img, svg').forEach(icon => {
        icon.setAttribute('alt', label);
        icon.setAttribute('aria-label', label);
        icon.setAttribute('title', label);
      });
    });
  };

  const run = () => {
    translateButtons();
    let elapsed = 0;
    const timer = setInterval(() => {
      translateButtons();
      elapsed += 300;
      if (elapsed >= 10000) clearInterval(timer);
    }, 300);

    const observer = new MutationObserver(() => translateButtons());
    observer.observe(document, { childList: true, subtree: true, characterData: true, attributes: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
