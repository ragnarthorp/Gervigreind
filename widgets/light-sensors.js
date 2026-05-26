/* ---------- Ljósskynjarar Mark I (skuggur og bitar) ---------- */
function renderLightSensors(figure) {
  figure.className = 'lightsens-figure';
  figure.setAttribute('aria-label',
    'Ljósskynjarar Mark I: blað með bókstafnum T rennur fyrir 20 × 20 skynjaranet og bitarnir flippast milli 1 og 0');

  figure.appendChild(el('figcaption', {
    class: 'lightsens-title',
    text: 'Ljósskynjarar Mark I'
  }));
  figure.appendChild(el('p', {
    class: 'lightsens-hint',
    html: 'Veldu tákn og dragðu blaðið inn í kassann. Þar sem táknið hylur gluggann — skuggi — verður gildið <strong>0</strong>. Þar sem ljós fer í gegn verður gildið <strong>1</strong>.'
  }));

  // ====== víddir ======
  var ROWS = 20, COLS = 20;
  var CELL = 16;
  var GAP  = 1;
  var STEP = CELL + GAP;
  var GRID_W = COLS * STEP - GAP;   // 339
  var GRID_H = ROWS * STEP - GAP;

  var SC_W = GRID_W;
  var SC_H = 120;

  // svarti kassinn (skynjarahúsið)
  var BOX_W = Math.round(SC_W * 0.40);
  var BOX_H = Math.round(SC_H * 0.78);
  var BOX_X = Math.round((SC_W - BOX_W) / 2);
  var BOX_Y = Math.round((SC_H - BOX_H) / 2);

  // blaðið — sama hæð, 1.4× breitt
  var PAP_W = Math.round(BOX_W * 1.4);
  var PAP_H = BOX_H;

  // ====== scene canvas ======
  var sceneWrap = el('div', { class: 'lightsens-scene-wrap' });
  var canvas = el('canvas', { class: 'lightsens-scene' });
  canvas.width  = SC_W;
  canvas.height = SC_H;
  canvas.setAttribute('aria-hidden', 'true');
  sceneWrap.appendChild(canvas);
  figure.appendChild(sceneWrap);

  var sctx = canvas.getContext('2d');

  // les þema-liti frá CSS-breytum á figure
  function readColor(name, fallback) {
    var v = getComputedStyle(figure).getPropertyValue(name).trim();
    return v || fallback;
  }

  // ====== offscreen „blað“ canvas (mynstur teiknað á það) ======
  var tc = document.createElement('canvas');
  tc.width  = PAP_W;
  tc.height = PAP_H;
  var tctx = tc.getContext('2d');
  var tData = null;

  function drawShape(shape) {
    tctx.fillStyle = '#fffdf7';
    tctx.fillRect(0, 0, PAP_W, PAP_H);
    tctx.fillStyle = '#111';

    var cx = PAP_W / 2;
    var cy = PAP_H / 2;
    var s  = Math.min(PAP_W, PAP_H) * 0.78;          // grunnstærð
    var lw = Math.max(4, s * 0.16);                  // línuþ.

    if (shape === 'T' || shape === 'L') {
      tctx.font = 'bold ' + Math.round(PAP_H * 0.82) + 'px "Times New Roman", Georgia, serif';
      tctx.textAlign = 'center';
      tctx.textBaseline = 'middle';
      tctx.fillText(shape, cx, cy);
    }
    else if (shape === 'circle') {
      tctx.beginPath();
      tctx.arc(cx, cy, s / 2 - lw / 2, 0, Math.PI * 2);
      tctx.lineWidth = lw;
      tctx.strokeStyle = '#111';
      tctx.stroke();
    }
    else if (shape === 'square') {
      tctx.lineWidth = lw;
      tctx.strokeStyle = '#111';
      tctx.strokeRect(cx - s / 2 + lw / 2, cy - s / 2 + lw / 2, s - lw, s - lw);
    }
    else if (shape === 'triangle') {
      tctx.beginPath();
      tctx.moveTo(cx,                     cy - s / 2 + lw / 2);
      tctx.lineTo(cx + s / 2 - lw / 2,    cy + s / 2 - lw / 2);
      tctx.lineTo(cx - s / 2 + lw / 2,    cy + s / 2 - lw / 2);
      tctx.closePath();
      tctx.lineWidth  = lw;
      tctx.lineJoin   = 'round';
      tctx.strokeStyle = '#111';
      tctx.stroke();
    }

    tData = tctx.getImageData(0, 0, PAP_W, PAP_H).data;
  }
  var currentShape = 'T';
  drawShape('T');

  function isTDark(px, py) {
    var ix = Math.round(px), iy = Math.round(py);
    if (ix < 0 || iy < 0 || ix >= PAP_W || iy >= PAP_H) return false;
    return tData[(iy * PAP_W + ix) * 4] < 128;
  }

  // ====== blað-staða ======
  var PAP_X_MIN = BOX_X - PAP_W;
  var PAP_X_MAX = BOX_X + BOX_W;
  var paperX    = PAP_X_MIN;
  var PAP_Y     = BOX_Y;

  // ====== teikning ======
  function drawScene() {
    var bg      = readColor('--bg-elev', '#F5F3EC');
    var paper   = '#FFFDF7';
    var paperEdge = readColor('--border', '#DAD7CE');
    var ink     = '#111111';
    var box     = readColor('--text', '#1A1A1A');
    var label   = readColor('--text-muted', '#555049');

    sctx.clearRect(0, 0, SC_W, SC_H);
    sctx.fillStyle = bg;
    sctx.fillRect(0, 0, SC_W, SC_H);

    // sjáanlegur hluti blaðsins (utan kassar til vinstri)
    var visLeft  = paperX;
    var visRight = Math.min(paperX + PAP_W, BOX_X);
    if (visLeft < visRight) {
      sctx.fillStyle = paper;
      sctx.fillRect(visLeft, PAP_Y, visRight - visLeft, PAP_H);
      sctx.strokeStyle = paperEdge;
      sctx.lineWidth = 0.5;
      sctx.strokeRect(visLeft + 0.5, PAP_Y + 0.5, visRight - visLeft - 1, PAP_H - 1);

      // T-ið — aðeins sá hluti sem er á blaðinu og utan kassar
      sctx.fillStyle = ink;
      for (var py = 0; py < PAP_H; py++) {
        for (var px = visLeft; px < visRight; px++) {
          var bx = px - paperX;
          if (bx < 0 || bx >= PAP_W) continue;
          if (isTDark(bx, py)) {
            sctx.fillRect(px, PAP_Y + py, 1, 1);
          }
        }
      }
    }

    // skynjarahúsið
    sctx.fillStyle = box;
    sctx.fillRect(BOX_X, BOX_Y, BOX_W, BOX_H);

    // merkimiði
    sctx.fillStyle = label;
    sctx.font = '9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'bottom';
    sctx.fillText('LJÓSSKYNJARAR', BOX_X + BOX_W / 2, BOX_Y - 4);
  }

  // ====== tákn-val ======
  var shapeRow = el('div', { class: 'lightsens-shapes', role: 'group', 'aria-label': 'Veldu tákn á blaðið' });
  var SHAPES = [
    { key: 'T',        label: 'T',        symbol: 'T'  },
    { key: 'L',        label: 'L',        symbol: 'L'  },
    { key: 'circle',   label: 'Hringur',  symbol: '◯' },
    { key: 'square',   label: 'Ferningur',symbol: '□' },
    { key: 'triangle', label: 'Þriþhyrningur', symbol: '△' }
  ];
  var shapeBtns = [];
  SHAPES.forEach(function (sh, i) {
    var btn = el('button', {
      type: 'button',
      class: 'lightsens-shape-btn' + (i === 0 ? ' is-active' : ''),
      'aria-pressed': i === 0 ? 'true' : 'false',
      'aria-label': 'Tákn: ' + sh.label
    });
    btn.textContent = sh.symbol;
    btn.addEventListener('click', function () {
      shapeBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      currentShape = sh.key;
      drawShape(sh.key);
      drawScene();
      updateGrid();
    });
    shapeRow.appendChild(btn);
    shapeBtns.push(btn);
  });
  figure.appendChild(shapeRow);

  // ====== sleði ======
  var sliderWrap = el('div', { class: 'lightsens-slider-row' });
  var prevBtn = el('button', {
    type: 'button',
    class: 'lightsens-arrow',
    'aria-label': 'Færa blað til vinstri'
  });
  prevBtn.textContent = '◀';
  sliderWrap.appendChild(prevBtn);
  var slider = el('input', {
    type: 'range', min: '0', max: '1000', value: '0', step: '1',
    class: 'lightsens-slider',
    'aria-label': 'Renna blaðinu inn í skynjarahúsið'
  });
  sliderWrap.appendChild(slider);
  var nextBtn = el('button', {
    type: 'button',
    class: 'lightsens-arrow',
    'aria-label': 'Færa blað til hægri'
  });
  nextBtn.textContent = '▶';
  sliderWrap.appendChild(nextBtn);
  figure.appendChild(sliderWrap);

  function step(delta) {
    var v = parseInt(slider.value, 10) + delta;
    v = Math.max(0, Math.min(1000, v));
    slider.value = String(v);
    slider.dispatchEvent(new Event('input'));
  }
  prevBtn.addEventListener('click', function () { step(-20); });
  nextBtn.addEventListener('click', function () { step(20); });

  // ====== HTML grindin (20 × 20) ======
  var gridWrap = el('div', { class: 'lightsens-grid-wrap' });
  var gridLabel = el('div', { class: 'lightsens-grid-label', text: 'LJÓSSKYNJARAR — 20 × 20' });
  gridLabel.style.width = GRID_W + 'px';
  var grid = el('div', { class: 'lightsens-grid' });
  grid.style.gridTemplateColumns = 'repeat(' + COLS + ', ' + CELL + 'px)';
  grid.style.gridTemplateRows    = 'repeat(' + ROWS + ', ' + CELL + 'px)';
  grid.style.width = GRID_W + 'px';
  gridWrap.appendChild(gridLabel);
  gridWrap.appendChild(grid);
  figure.appendChild(gridWrap);

  var cells = [];
  for (var i = 0; i < ROWS * COLS; i++) {
    var c = el('div', { class: 'lightsens-cell is-on' });
    c.style.width    = CELL + 'px';
    c.style.height   = CELL + 'px';
    c.style.fontSize = Math.max(7, CELL - 7) + 'px';
    c.textContent    = '1';
    grid.appendChild(c);
    cells.push(c);
  }

  figure.appendChild(el('p', {
    class: 'lightsens-foot',
    html: '<strong>0</strong> = skuggi &nbsp;·&nbsp; <strong>1</strong> = ljós'
  }));

  // ====== uppfærsla á grindinni ======
  function updateGrid() {
    var offset = BOX_X - paperX;
    var on  = 0, off = 0;

    // Talning per röð til að greina T-mynstur óháð því hvar T er í grindinni.
    var rowDark = new Array(ROWS);
    for (var i = 0; i < ROWS; i++) rowDark[i] = 0;

    for (var r = 0; r < ROWS; r++) {
      for (var col = 0; col < COLS; col++) {
        var kx = (col + 0.5) / COLS * BOX_W;
        var ky = (r   + 0.5) / ROWS * BOX_H;
        var bx = kx + offset;
        var by = ky;
        var onPaper = (bx >= 0 && bx < PAP_W && by >= 0 && by < PAP_H);
        var val = (onPaper && isTDark(bx, by)) ? 0 : 1;
        var cell = cells[r * COLS + col];
        if (val === 0) {
          cell.className = 'lightsens-cell';
          cell.textContent = '0';
          off++;
          rowDark[r]++;
        } else {
          cell.className = 'lightsens-cell is-on';
          cell.textContent = '1';
          on++;
        }
      }
    }

    // Finna efstu og neðstu „virku“ röð (≥ 2 dökkir reitir).
    var r_top = -1, r_bot = -1;
    for (var r2 = 0; r2 < ROWS; r2++) {
      if (rowDark[r2] >= 2) {
        if (r_top < 0) r_top = r2;
        r_bot = r2;
      }
    }
    var height  = (r_top >= 0) ? (r_bot - r_top) : 0;
    var topW    = (r_top >= 0)
                  ? rowDark[r_top] + ((r_top + 1 < ROWS) ? rowDark[r_top + 1] : 0)
                  : 0;
    var botW    = (r_bot >= 0) ? rowDark[r_bot] : 0;

    // T-mynstri\u00f0 sem neti\u00f0 hefur l\u00e6rt a\u00f0 \u00feekkja:
    //   - efri \u00feverbj\u00e1lki (topW \u2265 6)
    //   - l\u00f3\u00f0r\u00e9tti bj\u00e1lki sem n\u00e6r ni\u00f0ur (h \u2265 7)
    //   - enginn botnbj\u00e1lki (botW \u2264 3)
    var patternMatch = (height >= 7) && (topW >= 6) && (botW <= 3);
    var sv = parseInt(slider.value, 10);

    // T er r\u00e9tt flokka\u00f0 \u00feegar t\u00e1kn er T og sle\u00f0inn er innan vi\u00f0 \u00fea\u00f0
    // bil sem netinu var kennt a\u00f0 r\u00e1\u00f0a vi\u00f0.
    var tClear = (currentShape === 'T') && (sv >= 340) && (sv <= 720);

    // T er RANGLEGA flokka\u00f0: t\u00e1kn er L en sjanlegi hlutinn \u00ed kassanum
    // hefur sama mynstur og T (\u00fee.e. botn-bj\u00e1lkinn er horfinn).
    var tWrong = (currentShape === 'L') && patternMatch;

    grid.classList.toggle('is-recognized', tClear);
    grid.classList.toggle('is-misrecognized', tWrong);
    gridLabel.classList.toggle('is-recognized', tClear);
    gridLabel.classList.toggle('is-misrecognized', tWrong);
    if (tClear) {
      gridLabel.textContent = 'FR\u00c1LAG \u2014 KVEIKT \u00c1 \u00deEKKIR T';
    } else if (tWrong) {
      gridLabel.textContent = 'RANGLEGA FLOKKA\u00d0 SEM T';
    } else {
      gridLabel.textContent = 'LJ\u00d3SKYNJARAR \u2014 20 \u00d7 20';
    }
  }

  slider.addEventListener('input', function () {
    var t = parseInt(this.value, 10) / 1000;
    paperX = PAP_X_MIN + t * (PAP_X_MAX - PAP_X_MIN);
    drawScene();
    updateGrid();
  });

  drawScene();
  updateGrid();

  // bregst við þema-skiptingu (dökk / ljós) — endurteiknar canvas
  var themeWatcher = new MutationObserver(function () { drawScene(); });
  themeWatcher.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
