/* ---------- Jacquard-vefstóll ---------- */
function renderLoom(figure) {

  /* ── Stærðir ── */
  var SIZES = [
    {
      label: 'Lítið  6×8',
      cards: [
        [1,1,0,0,0,0,1,1],
        [1,0,1,0,0,1,0,1],
        [0,1,0,1,1,0,1,0],
        [0,1,0,1,1,0,1,0],
        [1,0,1,0,0,1,0,1],
        [1,1,0,0,0,0,1,1]
      ]
    },
    {
      label: 'Miðlungs  10×10',
      cards: [
        [0,0,1,1,0,0,1,1,0,0],
        [0,1,0,0,1,1,0,0,1,0],
        [1,0,0,1,0,0,1,0,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [0,1,0,1,0,0,1,0,1,0],
        [0,1,0,1,0,0,1,0,1,0],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,0,1,0,0,1,0,0,1],
        [0,1,0,0,1,1,0,0,1,0],
        [0,0,1,1,0,0,1,1,0,0]
      ]
    },
    {
      label: 'Stórt  16×16',
      cards: (function() {
        // Space Invaders-líkt mynstur
        var rows = [
          [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0],
          [0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0],
          [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
          [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
          [0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0],
          [0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,0,1,1,1,1,1,1,0,1,1,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0],
          [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0]
        ];
        return rows;
      })()
    }
  ];

  var currentSize = 0;
  var CARD_MS = 1200;

  figure.className = 'loom-figure';
  figure.setAttribute('aria-label', 'Gagnvirk sýning á því hvernig gataspjöld stjórna vefnaði');

  figure.appendChild(el('figcaption', {
    class: 'loom-title',
    text: 'Hvernig gataspjaldið stjórnar vefnaðinum'
  }));

  figure.appendChild(el('p', {
    class: 'loom-hint',
    text: 'Smelltu á reit til að bæta við eða fjarlægja gat — síðan ýttu á Vefa og sjáðu þitt eigið mynstur vefjast.'
  }));

  /* ── Stærðarval ── */
  var sizeBar = el('div', { class: 'loom-sizebar' });
  var sizeBtns = [];
  SIZES.forEach(function(s, i) {
    var btn = el('button', {
      class: 'loom-sizebtn' + (i === 0 ? ' is-active' : ''),
      type: 'button',
      text: s.label
    });
    btn.addEventListener('click', function() {
      if (currentSize === i) return;
      currentSize = i;
      sizeBtns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      rebuildGrid();
    });
    sizeBar.appendChild(btn);
    sizeBtns.push(btn);
  });
  figure.appendChild(sizeBar);

  /* ── Spjaldahluti (endurbyggður við stærðarskipti) ── */
  var cardsSec = el('div', { class: 'loom-section' });
  cardsSec.appendChild(el('p', { class: 'loom-label', text: 'Gataspjöld' }));
  var stack = el('div', { class: 'loom-stack' });
  cardsSec.appendChild(stack);
  figure.appendChild(cardsSec);

  figure.appendChild(el('div', { class: 'loom-arrow', 'aria-hidden': 'true', text: '↓' }));

  /* ── Vefnaðarhluti ── */
  var fabricSec = el('div', { class: 'loom-section' });
  fabricSec.appendChild(el('p', { class: 'loom-label', text: 'Vefnaður' }));
  var fabric = el('div', { class: 'loom-fabric' });
  fabricSec.appendChild(fabric);
  figure.appendChild(fabricSec);

  /* ── Hnappar ── */
  var controls = el('div', { class: 'loom-controls' });
  var playBtn  = el('button', { class: 'loom-btn loom-btn-primary', type: 'button', text: '▶ Vefa' });
  var clearBtn = el('button', { class: 'loom-btn', type: 'button', text: '✕ Ný spjöld' });
  controls.appendChild(playBtn);
  controls.appendChild(clearBtn);
  figure.appendChild(controls);

  var step  = -1;
  var timer = null;

  /* ── Endurbyggja spjöld og fabric þegar stærð breytist ── */
  function rebuildGrid() {
    clearWeave();
    var defaultCards = SIZES[currentSize].cards;
    var CARDS = defaultCards.length;
    var COLS  = defaultCards[0].length;

    // Spjöld
    stack.innerHTML = '';
    defaultCards.forEach(function(row, idx) {
      var card = el('div', { class: 'loom-card', 'data-i': String(idx),
                             role: 'group', 'aria-label': 'Spjald ' + (idx + 1) });
      row.forEach(function(v, colIdx) {
        var isHole = !!v;
        var cell = el('button', {
          type: 'button',
          class: 'loom-cell' + (isHole ? ' is-hole' : ''),
          'aria-pressed': isHole ? 'true' : 'false',
          'aria-label': 'Spjald ' + (idx + 1) + ', reitur ' + (colIdx + 1)
        });
        cell.addEventListener('click', function() {
          var nowHole = cell.classList.toggle('is-hole');
          cell.setAttribute('aria-pressed', nowHole ? 'true' : 'false');
          clearWeave();
        });
        card.appendChild(cell);
      });
      stack.appendChild(card);
    });

    // Fabric-raðir
    fabric.innerHTML = '';
    for (var r = 0; r < CARDS; r++) {
      fabric.appendChild(el('div', { class: 'loom-fabric-row', 'data-i': String(r) }));
    }

    // Stillum CSS-breytu á dálkafjölda svo grid-layout virki
    stack.style.setProperty('--loom-cols', String(COLS));
    fabric.style.setProperty('--loom-cols', String(COLS));
  }

  function readCard(idx) {
    var cells = figure.querySelectorAll('.loom-card[data-i="' + idx + '"] .loom-cell');
    var out = [];
    for (var i = 0; i < cells.length; i++) {
      out.push(cells[i].classList.contains('is-hole') ? 1 : 0);
    }
    return out;
  }

  function weaveRow(idx) {
    var pattern = readCard(idx);
    var rowEl = figure.querySelector('.loom-fabric-row[data-i="' + idx + '"]');
    rowEl.innerHTML = '';
    pattern.forEach(function(v) {
      rowEl.appendChild(el('span', {
        class: 'loom-weave' + (v ? ' is-lifted' : ''),
        'aria-hidden': 'true'
      }));
    });
    requestAnimationFrame(function() {
      rowEl.classList.add('is-shown');
    });
  }

  function clearWeave() {
    if (timer) { clearTimeout(timer); timer = null; }
    step = -1;
    var cardEls = figure.querySelectorAll('.loom-card');
    for (var i = 0; i < cardEls.length; i++) {
      cardEls[i].classList.remove('is-current', 'is-done');
    }
    var rowEls = figure.querySelectorAll('.loom-fabric-row');
    for (var j = 0; j < rowEls.length; j++) {
      rowEls[j].classList.remove('is-shown');
      rowEls[j].innerHTML = '';
    }
    playBtn.disabled = false;
    playBtn.textContent = '▶ Vefa';
  }

  function clearAll() {
    clearWeave();
    var cellEls = figure.querySelectorAll('.loom-cell');
    for (var k = 0; k < cellEls.length; k++) {
      cellEls[k].classList.remove('is-hole');
      cellEls[k].setAttribute('aria-pressed', 'false');
    }
  }

  function applyCardStates() {
    var CARDS = SIZES[currentSize].cards.length;
    var cardEls = figure.querySelectorAll('.loom-card');
    for (var i = 0; i < cardEls.length; i++) {
      cardEls[i].classList.toggle('is-current', i === step);
      cardEls[i].classList.toggle('is-done',    i <  step);
    }
  }

  function tick() {
    timer = null;
    if (!document.contains(figure)) return;
    var CARDS = SIZES[currentSize].cards.length;
    step++;
    applyCardStates();
    weaveRow(step);
    if (step >= CARDS - 1) {
      playBtn.textContent = '✓ Búið';
      return;
    }
    timer = setTimeout(tick, CARD_MS);
  }

  playBtn.addEventListener('click', function() {
    if (timer) return;
    var CARDS = SIZES[currentSize].cards.length;
    if (step >= CARDS - 1) clearWeave();
    playBtn.disabled = true;
    tick();
  });
  clearBtn.addEventListener('click', clearAll);

  // Byrjum með sjálfgefna stærð
  rebuildGrid();
}