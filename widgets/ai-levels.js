/* ---------- Þrjú stig gervigreindar: ANI · AGI · ASI ---------- */
function renderAILevels(figure) {
  figure.className = 'ailev-figure';
  figure.setAttribute('aria-label',
    'Samanburður á þremur stigum gervigreindar: þröng (ANI), almenn (AGI) og ofur (ASI).');

  figure.appendChild(el('figcaption', {
    class: 'ailev-title',
    text: 'Þrjú stig gervigreindar'
  }));
  figure.appendChild(el('p', {
    class: 'ailev-hint',
    text: 'Frá tækni sem þú átt í dag, til mögulegrar framtíðar — og fræðilegrar tilgátu.'
  }));

  var LEVELS = [
    {
      kind: 'ani',
      short: 'ANI',
      title: 'Þröng gervigreind',
      english: 'Artificial Narrow Intelligence',
      definition: 'Öflug á einu afmörkuðu sviði en getur ekki yfirfært þekkingu sína á óskyld svið án endurþjálfunar.',
      examples: [
        'Deep Blue (skák, 1997)',
        'AlexNet (myndgreining, 2012)',
        'ChatGPT-3.5 (texti, 2022)',
        'Talgervlar og þýðingarvélar'
      ],
      status: 'Þgar komin fram.'
    },
    {
      kind: 'agi',
      short: 'AGI',
      title: 'Almenn gervigreind',
      english: 'Artificial General Intelligence',
      definition: 'Gæti, líkt og maður, lært af umhverfi sínu, yfirfært þekkingu og leyst ný, óvænt vandamál.',
      examples: [
        'Lærir af umhverfi sínu',
        'Yfirfærir milli sviða',
        'Notar almenna skynsemi',
        'Þarf enga endurforritun'
      ],
      status: 'Demis Hassabis spáir innan áratugs. Aðrir efast.'
    },
    {
      kind: 'asi',
      short: 'ASI',
      title: 'Ofurgervigreind',
      english: 'Artificial Superintelligence',
      definition: 'Færi langt fram úr mannlegum vitsmunum á öllum eða nánast öllum sviðum. ',
      examples: [
        'Fræðilegt hugtak enn sem komið er',
        'Mögulegt: lausn flókinna vandamála',
        'Möguleg áhætta: missum stjórn',
        'Bæði vonir og djúpstæður ótti'
      ],
      status: 'Tilgáta. Varla hugsanleg með tækni dagsins í dag.'
    }
  ];

  var grid = el('div', { class: 'ailev-grid' });

  LEVELS.forEach(function (lv, i) {
    var card = el('div', { class: 'ailev-card ailev-' + lv.kind });

    var head = el('div', { class: 'ailev-head' });
    head.appendChild(el('div', { class: 'ailev-short', text: lv.short }));
    head.appendChild(el('div', { class: 'ailev-title-is', text: lv.title }));
    head.appendChild(el('div', { class: 'ailev-title-en', text: lv.english }));
    card.appendChild(head);

    card.appendChild(el('p', { class: 'ailev-def', text: lv.definition }));

    var list = el('ul', { class: 'ailev-list' });
    lv.examples.forEach(function (ex) {
      list.appendChild(el('li', { text: ex }));
    });
    card.appendChild(list);

    var status = el('div', { class: 'ailev-status' });
    status.appendChild(el('span', { class: 'ailev-status-label', text: 'STAÐA' }));
    status.appendChild(el('span', { class: 'ailev-status-value', text: lv.status }));
    card.appendChild(status);

    grid.appendChild(card);

    if (i < LEVELS.length - 1) {
      var arrow = el('div', { class: 'ailev-arrow', 'aria-hidden': 'true' });
      arrow.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12 H 19"/>' +
          '<path d="M14 7 L 19 12 L 14 17"/>' +
        '</svg>';
      grid.appendChild(arrow);
    }
  });

  figure.appendChild(grid);
}

