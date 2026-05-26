/* ---------- 4. Reikniaflssamanburður ---------- */
    function renderComputerCompare(figure) {
      var HEART = [
        '0000011100011100', '0001111111111110', '0011111111111111', '0111111111111111',
        '0111111111111111', '0111111111111111', '0011111111111110', '0001111111111100',
        '0000111111110000', '0000011111110000', '0000001111100000', '0000000111000000',
        '0000000010000000', '0000000000000000', '0000000000000000', '0000000000000000'
      ];
      var GRID_N = 16;
      var TOTAL = GRID_N * GRID_N;

      var bits = [];
      for (var r = 0; r < GRID_N; r++) {
        for (var c = 0; c < GRID_N; c++) {
          bits.push(HEART[r][c] === '1' ? 1 : 0);
        }
      }

      var COMPUTERS = [
        { name: 'Klapparstígur (IBM 1401, 1963)', shortName: 'Klapparstígur', ms: 55       },
        { name: 'Apollo (AGC, 1969)',              shortName: 'Apollo',         ms: 125      },
        { name: 'Sinclair ZX Spectrum (1982)',     shortName: 'ZX Spectrum',    ms: 1.4      },
        { name: 'PlayStation 1 (1994)',            shortName: 'PlayStation 1',  ms: 0.17     },
        { name: 'iPhone 1 (2007)',                 shortName: 'iPhone 1',       ms: 0.012    },
        { name: 'Snjallsími (2026)',                shortName: 'Snjallsími',     ms: 0.0003   }
      ];

      function fmtNumber(n) {
        var rounded = Math.round(n);
        var s = String(rounded);
        var out = '';
        for (var i = 0; i < s.length; i++) {
          if (i > 0 && (s.length - i) % 3 === 0) out += '.';
          out += s[i];
        }
        return out;
      }
      function fmtTime(ms) {
        if (ms < 1)      return ms.toFixed(3) + ' ms';
        if (ms < 10)     return ms.toFixed(2) + ' ms';
        if (ms < 1000)   return Math.round(ms) + ' ms';
        if (ms < 60000)  return (ms / 1000).toFixed(2).replace('.', ',') + ' s';
        var minutes = Math.floor(ms / 60000);
        var seconds = Math.round((ms % 60000) / 1000);
        return minutes + ' mín ' + seconds + ' s';
      }
      function fmtRatio(r) {
        if (r < 10)        return r.toFixed(1).replace('.', ',');
        if (r < 1000)      return String(Math.round(r));
        if (r < 1000000)   return fmtNumber(r);
        return fmtNumber(r / 1000000) + ' milljón';
      }

      figure.className = 'pxcompare-figure';
      figure.setAttribute('aria-label', 'Samanburður á reikniafli tölva');

      figure.appendChild(el('figcaption', { class: 'pxcompare-title', text: 'Berðu saman — hversu lengi tekur það?' }));
      figure.appendChild(el('p', { class: 'pxcompare-hint', text: 'Sjáðu hve hratt ólíkar tölvur unnu.' }));

      function buildPanel(initialIdx) {
        var p = el('div', { class: 'pxcompare-panel' });
        var select = el('select', { class: 'pxcompare-select', 'aria-label': 'Velja tölvu' });
        COMPUTERS.forEach(function (c, i) {
          var opt = el('option', { value: String(i), text: c.name });
          if (i === initialIdx) opt.selected = true;
          select.appendChild(opt);
        });
        p.appendChild(select);

        var grid = el('div', { class: 'pxgrid', role: 'img', 'aria-label': 'Pixla-rist 16 sinnum 16' });
        var cells = [];
        for (var i = 0; i < TOTAL; i++) {
          var cell = el('div', { class: 'pxgrid-cell' });
          grid.appendChild(cell);
          cells.push(cell);
        }
        p.appendChild(grid);

        var clock = el('div', { class: 'pxgrid-clock', text: '0 ms' });
        p.appendChild(clock);

        return { el: p, select: select, cells: cells, clock: clock, selectedIdx: initialIdx, finalTime: 0, done: false };
      }

      var panels = el('div', { class: 'pxcompare-panels' });
      var panelA = buildPanel(0);   
      var panelB = buildPanel(5);   
      panels.appendChild(panelA.el);
      panels.appendChild(panelB.el);
      figure.appendChild(panels);

      var controls = el('div', { class: 'pxcompare-controls' });
      var drawBtn  = el('button', { class: 'pxcompare-btn pxcompare-btn-primary', type: 'button', text: '▶ Teikna' });
      var clearBtn = el('button', { class: 'pxcompare-btn', type: 'button', text: '✕ Hreinsa' });
      controls.appendChild(drawBtn);
      controls.appendChild(clearBtn);
      figure.appendChild(controls);

      var compareLine = el('p', { class: 'pxcompare-result', role: 'status', 'aria-live': 'polite' });
      figure.appendChild(compareLine);

      var runToken = 0;
      var animating = false;

      function resetPanelVisual(p) {
        for (var i = 0; i < TOTAL; i++) p.cells[i].classList.remove('is-drawn', 'is-fg');
        p.clock.textContent = '0 ms';
        p.done = false;
        p.finalTime = 0;
      }

      function clearAll() {
        runToken++; animating = false;
        resetPanelVisual(panelA); resetPanelVisual(panelB);
        compareLine.textContent = ''; compareLine.classList.remove('is-visible');
        drawBtn.disabled = false; drawBtn.textContent = '▶ Teikna';
      }

      function drawPanel(panel, comp, myToken) {
        var start = performance.now();
        var msPerPixel = comp.ms;
        var totalDuration = msPerPixel * TOTAL;
        var drawn = 0;

        function tick() {
          if (myToken !== runToken) return;
          if (!document.contains(figure)) return;

          var elapsed = performance.now() - start;
          var target = Math.min(Math.floor(elapsed / msPerPixel), TOTAL);

          for (var i = drawn; i < target; i++) {
            panel.cells[i].classList.add('is-drawn');
            if (bits[i]) panel.cells[i].classList.add('is-fg');
          }
          drawn = target;
          panel.clock.textContent = fmtTime(Math.min(elapsed, totalDuration));

          if (drawn < TOTAL) {
            requestAnimationFrame(tick);
          } else {
            var jitter = 1 + (Math.random() - 0.5) * 0.2;
            panel.finalTime = totalDuration * jitter;
            panel.clock.textContent = fmtTime(panel.finalTime);
            panel.done = true;
            checkBothDone();
          }
        }
        requestAnimationFrame(tick);
      }

      function startDrawing() {
        if (animating) return;
        animating = true; drawBtn.disabled = true; drawBtn.textContent = '⏳ Teiknar…';
        compareLine.textContent = ''; compareLine.classList.remove('is-visible');
        resetPanelVisual(panelA); resetPanelVisual(panelB);

        panelA.selectedIdx = parseInt(panelA.select.value, 10);
        panelB.selectedIdx = parseInt(panelB.select.value, 10);

        var myToken = ++runToken;
        drawPanel(panelA, COMPUTERS[panelA.selectedIdx], myToken);
        drawPanel(panelB, COMPUTERS[panelB.selectedIdx], myToken);
      }

      function checkBothDone() {
        if (!panelA.done || !panelB.done) return;
        animating = false; drawBtn.disabled = false; drawBtn.textContent = '▶ Teikna';

        var aTime = panelA.finalTime; var bTime = panelB.finalTime;
        var aName = COMPUTERS[panelA.selectedIdx].shortName; var bName = COMPUTERS[panelB.selectedIdx].shortName;

        var msg;
        if (panelA.selectedIdx === panelB.selectedIdx) {
          msg = 'Sama tölva á báðum hliðum — aðeins lauslegur munur vegna slæðu.';
        } else {
          var ratio = aTime > bTime ? (aTime / bTime) : (bTime / aTime);
          var slow  = aTime > bTime ? aName : bName; var fast  = aTime > bTime ? bName : aName;
          msg = ratio < 1.5 ? slow + ' og ' + fast + ' tóku svipaðan tíma.' : slow + ' tók ' + fmtRatio(ratio) + ' sinnum lengur en ' + fast + '.';
        }
        compareLine.textContent = msg; compareLine.classList.add('is-visible');
      }

      drawBtn.addEventListener('click', startDrawing);
      clearBtn.addEventListener('click', clearAll);
    }