/* ---------- 2. Enigma-þraut ---------- */
    function renderEnigma(figure) {
      function strToPerm(s) {
        var p = [];
        for (var i = 0; i < 26; i++) p.push(s.charCodeAt(i) - 65);
        return p;
      }
      function invPerm(p) {
        var inv = new Array(26);
        for (var i = 0; i < 26; i++) inv[p[i]] = i;
        return inv;
      }

      var R1  = strToPerm('EKMFLGDQVZNTOWYHXUPSAIBRCJ');
      var R2  = strToPerm('JADKSIRUXBLHWTMCQGZNPYFVOE');
      var R3  = strToPerm('BDFHJLCPRTXVNZYEIWGAKMUSQO');
      var REF = strToPerm('YRUHQSLDPXNGOKMIEBFZCWVJAT');
      var R1i = invPerm(R1), R2i = invPerm(R2), R3i = invPerm(R3);

      function idx(ch) { return ch.charCodeAt(0) - 65; }
      function ltr(n)  { return String.fromCharCode(65 + ((n % 26) + 26) % 26); }

      function through(perm, pos, x) {
        return ((perm[(x + pos) % 26] - pos) % 26 + 26) % 26;
      }

      function encChar(x, p1, p2, p3) {
        x = through(R1, p1, x);
        x = through(R2, p2, x);
        x = through(R3, p3, x);
        x = REF[x];
        x = through(R3i, p3, x);
        x = through(R2i, p2, x);
        x = through(R1i, p1, x);
        return x;
      }
      function encString(s, p1, p2, p3) {
        var out = '';
        for (var i = 0; i < s.length; i++) {
          var c = s.charCodeAt(i) - 65;
          if (c < 0 || c >= 26) { out += s[i]; continue; }
          out += String.fromCharCode(65 + encChar(c, (p1 + i) % 26, p2, p3));
        }
        return out;
      }

      var plaintext     = 'SEELOWE';
      var displaySolved = 'SEELOWE';   
      var I_CORRECT     = idx('S');
      var II_CORRECT    = idx('E');
      var III_CORRECT   = idx('A');

      var ciphertext = encString(plaintext, I_CORRECT, II_CORRECT, III_CORRECT);
      var unlocked = false;

      figure.className = 'enigma-figure';
      figure.setAttribute('aria-label', 'Gagnvirk Enigma-þraut');

      figure.appendChild(el('figcaption', { class: 'enigma-title', text: 'Leystu dulmálið' }));
      var hintEl = el('p', {
        class: 'enigma-hint',
        text: 'Við þekkjum allar stillingarnar nema eina. Finndu réttu stillinguna fyrir Hjól III til að afhjúpa leyniorðið.'
      });
      figure.appendChild(hintEl);

      function buildRotor(label, initialVal, locked) {
        var val = initialVal;
        var rotor = el('div', { class: 'enigma-rotor ' + (locked ? 'is-locked' : 'is-active') });
        rotor.appendChild(el('span', { class: 'enigma-rotor-label', text: label }));

        var upBtn   = el('button', { class: 'enigma-rotor-btn', type: 'button',
                                      'aria-label': label + ': næsti stafur', text: '▲' });
        var letter  = el('div', { class: 'enigma-rotor-letter',
                                   role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true',
                                   text: ltr(val) });
        var downBtn = el('button', { class: 'enigma-rotor-btn', type: 'button',
                                      'aria-label': label + ': fyrri stafur', text: '▼' });
        var status  = el('span', { class: 'enigma-rotor-status', text: '🔒 Læst' });

        rotor.appendChild(upBtn);
        rotor.appendChild(letter);
        rotor.appendChild(downBtn);
        rotor.appendChild(status);

        upBtn.addEventListener('click', function () {
          val = (val + 1) % 26;
          letter.textContent = ltr(val);
          update();
        });
        downBtn.addEventListener('click', function () {
          val = (val - 1 + 26) % 26;
          letter.textContent = ltr(val);
          update();
        });

        return {
          el: rotor,
          val: function () { return val; },
          unlock: function () {
            rotor.classList.remove('is-locked');
            rotor.classList.add('is-active');
          }
        };
      }

      var rotors = el('div', { class: 'enigma-rotors' });
      var rotorI   = buildRotor('Hjól I',   I_CORRECT,   true);
      var rotorII  = buildRotor('Hjól II',  II_CORRECT,  true);
      var rotorIII = buildRotor('Hjól III', idx('G'),    false);   
      rotors.appendChild(rotorI.el);
      rotors.appendChild(rotorII.el);
      rotors.appendChild(rotorIII.el);
      figure.appendChild(rotors);

      var displays = el('div', { class: 'enigma-displays' });

      var cipherRow = el('div', { class: 'enigma-row' });
      cipherRow.appendChild(el('span', { class: 'enigma-row-label', text: 'Dulmál' }));
      var cipherCells = el('div', { class: 'enigma-cells' });
      for (var i = 0; i < ciphertext.length; i++) {
        cipherCells.appendChild(el('span', { class: 'enigma-cell is-cipher', text: ciphertext[i] }));
      }
      cipherRow.appendChild(cipherCells);
      displays.appendChild(cipherRow);

      var plainRow = el('div', { class: 'enigma-row' });
      plainRow.appendChild(el('span', { class: 'enigma-row-label', text: 'Afkóðað' }));
      var plainCells = el('div', { class: 'enigma-cells' });
      for (var j = 0; j < plaintext.length; j++) {
        plainCells.appendChild(el('span', { class: 'enigma-cell is-plain', text: '·' }));
      }
      plainRow.appendChild(plainCells);
      displays.appendChild(plainRow);

      figure.appendChild(displays);

      var success = el('div', { class: 'enigma-success', role: 'status', 'aria-live': 'polite' });
      var s1 = el('strong', { text: 'Rétt! ' });
      success.appendChild(s1);
      success.appendChild(document.createTextNode(
        'SEELÖWE (Sæljón) var dulnefni nasista yfir fyrirhugaða innráðs í Bretland 1940. ' +
        'Bombe-vél Turings gat þurft að prófa allar 17.576 mögulegar stillingar til að finna svona lausn — það tókst stundum á nokkrum mínútum.'
      ));
      figure.appendChild(success);

      function update() {
        var iV   = rotorI.val();
        var iiV  = rotorII.val();
        var iiiV = rotorIII.val();
        var decoded = encString(ciphertext, iV, iiV, iiiV);
        var solved = (iV === I_CORRECT && iiV === II_CORRECT && iiiV === III_CORRECT);
        var display = solved ? displaySolved : decoded;
        var cells = plainCells.children;
        for (var i = 0; i < display.length; i++) {
          cells[i].textContent = display[i];
        }
        figure.classList.toggle('is-solved', solved);
        if (solved && !unlocked) {
          unlocked = true;
          rotorI.unlock();
          rotorII.unlock();
          hintEl.textContent = 'Öll hjól eru nu opin. Prófaðu mismunandi stillingar og sjáðu hvernig dulmálið breytist.';
        }
      }

      update();
    }
