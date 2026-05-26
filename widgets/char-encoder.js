 /* ---------- 8. Staftáknun (Encoder) ---------- */
    function renderCharEncoder(figure) {
      figure.className = 'charenc-figure';
      figure.setAttribute('aria-label', 'Gagnvirkt tæki sem sýnir hvernig stafur er geymdur í tölvu');
      figure.appendChild(el('figcaption', { class: 'charenc-title', text: 'Prófaðu: hvernig er stafurinn geymdur?' }));

      var quickRow = el('div', { class: 'charenc-quick', role: 'group', 'aria-label': 'Algengir stafir' });
      var QUICK_CHARS = ['A', 'a', 'Þ', 'þ', 'Æ', 'æ', 'Ð', 'ð', '字', '🤓'];
      QUICK_CHARS.forEach(function (ch) {
        var btn = el('button', { class: 'charenc-quick-btn', type: 'button', text: ch });
        btn.addEventListener('click', function () { input.value = ''; update(ch); });
        quickRow.appendChild(btn);
      });
      figure.appendChild(quickRow);

      var inputRow = el('div', { class: 'charenc-input-row' });
      var inputLabel = el('label', { class: 'charenc-input-label', for: 'charenc-inp', text: 'eða sláðu inn staf:' });
      var input = el('input', { type: 'text', maxlength: '4', class: 'charenc-input', id: 'charenc-inp' });
      inputRow.appendChild(inputLabel); inputRow.appendChild(input); figure.appendChild(inputRow);

      var display = el('div', { class: 'charenc-display' });
      var bigChar = el('div', { class: 'charenc-bigchar', text: 'A', role: 'status', 'aria-live': 'polite' });
      var info = el('div', { class: 'charenc-info' });
      var codePointEl = el('span', { class: 'charenc-info-item charenc-cp', text: 'U+0041' });
      var asciiEl     = el('span', { class: 'charenc-info-item charenc-ascii', text: 'ASCII: 65' });
      var byteCountEl = el('span', { class: 'charenc-info-item charenc-bytecount', text: '1 bæti' });
      info.appendChild(codePointEl); info.appendChild(asciiEl); info.appendChild(byteCountEl);
      display.appendChild(bigChar); display.appendChild(info); figure.appendChild(display);

      var bytesArea = el('div', { class: 'charenc-bytes' }); figure.appendChild(bytesArea);
      var binStrEl = el('p', { class: 'charenc-string', text: '01000001' }); figure.appendChild(binStrEl);

      var encoder = (typeof TextEncoder !== 'undefined') ? new TextEncoder() : null;

      function update(ch) {
        if (!ch) return; ch = String.fromCodePoint(ch.codePointAt(0));
        bigChar.textContent = ch; var cp = ch.codePointAt(0);
        var hex = cp.toString(16).toUpperCase(); while (hex.length < 4) hex = '0' + hex;
        codePointEl.textContent = 'U+' + hex;

        if (cp < 128) { asciiEl.textContent = 'ASCII: ' + cp; asciiEl.classList.remove('is-hidden'); }
        else { asciiEl.classList.add('is-hidden'); }

        var bytes = encoder ? encoder.encode(ch) : new Uint8Array([cp & 0xFF]);
        byteCountEl.textContent = bytes.length + ' bæti (UTF-8)';
        bytesArea.innerHTML = ''; var fullBin = '';

        for (var i = 0; i < bytes.length; i++) {
          var byteVal = bytes[i]; var byteBits = '';
          for (var b = 7; b >= 0; b--) byteBits += ((byteVal >> b) & 1) ? '1' : '0';
          fullBin += byteBits;

          var byteRow = el('div', { class: 'charenc-byte' });
          byteRow.appendChild(el('div', { class: 'charenc-byte-label', text: 'Bæti ' + (i + 1) + ' — ' + byteVal }));
          var bitRow = el('div', { class: 'charenc-byte-bits' });
          for (var k = 0; k < 8; k++) {
            var on = byteBits[k] === '1';
            bitRow.appendChild(el('div', { class: 'charenc-bit' + (on ? ' is-on' : ''), text: byteBits[k] }));
          }
          byteRow.appendChild(bitRow); bytesArea.appendChild(byteRow);
        }
        binStrEl.textContent = fullBin.match(/.{1,8}/g).join(' ');
      }

      input.addEventListener('input', function () { if (this.value.length > 0) update(this.value); });
      update('A');
    }