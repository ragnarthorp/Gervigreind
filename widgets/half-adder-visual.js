/* ---------- 19. Hálf-deilari sjónrænn (Visual Half Adder) ---------- */
    function renderHalfAdderVisual(figure) {
      figure.className = 'hav-figure';
      figure.appendChild(el('figcaption', { class: 'hav-title', text: 'Tvö rökhlið leggja saman tvær tölur' }));
      var svgWrap = el('div', { class: 'hav-svg-wrap' }); figure.appendChild(svgWrap);

      var state = { a: 0, b: 0 };
      function rebuild() {
        var sum = state.a ^ state.b; var carry = state.a & state.b;
        svgWrap.innerHTML = [
          '<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" class="hav-svg">',
            '<rect x="90" y="60" width="64" height="60" rx="6" fill="' + (state.a ? '#57c9a0' : '#DAD7CE') + '" class="hav-input-box" data-inp="a"/>',
            '<text x="122" y="95" text-anchor="middle">A: ' + state.a + '</text>',
            '<rect x="90" y="200" width="64" height="60" rx="6" fill="' + (state.b ? '#57c9a0' : '#DAD7CE') + '" class="hav-input-box" data-inp="b"/>',
            '<text x="122" y="235" text-anchor="middle">B: ' + state.b + '</text>',
            '<path d="M 154 90 L 295 90 M 154 230 L 295 230" stroke="#2A5C66" stroke-width="3"/>',
            '<rect x="295" y="65" width="80" height="50" rx="4" fill="#2A5C66"/>',
            '<text x="335" y="95" fill="white" text-anchor="middle">XOR</text>',
            '<rect x="295" y="205" width="80" height="50" rx="4" fill="#2A5C66"/>',
            '<text x="335" y="235" fill="white" text-anchor="middle">AND</text>',
            '<text x="450" y="95">Summa: ' + sum + '</text>',
            '<text x="450" y="235">Flutningur: ' + carry + '</text>',
          '</svg>'
        ].join('');

        svgWrap.querySelectorAll('.hav-input-box').forEach(function(box) {
          box.addEventListener('click', function() {
            var id = box.getAttribute('data-inp'); state[id] = 1 - state[id]; rebuild();
          });
        });
      }
      rebuild();
    }