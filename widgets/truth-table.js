 /* ---------- 18. Teikna rökhlið á spjald (Truth Table Engine) ---------- */
    function renderTruthTable(figure) {
      figure.className = 'tt-figure';
      figure.appendChild(el('figcaption', { class: 'tt-title', text: 'Önnur rökhlið og sanngildistöflur' }));

      var GATES = [
        { key: 'and', name: 'AND', op: function(a,b){return a&b;} },
        { key: 'or',  name: 'OR',  op: function(a,b){return a|b;} },
        { key: 'xor', name: 'XOR', op: function(a,b){return a^b;} }
      ];

      var selector = el('div', { class: 'tt-selector' });
      var card = el('div', { class: 'tt-card', text: 'Veldu hlið að ofan.' });

      GATES.forEach(function(g) {
        var btn = el('button', { class: 'tt-pill', type: 'button', text: g.name });
        btn.addEventListener('click', function() {
          card.innerHTML = '';
          var table = el('table', { class: 'tt-table' });
          for(var a=0; a<2; a++) {
            for(var b=0; b<2; b++) {
              var tr = el('tr');
              tr.appendChild(el('td', { text: String(a) })); tr.appendChild(el('td', { text: String(b) }));
              tr.appendChild(el('td', { text: String(g.op(a,b)) })); table.appendChild(tr);
            }
          }
          card.appendChild(table);
        });
        selector.appendChild(btn);
      });
      figure.appendChild(selector); figure.appendChild(card);
    }