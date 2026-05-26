/* ---------- Smárinn — grind sem stýrir straumi ---------- */
function renderTriode(figure) {
  figure.className = 'triode-figure';
  figure.setAttribute('aria-label', 'Gagnvirkur smári þar sem grindarspenna stýrir rafeindastraumi');

  figure.appendChild(el('figcaption', {
    class: 'triode-title',
    text: 'Grindin sem stýrir straumnum'
  }));
  figure.appendChild(el('p', {
    class: 'triode-hint',
    text: 'Grindin virkar eins og loki sem stjórnar rafeindaflæði. Neikvæðari grind lokar meira fyrir flæðið — fáar rafeindir komast í gegn og peran er dauf. Jákvæðari grind opnar flæðið — fleiri rafeindir komast áfram og peran lýsir skært.'
  }));

  // ---- rafeindir í straumnum (SMIL-fjör) ----
  var electronSvg = '';
  for (var i = 0; i < 8; i++) {
    var begin = '-' + (i * 0.175).toFixed(3) + 's';
    electronSvg += '<circle class="triode-electron" data-eidx="' + i + '" r="4.5" cy="120">' +
      '<animate attributeName="cx" from="146" to="404" dur="1.4s" repeatCount="indefinite" begin="' + begin + '" />' +
    '</circle>';
  }

  var svgWrap = el('div', { class: 'triode-svg-wrap' });
  svgWrap.innerHTML = [
    '<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" role="img"',
    ' aria-label="Þrískautslampi/smári: rafeindir streyma frá bakskauti til forskauts, grindin stýrir flæðinu">',

      /* hjúpur (glerkúpa / hálfleiðari) */
      '<rect class="triode-envelope" x="115" y="62" width="320" height="116" rx="58" ry="58" />',

      /* rafhlaða */
      '<g class="triode-battery">',
        '<line x1="48" y1="168" x2="80" y2="168" class="triode-cell-long" />',
        '<line x1="55" y1="186" x2="73" y2="186" class="triode-cell-short" />',
        '<text x="92" y="173" class="triode-pole-label">−</text>',
        '<text x="92" y="191" class="triode-pole-label">+</text>',
      '</g>',

      /* vír inn frá rafhlöðu að bakskauti */
      '<path class="triode-wires-in" d="M 64 168 L 64 120 L 146 120" />',

      /* bakskaut (heitt — alltaf glóandi) */
      '<g class="triode-cathode">',
        '<rect x="134" y="106" width="14" height="28" rx="3" class="triode-pin" />',
        '<line x1="138" y1="100" x2="138" y2="92" class="triode-cathode-heat" />',
        '<line x1="144" y1="100" x2="144" y2="92" class="triode-cathode-heat" />',
        '<text x="141" y="154" class="triode-pin-label">Bakskaut</text>',
      '</g>',

      /* rafeindastraumurinn */
      '<g class="triode-stream">' + electronSvg + '</g>',

      /* grind — punktalína + tengill upp + lítil grind-borð til skrauts */
      '<g class="triode-grid">',
        '<path class="triode-grid-wire" d="M 275 90 L 275 50 L 332 50" />',
        '<g class="triode-grid-bars">',
          '<line x1="266" y1="92" x2="266" y2="156" />',
          '<line x1="275" y1="92" x2="275" y2="156" />',
          '<line x1="284" y1="92" x2="284" y2="156" />',
        '</g>',
        '<text x="345" y="54" class="triode-pin-label" text-anchor="start">Grind</text>',
      '</g>',

      /* forskaut */
      '<g class="triode-anode">',
        '<rect x="404" y="106" width="14" height="28" rx="3" class="triode-pin" />',
        '<text x="411" y="154" class="triode-pin-label">Forskaut</text>',
      '</g>',

      /* vír út úr forskauti til peru */
      '<path class="triode-wires-out" d="M 418 120 L 488 120 L 488 150" />',
      '<path class="triode-wires-out" d="M 488 194 L 488 214 L 64 214 L 64 195" />',

      /* pera */
      '<g class="triode-bulb">',
        '<g class="triode-bulb-rays">',
          '<line x1="488" y1="133" x2="488" y2="122" />',
          '<line x1="462" y1="148" x2="453" y2="139" />',
          '<line x1="514" y1="148" x2="523" y2="139" />',
          '<line x1="455" y1="172" x2="442" y2="172" />',
          '<line x1="521" y1="172" x2="534" y2="172" />',
        '</g>',
        '<circle cx="488" cy="172" r="22" class="triode-bulb-glass" />',
        '<path d="M 478 182 L 482 170 L 488 182 L 494 170 L 498 182" class="triode-bulb-fil" />',
        '<rect x="480" y="192" width="16" height="7" class="triode-bulb-base" />',
      '</g>',
    '</svg>'
  ].join('');
  figure.appendChild(svgWrap);

  // ---- sleði: spenna á grind ----
  var sliderWrap = el('div', { class: 'triode-slider-wrap' });
  var sliderHead = el('div', { class: 'triode-slider-head' });
  sliderHead.appendChild(el('span', { class: 'triode-slider-label', text: 'SPENNA Á GRIND' }));
  var sliderVal = el('span', { class: 'triode-slider-value', text: '0' });
  sliderHead.appendChild(sliderVal);
  sliderWrap.appendChild(sliderHead);

  var slider = el('input', {
    type: 'range', min: '0', max: '100', value: '0', step: '1',
    class: 'triode-slider',
    'aria-label': 'Spenna á grind, 0 til 100'
  });
  sliderWrap.appendChild(slider);

  var scale = el('div', { class: 'triode-scale' });
  scale.appendChild(el('span', { text: 'Neikvæð — lokar' }));
  scale.appendChild(el('span', { text: 'Jákvæð — opnar' }));
  sliderWrap.appendChild(scale);

  figure.appendChild(sliderWrap);

  // ---- stöðuspjald ----
  var status = el('div', { class: 'triode-status' });
  function makeChip(label) {
    var chip = el('div', { class: 'triode-chip' });
    chip.appendChild(el('span', { class: 'triode-chip-label', text: label }));
    var val = el('span', { class: 'triode-chip-value', text: '0' });
    chip.appendChild(val);
    return { el: chip, val: val };
  }
  var chipGate = makeChip('Grind');
  var chipFlow = makeChip('Rafeindir');
  var chipOut  = makeChip('Frálag');
  status.appendChild(chipGate.el);
  status.appendChild(chipFlow.el);
  status.appendChild(chipOut.el);
  figure.appendChild(status);

  var bulbLabel = el('p', { class: 'triode-bulb-label', text: 'Pera: SLÖKKT' });
  figure.appendChild(bulbLabel);

  function update() {
    var gate = parseInt(slider.value, 10);
    sliderVal.textContent = String(gate);
    chipGate.val.textContent = String(gate);

    // hve margar rafeindir komast yfir
    var count = Math.round((gate / 100) * 8);
    var electrons = figure.querySelectorAll('.triode-electron');
    for (var i = 0; i < electrons.length; i++) {
      electrons[i].classList.toggle('is-active', i < count);
    }

    var live = count >= 1;

    // víra og peru-stillingar
    figure.querySelector('.triode-wires-in').classList.toggle('is-live', live);
    var outWires = figure.querySelectorAll('.triode-wires-out');
    for (var k = 0; k < outWires.length; k++) {
      outWires[k].classList.toggle('is-live', live);
    }

    var bulb = figure.querySelector('.triode-bulb');
    bulb.classList.toggle('is-on', live);
    // Setjum birtu-stigi\u00f0 \u00e1 figure r\u00f3tina svo a\u00f0 b\u00e6\u00f0i pera, geislar OG bulb-label
    // (sem er systkini, ekki barn) geta lesi\u00f0 breytuna.
    figure.style.setProperty('--triode-brightness', String(gate / 100));

    // grind — birta + bilshöfða stilling eftir gate
    var grid = figure.querySelector('.triode-grid');
    grid.classList.toggle('is-powered', gate > 0);
    grid.style.setProperty('--triode-gate', String(gate / 100));

    // chips
    chipFlow.val.textContent = count + ' / 8';
    chipOut.val.textContent = live ? '1' : '0';
    chipGate.el.classList.toggle('is-on', gate > 0);
    chipFlow.el.classList.toggle('is-on', live);
    chipOut.el.classList.toggle('is-on', live);

    bulbLabel.textContent = 'Pera: ' + (live ? 'KVEIKT' : 'SLÖKKT');
    bulbLabel.classList.toggle('is-on', live);
  }

  slider.addEventListener('input', update);
  update();
}
