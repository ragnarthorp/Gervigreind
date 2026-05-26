 /* ---------- 3. Tvíleit (leikur) ---------- */
    function renderBinarySearch(figure) {
      var SIZE = 100;
      var target = 0;
      var clicks = 0;
      var solved = false;

      figure.className = 'binsearch-figure';
      figure.setAttribute('aria-label', 'Gagnvirkur tvíleitarleikur');

      figure.appendChild(el('figcaption', {
        class: 'binsearch-title',
        text: 'Prófaðu tvíleitina — finndu töluna'
      }));
      figure.appendChild(el('p', {
        class: 'binsearch-hint',
        text: 'Smelltu á tölu til að giska. Þú getur útilokað helmninginn í einu. Reyndu að finna töluna með sem fæstum smellum.'
      }));

      var meter = el('div', { class: 'binsearch-meter' });
      var counter = el('span', { class: 'binsearch-counter', text: 'Smellir: 0' });
      meter.appendChild(counter);
      figure.appendChild(meter);

      var grid = el('div', { class: 'binsearch-grid', role: 'group', 'aria-label': 'Tölur 1 til 100' });
      var cells = [];
      for (var i = 1; i <= SIZE; i++) {
        var btn = el('button', { class: 'binsearch-cell', type: 'button', text: String(i), 'data-n': String(i) });
        btn.addEventListener('click', onCellClick);
        grid.appendChild(btn);
        cells.push(btn);
      }
      figure.appendChild(grid);

      var result = el('div', { class: 'binsearch-result', role: 'status', 'aria-live': 'polite' });
      figure.appendChild(result);

      var controls = el('div', { class: 'binsearch-controls' });
      var resetBtn = el('button', { class: 'binsearch-btn', type: 'button', text: '↻ Ný tala' });
      controls.appendChild(resetBtn);
      figure.appendChild(controls);

      function onCellClick() {
        if (solved) return;
        if (this.disabled) return;
        var n = parseInt(this.getAttribute('data-n'), 10);
        clicks++;
        counter.textContent = 'Smellir: ' + clicks;
        if (n === target) {
          solved = true;
          for (var k = 0; k < SIZE; k++) {
            if (!cells[k].classList.contains('is-out')) {
              cells[k].classList.add('is-correct');
            }
            cells[k].disabled = true;
          }
          result.textContent = 'Þú fannst töluna ' + target + ' á ' + clicks +
                                ' smellum! Tvíleit þarf aldrei fleiri en 7 smelli til að finna tölu á bilinu 1–100.';
          result.classList.add('is-visible');
        } else if (n < target) {
          for (var a = 1; a <= n; a++) {
            cells[a - 1].classList.add('is-out');
            cells[a - 1].disabled = true;
          }
        } else {
          for (var b = n; b <= SIZE; b++) {
            cells[b - 1].classList.add('is-out');
            cells[b - 1].disabled = true;
          }
        }
      }

      function reset() {
        target = Math.floor(Math.random() * SIZE) + 1;
        clicks = 0;
        solved = false;
        counter.textContent = 'Smellir: 0';
        result.textContent = '';
        result.classList.remove('is-visible');
        for (var k = 0; k < SIZE; k++) {
          cells[k].classList.remove('is-out', 'is-correct');
          cells[k].disabled = false;
        }
      }

      resetBtn.addEventListener('click', reset);
      reset();
    }