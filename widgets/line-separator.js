/* ---------- Línuleg aðgreining — AND, OR, XOR ---------- */
function renderLineSeparator(figure) {
  figure.className = 'linesep-figure';
  figure.setAttribute('aria-label',
    'Gagnvirkt línurit: dragðu beina línu þannig að hún aðgreini réttu svörin (grænu) frá röngum (rauðum) fyrir AND, OR og XOR.');

  figure.appendChild(el('figcaption', {
    class: 'linesep-title',
    text: 'Línuleg aðgreining'
  }));
  figure.appendChild(el('p', {
    class: 'linesep-hint',
    text: 'Veldu reglu og dragðu enda punktalínunnar þannig að grænu punktarnir séu öðrum megin við línuna en þeir rauðu hinum megin. '
  }));

  // ====== state ======
  var RULES = {
    AND: { fn: function (a, b) { return a === 1 && b === 1; }, description: 'Rétt aðeins þegar A og B eru bæði 1.' },
    OR:  { fn: function (a, b) { return a === 1 || b === 1; }, description: 'Rétt þegar A eða B er 1.' },
    XOR: { fn: function (a, b) { return a !== b;            }, description: 'Rétt þegar A og B eru ólík.' }
  };
  var POINTS = [
    { a: 0, b: 0 }, { a: 0, b: 1 }, { a: 1, b: 0 }, { a: 1, b: 1 }
  ];
  var currentRule = 'AND';
  var initialP1 = { x: -0.15, y: -0.15 };
  var initialP2 = { x: 1.25,  y: 1.25  };
  var p1 = { x: initialP1.x, y: initialP1.y };
  var p2 = { x: initialP2.x, y: initialP2.y };
  var dragging = null;

  // ====== reglu-takkar ======
  var ruleRow = el('div', { class: 'linesep-rules', role: 'group', 'aria-label': 'Veldu rökhlið' });
  var ruleBtns = {};
  Object.keys(RULES).forEach(function (r) {
    var btn = el('button', {
      type: 'button',
      class: 'linesep-rule-btn' + (r === currentRule ? ' is-active' : ''),
      'aria-pressed': r === currentRule ? 'true' : 'false',
      text: r
    });
    btn.addEventListener('click', function () {
      currentRule = r;
      // endurstilla línu
      p1 = { x: initialP1.x, y: initialP1.y };
      p2 = { x: initialP2.x, y: initialP2.y };
      Object.keys(ruleBtns).forEach(function (k) {
        ruleBtns[k].classList.remove('is-active');
        ruleBtns[k].setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      update();
    });
    ruleRow.appendChild(btn);
    ruleBtns[r] = btn;
  });
  figure.appendChild(ruleRow);

  // ====== aðal layout ======
  var main = el('div', { class: 'linesep-main' });

  // --- SVG ---
  var W = 380, H = 380;
  var PAD = 60;
  var SCALE = 220;

  function toSvg(x, y) {
    return { cx: PAD + x * SCALE, cy: H - PAD - y * SCALE };
  }
  function fromSvg(cx, cy) {
    var x = (cx - PAD) / SCALE;
    var y = (H - PAD - cy) / SCALE;
    return {
      x: Math.max(-0.25, Math.min(1.45, x)),
      y: Math.max(-0.25, Math.min(1.45, y))
    };
  }

  // (p2.x - p1.x) * (pt_y - p1.y) - (p2.y - p1.y) * (pt_x - p1.x)
  // pt í (b, a) hnitum þar sem b er x-ás, a er y-ás
  function sideOfLine(pt) {
    return (p2.x - p1.x) * (pt.a - p1.y) - (p2.y - p1.y) * (pt.b - p1.x);
  }

  var svgWrap = el('div', { class: 'linesep-svg-wrap' });
  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('class', 'linesep-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Hnitakerfi með fjórum punktum og dragdrægri línu');

  function svgEl(tag, attrs) {
    var node = document.createElementNS(svgNS, tag);
    if (attrs) for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // ásar
  svg.appendChild(svgEl('line', {
    x1: PAD, y1: H - PAD, x2: PAD + 1.3 * SCALE, y2: H - PAD,
    class: 'linesep-axis'
  }));
  svg.appendChild(svgEl('line', {
    x1: PAD, y1: H - PAD, x2: PAD, y2: H - PAD - 1.3 * SCALE,
    class: 'linesep-axis'
  }));

  // ás-merkingar
  [0, 1].forEach(function (v) {
    var x = PAD + v * SCALE;
    var y = H - PAD - v * SCALE;
    // X-ás tick
    svg.appendChild(svgEl('line', {
      x1: x, y1: H - PAD - 6, x2: x, y2: H - PAD + 6, class: 'linesep-axis'
    }));
    var tx = svgEl('text', {
      x: x, y: H - PAD + 22, 'text-anchor': 'middle', class: 'linesep-tick'
    });
    tx.textContent = v;
    svg.appendChild(tx);
    // Y-ás tick
    svg.appendChild(svgEl('line', {
      x1: PAD - 6, y1: y, x2: PAD + 6, y2: y, class: 'linesep-axis'
    }));
    var ty = svgEl('text', {
      x: PAD - 16, y: y + 5, 'text-anchor': 'end', class: 'linesep-tick'
    });
    ty.textContent = v;
    svg.appendChild(ty);
  });

  // ás-titlar
  var labelA = svgEl('text', {
    x: PAD - 32, y: H - PAD - 1.32 * SCALE, 'text-anchor': 'middle', class: 'linesep-axislabel'
  });
  labelA.textContent = 'A';
  svg.appendChild(labelA);
  var labelB = svgEl('text', {
    x: PAD + 1.32 * SCALE, y: H - PAD + 22, 'text-anchor': 'middle', class: 'linesep-axislabel'
  });
  labelB.textContent = 'B';
  svg.appendChild(labelB);

  // línan + endpunktar
  var lineEl = svgEl('line', { class: 'linesep-line' });
  svg.appendChild(lineEl);
  var handle1 = svgEl('circle', { r: 10, class: 'linesep-handle', tabindex: '0', 'aria-label': 'Endapunktur 1' });
  var handle2 = svgEl('circle', { r: 10, class: 'linesep-handle', tabindex: '0', 'aria-label': 'Endapunktur 2' });
  svg.appendChild(handle1);
  svg.appendChild(handle2);

  // 4 gagnapunktar
  var dataPointEls = POINTS.map(function (pt) {
    var c = svgEl('circle', { r: 14, class: 'linesep-point' });
    var p = toSvg(pt.b, pt.a);
    c.setAttribute('cx', p.cx);
    c.setAttribute('cy', p.cy);
    svg.appendChild(c);
    // merki yfir punkti með a,b
    var lbl = svgEl('text', {
      x: p.cx, y: p.cy + 5, 'text-anchor': 'middle', class: 'linesep-point-lbl'
    });
    lbl.textContent = '';
    svg.appendChild(lbl);
    return { el: c, lbl: lbl, pt: pt };
  });

  svgWrap.appendChild(svg);
  main.appendChild(svgWrap);

  // --- hægra spjald ---
  var panel = el('div', { class: 'linesep-panel' });

  var card1 = el('div', { class: 'linesep-card' });
  var card1Head = el('div', { class: 'linesep-card-head' });
  var ruleTitle = el('h3', { class: 'linesep-rule-title', text: currentRule });
  card1Head.appendChild(ruleTitle);
  card1.appendChild(card1Head);
  var ruleDesc = el('p', { class: 'linesep-rule-desc', text: RULES[currentRule].description });
  card1.appendChild(ruleDesc);

  // sanngildistafla
  var table = el('table', { class: 'linesep-table' });
  var thead = el('thead');
  var theadRow = el('tr');
  ['A', 'B', 'Útkoma'].forEach(function (h) {
    var th = el('th', { text: h });
    theadRow.appendChild(th);
  });
  thead.appendChild(theadRow);
  table.appendChild(thead);
  var tbody = el('tbody');
  var tableRows = POINTS.map(function (pt) {
    var tr = el('tr');
    tr.appendChild(el('td', { text: String(pt.a) }));
    tr.appendChild(el('td', { text: String(pt.b) }));
    var tdOut = el('td', { class: 'linesep-out' });
    tr.appendChild(tdOut);
    tbody.appendChild(tr);
    return { tr: tr, out: tdOut, pt: pt };
  });
  table.appendChild(tbody);
  card1.appendChild(table);
  panel.appendChild(card1);

  var card2 = el('div', { class: 'linesep-card' });
  var eqHead = el('div', { class: 'linesep-card-sub', text: 'JAFNA LÍNUNNAR' });
  card2.appendChild(eqHead);
  var eqText = el('div', { class: 'linesep-equation', text: '' });
  card2.appendChild(eqText);
  var status = el('div', { class: 'linesep-status', text: '' });
  card2.appendChild(status);
  panel.appendChild(card2);

  main.appendChild(panel);
  figure.appendChild(main);

  // ====== uppfærsla ======
  function update() {
    // reglu-spjald
    ruleTitle.textContent = currentRule;
    ruleDesc.textContent = RULES[currentRule].description;

    // sanngildistafla
    tableRows.forEach(function (row) {
      var correct = RULES[currentRule].fn(row.pt.a, row.pt.b);
      row.out.textContent = correct ? '1' : '0';
      row.tr.classList.toggle('is-correct', correct);
    });

    // 4 gagnapunktar — litur eftir réttri útkomu
    dataPointEls.forEach(function (d) {
      var correct = RULES[currentRule].fn(d.pt.a, d.pt.b);
      d.el.classList.toggle('is-correct', correct);
      d.el.classList.toggle('is-wrong', !correct);
      d.lbl.textContent = correct ? '1' : '0';
    });

    // lína + endpunktar
    var s1 = toSvg(p1.x, p1.y);
    var s2 = toSvg(p2.x, p2.y);
    lineEl.setAttribute('x1', s1.cx);
    lineEl.setAttribute('y1', s1.cy);
    lineEl.setAttribute('x2', s2.cx);
    lineEl.setAttribute('y2', s2.cy);
    handle1.setAttribute('cx', s1.cx);
    handle1.setAttribute('cy', s1.cy);
    handle2.setAttribute('cx', s2.cx);
    handle2.setAttribute('cy', s2.cy);

    // jafna
    var dx = p2.x - p1.x;
    var equation;
    if (Math.abs(dx) < 0.001) {
      equation = 'B = ' + p1.x.toFixed(2);
    } else {
      var m = (p2.y - p1.y) / dx;
      var c = p1.y - m * p1.x;
      var sign = c >= 0 ? '+' : '−';
      equation = 'A = ' + m.toFixed(2) + '·B ' + sign + ' ' + Math.abs(c).toFixed(2);
    }
    eqText.textContent = equation;

    // mat
    var labeled = POINTS.map(function (pt) {
      return { pt: pt, correct: RULES[currentRule].fn(pt.a, pt.b), side: sideOfLine(pt) };
    });
    var onLine = labeled.some(function (p) { return Math.abs(p.side) < 0.001; });
    var ok = false, message = '';

    if (currentRule === 'XOR') {
      message = 'XOR er ekki línulega aðgreinanlegt. Engin ein bein lína getur aðskilið grænu punktana frá þeim rauðu.';
      ok = false;
    } else if (onLine) {
      message = 'Línan fer í gegnum punkt — færðu hana aðeins til hliðar.';
      ok = false;
    } else {
      var correctSides = labeled.filter(function (p) { return p.correct; }).map(function (p) { return Math.sign(p.side); });
      var wrongSides   = labeled.filter(function (p) { return !p.correct; }).map(function (p) { return Math.sign(p.side); });
      var sepA = correctSides.every(function (s) { return s > 0; }) && wrongSides.every(function (s) { return s < 0; });
      var sepB = correctSides.every(function (s) { return s < 0; }) && wrongSides.every(function (s) { return s > 0; });
      if (sepA || sepB) {
        message = 'Rétt! Línan aðgreinir grænu punktana frá þeim rauðu.';
        ok = true;
      } else {
        message = 'Ekki alveg — reyndu að hafa alla grænu punktana öðrum megin við línuna.';
        ok = false;
      }
    }
    status.textContent = message;
    status.classList.toggle('is-ok',   ok);
    status.classList.toggle('is-fail', !ok);
    status.classList.toggle('is-xor',  currentRule === 'XOR');
  }

  // ====== pointer-meðhöndlun ======
  function clientToSvg(clientX, clientY) {
    var rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width  * W,
      y: (clientY - rect.top)  / rect.height * H
    };
  }

  function startDrag(which, e) {
    e.preventDefault();
    dragging = which;
    try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
  }
  handle1.addEventListener('pointerdown', function (e) { startDrag('p1', e); });
  handle2.addEventListener('pointerdown', function (e) { startDrag('p2', e); });

  svg.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var pt = clientToSvg(e.clientX, e.clientY);
    var pos = fromSvg(pt.x, pt.y);
    if (dragging === 'p1') p1 = pos;
    else if (dragging === 'p2') p2 = pos;
    update();
  });
  function endDrag() { dragging = null; }
  svg.addEventListener('pointerup',     endDrag);
  svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('pointerleave',  endDrag);

  // lyklaborð: pílur færa endapunkt sem hefur fókus
  function makeKeyHandler(which) {
    return function (e) {
      var step = e.shiftKey ? 0.10 : 0.04;
      var target = which === 'p1' ? p1 : p2;
      var changed = true;
      if (e.key === 'ArrowLeft')       target.x -= step;
      else if (e.key === 'ArrowRight') target.x += step;
      else if (e.key === 'ArrowDown')  target.y -= step;
      else if (e.key === 'ArrowUp')    target.y += step;
      else changed = false;
      if (changed) {
        target.x = Math.max(-0.25, Math.min(1.45, target.x));
        target.y = Math.max(-0.25, Math.min(1.45, target.y));
        e.preventDefault();
        update();
      }
    };
  }
  handle1.addEventListener('keydown', makeKeyHandler('p1'));
  handle2.addEventListener('keydown', makeKeyHandler('p2'));

  update();
}
