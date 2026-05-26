/* ---------- Lögmál Moores — smárar gegnum tímann ---------- */
function renderMooresLaw(figure) {
  figure.className = 'moores-figure';
  figure.setAttribute('aria-label',
    'Gagnvirkur ferðalag um lögmál Moores: dragðu sleðann frá 1965 til 2025 og sjáðu fjölda smára vaxa og stærð þeirra minnka.');

  figure.appendChild(el('figcaption', {
    class: 'moores-title',
    text: 'Lögmál Moores'
  }));
  figure.appendChild(el('p', {
    class: 'moores-hint',
    text: 'Renndu sleðanum gegnum árin. Fjöldi smára á einni flögu vex án afláts — og hver smári minnkar þangað til hann er orðinn smærri en sést með berum augum.'
  }));

  // -------- gögn --------
  // Ártal, fjöldi smára á flögu, stærð (gate length) í nanómetrum, dæmigerð flaga
  var DATA = [
    { year: 1965, count: 50,            sizeNm: 25000, chip: 'Fyrstu kísilflögur' },
    { year: 1971, count: 2300,          sizeNm: 10000, chip: 'Intel 4004' },
    { year: 1978, count: 29000,         sizeNm: 3000,  chip: 'Intel 8086' },
    { year: 1985, count: 275000,        sizeNm: 1500,  chip: 'Intel 386' },
    { year: 1993, count: 3100000,       sizeNm: 800,   chip: 'Pentium' },
    { year: 2000, count: 42000000,      sizeNm: 180,   chip: 'Pentium 4' },
    { year: 2007, count: 291000000,     sizeNm: 65,    chip: 'Core 2 Duo (iPhone-ár)' },
    { year: 2012, count: 1400000000,    sizeNm: 22,    chip: 'Ivy Bridge' },
    { year: 2017, count: 19200000000,   sizeNm: 10,    chip: 'NVIDIA GV100 GPU' },
    { year: 2020, count: 39500000000,   sizeNm: 7,     chip: 'Apple M1 (síðar)' },
    { year: 2023, count: 134000000000,  sizeNm: 3,     chip: 'Apple M3 Max' },
    { year: 2025, count: 200000000000,  sizeNm: 2,     chip: 'Apple M4 / Blackwell' }
  ];

  // ---- layout ----
  var grid = el('div', { class: 'moores-grid' });

  // Vinstri: fjöldi smára
  var leftCard = el('div', { class: 'moores-card' });
  leftCard.appendChild(el('div', { class: 'moores-card-label', text: 'FJÖLDI SMÁRA Á FLÖGU' }));
  var countBig = el('div', { class: 'moores-count', text: '0' });
  leftCard.appendChild(countBig);
  var countWord = el('div', { class: 'moores-count-word', text: '' });
  leftCard.appendChild(countWord);
  grid.appendChild(leftCard);

  // Hægri: stærð smára
  var rightCard = el('div', { class: 'moores-card' });
  rightCard.appendChild(el('div', { class: 'moores-card-label', text: 'STÆRÐ EINS SMÁRA' }));
  var sizeBig = el('div', { class: 'moores-size', text: '0' });
  rightCard.appendChild(sizeBig);
  var sizeUnit = el('div', { class: 'moores-size-unit', text: 'nanómetrar' });
  rightCard.appendChild(sizeUnit);
  // litla ferningurinn sem minnkar
  var sizeViz = el('div', { class: 'moores-size-viz', 'aria-hidden': 'true' });
  var sizeSquare = el('div', { class: 'moores-size-square' });
  sizeViz.appendChild(sizeSquare);
  rightCard.appendChild(sizeViz);
  grid.appendChild(rightCard);

  figure.appendChild(grid);

  // ---- Kúrva-rað: línuleg + lograf hlið við hlið ----
  var charts = el('div', { class: 'moores-charts' });

  function buildChart(kind, label, sublabel) {
    var card = el('div', { class: 'moores-chart-card' });
    card.appendChild(el('div', { class: 'moores-chart-label', text: label }));
    card.appendChild(el('div', { class: 'moores-chart-sub', text: sublabel }));

    var svgNS = 'http://www.w3.org/2000/svg';
    var W = 260, H = 140, PAD_L = 36, PAD_R = 8, PAD_T = 10, PAD_B = 22;
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'moores-chart-svg');
    svg.setAttribute('aria-hidden', 'true');

    function svgEl(tag, attrs) {
      var n = document.createElementNS(svgNS, tag);
      if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    var minLog = Math.log10(DATA[0].count);
    var maxLog = Math.log10(DATA[DATA.length - 1].count);
    var minLin = 0;
    var maxLin = DATA[DATA.length - 1].count;
    var minYr  = DATA[0].year, maxYr = DATA[DATA.length - 1].year;

    function xOf(year) {
      return PAD_L + ((year - minYr) / (maxYr - minYr)) * (W - PAD_L - PAD_R);
    }
    function yOf(count) {
      if (kind === 'log') {
        var t = (Math.log10(count) - minLog) / (maxLog - minLog);
        return H - PAD_B - t * (H - PAD_T - PAD_B);
      }
      var u = count / maxLin;
      return H - PAD_B - u * (H - PAD_T - PAD_B);
    }

    // y-ás og x-ás
    svg.appendChild(svgEl('line', {
      x1: PAD_L, y1: H - PAD_B, x2: W - PAD_R, y2: H - PAD_B,
      class: 'moores-chart-axis'
    }));
    svg.appendChild(svgEl('line', {
      x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: H - PAD_B,
      class: 'moores-chart-axis'
    }));

    // y-ás merkingar
    var yTicks;
    if (kind === 'log') {
      yTicks = [
        { v: 100, t: '10²' },
        { v: 10000, t: '10⁴' },
        { v: 1000000, t: '10⁶' },
        { v: 100000000, t: '10⁸' },
        { v: 10000000000, t: '10¹⁰' }
      ];
    } else {
      yTicks = [
        { v: 0,            t: '0' },
        { v: maxLin * 0.5, t: '100 mrð' },
        { v: maxLin,       t: '200 mrð' }
      ];
    }
    yTicks.forEach(function (tk) {
      var y = yOf(tk.v);
      if (y < PAD_T - 1 || y > H - PAD_B + 1) return;
      svg.appendChild(svgEl('line', {
        x1: PAD_L - 4, y1: y, x2: PAD_L, y2: y,
        class: 'moores-chart-axis'
      }));
      svg.appendChild(svgEl('line', {
        x1: PAD_L, y1: y, x2: W - PAD_R, y2: y,
        class: 'moores-chart-grid'
      }));
      var txt = svgEl('text', {
        x: PAD_L - 6, y: y + 3,
        'text-anchor': 'end',
        class: 'moores-chart-tick'
      });
      txt.textContent = tk.t;
      svg.appendChild(txt);
    });

    // x-ás ártöl
    ['1965', '1995', '2025'].forEach(function (yr) {
      var x = xOf(parseInt(yr, 10));
      svg.appendChild(svgEl('line', {
        x1: x, y1: H - PAD_B, x2: x, y2: H - PAD_B + 4,
        class: 'moores-chart-axis'
      }));
      var t = svgEl('text', {
        x: x, y: H - PAD_B + 14,
        'text-anchor': 'middle',
        class: 'moores-chart-tick'
      });
      t.textContent = yr;
      svg.appendChild(t);
    });

    // það sem var: fullur ferill (faðmast af opacity), og virki hluti yfir.
    var fullPath = svgEl('polyline', {
      class: 'moores-chart-line is-full',
      points: DATA.map(function (d) { return xOf(d.year) + ',' + yOf(d.count); }).join(' ')
    });
    svg.appendChild(fullPath);

    var activePath = svgEl('polyline', { class: 'moores-chart-line is-active' });
    svg.appendChild(activePath);

    // 12 daufir punktar undir, einn búrinn punktur fyrir ofan (markeri)
    var dotEls = DATA.map(function (d) {
      var c = svgEl('circle', {
        cx: xOf(d.year), cy: yOf(d.count), r: 2,
        class: 'moores-chart-dot'
      });
      svg.appendChild(c);
      return c;
    });
    var marker = svgEl('circle', { r: 5, class: 'moores-chart-marker' });
    svg.appendChild(marker);

    card.appendChild(svg);
    charts.appendChild(card);

    return {
      update: function (idx) {
        var pts = DATA.slice(0, idx + 1).map(function (d) {
          return xOf(d.year) + ',' + yOf(d.count);
        }).join(' ');
        activePath.setAttribute('points', pts);
        var d = DATA[idx];
        marker.setAttribute('cx', xOf(d.year));
        marker.setAttribute('cy', yOf(d.count));
        dotEls.forEach(function (el, i) {
          el.classList.toggle('is-passed', i <= idx);
        });
      }
    };
  }

  var chartLin = buildChart('linear', 'LÍNULEGT', 'á eðlilegum kvarða');
  var chartLog = buildChart('log',    'LOGRAF-KVARÐI', 'á log₁₀-kvarða');
  figure.appendChild(charts);

  // Mannshár-samanburður
  var hair = el('div', { class: 'moores-hair' });
  hair.appendChild(el('div', { class: 'moores-hair-label', text: 'BREIDD MANNSHÁRS · 75.000 nm' }));
  var hairBar = el('div', { class: 'moores-hair-bar' });
  var hairFill = el('div', { class: 'moores-hair-fill', 'aria-hidden': 'true' });
  hairBar.appendChild(hairFill);
  hair.appendChild(hairBar);
  var hairText = el('div', { class: 'moores-hair-text', text: '' });
  hair.appendChild(hairText);
  figure.appendChild(hair);

  // Sleði + örvatakkar
  var sliderRow = el('div', { class: 'moores-slider-row' });
  var yearLabel = el('span', { class: 'moores-year', text: '1965' });
  sliderRow.appendChild(yearLabel);
  var prevBtn = el('button', {
    type: 'button',
    class: 'moores-step',
    'aria-label': 'Fyrra ár'
  });
  prevBtn.textContent = '◀';
  sliderRow.appendChild(prevBtn);
  var slider = el('input', {
    type: 'range', min: '0', max: String(DATA.length - 1), value: '0', step: '1',
    class: 'moores-slider',
    'aria-label': 'Ár frá 1965 til 2025'
  });
  sliderRow.appendChild(slider);
  var nextBtn = el('button', {
    type: 'button',
    class: 'moores-step',
    'aria-label': 'Næsta ár'
  });
  nextBtn.textContent = '▶';
  sliderRow.appendChild(nextBtn);
  var chipLabel = el('span', { class: 'moores-chip', text: DATA[0].chip });
  sliderRow.appendChild(chipLabel);
  figure.appendChild(sliderRow);

  // ár-merkingar undir sleðanum (sex jafndreifðar)
  var scale = el('div', { class: 'moores-scale' });
  ['1965','1980','1995','2010','2025'].forEach(function (y) {
    scale.appendChild(el('span', { text: y }));
  });
  figure.appendChild(scale);

  // -------- formatting --------
  function formatCount(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(n >= 10e9 ? 0 : 1) + ' milljarðar';
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 10e6 ? 0 : 1) + ' milljónir';
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 10e3 ? 0 : 1) + ' þúsund';
    return String(Math.round(n));
  }
  function formatNumericCount(n) {
    return Math.round(n).toLocaleString('is-IS');
  }
  function formatSize(nm) {
    if (nm >= 1000) return (nm / 1000).toFixed(nm >= 10000 ? 0 : 1) + ' µm';
    return nm + ' nm';
  }
  function hairFraction(nm) {
    // 75 µm = 75000 nm hár
    return (nm / 75000) * 100;
  }

  function update(idx) {
    var d = DATA[idx];
    yearLabel.textContent = String(d.year);
    chipLabel.textContent = d.chip;

    countBig.textContent = formatNumericCount(d.count);
    countWord.textContent = '≈ ' + formatCount(d.count);

    sizeBig.textContent = formatSize(d.sizeNm);
    sizeUnit.textContent = d.sizeNm >= 1000 ? 'míkrómetrar' : 'nanómetrar';

    // ferningur minnkar
    // Hámark 100 px, lágmark 4 px. log-skala milli 2 og 25.000
    var minNm = 2, maxNm = 25000;
    var t = (Math.log(d.sizeNm) - Math.log(minNm)) / (Math.log(maxNm) - Math.log(minNm));
    var px = 4 + t * 96;
    sizeSquare.style.width  = px + 'px';
    sizeSquare.style.height = px + 'px';

    // hár-strikið
    var pct = hairFraction(d.sizeNm);
    if (pct >= 1) {
      hairFill.style.width = Math.min(100, pct) + '%';
      hairText.textContent = 'Smárinn er um ' + (pct).toFixed(0) + '% af breidd hárs.';
    } else if (pct >= 0.1) {
      hairFill.style.width = Math.max(0.5, pct) + '%';
      hairText.textContent = 'Smárinn er ' + (pct).toFixed(1) + '% af breidd hárs — innan við hundraðasta hluta.';
    } else {
      hairFill.style.width = '0.2%';
      var times = Math.round(75000 / d.sizeNm);
      hairText.textContent = times.toLocaleString('is-IS') + ' smárar komast hlið við hlið yfir eitt hár.';
    }

    // kúrvur
    chartLin.update(idx);
    chartLog.update(idx);
  }

  slider.addEventListener('input', function () {
    update(parseInt(this.value, 10));
  });

  function step(delta) {
    var v = parseInt(slider.value, 10) + delta;
    v = Math.max(0, Math.min(DATA.length - 1, v));
    slider.value = String(v);
    update(v);
  }
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  update(0);
}
