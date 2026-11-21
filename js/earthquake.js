/* earthquake.js — click interaction for the mantle section
   Also sets window.earthquakeActive so waves.js can overlay P/S arrivals. */

(() => {
  const section = document.getElementById('mantle');
  if (!section) return;

  let cooldown = false;

  function triggerQuake() {
    if (cooldown) return;
    cooldown = true;

    // Trigger page shake
    section.classList.remove('quaking');
    void section.offsetWidth;
    section.classList.add('quaking');

    // Signal waves.js to show P/S wave arrivals
    window.earthquakeActive = true;
    window.earthquakeStamp = Date.now();
    window.earthquakeElapsed = 0;

    window.setTimeout(() => {
      section.classList.remove('quaking');
      cooldown = false;
    }, 1400);
  }

  section.addEventListener('click', triggerQuake);
})();
