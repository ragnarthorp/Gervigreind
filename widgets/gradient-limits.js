/* ---------- Vanishing / Exploding Gradient ---------- */
function renderGradientLimits(figure) {
  figure.className = 'vanex-figure';
  figure.setAttribute('aria-label',
    'Sýning á því hvernig afleiða margfaldast veldislega gegnum lög í djúpu tauganeti.');

  figure.appendChild(el('figcaption', {
    class: 'vanex-title',
    text: 'Af hverju afturflutningur missir tökin'
  }));
  figure.appendChild(el('p', {
    class: 'vanex-hint',
    text: 'Stilltu afleiðu á hverju lagi og dýpt netsins. Þegar afleiðan er aðeins frábrugðin 1 magnast munurinn upp veldislega — afleiðan hverfur eða springur, og netið hættir að læra.'
  }));

  // ---- state ----
  var multiplier = 0.5;
  var depth = 10;

  // ---- sliders ----
  function buildSlider(opts) {
    var wrap = el('div', { class: 'vanex-slider-wrap' });
    var head = el('div', { class: 'vanex-slider-head' });
    head.appendChild(el('span', { class: 'vanex-slider-label', text: opts.label }));
    var valueEl = el('span', { class: 'vanex-slider-value', text: '' });
    head.appendChild(valueEl);
    wrap.appendChild(head);
    var slider = el('input', {
      type: 'range',
      min: String(opts.min),
      max: String(opts.max),
      value: String(opts.value),
      step: String(opts.step),
      class: 'vanex-slider'
    });
    wrap.appendChild(slider);
    return { wrap: wrap, slider: slider, value: valueEl };
  }

  var mulCtl = buildSlider({
    label: 'AFLEIÐA Á HVERJU LAGI',
    min: 30, max: 170, value: 50, step: 1
  });
  mulCtl.slider.addEventListener('input', function () {
    multiplier = parseInt(this.value, 10) / 100;
    update();
  });

  var depthCtl = buildSlider({
    label: 'DÝPT NETSINS',
    min: 3, max: 25, value: 10, step: 1
  });
  depthCtl.slider.addEventListener('input', function () {
    depth = parseInt(this.value, 10);
    update();
  });

  var sliders = el('div', { class: 'vanex-sliders' });
  sliders.appendChild(mulCtl.wrap);
  sliders.appendChild(depthCtl.wrap);
  figure.appendChild(sliders);

  // ---- chart ----
  var chartCard = el('div', { class: 'vanex-chart-card' });
  var chartLabel = el('div', { class: 'vanex-chart-label', text: 'STÆRÐ AFLEIÐU GEGNUM LÖG · LOG₁₀-KVARÐI' });
  chartCard.appendChild(chartLabel);

  var svgNS = 'http://www.w3.org/2000/svg';
  var W = 420, H = 200, PAD_L = 50, PAD_R = 16, PAD_T = 16, PAD_B = 36;
  var Y_MIN = -12, Y_MAX = 12;

  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.setAttribute('class', 'vanex-chart');
  svg.setAttribute('aria-hidden', 'true');

  function svgEl(tag, attrs) {
    var n = document.createElementNS(svgNS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function xOf(i, N) {
    if (N <= 0) return PAD_L;
    return PAD_L + (i / N) * (W - PAD_L - PAD_R);
  }
  function yOf(logVal) {
    var clamped = Math.max(Y_MIN, Math.min(Y_MAX, logVal));
    var t = (clamped - Y_MIN) / (Y_MAX - Y_MIN);
    return H - PAD_B - t * (H - PAD_T - PAD_B);
  }

  // axes
  svg.appendChild(svgEl('line', {
    x1: PAD_L, y1: H - PAD_B, x2: W - PAD_R, y2: H - PAD_B, class: 'vanex-axis'
  }));
  svg.appendChild(svgEl('line', {
    x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: H - PAD_B, class: 'vanex-axis'
  }));

  // gridlines + y labels (powers of 10)
  [-10, -5, 0, 5, 10].forEach(function (logV) {
    var y = yOf(logV);
    if (logV !== 0) {
      svg.appendChild(svgEl('line', {
        x1: PAD_L, y1: y, x2: W - PAD_R, y2: y, class: 'vanex-grid'
      }));
    } else {
      // stable line at value=1
      svg.appendChild(svgEl('line', {
        x1: PAD_L, y1: y, x2: W - PAD_R, y2: y, class: 'vanex-stable-line'
      }));
    }
    var label = logV === 0 ? '1' : '10^' + (logV > 0 ? logV : logV);
    var txt = svgEl('text', {
      x: PAD_L - 6, y: y + 3,
      'text-anchor': 'end',
      class: 'vanex-tick'
    });
    txt.textContent = label;
    svg.appendChild(txt);
  });

  // x label
  var xLabel = svgEl('text', {
    x: (PAD_L + W - PAD_R) / 2, y: H - 6,
    'text-anchor': 'middle',
    class: 'vanex-axis-label'
  });
  xLabel.textContent = 'lag (frá útgangi til ílags)';
  svg.appendChild(xLabel);

  // line that we update
  var dataLine = svgEl('polyline', { class: 'vanex-line' });
  svg.appendChild(dataLine);
  var endMarker = svgEl('circle', { r: 5, class: 'vanex-marker' });
  svg.appendChild(endMarker);

  chartCard.appendChild(svg);
  figure.appendChild(chartCard);

  // ---- result + status ----
  var result = el('div', { class: 'vanex-result' });
  var resultEyebrow = el('div', { class: 'vanex-result-eyebrow', text: '' });
  var resultValue = el('div', { class: 'vanex-result-value', text: '' });
  var resultText = el('p', { class: 'vanex-result-text', text: '' });
  result.appendChild(resultEyebrow);
  result.appendChild(resultValue);
  result.appendChild(resultText);
  figure.appendChild(result);

  function formatValue(v) {
    var av = Math.abs(v);
    if (av === 0) return '0';
    if (av >= 1e6 || av < 1e-4) return v.toExponential(2).replace('e', '·10^').replace('+', '');
    if (av >= 1)   return v.toFixed(av >= 100 ? 0 : 2);
    if (av >= 0.01) return v.toFixed(3);
    return v.toFixed(5);
  }

  function update() {
    mulCtl.value.textContent = multiplier.toFixed(2);
    depthCtl.value.textContent = depth + ' lög';

    var finalVal = Math.pow(multiplier, depth);
    var logFinal = Math.log10(finalVal);

    // build polyline points
    var pts = [];
    for (var i = 0; i <= depth; i++) {
      var logV = i * Math.log10(multiplier);
      pts.push(xOf(i, depth) + ',' + yOf(logV));
    }
    dataLine.setAttribute('points', pts.join(' '));

    var endY = yOf(logFinal);
    var endX = xOf(depth, depth);
    endMarker.setAttribute('cx', endX);
    endMarker.setAttribute('cy', endY);

    // status
    var kind;
    if (multiplier >= 0.95 && multiplier <= 1.05) kind = 'stable';
    else if (multiplier < 1) kind = 'vanish';
    else kind = 'explode';

    figure.classList.remove('is-vanish', 'is-explode', 'is-stable');
    figure.classList.add('is-' + kind);

    if (kind === 'stable') {
      resultEyebrow.textContent = 'STÖÐUG';
      resultText.textContent = 'Þegar afleiðan er nálægt 1 helst hún stöðug og afturflutningur virkar áfram. Þetta er eina sviðið þar sem djúp net læra að uppsetju.';
    } else if (kind === 'vanish') {
      resultEyebrow.textContent = 'HVERFUR';
      resultText.textContent = 'Eftir nokkur lög er afleiðan orðin svo lítil að hún er gagnslaus. Lögin sem eru lengst frá frálaginu fá ekkert að læra — leiðréttingin nær aldrei alla leið.';
    } else {
      resultEyebrow.textContent = 'SPRINGUR';
      resultText.textContent = 'Afleiðan vex svo hratt að talan verður stjarnfræðilega stór. Þjálfunin verður óstöðug og netið skilar gagnslausum úttökum eða krasar.';
    }
    resultValue.textContent = 'Eftir ' + depth + ' lög: ' + formatValue(finalVal);
  }

  update();
}
