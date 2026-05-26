 /* ---------- 7. Tvíundabreytir ---------- */
    function renderBinaryConverter(figure) {
      figure.className = 'binconv-figure';
      figure.setAttribute('aria-label', 'Gagnvirkt tæki sem sýnir tugatölu sem tvíundatölu');
      figure.appendChild(el('figcaption', { class: 'binconv-title', text: 'Prófaðu: breyttu tölu í tvíundarkerfi' }));

      var controls = el('div', { class: 'binconv-controls' });
      var slider = el('input', { type: 'range', min: '0', max: '255', value: '42', class: 'binconv-slider', 'aria-label': 'Renna fyrir tugatölu' });
      var numberInput = el('input', { type: 'number', min: '0', max: '255', value: '42', class: 'binconv-number', 'aria-label': 'Slá inn tugatölu' });
      controls.appendChild(slider); controls.appendChild(numberInput); figure.appendChild(controls);

      var bits = el('div', { class: 'binconv-bits', role: 'group', 'aria-label': 'Átta bitar með sætisgildi' });
      var cells = [];
      for (var b = 7; b >= 0; b--) {
        var wrap = el('div', { class: 'binconv-bit' });
        var cell = el('button', { class: 'binconv-bit-cell', type: 'button', text: '0', 'aria-pressed': 'false', 'aria-label': 'Biti ' + (1 << b) });
        var place = el('div', { class: 'binconv-bit-value', text: String(1 << b) });
        wrap.appendChild(cell); wrap.appendChild(place); bits.appendChild(wrap); cells.push(cell);
      }
      figure.appendChild(bits);
      var binaryStr = el('p', { class: 'binconv-string', text: '00101010' });
      figure.appendChild(binaryStr);

      function update(value) {
        var n = parseInt(value, 10); if (isNaN(n)) n = 0; n = Math.max(0, Math.min(255, n));
        slider.value = String(n); if (document.activeElement !== numberInput) numberInput.value = String(n);
        var bin = ''; for (var b = 7; b >= 0; b--) bin += ((n >> b) & 1) ? '1' : '0';
        binaryStr.textContent = bin;
        for (var i = 0; i < 8; i++) {
          var on = bin[i] === '1'; cells[i].textContent = on ? '1' : '0';
          cells[i].classList.toggle('is-on', on); cells[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
      }

      cells.forEach(function (cell, i) {
        cell.addEventListener('click', function () {
          var bitIndex = 7 - i; var n = parseInt(slider.value, 10) || 0;
          update(n ^ (1 << bitIndex));
        });
      });

      slider.addEventListener('input', function () { update(this.value); });
      numberInput.addEventListener('input', function () { update(this.value); });
      update(42);
    }
