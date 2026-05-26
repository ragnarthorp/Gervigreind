/* ---------- RGB-litaskynsleikur ---------- */
function renderRgbGame(figure) {
  figure.className = 'rgbgame-figure';
  figure.setAttribute('aria-label', 'Litaskynsleikur: giskaðu á RGB-gildi litar');

  figure.appendChild(el('figcaption', { class: 'rgbgame-title', text: 'Prófaðu litaskyn þitt' }));
  figure.appendChild(el('p', { class: 'rgbgame-intro',
    text: 'Hér er litur. Stilltu R, G og B stikurnar þar til þú telur þig hafa fundið hann. Hversu nákvæmt litaskyn hefurðu?' }));

  var MODES = [
    { key: 'easy',   label: 'Auðvelt',   channels: ['r'],        hint: 'Aðeins rauð rás' },
    { key: 'medium', label: 'Miðlungs',  channels: ['r','g'],    hint: 'Rauð og græn' },
    { key: 'hard',   label: 'Erfitt',    channels: ['r','g','b'], hint: 'Allar þrjár rásir' }
  ];
  var currentMode = MODES[2];
  var modeBar = el('div', { class: 'rgbgame-modebar' });
  var modeBtns = [];
  MODES.forEach(function(m) {
    var btn = el('button', { class: 'rgbgame-modebtn' + (m.key === 'hard' ? ' is-active' : ''),
      type: 'button', text: m.label });
    btn.addEventListener('click', function() {
      currentMode = m;
      modeBtns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      newRound();
    });
    modeBar.appendChild(btn);
    modeBtns.push(btn);
  });
  figure.appendChild(modeBar);

  var colorRow = el('div', { class: 'rgbgame-colorrow' });

  var targetWrap = el('div', { class: 'rgbgame-colorblock-wrap' });
  var targetSwatch = el('div', { class: 'rgbgame-swatch', 'aria-label': 'Markmiðsliturinn' });
  var targetLbl = el('p', { class: 'rgbgame-swatch-lbl', text: 'Markmiðið' });
  targetWrap.appendChild(targetSwatch);
  targetWrap.appendChild(targetLbl);

  var guessWrap = el('div', { class: 'rgbgame-colorblock-wrap' });
  var guessSwatch = el('div', { class: 'rgbgame-swatch', 'aria-label': 'Gisk þitt' });
  var guessLbl = el('p', { class: 'rgbgame-swatch-lbl', text: 'Gisk þitt' });
  guessWrap.appendChild(guessSwatch);
  guessWrap.appendChild(guessLbl);

  colorRow.appendChild(targetWrap);
  colorRow.appendChild(guessWrap);
  figure.appendChild(colorRow);

  var slidersWrap = el('div', { class: 'rgbgame-sliders' });
  var sliderDefs = [
    { key: 'r', label: 'R — rauður', cls: 'rgbgame-ch-r' },
    { key: 'g', label: 'G — grænn',  cls: 'rgbgame-ch-g' },
    { key: 'b', label: 'B — blár',   cls: 'rgbgame-ch-b' }
  ];
  var sliderCtls = {};
  sliderDefs.forEach(function(d) {
    var row = el('div', { class: 'rgbgame-sliderrow ' + d.cls });
    var head = el('div', { class: 'rgbgame-sliderhead' });
    head.appendChild(el('span', { class: 'rgbgame-sliderlbl', text: d.label }));
    var valEl = el('span', { class: 'rgbgame-sliderval', text: '128' });
    head.appendChild(valEl);
    row.appendChild(head);
    var slider = el('input', { type: 'range', min: '0', max: '255', value: '128', step: '1',
      class: 'rgbgame-slider', 'aria-label': d.label });
    row.appendChild(slider);
    slidersWrap.appendChild(row);
    sliderCtls[d.key] = { slider: slider, valEl: valEl, row: row };
    slider.addEventListener('input', function() {
      guess[d.key] = parseInt(slider.value, 10);
      valEl.textContent = slider.value;
      updateGuess();
    });
  });
  figure.appendChild(slidersWrap);

  var btnRow = el('div', { class: 'rgbgame-btnrow' });
  var checkBtn = el('button', { class: 'rgbgame-btn rgbgame-btn-primary', type: 'button', text: '🎯 Athuga svar' });
  var newBtn   = el('button', { class: 'rgbgame-btn', type: 'button', text: '↻ Nýr litur' });
  btnRow.appendChild(checkBtn);
  btnRow.appendChild(newBtn);
  figure.appendChild(btnRow);

  var resultBox = el('div', { class: 'rgbgame-result', role: 'status', 'aria-live': 'polite' });
  figure.appendChild(resultBox);

  var scoreSection = el('div', { class: 'rgbgame-scoreboard' });
  var scoreTitle = el('p', { class: 'rgbgame-score-title', text: 'Bestu tilraunir' });
  var scoreList  = el('div', { class: 'rgbgame-score-list' });
  scoreSection.appendChild(scoreTitle);
  scoreSection.appendChild(scoreList);
  figure.appendChild(scoreSection);

  var target  = { r: 128, g: 128, b: 128 };
  var guess   = { r: 128, g: 128, b: 128 };
  var scores  = [];
  var checked = false;

  function randInt(max) { return Math.floor(Math.random() * (max + 1)); }

  function rgbDist(a, b) {
    var dr = a.r - b.r, dg = a.g - b.g, db = a.b - b.b;
    return Math.sqrt(dr*dr + dg*dg + db*db) / Math.sqrt(3 * 255 * 255);
  }

  function scoreLabel(pct) {
    if (pct >= 99) return '🏆 Fullkomið!';
    if (pct >= 95) return '⭐ Frábært!';
    if (pct >= 85) return '✓ Mjög gott';
    if (pct >= 70) return 'Ágætt';
    if (pct >= 50) return 'Svipað';
    return 'Reyndu aftur';
  }

  function channelBar(key, tVal, gVal) {
    var diff = Math.abs(tVal - gVal);
    var arrow = gVal < tVal ? '↑' : gVal > tVal ? '↓' : '✓';
    var cls = diff === 0 ? 'is-exact' : diff < 20 ? 'is-close' : 'is-far';
    return '<div class="rgbgame-chbar ' + cls + '">'
      + '<span class="rgbgame-chbar-key">' + key.toUpperCase() + '</span>'
      + '<span class="rgbgame-chbar-vals">Markmið: <strong>' + tVal + '</strong> · Gisk: <strong>' + gVal + '</strong></span>'
      + '<span class="rgbgame-chbar-arrow">' + arrow + '</span>'
      + '</div>';
  }

  function updateGuess() {
    guessSwatch.style.backgroundColor = 'rgb(' + guess.r + ',' + guess.g + ',' + guess.b + ')';
    if (checked) showResult();
  }

  function showResult() {
    var dist = rgbDist(target, guess);
    var pct  = Math.round((1 - dist) * 100);
    var bars = currentMode.channels.map(function(k) {
      return channelBar(k, target[k], guess[k]);
    }).join('');
    resultBox.innerHTML =
      '<div class="rgbgame-score-num">' + pct + '%</div>'
      + '<div class="rgbgame-score-lbl">' + scoreLabel(pct) + '</div>'
      + '<div class="rgbgame-chbars">' + bars + '</div>'
      + (pct === 100
        ? '<div class="rgbgame-exact">Þú hittir hárrétt á litinn! 🎨</div>'
        : '<div class="rgbgame-target-reveal">Markmiðsliturinn er rgb(' + target.r + ', ' + target.g + ', ' + target.b + ')</div>');
    resultBox.classList.add('is-visible');
  }

  function newRound() {
    checked = false;
    resultBox.classList.remove('is-visible');
    resultBox.innerHTML = '';

    target.r = currentMode.channels.indexOf('r') !== -1 ? randInt(255) : 0;
    target.g = currentMode.channels.indexOf('g') !== -1 ? randInt(255) : 0;
    target.b = currentMode.channels.indexOf('b') !== -1 ? randInt(255) : 0;
    targetSwatch.style.backgroundColor = 'rgb(' + target.r + ',' + target.g + ',' + target.b + ')';

    sliderDefs.forEach(function(d) {
      var active = currentMode.channels.indexOf(d.key) !== -1;
      sliderCtls[d.key].row.style.display = active ? '' : 'none';
      sliderCtls[d.key].slider.value = '128';
      sliderCtls[d.key].valEl.textContent = '128';
      guess[d.key] = active ? 128 : 0;
    });

    guessSwatch.style.backgroundColor = 'rgb(' + guess.r + ',' + guess.g + ',' + guess.b + ')';
  }

  function recordScore() {
    var pct = Math.round((1 - rgbDist(target, guess)) * 100);
    scores.push({ pct: pct, mode: currentMode.label });
    scores.sort(function(a, b) { return b.pct - a.pct; });
    if (scores.length > 5) scores = scores.slice(0, 5);
    scoreList.innerHTML = scores.map(function(s, i) {
      return '<div class="rgbgame-score-row">'
        + '<span class="rgbgame-score-rank">#' + (i + 1) + '</span>'
        + '<span class="rgbgame-score-pct">' + s.pct + '%</span>'
        + '<span class="rgbgame-score-mode">' + s.mode + '</span>'
        + '</div>';
    }).join('');
    scoreSection.classList.add('is-visible');
  }

  checkBtn.addEventListener('click', function() {
    if (checked) return;
    checked = true;
    showResult();
    recordScore();
  });

  newBtn.addEventListener('click', newRound);
  newRound();
}