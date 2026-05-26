/* ---------- RGB-litaröð (gagnvirkur litari) ---------- */
function renderRgbMixer(figure) {
  figure.className = 'rgbmix-figure';
  figure.setAttribute('aria-label', 'Gagnvirk litablöndun með rauðum, grænum og bláum');

  figure.appendChild(el('figcaption', {
    class: 'rgbmix-title',
    text: 'Prófaðu: blandaðu litinn þinn'
  }));

  var HEART_ROWS = [
    '0000000000000000',
    '0000000000000000',
    '0000000000000000',
    '0001100000011000',
    '0011110000111100',
    '0111111001111110',
    '0111111111111110',
    '0111111111111110',
    '0011111111111100',
    '0001111111111000',
    '0000111111110000',
    '0000011111100000',
    '0000001111000000',
    '0000000110000000',
    '0000000000000000',
    '0000000000000000'
  ];
  var heart = el('div', { class: 'rgbmix-heart', role: 'img',
                           'aria-label': 'Hjarta sem litast eftir völdum lit' });
  var heartCells = [];
  for (var r = 0; r < HEART_ROWS.length; r++) {
    for (var c = 0; c < HEART_ROWS[r].length; c++) {
      var on = HEART_ROWS[r][c] === '1';
      var cell = el('div', { class: 'rgbmix-heart-cell' + (on ? ' is-fg' : '') });
      heart.appendChild(cell);
      if (on) heartCells.push(cell);
    }
  }
  figure.appendChild(heart);
  var rgbText = el('p', { class: 'rgbmix-rgb', text: 'rgb(100, 100, 100)' });
  figure.appendChild(rgbText);

  var QUICK = [
    { name: 'Svartur',    r: 0,   g: 0,   b: 0   },
    { name: 'Hvítur',     r: 255, g: 255, b: 255 },
    { name: 'Grár',       r: 100, g: 100, b: 100 },
    { name: 'Rauðbrúnn',  r: 165, g: 42,  b: 42  },
    { name: 'Fjólublár',  r: 128, g: 0,   b: 128 },
    { name: 'Bleikur',    r: 255, g: 182, b: 193 }
  ];
  var quickRow = el('div', { class: 'rgbmix-quick' });
  QUICK.forEach(function (c) {
    var btn = el('button', { class: 'rgbmix-quick-btn', type: 'button',
                              'aria-label': 'Velja lit ' + c.name });
    var dot = el('span', { class: 'rgbmix-quick-dot' });
    dot.style.backgroundColor = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
    btn.appendChild(dot);
    btn.appendChild(document.createTextNode(c.name));
    btn.addEventListener('click', function () {
      state.r = c.r; state.g = c.g; state.b = c.b;
      update();
    });
    quickRow.appendChild(btn);
  });
  figure.appendChild(quickRow);

  var channelsWrap = el('div', { class: 'rgbmix-channels' });
  var channels = ['r', 'g', 'b'].map(function (key) {
    var fullName = key === 'r' ? 'rauður' : key === 'g' ? 'grænn' : 'blár';
    var ch = el('div', { class: 'rgbmix-channel rgbmix-ch-' + key });

    var head = el('div', { class: 'rgbmix-ch-head' });
    head.appendChild(el('span', { class: 'rgbmix-ch-label',
                                   text: key.toUpperCase() + ' — ' + fullName }));
    var valueEl = el('span', { class: 'rgbmix-ch-value', text: '0' });
    head.appendChild(valueEl);
    ch.appendChild(head);

    var slider = el('input', {
      type: 'range', min: '0', max: '255', value: '0', step: '1',
      class: 'rgbmix-slider',
      'aria-label': 'Rás ' + key.toUpperCase() + ': ' + fullName + ' (0 til 255)'
    });
    ch.appendChild(slider);

    var bitsRow = el('div', { class: 'rgbmix-bits' });
    var bitCells = [];
    for (var i = 0; i < 8; i++) {
      var bitCell = el('div', { class: 'rgbmix-bit', text: '0' });
      bitsRow.appendChild(bitCell);
      bitCells.push(bitCell);
    }
    ch.appendChild(bitsRow);

    slider.addEventListener('input', function () {
      state[key] = parseInt(this.value, 10);
      update();
    });

    channelsWrap.appendChild(ch);
    return { key: key, slider: slider, valueEl: valueEl, bitCells: bitCells };
  });
  figure.appendChild(channelsWrap);

  var state = { r: 100, g: 100, b: 100 };

  function update() {
    var rgbStr = 'rgb(' + state.r + ', ' + state.g + ', ' + state.b + ')';
    for (var i = 0; i < heartCells.length; i++) {
      heartCells[i].style.backgroundColor = rgbStr;
    }
    rgbText.textContent = rgbStr;
    channels.forEach(function (c) {
      var v = state[c.key];
      if (document.activeElement !== c.slider) c.slider.value = String(v);
      c.valueEl.textContent = String(v);
      for (var b = 0; b < 8; b++) {
        var on = ((v >> (7 - b)) & 1) === 1;
        c.bitCells[b].textContent = on ? '1' : '0';
        c.bitCells[b].classList.toggle('is-on', on);
      }
    });
  }

  update();
}