/* ---------- Þrír heimspekistraumar ---------- */
function renderPhilosophy(figure) {
  figure.className = 'phil-figure';
  figure.setAttribute('aria-label',
    'Þrír heimspekistraumar um hlutverk mannsins í heimi gervigreindar.');

  figure.appendChild(el('figcaption', {
    class: 'phil-title',
    text: 'Hvert á hlutverk mannfólks að vera?'
  }));
  figure.appendChild(el('p', {
    class: 'phil-hint',
    text: 'Þrjár ólíkar leiðir til að hugsa um stöðu manna gagnvart gervigreind. Engin er rétt — hver dregur fram aðra hlið.'
  }));

  var STREAMS = [
    {
      key: 'post',
      short: 'PÓSTHÚMANISMI',
      english: 'Posthumanism',
      coreQ: 'Erum við í alvöru miðpunktur heimsins?',
      coreA: 'Nei. Sérstaða okkar er stórlega ýkt — við erum dýr eins og önnur dýr og ofmetum okkur.',
      ai: 'Vélar sem skara fram úr mannlegum vitsmunum eru ekki harmleikur. Þær geta gefið okkur víðara sjónarhorn og auðmýkt.'
    },
    {
      key: 'exist',
      short: 'TILVISTARSTEFNA',
      english: 'Existentialism',
      coreQ: 'Hver er tilgangur míns lífs?',
      coreA: 'Þú skapar þig sjálf(ur) með því að velja. Manneskjan er höfundur eigin lífs.',
      ai: 'Tækni má ekki taka af okkur valið. Ef við látum hana lifa lífinu fyrir okkur verðum við andlega löt, áttavillt og vansæl.'
    },
    {
      key: 'human',
      short: 'HÚMANISMI',
      english: 'Humanism',
      coreQ: 'Hvað gerir mannfólk verðmætt?',
      coreA: 'Reisn, tilfinningar og þarfir — ekki greind. Mannréttindi eru hvorki bundin stétt né gáfum.',
      ai: 'Gervigreindinni þarf að setja ramma. Þegar hagsmunir manna og véla rekast á, skulu vélarnar víkja.'
    }
  ];

  var grid = el('div', { class: 'phil-grid' });

  STREAMS.forEach(function (s) {
    var card = el('div', { class: 'phil-card phil-' + s.key });

    card.appendChild(el('div', { class: 'phil-short', text: s.short }));
    card.appendChild(el('div', { class: 'phil-english', text: s.english }));

    var qBox = el('div', { class: 'phil-q-box' });
    qBox.appendChild(el('div', { class: 'phil-eyebrow', text: 'KJARNASPURNING' }));
    qBox.appendChild(el('p', { class: 'phil-q', text: s.coreQ }));
    card.appendChild(qBox);

    var aBox = el('div', { class: 'phil-a-box' });
    aBox.appendChild(el('div', { class: 'phil-eyebrow', text: 'SVAR' }));
    aBox.appendChild(el('p', { class: 'phil-a', text: s.coreA }));
    card.appendChild(aBox);

    var aiBox = el('div', { class: 'phil-ai-box' });
    aiBox.appendChild(el('div', { class: 'phil-eyebrow', text: 'OG GERVIGREIND?' }));
    aiBox.appendChild(el('p', { class: 'phil-ai', text: s.ai }));
    card.appendChild(aiBox);

    grid.appendChild(card);
  });

  figure.appendChild(grid);
}

