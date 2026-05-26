/* ---------- 17. Hálf-deilari (Half Adder) ---------- */
    function renderHalfAdder(figure) {
      figure.className = 'halfadder-figure';
      figure.appendChild(el('figcaption', { class: 'halfadder-title', text: 'Svona leggur tölvan saman tölur' }));

      var state = { a: 0, b: 0 };
      var aBtn = el('button', { class: 'gate-toggle', type: 'button', text: 'A: 0' });
      var bBtn = el('button', { class: 'gate-toggle', type: 'button', text: 'B: 0' });
      var row = el('div', { class: 'halfadder-inputs' }); row.appendChild(aBtn); row.appendChild(bBtn); figure.appendChild(row);

      var circuit = el('div', { class: 'halfadder-circuit' });
      var xorOut = el('span', { class: 'halfadder-output-value', text: '0' });
      var andOut = el('span', { class: 'halfadder-output-value', text: '0' });

      var xorRow = el('div', { class: 'halfadder-gate', text: 'XOR (Summa) → ' }); xorRow.appendChild(xorOut);
      var andRow = el('div', { class: 'halfadder-gate', text: 'AND (Flutningur) → ' }); andRow.appendChild(andOut);
      circuit.appendChild(xorRow); circuit.appendChild(andRow); figure.appendChild(circuit);

      var result = el('p', { class: 'halfadder-result', role: 'status' }); figure.appendChild(result);

      function update() {
        aBtn.textContent = 'A: ' + state.a; bBtn.textContent = 'B: ' + state.b;
        aBtn.classList.toggle('is-on', state.a); bBtn.classList.toggle('is-on', state.b);
        var sum = state.a ^ state.b; var carry = state.a & state.b;
        xorOut.textContent = sum; andOut.textContent = carry;
        result.innerHTML = state.a + ' + ' + state.b + ' = <strong>' + carry + sum + '</strong> í tvíundakerfi';
      }

      aBtn.addEventListener('click', function() { state.a = 1 - state.a; update(); });
      bBtn.addEventListener('click', function() { state.b = 1 - state.b; update(); });
      update();
    }