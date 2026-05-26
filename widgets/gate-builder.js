/* ---------- 20. Gate Builder ---------- */
    function renderGateBuilder(figure) {
      figure.className = 'gbuilder-figure';
      figure.appendChild(el('figcaption', { class: 'gbuilder-title', text: 'Smíðaðu þitt eigið rökhlið' }));
      var progress = el('p', { class: 'gbuilder-progress', text: 'Smelltu til að smíða (Virkni væntanleg í útgáfu 2.0)' });
      figure.appendChild(progress);
    }