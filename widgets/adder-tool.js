/* ---------- Samlagningartæki (hálf-, fullur samleggjari, 8-bita reiknivél) ---------- */
function renderAdderTool(figure) {
  figure.className = 'adder-figure';
  figure.setAttribute('aria-label', 'Gagnvirkt samlagningartæki: hálf-samleggjari, fullur samleggjari og 8-bita reiknivél');
  figure.appendChild(el('figcaption', { class: 'adder-title', text: 'Hvernig er einföld reiknivél gerð úr rökhliðum?' }));
  figure.appendChild(el('p', { class: 'adder-hint', text: 'Veldu stig til að sjá hvernig hvert þrep byggir ofan á hið fyrra — frá einu rökhlið upp í heila 8-bita reiknivél.' }));

  var tabBar = el('div', { class: 'adder-tabs' });
  var panels = [], tabBtns = [];
  var TABS = [{ label: '1 · Hálf-samleggjari' }, { label: '2 · Fullur samleggjari' }, { label: '3 · 8-bita reiknivél' }];
  TABS.forEach(function(t, ti) {
    var btn = el('button', { class: 'adder-tab' + (ti === 0 ? ' is-active' : ''), type: 'button', text: t.label });
    var panel = el('div', { class: 'adder-panel' + (ti === 0 ? ' is-visible' : '') });
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b) { b.classList.remove('is-active'); });
      panels.forEach(function(p) { p.classList.remove('is-visible'); });
      btn.classList.add('is-active'); panel.classList.add('is-visible');
    });
    tabBar.appendChild(btn); figure.appendChild(panel);
    tabBtns.push(btn); panels.push(panel);
  });
  figure.insertBefore(tabBar, panels[0]);

  function w(on)  { return 'at-wire'   + (on ? ' is-live' : ''); }
  function j(on)  { return 'at-junc'   + (on ? ' is-live' : ''); }
  function gb(on) { return 'at-gate'   + (on ? ' is-on'   : ''); }
  function ob(on) { return 'at-outbox' + (on ? ' is-on'   : ''); }
  function ib(on) { return 'at-inbox'  + (on ? ' is-on'   : ''); }
  function chip(v) { return '<span class="adder-chip' + (v ? ' is-on' : '') + '">' + v + '</span>'; }

  /* ── Hálf-samleggjari ── */
  var haState = { a: 0, b: 0 };
  var haWrap = el('div', { class: 'adder-svg-wrap' });
  var haResult = el('div', { class: 'adder-result', role: 'status', 'aria-live': 'polite' });
  var haStats = el('div', { class: 'adder-stats' });
  panels[0].appendChild(el('p', { class: 'adder-panel-hint', text: 'XOR gefur summuna, AND gefur flutninginn. Smelltu á A og B.' }));
  panels[0].appendChild(haWrap); panels[0].appendChild(haResult); panels[0].appendChild(haStats);

  function haBuild() {
    var sum = haState.a ^ haState.b, carry = haState.a & haState.b;
    haWrap.innerHTML = ['<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" class="adder-svg">',
      '<g class="at-input" id="at-ha-a"><text x="55" y="68" class="at-io-lbl">INNTAK A</text>',
      '<rect class="'+ib(haState.a)+'" x="28" y="75" width="54" height="54" rx="6"/>',
      '<text x="55" y="110" class="at-io-val">'+haState.a+'</text></g>',
      '<g class="at-input" id="at-ha-b"><text x="55" y="176" class="at-io-lbl">INNTAK B</text>',
      '<rect class="'+ib(haState.b)+'" x="28" y="183" width="54" height="54" rx="6"/>',
      '<text x="55" y="218" class="at-io-val">'+haState.b+'</text></g>',
      '<circle class="'+j(haState.a)+'" cx="116" cy="102" r="3.5"/>',
      '<circle class="'+j(haState.b)+'" cx="116" cy="210" r="3.5"/>',
      '<path class="'+w(haState.a)+'" d="M 82 102 L 116 102 C 175 102 205 93 240 102"/>',
      '<path class="'+w(haState.a)+'" d="M 116 102 C 155 138 195 198 240 215"/>',
      '<path class="'+w(haState.b)+'" d="M 82 210 L 116 210 C 164 210 205 133 240 112"/>',
      '<path class="'+w(haState.b)+'" d="M 116 210 C 175 210 205 221 240 225"/>',
      '<g class="'+gb(sum)+'"><path class="at-gate-arc" d="M 236 78 Q 245 102 236 126"/>',
      '<path class="at-gate-body" d="M 240 78 Q 257 78 295 102 Q 257 126 240 126 Q 249 102 240 78 Z"/>',
      '<text class="at-gate-lbl" x="268" y="106">XOR</text></g>',
      '<g class="'+gb(carry)+'"><path class="at-gate-body" d="M 240 200 L 265 200 A 17 17 0 0 1 265 234 L 240 234 Z"/>',
      '<text class="at-gate-lbl" x="259" y="221">AND</text></g>',
      '<circle class="'+j(carry)+'" cx="285" cy="217" r="3"/>',
      '<path class="'+w(carry)+'" d="M 285 217 L 350 217 L 350 82 L 410 82"/>',
      '<circle class="'+j(sum)+'" cx="299" cy="102" r="3"/>',
      '<path class="'+w(sum)+'" d="M 299 102 L 370 102 L 370 204 L 410 204"/>',
      '<rect class="'+ob(carry)+'" x="410" y="44" width="68" height="68" rx="6"/>',
      '<text x="444" y="90" class="at-outval">'+carry+'</text>',
      '<text x="492" y="67" transform="rotate(90,492,67)" class="at-outlbl">FLUTNINGUR</text>',
      '<rect class="'+ob(sum)+'" x="410" y="172" width="68" height="60" rx="6"/>',
      '<text x="444" y="211" class="at-outval">'+sum+'</text>',
      '<text x="492" y="197" transform="rotate(90,492,197)" class="at-outlbl">SUMMA</text>',
      '</svg>'].join('');
    haWrap.querySelector('#at-ha-a').addEventListener('click', function() { haState.a ^= 1; haBuild(); });
    haWrap.querySelector('#at-ha-b').addEventListener('click', function() { haState.b ^= 1; haBuild(); });
    haResult.innerHTML = haState.a + ' + ' + haState.b + ' = ' + chip(carry) + chip(sum) + ' <span class="adder-result-tail">= ' + (haState.a + haState.b) + ' í tugakerfinu</span>';
    renderAdderStats(haStats, { xor: 1, and: 1, or: 0, not: 0, lbl: 'Rökhlið í hálf-samleggjara' });
  }

  /* ── Fullur samleggjari ── */
  var faState = { a: 0, b: 0, cin: 0 };
  var faWrap = el('div', { class: 'adder-svg-wrap' });
  var faResult = el('div', { class: 'adder-result', role: 'status', 'aria-live': 'polite' });
  var faStats = el('div', { class: 'adder-stats' });
  panels[1].appendChild(el('p', { class: 'adder-panel-hint', text: 'Fullur samleggjari tekur flutning inn að auki — tvær XOR, tvær AND og eitt OR. Smelltu á A, B og Cín.' }));
  panels[1].appendChild(faWrap); panels[1].appendChild(faResult); panels[1].appendChild(faStats);

  function faBuild() {
    var A = faState.a, B = faState.b, Ci = faState.cin;
    var xab = A ^ B, sum = xab ^ Ci, c1 = A & B, c2 = xab & Ci, cout = c1 | c2;
    faWrap.innerHTML = ['<svg viewBox="0 0 580 360" xmlns="http://www.w3.org/2000/svg" class="adder-svg">',
      '<g class="at-input" id="at-fa-a"><text x="36" y="58" class="at-io-lbl">A</text>',
      '<rect class="'+ib(A)+'" x="12" y="64" width="48" height="48" rx="6"/>',
      '<text x="36" y="96" class="at-io-val">'+A+'</text></g>',
      '<g class="at-input" id="at-fa-b"><text x="36" y="158" class="at-io-lbl">B</text>',
      '<rect class="'+ib(B)+'" x="12" y="164" width="48" height="48" rx="6"/>',
      '<text x="36" y="196" class="at-io-val">'+B+'</text></g>',
      '<g class="at-input" id="at-fa-cin"><text x="36" y="258" class="at-io-lbl">CÍN</text>',
      '<rect class="'+ib(Ci)+'" x="12" y="264" width="48" height="48" rx="6"/>',
      '<text x="36" y="296" class="at-io-val">'+Ci+'</text></g>',
      '<circle class="'+j(A)+'" cx="78" cy="88" r="3"/>',
      '<circle class="'+j(B)+'" cx="78" cy="188" r="3"/>',
      '<circle class="'+j(Ci)+'" cx="78" cy="288" r="3"/>',
      '<path class="'+w(A)+'" d="M 60 88 L 78 88 C 130 88 155 126 185 139"/>',
      '<path class="'+w(B)+'" d="M 60 188 L 78 188 C 130 188 155 156 185 149"/>',
      '<g class="'+gb(xab)+'"><path class="at-gate-arc" d="M 181 124 Q 190 144 181 164"/>',
      '<path class="at-gate-body" d="M 185 124 Q 202 124 235 144 Q 202 164 185 164 Q 194 144 185 124 Z"/>',
      '<text class="at-gate-lbl" x="210" y="148">XOR</text></g>',
      '<circle class="'+j(xab)+'" cx="260" cy="144" r="3"/>',
      '<path class="'+w(xab)+'" d="M 239 144 L 260 144 C 300 144 318 151 340 159"/>',
      '<path class="'+w(Ci)+'" d="M 78 288 C 180 288 300 216 340 169"/>',
      '<g class="'+gb(sum)+'"><path class="at-gate-arc" d="M 336 144 Q 345 164 336 184"/>',
      '<path class="at-gate-body" d="M 340 144 Q 357 144 390 164 Q 357 184 340 184 Q 349 164 340 144 Z"/>',
      '<text class="at-gate-lbl" x="365" y="168">XOR</text></g>',
      '<path class="'+w(A)+'" d="M 78 88 C 120 88 155 256 185 268"/>',
      '<path class="'+w(B)+'" d="M 78 188 C 130 188 162 276 185 278"/>',
      '<g class="'+gb(c1)+'"><path class="at-gate-body" d="M 185 256 L 210 256 A 16 16 0 0 1 210 288 L 185 288 Z"/>',
      '<text class="at-gate-lbl" x="204" y="276">AND</text></g>',
      '<circle class="'+j(c1)+'" cx="228" cy="272" r="3"/>',
      '<path class="'+w(c1)+'" d="M 228 272 L 390 272 C 413 272 426 274 446 281"/>',
      '<path class="'+w(xab)+'" d="M 260 144 C 274 144 310 276 340 294"/>',
      '<path class="'+w(Ci)+'" d="M 78 288 C 160 288 280 310 340 306"/>',
      '<g class="'+gb(c2)+'"><path class="at-gate-body" d="M 340 284 L 365 284 A 16 16 0 0 1 365 316 L 340 316 Z"/>',
      '<text class="at-gate-lbl" x="359" y="304">AND</text></g>',
      '<circle class="'+j(c2)+'" cx="383" cy="300" r="3"/>',
      '<path class="'+w(c2)+'" d="M 383 300 C 408 300 426 294 446 291"/>',
      '<g class="'+gb(cout)+'"><path class="at-gate-body" d="M 446 270 Q 463 270 496 286 Q 463 302 446 302 Q 455 286 446 270 Z"/>',
      '<text class="at-gate-lbl" x="470" y="290">OR</text></g>',
      '<circle class="'+j(cout)+'" cx="499" cy="286" r="3"/>',
      '<path class="'+w(cout)+'" d="M 499 286 L 524 286 L 524 114 L 496 114"/>',
      '<rect class="'+ob(cout)+'" x="496" y="84" width="66" height="62" rx="6"/>',
      '<text x="529" y="124" class="at-outval">'+cout+'</text>',
      '<text x="562" y="107" transform="rotate(90,562,107)" class="at-outlbl">FLUTNINGUR</text>',
      '<circle class="'+j(sum)+'" cx="392" cy="164" r="3"/>',
      '<path class="'+w(sum)+'" d="M 392 164 L 426 164 L 426 246 L 496 246"/>',
      '<rect class="'+ob(sum)+'" x="496" y="216" width="66" height="54" rx="6"/>',
      '<text x="529" y="252" class="at-outval">'+sum+'</text>',
      '<text x="562" y="237" transform="rotate(90,562,237)" class="at-outlbl">SUMMA</text>',
      '</svg>'].join('');
    faWrap.querySelector('#at-fa-a').addEventListener('click', function() { faState.a ^= 1; faBuild(); });
    faWrap.querySelector('#at-fa-b').addEventListener('click', function() { faState.b ^= 1; faBuild(); });
    faWrap.querySelector('#at-fa-cin').addEventListener('click', function() { faState.cin ^= 1; faBuild(); });
    faResult.innerHTML = A + ' + ' + B + ' + Cín(' + Ci + ') = ' + chip(cout) + chip(sum) + ' <span class="adder-result-tail">= ' + (A + B + Ci) + ' í tugakerfinu</span>';
    renderAdderStats(faStats, { xor: 2, and: 2, or: 1, not: 0, lbl: 'Rökhlið í fullum samleggjara' });
  }

  /* ── 8-bita reiknivél ── */
  var GATE_COUNTS = {
    '+': { xor: 16, and: 8,   or: 7,  not: 0,  lbl: 'Ripple-carry samlagnari' },
    '-': { xor: 16, and: 8,   or: 7,  not: 8,  lbl: "Tvinnar-samlagning (two's complement)" },
    '*': { xor: 112, and: 176, or: 56, not: 0, lbl: 'Fylkis-margfaldari (array multiplier)' },
    '/': { xor: 128, and: 96,  or: 64, not: 64, lbl: 'Endurheimtulaus deilir (nálgun)' }
  };
  var c8state = { a: 0, b: 0, op: '+' };
  var c8Wrap = el('div', { class: 'adder-c8-wrap' });
  panels[2].appendChild(el('p', { class: 'adder-panel-hint', text: 'Sláðu inn tvær tölur (0–255) og veldu aðgerð. Sýnir hversu mörg rökhlið 8-bita vélbúnaður notar.' }));
  panels[2].appendChild(c8Wrap);

  var c8InputsRow = el('div', { class: 'adder-c8-inputs' });
  function makeNumBlock(labelText, inputId, bitsId) {
    var wrap = el('div', { class: 'adder-c8-numwrap' });
    wrap.appendChild(el('label', { class: 'adder-c8-lbl', text: labelText, for: inputId }));
    wrap.appendChild(el('input', { class: 'adder-c8-num', id: inputId, type: 'number', min: '0', max: '255', value: '0' }));
    wrap.appendChild(el('div', { class: 'adder-c8-bits', id: bitsId }));
    return wrap;
  }
  var opWrap = el('div', { class: 'adder-c8-opwrap' });
  ['+', '−', '×', '÷'].forEach(function(sym) {
    opWrap.appendChild(el('button', { class: 'adder-c8-op' + (sym === '+' ? ' is-active' : ''), type: 'button', 'data-op': sym, text: sym }));
  });
  c8InputsRow.appendChild(makeNumBlock('Tala A', 'at-c8a', 'at-c8a-bits'));
  c8InputsRow.appendChild(opWrap);
  c8InputsRow.appendChild(makeNumBlock('Tala B', 'at-c8b', 'at-c8b-bits'));
  var c8Answer = el('div', { class: 'adder-c8-answer' });
  var c8EqEl = el('span', { class: 'adder-c8-eq', id: 'at-c8-eq', text: '0 + 0 = 0' });
  var c8BinEl = el('span', { class: 'adder-c8-bin', id: 'at-c8-bin' });
  c8Answer.appendChild(c8EqEl); c8Answer.appendChild(c8BinEl);
  var c8Visual = el('div', { class: 'adder-c8-visual' });
  var c8Stats = el('div', { class: 'adder-stats' });
  c8Wrap.appendChild(c8InputsRow); c8Wrap.appendChild(c8Answer);
  c8Wrap.appendChild(c8Visual); c8Wrap.appendChild(c8Stats);

  function toBits8(n) { var b = []; for (var i = 7; i >= 0; i--) b.push((n >> i) & 1); return b; }
  function renderC8Bits(cont, val, which) {
    var bits = toBits8(Math.max(0, Math.min(255, val)));
    cont.innerHTML = bits.map(function(b, i) {
      return '<div class="adder-c8-bit' + (b ? ' is-on' : '') + '" data-i="' + i + '">' + b + '</div>';
    }).join('');
    cont.querySelectorAll('.adder-c8-bit').forEach(function(bitEl) {
      bitEl.addEventListener('click', function() {
        var pos = 7 - parseInt(bitEl.dataset.i);
        c8state[which] ^= (1 << pos);
        var inp = c8Wrap.querySelector('#at-c8' + which);
        if (inp) inp.value = c8state[which];
        c8Update();
      });
    });
  }
  function visRow(lbl, bitsHtml, note) {
    return '<div class="adder-c8-visrow"><span class="adder-c8-vislbl">' + lbl + '</span><div class="adder-c8-visbits">' + bitsHtml + '</div></div>' + (note ? '<div class="adder-c8-visnote">' + note + '</div>' : '');
  }
  function visBit(b, cls) { return '<div class="adder-c8-bitres' + (cls ? ' ' + cls : '') + '">' + b + '</div>'; }

  function c8Update() {
    var a = c8state.a, b = c8state.b, op = c8state.op;
    var abEl = c8Wrap.querySelector('#at-c8a-bits'), bbEl = c8Wrap.querySelector('#at-c8b-bits');
    if (abEl) renderC8Bits(abEl, a, 'a');
    if (bbEl) renderC8Bits(bbEl, b, 'b');
    var opKey = op === '+' ? '+' : op === '−' ? '-' : op === '×' ? '*' : '/';
    var gc = GATE_COUNTS[opKey];
    var raw, overflow = false, visHtml = '', note = '';
    if (op === '+') { raw = a + b; overflow = raw > 255; }
    else if (op === '−') { raw = a - b; overflow = raw < 0; }
    else if (op === '×') { raw = a * b; overflow = raw > 255; }
    else { if (b === 0) { raw = null; note = 'Deiling með 0 er óleyfð'; } else { raw = Math.floor(a / b); } }

    if (note) {
      c8EqEl.innerHTML = '<span class="adder-c8-overflow">' + note + '</span>';
      c8BinEl.textContent = ''; c8Visual.innerHTML = '';
    } else if (overflow) {
      var full = raw, kept = full & 0xFF;
      var nb = Math.max(9, Math.ceil(Math.log2(full + 1)));
      var fbits = []; for (var i = nb - 1; i >= 0; i--) fbits.push((full >> i) & 1);
      var lc = nb - 8;
      var fc = fbits.map(function(bb, i) { return i < lc ? (bb ? 'is-lost' : '') : (bb ? 'is-on' : ''); });
      c8EqEl.innerHTML = a + ' ' + op + ' ' + b + ' = <span class="adder-c8-overflow">' + full + '</span> → 8 bitar geyma <strong>' + kept + '</strong>';
      c8BinEl.textContent = '';
      visHtml += visRow(full + ' =', fbits.map(function(bb, i) { return visBit(bb, fc[i]); }).join(''), '<span class="adder-c8-overflow">■</span> Rauðir bitar glatast. Til að geyma ' + full + ' þyrfti ' + nb + ' bita.');
      var kb = []; for (var k = 7; k >= 0; k--) kb.push((kept >> k) & 1);
      visHtml += visRow(kept + ' =', kb.map(function(bb) { return visBit(bb, bb ? 'is-on' : ''); }).join(''), 'Þetta er það sem 8-bita vélin skilar.');
      c8Visual.innerHTML = visHtml;
    } else if (op === '÷' && raw !== null) {
      var q = Math.floor(a / b), rem = a % b;
      c8EqEl.innerHTML = a + ' ÷ ' + b + ' = <strong>' + q + '</strong> afgangur <span class="adder-c8-rem">' + rem + '</span>';
      c8BinEl.textContent = '';
      var qb = []; for (var qi = 7; qi >= 0; qi--) qb.push((q >> qi) & 1);
      visHtml += visRow('Kvóti =', qb.map(function(bb) { return visBit(bb, bb ? 'is-on' : ''); }).join(''));
      if (rem > 0) {
        var rb = []; for (var ri = 7; ri >= 0; ri--) rb.push((rem >> ri) & 1);
        visHtml += visRow('Afgangur =', rb.map(function(bb) { return visBit(bb, 'is-rem'); }).join(''), 'Afgangurinn glatast í heiltölureiknivél nema vél sendi hann sérstaklega.');
      }
      c8Visual.innerHTML = visHtml;
    } else {
      var r8 = (raw || 0) & 0xFF;
      var r8b = []; for (var bi = 7; bi >= 0; bi--) r8b.push((r8 >> bi) & 1);
      c8EqEl.textContent = a + ' ' + op + ' ' + b + ' = ' + r8;
      c8BinEl.textContent = '= ' + r8b.join('') + ' (tvíundarlegt)';
      c8Visual.innerHTML = '';
    }
    renderAdderStats(c8Stats, gc);
  }

  var c8aInp = c8Wrap.querySelector('#at-c8a'), c8bInp = c8Wrap.querySelector('#at-c8b');
  c8aInp.addEventListener('input', function() { c8state.a = Math.max(0, Math.min(255, parseInt(this.value) || 0)); c8Update(); });
  c8bInp.addEventListener('input', function() { c8state.b = Math.max(0, Math.min(255, parseInt(this.value) || 0)); c8Update(); });
  c8Wrap.querySelectorAll('.adder-c8-op').forEach(function(btn) {
    btn.addEventListener('click', function() {
      c8Wrap.querySelectorAll('.adder-c8-op').forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active'); c8state.op = btn.dataset.op; c8Update();
    });
  });

  function renderAdderStats(container, gc) {
    var types = [
      { name: 'XOR', val: gc.xor, color: 'var(--accent)' },
      { name: 'AND', val: gc.and, color: '#57c9a0' },
      { name: 'OR',  val: gc.or,  color: '#e8a93a' },
      { name: 'NOT', val: gc.not, color: '#b07ae8' }
    ].filter(function(t) { return t.val > 0; });
    var mx = Math.max.apply(null, types.map(function(t) { return t.val; }));
    container.innerHTML = (gc.lbl ? '<div class="adder-stats-title">' + gc.lbl.toUpperCase() + '</div>' : '')
      + '<div class="adder-stats-row">'
      + types.map(function(t) {
        return '<div class="adder-stats-chip"><div class="adder-stats-name">' + t.name + '</div>'
          + '<div class="adder-stats-num">' + t.val + '</div>'
          + '<div class="adder-stats-bar"><div class="adder-stats-fill" style="width:' + Math.round(t.val / mx * 100) + '%;background:' + t.color + '"></div></div>'
          + '</div>';
      }).join('') + '</div>'
      + (gc.lbl && gc.lbl.indexOf('8') !== -1 ? '<div class="adder-stats-note">Þetta eru vélbúnaðarlegar nálganir fyrir 8-bita heiltölu-einingu (ALU).</div>' : '');
  }

  haBuild(); faBuild(); c8Update();
}