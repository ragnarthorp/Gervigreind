/* ---------- Hvað sér AlexNet? ---------- */
function renderAlexnet(figure) {
  figure.className = 'alex-figure';
  figure.setAttribute('aria-label',
    'Sýning á því hvernig AlexNet flokkar myndir með topp-5 tilgátum og prósentum.');

  figure.appendChild(el('figcaption', {
    class: 'alex-title',
    text: 'Hvað sér AlexNet?'
  }));
  figure.appendChild(el('p', {
    class: 'alex-hint',
    text: 'Veldu hlut og sjáðu hvaða fimm flokka AlexNet stingur upp á — með prósentu fyrir hve sannfært það er. Skiptu yfir í „óvenjulegt sjónarhorn“ til að sjá tauganetið rugla.'
  }));

  // ---- gögn ----
  // Hver hlutur hefur 2 sett: clear (skýrt) og weird (óvenjulegt). Topp-5 með %
  var OBJECTS = {
    hamar: {
      key: 'hamar',
      label: 'HAMAR',
      clear: [
        { name: 'Hamar',        pct: 92  },
        { name: 'Skrúfjárn',    pct: 3   },
        { name: 'Öxi',          pct: 2   },
        { name: 'Dósaopnari',   pct: 1.5 },
        { name: 'Skiptilykill', pct: 1   }
      ],
      weird: [
        { name: 'Hamar',        pct: 35 },
        { name: 'Hallamál',     pct: 28 },
        { name: 'Tindáti',      pct: 18 },
        { name: 'Meitill',      pct: 12 },
        { name: 'Skiptilykill', pct: 7  }
      ]
    },
    hundur: {
      key: 'hundur',
      label: 'HUNDUR',
      clear: [
        { name: 'Hundur',       pct: 88 },
        { name: 'Úlfur',        pct: 6  },
        { name: 'Refur',        pct: 3  },
        { name: 'Sjakali',      pct: 2  },
        { name: 'Köttur',       pct: 1  }
      ],
      weird: [
        { name: 'Hundur',       pct: 41 },
        { name: 'Úlfur',        pct: 24 },
        { name: 'Refur',        pct: 18 },
        { name: 'Sjakali',      pct: 10 },
        { name: 'Köttur',       pct: 7  }
      ]
    },
    bill: {
      key: 'bill',
      label: 'SPORTBÍLL',
      clear: [
        { name: 'Sportbíll',     pct: 89  },
        { name: 'Pallbíll',      pct: 4   },
        { name: 'Jeppi',         pct: 3   },
        { name: 'Limmósína',     pct: 2.5 },
        { name: 'Rúta',          pct: 1.5 }
      ],
      weird: [
        { name: 'Sportbíll',     pct: 36 },
        { name: 'Pallbíll',      pct: 24 },
        { name: 'Limmósína',     pct: 19 },
        { name: 'Jeppi',         pct: 13 },
        { name: 'Hjólhýsi',      pct: 8  }
      ]
    }
  };

  var ORDER = ['hamar', 'hundur', 'bill'];

  var state = {
    object: 'hamar',
    angle:  'clear'   // 'clear' eða 'weird'
  };

  // ---- velja-hluti rad ----
  var objectRow = el('div', { class: 'alex-objects', role: 'group', 'aria-label': 'Veldu hlut' });
  var objBtns = {};
  ORDER.forEach(function (k) {
    var o = OBJECTS[k];
    var btn = el('button', {
      type: 'button',
      class: 'alex-obj-btn' + (k === state.object ? ' is-active' : ''),
      'aria-pressed': k === state.object ? 'true' : 'false',
      text: o.label
    });
    btn.addEventListener('click', function () {
      state.object = k;
      Object.keys(objBtns).forEach(function (id) {
        objBtns[id].classList.toggle('is-active', id === k);
        objBtns[id].setAttribute('aria-pressed', id === k ? 'true' : 'false');
      });
      update();
    });
    objectRow.appendChild(btn);
    objBtns[k] = btn;
  });
  figure.appendChild(objectRow);

  // ---- velja sjónarhorn ----
  var angleRow = el('div', { class: 'alex-angle', role: 'group', 'aria-label': 'Veldu sjónarhorn' });
  var ANGLES = [
    { id: 'clear', label: 'Skýrt sjónarhorn' },
    { id: 'weird', label: 'Óvenjulegt sjónarhorn' }
  ];
  var angleBtns = {};
  ANGLES.forEach(function (a) {
    var btn = el('button', {
      type: 'button',
      class: 'alex-angle-btn' + (a.id === state.angle ? ' is-active' : ''),
      'aria-pressed': a.id === state.angle ? 'true' : 'false',
      text: a.label
    });
    btn.addEventListener('click', function () {
      state.angle = a.id;
      Object.keys(angleBtns).forEach(function (id) {
        angleBtns[id].classList.toggle('is-active', id === a.id);
        angleBtns[id].setAttribute('aria-pressed', id === a.id ? 'true' : 'false');
      });
      update();
    });
    angleRow.appendChild(btn);
    angleBtns[a.id] = btn;
  });
  figure.appendChild(angleRow);

  // ---- útkomu-spjald ----
  var card = el('div', { class: 'alex-card' });
  var head = el('div', { class: 'alex-card-head' });
  head.appendChild(el('div', { class: 'alex-card-eyebrow', text: 'TOPP-5 TILGÁTUR' }));
  var topGuess = el('div', { class: 'alex-card-top', text: '' });
  head.appendChild(topGuess);
  card.appendChild(head);

  // 5 lóðréttar línur
  var rows = [];
  for (var i = 0; i < 5; i++) {
    var row = el('div', { class: 'alex-row' });
    var name = el('div', { class: 'alex-row-name', text: '' });
    var bar  = el('div', { class: 'alex-row-bar' });
    var fill = el('div', { class: 'alex-row-fill' });
    bar.appendChild(fill);
    var pct  = el('div', { class: 'alex-row-pct', text: '' });
    row.appendChild(name);
    row.appendChild(bar);
    row.appendChild(pct);
    card.appendChild(row);
    rows.push({ row: row, name: name, fill: fill, pct: pct });
  }
  figure.appendChild(card);

  // ---- skýring í lok ----
  var explain = el('p', { class: 'alex-explain', text: '' });
  figure.appendChild(explain);

  function update() {
    var o = OBJECTS[state.object];
    var arr = o[state.angle];
    var top = arr[0];

    topGuess.textContent = top.name + ' · ' + formatPct(top.pct);
    topGuess.classList.toggle('is-confident', top.pct >= 60);
    topGuess.classList.toggle('is-unsure',    top.pct < 60);

    rows.forEach(function (r, i) {
      var d = arr[i];
      r.name.textContent = d.name;
      r.pct.textContent = formatPct(d.pct);
      r.fill.style.width = (d.pct) + '%';
      r.row.classList.toggle('is-top', i === 0);
    });

    if (state.angle === 'clear') {
      explain.textContent = 'Skýrt sjónarhorn: AlexNet er sannfært. Topp-tilgátan fær yfirgnæfandi prósentu og hinar fjórar eru hver um sig undir 5%.';
    } else {
      explain.textContent = 'Óvenjulegt sjónarhorn: Mynstrin sem netið treystir á — brúnir, form, litir — passa ekki lengur fullkomlega. Prósenturnar dreifast og topp-tilgátan er aðeins nokkrum prósentum á undan þeirri næstu.';
    }
  }

  function formatPct(p) {
    if (p < 10 && Math.round(p) !== p) return p.toFixed(1) + '%';
    return Math.round(p) + '%';
  }

  update();
}

