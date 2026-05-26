/* ---------- Þrjú rökhlið hlið við hlið (AND / OR / XOR) ---------- */
function renderLogicGates(figure) {
  figure.className = 'logicgates-figure';
  figure.setAttribute('aria-label', 'Gagnvirkur samanburður á AND, OR og XOR rökhliðum');

  figure.appendChild(el('figcaption', {
    class: 'logicgates-title',
    text: 'Prófaðu rökhliðin: kveiktu á A og B'
  }));
  figure.appendChild(el('p', {
    class: 'logicgates-hint',
    text: 'Smelltu á rofa A og B til að kveikja eða slökkva. Sjáðu hvernig hvert hlið svarar — og taktu eftir muninum á XOR og OR.'
  }));

  var state = { a: 0, b: 0 };

  function makeToggle(name) {
    var btn = el('button', { class: 'gate-toggle', type: 'button',
                              'aria-label': 'Kveiktu eða slökktu á inntaki ' + name,
                              'aria-pressed': 'false' });
    btn.appendChild(el('span', { class: 'gate-toggle-name', text: name }));
    var val = el('span', { class: 'gate-toggle-value', text: '0' });
    btn.appendChild(val);
    return { el: btn, val: val };
  }

  var aBtn = makeToggle('A');
  var bBtn = makeToggle('B');
  var inputsRow = el('div', { class: 'logicgates-inputs' });
  inputsRow.appendChild(aBtn.el);
  inputsRow.appendChild(bBtn.el);
  figure.appendChild(inputsRow);

  var GATES = [
    { name: 'AND', symbol: 'A ∧ B', fn: function (a, b) { return a & b; } },
    { name: 'OR',  symbol: 'A ∨ B', fn: function (a, b) { return a | b; } },
    { name: 'XOR', symbol: 'A ⊕ B', fn: function (a, b) { return a ^ b; } }
  ];

  var grid = el('div', { class: 'logicgates-grid' });
  var cells = GATES.map(function (g) {
    var card = el('div', { class: 'logicgates-card' });
    card.appendChild(el('div', { class: 'logicgates-card-title', text: g.name }));
    card.appendChild(el('div', { class: 'logicgates-card-symbol', text: g.symbol }));

    var bulb = el('div', { class: 'logicgates-bulb', 'aria-live': 'polite' });
    var bulbVal = el('span', { class: 'logicgates-bulb-value', text: '0' });
    bulb.appendChild(bulbVal);
    card.appendChild(bulb);
    card.appendChild(el('div', { class: 'logicgates-card-out', text: 'Útkoma' }));

    var table = el('table', { class: 'logicgates-tt' });
    var thead = el('thead');
    var headRow = el('tr');
    ['A', 'B', g.name].forEach(function (h) { headRow.appendChild(el('th', { text: h })); });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = el('tbody');
    var rows = [];
    for (var ai = 0; ai < 2; ai++) {
      for (var bi = 0; bi < 2; bi++) {
        var tr = el('tr', { 'data-a': String(ai), 'data-b': String(bi) });
        tr.appendChild(el('td', { text: String(ai) }));
        tr.appendChild(el('td', { text: String(bi) }));
        tr.appendChild(el('td', { text: String(g.fn(ai, bi)) }));
        tbody.appendChild(tr);
        rows.push({ a: ai, b: bi, el: tr });
      }
    }
    table.appendChild(tbody);
    card.appendChild(table);
    grid.appendChild(card);

    return { def: g, card: card, bulb: bulb, bulbVal: bulbVal, rows: rows };
  });
  figure.appendChild(grid);

  function update() {
    aBtn.el.classList.toggle('is-on', state.a === 1);
    bBtn.el.classList.toggle('is-on', state.b === 1);
    aBtn.el.setAttribute('aria-pressed', state.a === 1 ? 'true' : 'false');
    bBtn.el.setAttribute('aria-pressed', state.b === 1 ? 'true' : 'false');
    aBtn.val.textContent = String(state.a);
    bBtn.val.textContent = String(state.b);

    cells.forEach(function (c) {
      var out = c.def.fn(state.a, state.b);
      c.bulbVal.textContent = String(out);
      c.bulb.classList.toggle('is-on', out === 1);
      c.rows.forEach(function (r) {
        r.el.classList.toggle('is-active', r.a === state.a && r.b === state.b);
      });
    });
  }

  aBtn.el.addEventListener('click', function () { state.a = 1 - state.a; update(); });
  bBtn.el.addEventListener('click', function () { state.b = 1 - state.b; update(); });

  update();
}