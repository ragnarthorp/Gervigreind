 /* ---------- 6. Tvíundartafla ---------- */
    function renderBinaryTable(figure) {
      figure.className = 'bintable-figure';
      figure.setAttribute('aria-label', 'Tafla sem sýnir tölurnar 0 til 10 í tugakerfi og tvíundarkerfi');
      figure.appendChild(el('figcaption', { class: 'bintable-title', text: 'Tölurnar 0–10 í báðum kerfum' }));

      var table = el('table', { class: 'bintable' });
      var thead = el('thead'); var trHead = el('tr');
      trHead.appendChild(el('th', { scope: 'col', text: 'Tugakerfi' }));
      trHead.appendChild(el('th', { scope: 'col', text: 'Tvíundarkerfi' }));
      thead.appendChild(trHead); table.appendChild(thead);

      var tbody = el('tbody');
      for (var i = 0; i <= 10; i++) {
        var tr = el('tr');
        tr.appendChild(el('td', { text: String(i) }));
        tr.appendChild(el('td', { class: 'bintable-binary', text: i.toString(2) }));
        tbody.appendChild(tr);
      }
      table.appendChild(tbody); figure.appendChild(table);
    }
