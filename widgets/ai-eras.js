/* ---------- Þrjú tímabil, þrjár vélar ---------- */
function renderAIEras(figure) {
  figure.className = 'eras-figure';
  figure.setAttribute('aria-label',
    'Samanburður á þremur tímamóta-vélum: Deep Blue (1997), AlexNet (2012) og AlphaGo (2016).');

  figure.appendChild(el('figcaption', {
    class: 'eras-title',
    text: 'Þrjú tímabil, þrjár vélar'
  }));
  figure.appendChild(el('p', {
    class: 'eras-hint',
    text: 'Þrír stórir áfangar í gervigreind. Berðu saman hvernig nálgunin breyttist — frá hreinni reiknigetu yfir í djúpnám og loks yfir í gervigreind sem kennir sjálfri sér.'
  }));

  var ERAS = [
    {
      year: 1997,
      name: 'Deep Blue',
      domain: 'SKÁK',
      approach: 'BRUTE FORCE',
      approachKind: 'brute',
      hardware: '480 sérhannaðir örgjörvar',
      stat: { value: '200M', unit: 'stöður á sekúndu' },
      novel: 'Hröð leit í gegnum risastór trjámynstur möguleikanna. Sigraði heimsmeistarann Garrí Kasparov.',
      foe: 'vs. Garrí Kasparov'
    },
    {
      year: 2012,
      name: 'AlexNet',
      domain: 'TÖLVUSJÓN',
      approach: 'DJÚPNÁM',
      approachKind: 'deep',
      hardware: '2 GPU + 1 CPU',
      stat: { value: '8', unit: 'lög að dýpt' },
      novel: 'Tauganet sem lærði sjálft að þekkja mynstur úr 1,2 milljónum mynda. Felldi villuhlutfall í ImageNet-keppninni um nær 11 prósentustig.',
      foe: 'ILSVRC-keppnin'
    },
    {
      year: 2016,
      name: 'AlphaGo',
      domain: 'GO',
      approach: 'DJÚPNÁM + STYRKINGAR­NÁM',
      approachKind: 'rl',
      hardware: '176 GPU + 1202 CPU',
      stat: { value: '4–1', unit: 'gegn Lee Sedol' },
      novel: 'Keppti við sjálfa sig milljónum sinnum og fann leiðir sem engir mennskir spilarar höfðu áður séð. Leikur 37 í annarri skák kom heiminum á óvart.',
      foe: 'vs. Lee Sedol'
    }
  ];

  var grid = el('div', { class: 'eras-grid' });

  ERAS.forEach(function (e, i) {
    var card = el('div', { class: 'eras-card eras-card-' + e.approachKind });

    var head = el('div', { class: 'eras-head' });
    head.appendChild(el('div', { class: 'eras-year', text: String(e.year) }));
    head.appendChild(el('div', { class: 'eras-name', text: e.name }));
    head.appendChild(el('div', { class: 'eras-domain', text: e.domain }));
    card.appendChild(head);

    var approach = el('div', { class: 'eras-approach' });
    approach.appendChild(el('span', { class: 'eras-approach-eyebrow', text: 'NÁLGUN' }));
    approach.appendChild(el('span', { class: 'eras-approach-label', text: e.approach }));
    card.appendChild(approach);

    var stat = el('div', { class: 'eras-stat' });
    stat.appendChild(el('div', { class: 'eras-stat-value', text: e.stat.value }));
    stat.appendChild(el('div', { class: 'eras-stat-unit', text: e.stat.unit }));
    card.appendChild(stat);

    var meta = el('div', { class: 'eras-meta' });
    var metaRow1 = el('div', { class: 'eras-meta-row' });
    metaRow1.appendChild(el('span', { class: 'eras-meta-label', text: 'Vélbúnaður' }));
    metaRow1.appendChild(el('span', { class: 'eras-meta-value', text: e.hardware }));
    meta.appendChild(metaRow1);
    var metaRow2 = el('div', { class: 'eras-meta-row' });
    metaRow2.appendChild(el('span', { class: 'eras-meta-label', text: 'Andstæðingur' }));
    metaRow2.appendChild(el('span', { class: 'eras-meta-value', text: e.foe }));
    meta.appendChild(metaRow2);
    card.appendChild(meta);

    var novel = el('div', { class: 'eras-novel' });
    novel.appendChild(el('div', { class: 'eras-novel-eyebrow', text: 'HVAÐ VAR NÝTT' }));
    novel.appendChild(el('p', { class: 'eras-novel-text', text: e.novel }));
    card.appendChild(novel);

    grid.appendChild(card);

    // tengiör á eftir vinstri spjöldum
    if (i < ERAS.length - 1) {
      var arrow = el('div', { class: 'eras-arrow', 'aria-hidden': 'true' });
      arrow.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M5 12 H 19"/>' +
          '<path d="M14 7 L 19 12 L 14 17"/>' +
        '</svg>';
      grid.appendChild(arrow);
    }
  });

  figure.appendChild(grid);

  // neðsta línan — eitthvað til samhengis
  figure.appendChild(el('p', {
    class: 'eras-footnote',
    text: 'Frá tölvu sem reiknaði yfir í tölvu sem lærði — og loks tölvu sem kennir sjálfri sér.'
  }));
}

