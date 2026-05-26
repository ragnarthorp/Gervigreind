/* ---------- Sanngildistöflu Boole (kyrr tafla fyrir „og" og „eða") ---------- */
function renderBooleTable(figure) {
  figure.className = 'booletable-figure';
  figure.setAttribute('aria-label', 'Sanngildistafla sem sýnir margföldun („og") og samlagningu („eða") á 0 og 1');

  figure.appendChild(el('figcaption', {
    class: 'booletable-title',
    text: 'Sanngildistafla'
  }));

  var table = el('table', { class: 'booletable' });
  var thead = el('thead');
  var headRow = el('tr');
  ['A', 'B', 'A · B  („og")', 'A + B  („eða")'].forEach(function (h) {
    headRow.appendChild(el('th', { scope: 'col', text: h }));
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  var tbody = el('tbody');
  for (var a = 0; a < 2; a++) {
    for (var b = 0; b < 2; b++) {
      var tr = el('tr');
      tr.appendChild(el('td', { text: String(a) }));
      tr.appendChild(el('td', { text: String(b) }));
      tr.appendChild(el('td', { class: 'booletable-result', text: String(a & b) }));
      tr.appendChild(el('td', { class: 'booletable-result', text: String(a | b) }));
      tbody.appendChild(tr);
    }
  }
  table.appendChild(tbody);
  figure.appendChild(table);

  figure.appendChild(el('p', {
    class: 'booletable-caption',
    text: 'Taktu eftir: 1 + 1 = 1 í þessu kerfi, því 1 táknar „satt" — ekki tölu.'
  }));
}