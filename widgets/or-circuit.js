/* ---------- OR-rafrás (samhliða rofar) ---------- */
function renderOrCircuit(figure) {
  figure.className = 'circuit-figure';
  figure.setAttribute('aria-label', 'Gagnvirk rafrás með tveimur samhliða rofum og peru sem virkar sem OR-hlið');

  figure.appendChild(el('figcaption', {
    class: 'circuit-title',
    text: 'Rafrásin sem útskýrir OR'
  }));
  figure.appendChild(el('p', {
    class: 'circuit-hint',
    text: 'Hér eru rofarnir samhliða — straumurinn þarf BARA að komast aðra hvora leiðina. Peran kviknar ef A er lokuð EÐA B er lokuð (eða báðar).'
  }));

  var svgWrap = el('div', { class: 'circuit-svg-wrap' });
  svgWrap.innerHTML = [
    '<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" role="img"',
    ' aria-label="Rafrás með tveimur samhliða rofum, rafhlöðu og peru">',

      '<text x="205" y="14" class="circuit-section-label">ÍLAG</text>',
      '<text x="490" y="20" class="circuit-section-label">FRÁLAG</text>',

      '<g class="circuit-wires">',
        '<path d="M 70 100 L 70 50 L 140 50" />',
        '<path d="M 140 50 L 140 220" />',
        '<path d="M 140 50 L 175 50" />',
        '<path d="M 140 220 L 175 220" />',
        '<path d="M 420 50 L 420 220" />',
        '<path d="M 420 50 L 490 50 L 490 110" />',
        '<path d="M 490 160 L 490 240 L 70 240 L 70 150" />',
      '</g>',
      '<g class="circuit-wires-a">',
        '<path d="M 235 50 L 420 50" />',
      '</g>',
      '<g class="circuit-wires-b">',
        '<path d="M 235 220 L 420 220" />',
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
        '<rect class="circuit-hit" x="160" y="20" width="90" height="55" />',
        '<circle cx="175" cy="50" r="5" class="circuit-pad" />',
        '<circle cx="235" cy="50" r="5" class="circuit-pad" />',
        '<line class="circuit-lever" data-lever="a" x1="175" y1="50" x2="235" y2="50" />',
        '<text x="205" y="32" class="circuit-switch-label">A</text>',
        '<text x="205" y="74" class="circuit-switch-state" data-state="a">opinn</text>',
      '</g>',

      '<g class="circuit-switch" data-switch="b">',
        '<rect class="circuit-hit" x="160" y="190" width="90" height="55" />',
        '<circle cx="175" cy="220" r="5" class="circuit-pad" />',
        '<circle cx="235" cy="220" r="5" class="circuit-pad" />',
        '<line class="circuit-lever" data-lever="b" x1="175" y1="220" x2="235" y2="220" />',
        '<text x="205" y="208" class="circuit-switch-label">B</text>',
        '<text x="205" y="244" class="circuit-switch-state" data-state="b">opinn</text>',
      '</g>',

      '<g class="circuit-bulb">',
        '<g class="circuit-bulb-rays">',
          '<line x1="490" y1="80"  x2="490" y2="68"  />',
          '<line x1="455" y1="100" x2="443" y2="88"  />',
          '<line x1="525" y1="100" x2="537" y2="88"  />',
          '<line x1="443" y1="135" x2="428" y2="135" />',
          '<line x1="537" y1="135" x2="552" y2="135" />',
        '</g>',
        '<circle cx="490" cy="135" r="28" class="circuit-bulb-glass" />',
        '<path d="M 478 146 L 483 130 L 490 146 L 497 130 L 502 146" class="circuit-bulb-fil" />',
        '<rect x="480" y="159" width="20" height="9" class="circuit-bulb-base" />',
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
  var chipOut = makeChip('A + B');
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
    if (key === 'a') pivot = '175 50'; else pivot = '175 220';
    lever.setAttribute('transform', closed ? '' : 'rotate(-30 ' + pivot + ')');
    var label = figure.querySelector('[data-state="' + key + '"]');
    label.textContent = closed ? 'lokaður' : 'opinn';
  }

  function update() {
    setSwitch('a', state.a);
    setSwitch('b', state.b);
    var live = state.a || state.b;
    figure.querySelector('.circuit-wires').classList.toggle('is-live', live);
    figure.querySelector('.circuit-wires-a').classList.toggle('is-live', state.a);
    figure.querySelector('.circuit-wires-b').classList.toggle('is-live', state.b);
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