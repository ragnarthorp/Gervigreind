/* ---------- Neuron: Weight, Bias og Loss ---------- */
function renderNeuronLoss(figure) {
  figure.className = 'neuronloss-figure';
  figure.setAttribute('aria-label', 'Gagnvirkur neuron-skoðari: stilltu weight og bias til að lágmarka loss');

  /* ---------- Gagnasett ---------- */
  var DATASETS = [
    {
      label: 'Gagnasett 1',
      desc: 'Einföld jákvæð línuleg fylgni',
      seed: 42,
      trueW: 0.8, trueB: 0.1, noiseAmp: 0.24
    },
    {
      label: 'Gagnasett 2',
      desc: 'Neikvæð fylgni, brattari lína',
      seed: 77,
      trueW: -1.2, trueB: -0.2, noiseAmp: 0.30
    },
    {
      label: 'Gagnasett 3',
      desc: 'Veik fylgni – meira hávaði í gögnum',
      seed: 13,
      trueW: 0.4, trueB: 0.3, noiseAmp: 0.70
    }
  ];
  var N_POINTS = 30;

  function makeSeed(n) {
    var s = n;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  function generateData(ds) {
    var rng = makeSeed(ds.seed);
    var pts = [];
    for (var i = 0; i < N_POINTS; i++) {
      var x = rng() * 2 - 1;
      var y = ds.trueW * x + ds.trueB + (rng() * ds.noiseAmp - ds.noiseAmp / 2);
      pts.push({ x: x, y: y });
    }
    return pts;
  }

  var allData = DATASETS.map(generateData);
  var currentDS = 0;

  /* ---------- HTML uppbygging ---------- */
  figure.appendChild(el('figcaption', { class: 'neuronloss-title', text: 'Neuron: weight, bias og loss' }));

  /* Flippar fyrir gagnasett */
  var tabBar = el('div', { class: 'neuronloss-tabs' });
  var tabs = DATASETS.map(function (ds, i) {
    var btn = el('button', { type: 'button', class: 'neuronloss-tab' + (i === 0 ? ' is-active' : ''), text: ds.label });
    btn.addEventListener('click', function () { switchDataset(i); });
    tabBar.appendChild(btn);
    return btn;
  });
  figure.appendChild(tabBar);

  var dsDesc = el('p', { class: 'neuronloss-desc', text: DATASETS[0].desc });
  figure.appendChild(dsDesc);

  /* Aðalrammi: canvas + stýringar hlið við hlið */
  var layout = el('div', { class: 'neuronloss-layout' });

  /* Canvas */
  var canvas = el('canvas', { class: 'neuronloss-canvas', width: '300', height: '300' });
  layout.appendChild(canvas);
  var ctx2d = canvas.getContext('2d');

  /* Stýringar */
  var controls = el('div', { class: 'neuronloss-controls' });

  /* Weight sleði */
  var wRow = el('div', { class: 'neuronloss-row' });
  wRow.appendChild(el('span', { class: 'neuronloss-slabel neuronloss-slabel--w', text: 'weight' }));
  var wSlider = el('input', { type: 'range', min: '-2', max: '2', step: '0.01', value: '0', class: 'neuronloss-slider neuronloss-slider--w', 'aria-label': 'Weight' });
  wRow.appendChild(wSlider);
  var wVal = el('span', { class: 'neuronloss-sval', text: '0.00' });
  wRow.appendChild(wVal);
  controls.appendChild(wRow);

  /* Bias sleði */
  var bRow = el('div', { class: 'neuronloss-row' });
  bRow.appendChild(el('span', { class: 'neuronloss-slabel neuronloss-slabel--b', text: 'bias' }));
  var bSlider = el('input', { type: 'range', min: '-1', max: '1', step: '0.01', value: '0', class: 'neuronloss-slider neuronloss-slider--b', 'aria-label': 'Bias' });
  bRow.appendChild(bSlider);
  var bVal = el('span', { class: 'neuronloss-sval', text: '0.00' });
  bRow.appendChild(bVal);
  controls.appendChild(bRow);

  /* Jafna */
  var formula = el('p', { class: 'neuronloss-formula' });
  var fStatic1 = el('span', { text: 'neuron(x) = ' });
  var fW = el('span', { class: 'neuronloss-fw', text: '0.00' });
  var fStatic2 = el('span', { text: 'x + ' });
  var fB = el('span', { class: 'neuronloss-fb', text: '0.00' });
  formula.appendChild(fStatic1);
  formula.appendChild(fW);
  formula.appendChild(fStatic2);
  formula.appendChild(fB);
  controls.appendChild(formula);

  /* Loss gildi */
  var lossRow = el('div', { class: 'neuronloss-loss-row' });
  var lossLabel = el('span', { class: 'neuronloss-loss-label', text: 'loss = MSE' });
  var lossVal = el('span', { class: 'neuronloss-loss-val', text: '–' });
  lossRow.appendChild(lossLabel);
  lossRow.appendChild(lossVal);
  controls.appendChild(lossRow);

  /* Framvindustika */
  var barWrap = el('div', { class: 'neuronloss-bar-wrap' });
  var barFill = el('div', { class: 'neuronloss-bar-fill' });
  barWrap.appendChild(barFill);
  controls.appendChild(barWrap);

  /* Vísbending */
  var hint = el('p', { class: 'neuronloss-hint', text: 'Dragðu sleðana og sjáðu hvernig línan færist.' });
  controls.appendChild(hint);

  layout.appendChild(controls);
  figure.appendChild(layout);

  /* ---------- Hjálparföll ---------- */
  function toCanv(v, size) { return (v + 1) / 2 * (size - 40) + 20; }

  function drawScene(w, b) {
    var s = canvas.width;
    ctx2d.clearRect(0, 0, s, s);

    var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var gridCol = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    var axisCol = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
    var dotCol  = isDark ? 'rgba(200,200,200,0.60)' : 'rgba(70,70,70,0.55)';

    /* Ristarlínur */
    ctx2d.strokeStyle = gridCol; ctx2d.lineWidth = 0.5;
    [-0.5, 0, 0.5].forEach(function (v) {
      var px = toCanv(v, s);
      ctx2d.beginPath(); ctx2d.moveTo(px, 20); ctx2d.lineTo(px, s - 20); ctx2d.stroke();
      ctx2d.beginPath(); ctx2d.moveTo(20, px); ctx2d.lineTo(s - 20, px); ctx2d.stroke();
    });

    /* Ásalínur */
    ctx2d.strokeStyle = axisCol; ctx2d.lineWidth = 1;
    var zero = toCanv(0, s);
    ctx2d.beginPath(); ctx2d.moveTo(zero, 20); ctx2d.lineTo(zero, s - 20); ctx2d.stroke();
    ctx2d.beginPath(); ctx2d.moveTo(20, zero); ctx2d.lineTo(s - 20, zero); ctx2d.stroke();

    /* Ásamerki */
    var lblCol = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)';
    ctx2d.fillStyle = lblCol; ctx2d.font = '10px sans-serif'; ctx2d.textAlign = 'center';
    [-1, -0.5, 0, 0.5, 1].forEach(function (v) {
      var px = toCanv(v, s);
      ctx2d.fillText(v === 0 ? '0' : v.toFixed(1), px, s - 5);
      if (v !== 0) {
        ctx2d.textAlign = 'right';
        ctx2d.fillText(v.toFixed(1), 17, s - px + 4);
        ctx2d.textAlign = 'center';
      }
    });

    /* Gagnapunktar */
    allData[currentDS].forEach(function (pt) {
      ctx2d.beginPath(); ctx2d.arc(toCanv(pt.x, s), s - toCanv(pt.y, s), 3.5, 0, Math.PI * 2);
      ctx2d.fillStyle = dotCol; ctx2d.fill();
    });

    /* Spálína */
    ctx2d.beginPath();
    ctx2d.moveTo(toCanv(-1.2, s), s - toCanv(w * -1.2 + b, s));
    ctx2d.lineTo(toCanv( 1.2, s), s - toCanv(w *  1.2 + b, s));
    ctx2d.strokeStyle = '#1D9E75'; ctx2d.lineWidth = 2; ctx2d.stroke();
  }

  function calcMSE(w, b) {
    var pts = allData[currentDS];
    var sum = 0;
    for (var i = 0; i < pts.length; i++) {
      var e = (w * pts[i].x + b) - pts[i].y;
      sum += e * e;
    }
    return sum / pts.length;
  }

  function update() {
    var w = parseFloat(wSlider.value);
    var b = parseFloat(bSlider.value);

    wVal.textContent = w.toFixed(2);
    bVal.textContent = b.toFixed(2);
    fW.textContent   = w.toFixed(2);
    fB.textContent   = b.toFixed(2);

    var loss = calcMSE(w, b);
    lossVal.textContent = loss.toFixed(4);

    var pct = Math.min(100, (loss / 0.6) * 100).toFixed(1);
    barFill.style.width = pct + '%';

    var col = loss < 0.02 ? '#3B6D11' : loss < 0.06 ? '#BA7517' : '#E24B4A';
    barFill.style.background = col;
    lossVal.style.color = col;

    if (loss < 0.015)     hint.textContent = '🎯 Frábært! Loss er mjög lágt – þú fanst bestu línu!';
    else if (loss < 0.05) hint.textContent = 'Gott! Þú ert að nálgast – haltu áfram.';
    else                  hint.textContent = 'Dragðu sleðana og sjáðu hvernig línan færist.';

    drawScene(w, b);
  }

  function switchDataset(i) {
    currentDS = i;
    tabs.forEach(function (t, j) {
      t.className = 'neuronloss-tab' + (j === i ? ' is-active' : '');
    });
    dsDesc.textContent = DATASETS[i].desc;
    wSlider.value = '0';
    bSlider.value = '0';
    update();
  }

  /* ---------- Viðburðahlustendur ---------- */
  wSlider.addEventListener('input', update);
  bSlider.addEventListener('input', update);

  /* ---------- Fyrsta teikning ---------- */
  update();
}