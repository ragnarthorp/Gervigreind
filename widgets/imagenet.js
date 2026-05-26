/* ---------- ImageNet 2010–2012: villuhlutfallið ---------- */
function renderImageNet(figure) {
  figure.className = 'imgnet-figure';
  figure.setAttribute('aria-label',
    'Súlurit yfir villuhlutfall í ImageNet-keppninni 2010, 2011 og 2012.');

  figure.appendChild(el('figcaption', {
    class: 'imgnet-title',
    text: 'ImageNet — villuhlutfall sigurvegara'
  }));
  figure.appendChild(el('p', {
    class: 'imgnet-hint',
    text: 'Smelltu og horfðu á árin koma upp eitt í einu. Lægri súla þýðir betri vélrænan sigurvegara — minni mistök.'
  }));

  // ---- Gögn ----
  var DATA = [
    { year: 2010, value: 28.2, team: 'NEC + Illinois', kind: 'classical' },
    { year: 2011, value: 25.7, team: 'Xerox / Frakkland', kind: 'classical' },
    { year: 2012, value: 15.3, team: 'AlexNet', kind: 'neural' }
  ];

  var MAX = 30;       // ás-hámark
  var bars = [];

  // ---- Súlna-svæði ----
  var board = el('div', { class: 'imgnet-board' });

  // y-ás (vinstri kvarði: 0% / 15% / 30%)
  var yAxis = el('div', { class: 'imgnet-yaxis' });
  ['30%','20%','10%','0%'].forEach(function (l) {
    yAxis.appendChild(el('span', { text: l }));
  });
  board.appendChild(yAxis);

  // ásalína við 0%
  board.appendChild(el('div', { class: 'imgnet-baseline' }));

  // grid-línur
  for (var g = 0; g < 3; g++) {
    var gl = el('div', { class: 'imgnet-gridline' });
    gl.style.bottom = ((g + 1) / 3 * 100) + '%';
    board.appendChild(gl);
  }

  // súlur
  DATA.forEach(function (d, i) {
    var col = el('div', { class: 'imgnet-col' });

    var bar = el('div', {
      class: 'imgnet-bar ' + (d.kind === 'neural' ? 'is-neural' : 'is-classical')
    });
    var pct = el('div', { class: 'imgnet-bar-pct', text: '' });
    bar.appendChild(pct);
    col.appendChild(bar);

    var foot = el('div', { class: 'imgnet-foot' });
    foot.appendChild(el('div', { class: 'imgnet-year', text: String(d.year) }));
    foot.appendChild(el('div', { class: 'imgnet-team', text: d.team }));
    col.appendChild(foot);

    board.appendChild(col);
    bars.push({ bar: bar, pct: pct, data: d });
  });

  figure.appendChild(board);

  // ---- Eftirskýring ----
  var reveal = el('div', { class: 'imgnet-reveal' });
  reveal.appendChild(el('p', {
    class: 'imgnet-reveal-text',
    text: 'Stökkið var næstum því 11 prósentustig á einu ári. Það sem fyrri sigurvegarar áorkuðu með smávægilegum tilraunum gerði AlexNet á einu kvöldi.'
  }));
  figure.appendChild(reveal);

  // ---- Hnappur ----
  var btnRow = el('div', { class: 'imgnet-btn-row' });
  var btn = el('button', {
    type: 'button',
    class: 'imgnet-btn',
    text: 'Sjá árin'
  });
  btnRow.appendChild(btn);
  figure.appendChild(btnRow);

  // ---- Hreyfimynd ----
  function reset() {
    bars.forEach(function (b) {
      b.bar.style.height = '0%';
      b.pct.textContent = '';
      b.bar.classList.remove('is-revealed');
    });
    reveal.classList.remove('is-visible');
  }

  function reveal_one(idx) {
    if (idx >= bars.length) {
      setTimeout(function () { reveal.classList.add('is-visible'); }, 350);
      btn.disabled = false;
      btn.textContent = 'Aftur';
      return;
    }
    var b = bars[idx];
    var h = (b.data.value / MAX) * 100;
    b.bar.style.height = h + '%';
    // teljari upp í gildið
    var start = performance.now();
    var DUR = 600;
    function step(now) {
      var t = Math.min(1, (now - start) / DUR);
      var ease = 1 - Math.pow(1 - t, 2);
      b.pct.textContent = (b.data.value * ease).toFixed(1) + '%';
      if (t < 1) requestAnimationFrame(step);
      else {
        b.pct.textContent = b.data.value.toFixed(1) + '%';
        b.bar.classList.add('is-revealed');
        setTimeout(function () { reveal_one(idx + 1); }, idx === 1 ? 550 : 350);
      }
    }
    requestAnimationFrame(step);
  }

  function play() {
    reset();
    btn.disabled = true;
    btn.textContent = 'Sýni …';
    setTimeout(function () { reveal_one(0); }, 200);
  }

  btn.addEventListener('click', play);
  reset();
}

