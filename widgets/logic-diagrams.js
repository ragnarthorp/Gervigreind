/* ---------- 11. Rökhugsunarmyndir ---------- */
    function renderLogicDiagrams(figure) {
      figure.className = 'logicdiag-figure';
      var pair = el('div', { class: 'logicdiag-pair' });

      function buildColumn(opts) {
        var col = el('div', { class: 'logicdiag-col' });
        col.appendChild(el('h4', { class: 'logicdiag-col-title', text: opts.title }));
        opts.premises.forEach(function (p) {
          col.appendChild(el('div', { class: 'logicdiag-box logicdiag-premise', html: '<strong>' + p.label + '</strong> ' + p.text }));
        });
        col.appendChild(el('div', { class: 'logicdiag-arrow', text: '↓' }));
        var concl = el('div', { class: 'logicdiag-box logicdiag-conclusion logicdiag-conclusion-' + opts.kind });
        concl.appendChild(el('div', { class: 'logicdiag-conclusion-label', text: opts.conclusionLabel }));
        concl.appendChild(el('div', { class: 'logicdiag-conclusion-text', text: opts.conclusionText }));
        if (opts.hint) concl.appendChild(el('div', { class: 'logicdiag-conclusion-hint', text: opts.hint }));
        col.appendChild(concl); return col;
      }

      pair.appendChild(buildColumn({
        title: 'Rétt röksemdafærsla',
        premises: [{ label: 'Forsenda 1:', text: 'Ef það rignir (R) þá er jörðin blaut (B)' }, { label: 'Forsenda 2:', text: 'Það er rigning (R)' }],
        kind: 'ok', conclusionLabel: '✓ Rökrétt', conclusionText: 'Jörðin er blaut (B)'
      }));
      pair.appendChild(buildColumn({
        title: 'Röng röksemdafærsla',
        premises: [{ label: 'Forsenda 1:', text: 'Ef það rignir (R) þá er jörðin blaut (B)' }, { label: 'Forsenda 2:', text: 'Jörðin er blaut (B)' }],
        kind: 'bad', conclusionLabel: '✗ Ekki rökrétt', conclusionText: 'Það hefur rignt (R)', hint: 'Jörðin gæti verið blaut af öðrum ástæðum.'
      }));
      figure.appendChild(pair);
    }