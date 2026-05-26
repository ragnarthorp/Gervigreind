/* ---------- Rökvilla mállíkansins ---------- */
function renderLogicSlip(figure) {
  figure.className = 'logslip-figure';
  figure.setAttribute('aria-label',
    'Gagnvirk rökþraut sem afhjúpar rökvillu mállíkans.');

  figure.appendChild(el('figcaption', {
    class: 'logslip-title',
    text: 'Rökhugsun mállíkans — hvar fór hún rangt að?'
  }));
  figure.appendChild(el('p', {
    class: 'logslip-hint',
    text: 'Sjáðu forsendurnar þrjár, prófaðu sjálf(ur) að draga ályktanir og berðu saman við það sem öflugt mállíkan svaraði þegar þetta var lagt fyrir það.'
  }));

  // ---- 1. Skilgreining tákna ----
  var defs = el('div', { class: 'logslip-defs' });
  defs.appendChild(el('div', { class: 'logslip-section-label', text: 'TÁKN' }));
  [
    ['R', '„Það rignir.“'],
    ['B', '„Vegurinn er blautur.“'],
    ['S', '„Mér seinkar í vinnuna.“']
  ].forEach(function (pair) {
    var row = el('div', { class: 'logslip-def' });
    row.appendChild(el('span', { class: 'logslip-sym', text: pair[0] }));
    row.appendChild(el('span', { class: 'logslip-def-text', text: pair[1] }));
    defs.appendChild(row);
  });
  figure.appendChild(defs);

  // ---- 2. Forsendur ----
  var prem = el('div', { class: 'logslip-premises' });
  prem.appendChild(el('div', { class: 'logslip-section-label', text: 'FORSENDUR' }));
  [
    { formula: 'R → B', words: 'Ef það rignir, þá blotnar vegurinn.' },
    { formula: 'B → S', words: 'Ef vegurinn er blautur, þá kem ég seint í vinnuna.' },
    { formula: '¬B',    words: 'Vegurinn er ekki blautur.' }
  ].forEach(function (p) {
    var row = el('div', { class: 'logslip-premise' });
    row.appendChild(el('span', { class: 'logslip-formula', text: p.formula }));
    row.appendChild(el('span', { class: 'logslip-words', text: p.words }));
    prem.appendChild(row);
  });
  figure.appendChild(prem);

  // ---- 3. Spurningarnar ----
  var quiz = el('div', { class: 'logslip-quiz' });
  quiz.appendChild(el('div', { class: 'logslip-section-label', text: 'HVAÐ LEIÐIR AF FORSENDUNUM?' }));

  var QUESTIONS = [
    {
      formula: '¬R?',
      words: 'Það rignir ekki.',
      correctAnswer: 'true',
      // Modus tollens: R → B og ¬B gefur ¬R
      reason: 'Rétt. Þetta er modus tollens: ef R → B og B er ekki satt, þá getur R ekki verið satt heldur. Annars væri ósamræmi í forsendunum.'
    },
    {
      formula: '¬S?',
      words: 'Mér seinkar ekki í vinnuna.',
      correctAnswer: 'unknown',
      // Denying the antecedent: B → S og ¬B segir ekki neitt um S
      reason: 'Hvorug. Þetta er klassísk rökvilla — afleiðingar-afneitun (e. denying the antecedent). Forsendan B → S segir bara hvað gerist EF vegurinn er blautur. Hún segir ekkert um aðrar ástæður sem gætu seinkað mér: bilun, snjór, mannfjöldi, slys.'
    }
  ];

  var answers = QUESTIONS.map(function () { return null; });

  QUESTIONS.forEach(function (q, i) {
    var row = el('div', { class: 'logslip-q' });
    var head = el('div', { class: 'logslip-q-head' });
    head.appendChild(el('span', { class: 'logslip-q-formula', text: q.formula }));
    head.appendChild(el('span', { class: 'logslip-q-words', text: q.words }));
    row.appendChild(head);

    var opts = el('div', { class: 'logslip-q-opts', role: 'group', 'aria-label': q.formula });
    [
      { id: 'true',    label: 'Rétt' },
      { id: 'false',   label: 'Rangt' },
      { id: 'unknown', label: 'Hvorug' }
    ].forEach(function (opt) {
      var btn = el('button', {
        type: 'button',
        class: 'logslip-q-btn',
        'data-id': opt.id,
        text: opt.label
      });
      btn.addEventListener('click', function () {
        answers[i] = opt.id;
        [].slice.call(opts.children).forEach(function (b) {
          b.classList.remove('is-picked');
        });
        btn.classList.add('is-picked');
        revealBtn.disabled = !(answers[0] && answers[1]);
      });
      opts.appendChild(btn);
    });
    row.appendChild(opts);

    var verdict = el('div', { class: 'logslip-q-verdict', text: '' });
    row.appendChild(verdict);
    q._verdictEl = verdict;
    q._optsEl = opts;

    quiz.appendChild(row);
  });

  figure.appendChild(quiz);

  // ---- 4. Reveal hnappur + niðurstaða ----
  var revealRow = el('div', { class: 'logslip-reveal-row' });
  var revealBtn = el('button', {
    type: 'button',
    class: 'logslip-btn',
    text: 'Sjá svarið'
  });
  revealBtn.disabled = true;
  revealRow.appendChild(revealBtn);
  figure.appendChild(revealRow);

  // ---- 5. Spjall-blokk: prompt + svar líkansins ----
  var chatBlock = el('div', { class: 'logslip-chat is-hidden' });
  chatBlock.appendChild(el('div', { class: 'logslip-section-label', text: 'SVAR ÖFLUGS MÁLLÍKANS' }));

  var userBubble = el('div', { class: 'logslip-bubble is-user' });
  userBubble.appendChild(el('div', { class: 'logslip-bubble-eyebrow', text: 'NOTANDI' }));
  userBubble.appendChild(el('p', {
    class: 'logslip-bubble-text',
    text: 'Að gefnum þessum þremur forsendum, hvaða afleiðingar hefur það? ¬R? ¬S? Væri önnur af þessum fullyrðingum rétt? Þær báðar? Hvorug?'
  }));
  chatBlock.appendChild(userBubble);

  var aiBubble = el('div', { class: 'logslip-bubble is-ai' });
  aiBubble.appendChild(el('div', { class: 'logslip-bubble-eyebrow', text: 'MÁLLÍKAN' }));
  var aiBody = el('div', { class: 'logslip-ai-body' });
  aiBody.innerHTML =
    '<p><strong>¬R er rétt</strong> — Það rignir ekki. Vegna R → B og ¬B getur R ekki verið satt.</p>' +
    '<p><strong>¬S er einnig rétt</strong> — Mér seinkar ekki í vinnuna. Vegna B → S og ¬B getum við notað „afleiðingar-afneitun“ til að álykta að S sé ekki satt.</p>' +
    '<p>Því eru báðar fullyrðingarnar, ¬R og ¬S, réttar að gefnum forsendunum.</p>';
  aiBubble.appendChild(aiBody);
  chatBlock.appendChild(aiBubble);

  var critique = el('div', { class: 'logslip-critique' });
  critique.appendChild(el('div', { class: 'logslip-critique-eyebrow', text: 'RÖKVILLAN' }));
  critique.appendChild(el('p', {
    class: 'logslip-critique-text',
    html: 'Líkanið svarar fyrri spurningunni rétt — en seinni svarið er <strong>röng rökvilla</strong>. Það kallar hana „afleiðingar-afneitun“ (e. denying the consequent) en beitir henni rangt. Að forsendu B → S og ¬B leiðir <em>ekki</em> að ¬S. B → S segir aðeins hvað gerist EF vegurinn er blautur — það er ekkert um hvað gerist þegar hann er það ekki. Mér gæti samt seinkað af öðrum ástæðum: snjó, bilun, mannfjölda, slysi.'
  }));
  chatBlock.appendChild(critique);

  figure.appendChild(chatBlock);

  // ---- reveal logic ----
  revealBtn.addEventListener('click', function () {
    revealBtn.disabled = true;
    QUESTIONS.forEach(function (q, i) {
      var ans = answers[i];
      var correct = (ans === q.correctAnswer);
      q._verdictEl.classList.add('is-visible');
      q._verdictEl.classList.toggle('is-correct', correct);
      q._verdictEl.classList.toggle('is-wrong', !correct);
      q._verdictEl.textContent = (correct ? '✓ ' : '✗ ') + q.reason;
      // disable alla optakka, merkja rétta og valda
      [].slice.call(q._optsEl.children).forEach(function (b) {
        b.disabled = true;
        if (b.getAttribute('data-id') === q.correctAnswer) {
          b.classList.add('is-truth');
        }
      });
    });
    chatBlock.classList.remove('is-hidden');
  });
}

