/* ---------- AND-rafrás (gagnvirk) ---------- */
function renderAndCircuit(figure) {
  figure.className = 'circuit-figure';
  figure.setAttribute('aria-label', 'Gagnvirk rafrás með tveimur rofum og peru sem virkar sem AND-hlið');

  figure.appendChild(el('figcaption', {
    class: 'circuit-title',
    text: 'Rafrásin sem útskýrir AND'
  }));
  figure.appendChild(el('p', {
    class: 'circuit-hint',
    text: 'Smelltu á rofana A og B til að loka eða opna þeim. Peran kviknar aðeins ef BÆÐI eru lokuð — straumurinn þarf að komast alla leið í gegnum bæði rofa.'
  }));

  var svgWrap = el('div', { class: 'circuit-svg-wrap' });
  svgWrap.innerHTML = [
    '<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" role="img"',
    ' aria-label="Rafrás með tveimur raðtengdum rofum, rafhlöðu og peru">',

      '<g class="circuit-wires">',
        '<path d="M 70 60 L 70 50 L 160 50" />',
        '<path d="M 220 50 L 300 50" />',
        '<path d="M 360 50 L 470 50 L 470 110" />',
        '<path d="M 470 175 L 470 200 L 70 200 L 70 170" />',
      '</g>',

      '<g class="circuit-battery">',
        '<line x1="55" y1="80"  x2="85"  y2="80"  class="cell-long"  />',
        '<line x1="62" y1="100" x2="78"  y2="100" class="cell-short" />',
        '<line x1="55" y1="130" x2="85"  y2="130" class="cell-long"  />',
        '<line x1="62" y1="150" x2="78"  y2="150" class="cell-short" />',
        '<text x="95"  y="86" class="circuit-label">+</text>',
        '<text x="95"  y="156" class="circuit-label">−</text>',
      '</g>',

      '<g class="circuit-switch" data-switch="a">',
        '<rect class="circuit-hit" x="145" y="0" width="90" height="65" />',
        '<circle cx="160" cy="50" r="5" class="circuit-pad" />',
        '<circle cx="220" cy="50" r="5" class="circuit-pad" />',
        '<line class="circuit-lever" data-lever="a" x1="160" y1="50" x2="220" y2="50" />',
        '<text x="190" y="22" class="circuit-switch-label">A</text>',
        '<text x="190" y="84" class="circuit-switch-state" data-state="a">opinn</text>',
      '</g>',

      '<g class="circuit-switch" data-switch="b">',
        '<rect class="circuit-hit" x="285" y="0" width="90" height="65" />',
        '<circle cx="300" cy="50" r="5" class="circuit-pad" />',
        '<circle cx="360" cy="50" r="5" class="circuit-pad" />',
        '<line class="circuit-lever" data-lever="b" x1="300" y1="50" x2="360" y2="50" />',
        '<text x="330" y="22" class="circuit-switch-label">B</text>',
        '<text x="330" y="84" class="circuit-switch-state" data-state="b">opinn</text>',
      '</g>',

      '<g class="circuit-bulb">',
        '<g class="circuit-bulb-rays">',
          '<line x1="470" y1="80"  x2="470" y2="68"  />',
          '<line x1="435" y1="100" x2="423" y2="88"  />',
          '<line x1="505" y1="100" x2="517" y2="88"  />',
          '<line x1="423" y1="143" x2="408" y2="143" />',
          '<line x1="517" y1="143" x2="532" y2="143" />',
        '</g>',
        '<circle cx="470" cy="143" r="28" class="circuit-bulb-glass" />',
        '<path d="M 458 154 L 463 138 L 470 154 L 477 138 L 482 154" class="circuit-bulb-fil" />',
        '<rect x="460" y="167" width="20" height="9" class="circuit-bulb-base" />',
      '</g>',
    '</svg>'
  ].join('');
  figure.appendChild(svgWrap);

  var status = el('div', { class: 'circuit-status' });
  function makeChip(label) {
    var chip = el('div', { class: 'circuit-chip' });
    chip.appendChild(el('span', { class: 'circuit-chip-label', text: label }));
    var val = el('span', { class: 'circuit-chip-value', text: '0' });
    chip.appendChild(val);
    return { el: chip, val: val };
  }
  var chipA   = makeChip('Rofi A');
  var chipB   = makeChip('Rofi B');
  var chipOut = makeChip('A · B');
  status.appendChild(chipA.el);
  status.appendChild(chipB.el);
  status.appendChild(chipOut.el);
  figure.appendChild(status);

  var bulbLabel = el('p', { class: 'circuit-bulb-label', text: 'Pera: SLÖKKT' });
  figure.appendChild(bulbLabel);

  var state = { a: false, b: false };

  function setSwitch(key, closed) {
    var lever = figure.querySelector('[data-lever="' + key + '"]');
    var pivot;
    if (key === 'a') pivot = '160 50'; else pivot = '300 50';
    lever.setAttribute('transform', closed ? '' : 'rotate(-30 ' + pivot + ')');
    var label = figure.querySelector('[data-state="' + key + '"]');
    label.textContent = closed ? 'lokaður' : 'opinn';
  }

  function update() {
    setSwitch('a', state.a);
    setSwitch('b', state.b);
    var live = state.a && state.b;
    figure.querySelector('.circuit-wires').classList.toggle('is-live', live);
    figure.querySelector('.circuit-bulb').classList.toggle('is-on', live);
    chipA.val.textContent   = state.a ? '1' : '0';
    chipB.val.textContent   = state.b ? '1' : '0';
    chipOut.val.textContent = live ? '1' : '0';
    chipA.el.classList.toggle('is-on',   state.a);
    chipB.el.classList.toggle('is-on',   state.b);
    chipOut.el.classList.toggle('is-on', live);
    bulbLabel.textContent = 'Pera: ' + (live ? 'KVEIKT' : 'SLÖKKT');
    bulbLabel.classList.toggle('is-on', live);
  }

  figure.querySelectorAll('.circuit-switch').forEach(function (g) {
    g.addEventListener('click', function () {
      var key = g.getAttribute('data-switch');
      state[key] = !state[key];
      update();
    });
  });

  update();
}