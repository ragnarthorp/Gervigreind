/* ---------- Fjórar raddir, fjórar áhyggjur ---------- */
function renderFourVoices(figure) {
  figure.className = 'voices-figure';
  figure.setAttribute('aria-label',
    'Fjórar raddir með ólíkar áhyggjur af þróun gervigreindar.');

  figure.appendChild(el('figcaption', {
    class: 'voices-title',
    text: 'Fjórar raddir, fjórar áhyggjur'
  }));
  figure.appendChild(el('p', {
    class: 'voices-hint',
    text: 'Smelltu á nafn til að lesa hvað sérfræðingurinn óttast mest. Athugaðu hve ólík áherslan er.'
  }));

  var VOICES = [
    {
      key: 'hassabis',
      name: 'Demis Hassabis',
      role: 'Forstjóri DeepMind · Nóbelsverðlaun 2024',
      quote: '„Heimspekingar og hugsuðir þurfa að hjálpa til við að temja tæknina.“',
      worry: 'Illviljað fólk noti tæknina, kerfin verði of öflug til að stjórna, og kapphlaupið um forskot leiði til óásættanlegrar áhættu.'
    },
    {
      key: 'hinton',
      name: 'Geoffrey Hinton',
      role: 'Guðfaðir djúpnáms · Nóbelsverðlaun 2024',
      quote: '„Mörkin milli sannleika og lygi eru að mást út.“',
      worry: 'Samfélagslegur óstöðugleiki þegar fjöldi starfa hverfur á stuttum tíma — og mannkyni gæti stafað tilvistarógn af vexti tækninnar. Hætti hjá Google 2023 til að geta tjáð sig óhikað.'
    },
    {
      key: 'li',
      name: 'Fei-Fei Li',
      role: 'Hönnuður ImageNet · Stanford',
      quote: '„Tæknin má ekki mismuna fólki.“',
      worry: 'Gervigreind verði að stýra á ábyrgan hátt með áherslu á réttindi og mikilvægi hverrar manneskju. Hún á að auka velsæld, ekki draga úr henni hjá stórum hópum fólks.'
    },
    {
      key: 'gebru',
      name: 'Timnit Gebru',
      role: 'Áður hjá Google · sagt upp 2020',
      quote: '„Fólk treystir líkönum án þess að hafa góða ástæðu.“',
      worry: 'Kapphlaupið um stærri mállíkön matar þau á óhreinsuðum gögnum með fordómafullum orðaforða. Umhverfisáhrifin bitna helst á fátæku fólki í viðkvæmum heimshlutum. Tæknigeirinn ber ekki ábyrgð.'
    }
  ];

  var grid = el('div', { class: 'voices-grid' });

  VOICES.forEach(function (v) {
    var card = el('button', {
      type: 'button',
      class: 'voices-card',
      'data-key': v.key
    });

    var initials = v.name.split(' ').map(function (s) { return s.charAt(0); }).join('');
    var avatar = el('div', { class: 'voices-avatar', text: initials });
    card.appendChild(avatar);

    var info = el('div', { class: 'voices-info' });
    info.appendChild(el('div', { class: 'voices-name', text: v.name }));
    info.appendChild(el('div', { class: 'voices-role', text: v.role }));
    card.appendChild(info);

    card.addEventListener('click', function () {
      show(v);
      [].slice.call(grid.children).forEach(function (b) { b.classList.remove('is-active'); });
      card.classList.add('is-active');
    });

    grid.appendChild(card);
  });

  figure.appendChild(grid);

  var detail = el('div', { class: 'voices-detail' });
  var detailEyebrow = el('div', { class: 'voices-detail-eyebrow', text: 'VELDU RÖDD' });
  var detailQuote = el('blockquote', { class: 'voices-detail-quote', text: '' });
  var detailWorry = el('p', { class: 'voices-detail-worry', text: 'Smelltu á einn af kortunum að ofan til að lesa um áhyggjur viðkomandi.' });
  detail.appendChild(detailEyebrow);
  detail.appendChild(detailQuote);
  detail.appendChild(detailWorry);
  figure.appendChild(detail);

  function show(v) {
    detailEyebrow.textContent = v.name.toUpperCase();
    detailQuote.textContent = v.quote;
    detailWorry.textContent = v.worry;
    detail.classList.add('is-loaded');
  }
}
