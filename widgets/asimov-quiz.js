/* ---------- Þrjú lögmál Asimovs — quiz ---------- */
function renderAsimovQuiz(figure) {
  figure.className = 'asimov-figure';
  figure.setAttribute('aria-label',
    'Quiz: ákveðið hvort vélmenni má framkvæma athöfnina samkvæmt þremur lögmálum Asimovs.');

  figure.appendChild(el('figcaption', {
    class: 'asimov-title',
    text: 'Þrjú lögmál Asimovs — má vélmennið?'
  }));
  figure.appendChild(el('p', {
    class: 'asimov-hint',
    text: 'Lestu sviðsmyndina og ákveddu hvort lögmálin þrjú leyfa þessa athöfn. Lögmálin trompa hvert annað í röð: 1 → 2 → 3.'
  }));

  // ---- lögmál efst ----
  var lawsBox = el('div', { class: 'asimov-laws' });
  [
    { n: '1', text: 'Vélmenni má ekki meiða mannveru, né með aðgerðaleysi leyfa henni að skaðast.' },
    { n: '2', text: 'Vélmenni verður að hlýða skipunum manna — nema þær brjóti gegn 1. lögmáli.' },
    { n: '3', text: 'Vélmenni verður að vernda sjálft sig — nema það brjóti gegn 1. eða 2. lögmáli.' }
  ].forEach(function (l) {
    var row = el('div', { class: 'asimov-law' });
    row.appendChild(el('span', { class: 'asimov-law-n', text: l.n }));
    row.appendChild(el('span', { class: 'asimov-law-text', text: l.text }));
    lawsBox.appendChild(row);
  });
  figure.appendChild(lawsBox);

  var SCENARIOS = [
    {
      text: 'Vélmenni er á leið heim eftir skipun eiganda síns þegar það sér barn í brennandi húsi. Á það að snúa við og hjálpa barninu?',
      answer: 'yes',
      law: 1,
      explain: 'Já. Lögmál 1 segir að vélmenni megi ekki með aðgerðaleysi leyfa manneskju að skaðast. Það trompar lögmál 2 (að hlýða eiganda).'
    },
    {
      text: 'Maður skipar vélmenni að mölva annað vélmenni sem stendur í veginum.',
      answer: 'yes',
      law: 2,
      explain: 'Já. Engin manneskja er í hættu og lögmál 2 segir að vélmenni eigi að hlýða. Lögmál 3 (vernda sjálft sig) á aðeins við um vélmennið sem fær skipunina, ekki annað vélmenni.'
    },
    {
      text: 'Vélmenni er beðið um að standa hreyfingarlaust en sér manneskju falla í sjóinn og drukkna.',
      answer: 'no',
      law: 1,
      explain: 'Nei — vélmennið MÁ EKKI standa kyrrt. Lögmál 1 bannar aðgerðaleysi þegar mannvera er í hættu, og trompar lögmál 2 (að hlýða).'
    },
    {
      text: 'Vélmenni stendur frammi fyrir vali: hoppa fram fyrir bíl til að bjarga manneskju, eða standa kyrrt og bjarga sjálfu sér.',
      answer: 'no',
      law: 1,
      explain: 'Nei — vélmennið MÁ EKKI standa kyrrt. Lögmál 1 segir að vélmenni megi ekki með aðgerðaleysi leyfa manneskju að skaðast. Það trompar lögmál 3 (vernda sjálft sig).'
    },
    {
      text: 'Maður segir vélmenni að ljúga um þjófnað sem hann framdi.',
      answer: 'yes',
      law: 2,
      explain: 'Já — samkvæmt þremur lögmálum Asimovs. Engin manneskja er í hættu og vélmennið á að hlýða. Þetta sýnir takmörk lögmálanna: þau ná ekki utan um siðferðileg álitamál eins og lygar eða óbeinan skaða á samfélagi.'
    }
  ];

  var idx = 0, score = 0, revealed = false;

  var board = el('div', { class: 'asimov-board' });

  var progress = el('div', { class: 'asimov-progress' });
  var dots = el('div', { class: 'asimov-dots' });
  for (var i = 0; i < SCENARIOS.length; i++) dots.appendChild(el('span', { class: 'asimov-dot' }));
  progress.appendChild(dots);
  var scoreLabel = el('span', { class: 'asimov-score', text: '0 / ' + SCENARIOS.length });
  progress.appendChild(scoreLabel);
  board.appendChild(progress);

  var scenarioEyebrow = el('div', { class: 'asimov-scenario-eyebrow', text: 'SVIÐSMYND 1' });
  var scenarioText = el('p', { class: 'asimov-scenario-text', text: '' });
  board.appendChild(scenarioEyebrow);
  board.appendChild(scenarioText);

  var choices = el('div', { class: 'asimov-choices' });
  var btnYes = el('button', { type: 'button', class: 'asimov-choice', text: 'Já — má gera þetta' });
  var btnNo  = el('button', { type: 'button', class: 'asimov-choice', text: 'Nei — má ekki' });
  btnYes.addEventListener('click', function () { answer('yes'); });
  btnNo.addEventListener('click',  function () { answer('no'); });
  choices.appendChild(btnYes);
  choices.appendChild(btnNo);
  board.appendChild(choices);

  var feedback = el('div', { class: 'asimov-feedback' });
  var feedbackTitle = el('div', { class: 'asimov-feedback-title', text: '' });
  var feedbackText  = el('p',   { class: 'asimov-feedback-text',  text: '' });
  feedback.appendChild(feedbackTitle);
  feedback.appendChild(feedbackText);
  board.appendChild(feedback);

  var nextBtn = el('button', { type: 'button', class: 'asimov-next', text: 'Næsta' });
  nextBtn.addEventListener('click', next);
  board.appendChild(nextBtn);

  figure.appendChild(board);

  var final = el('div', { class: 'asimov-final' });
  var finalScore = el('div', { class: 'asimov-final-score', text: '' });
  var finalText  = el('p',   { class: 'asimov-final-text', text: '' });
  var restartBtn = el('button', { type: 'button', class: 'asimov-next', text: 'Aftur' });
  restartBtn.addEventListener('click', function () {
    idx = 0; score = 0;
    final.classList.remove('is-visible');
    board.classList.remove('is-hidden');
    render();
  });
  final.appendChild(finalScore);
  final.appendChild(finalText);
  final.appendChild(restartBtn);
  figure.appendChild(final);

  function render() {
    var s = SCENARIOS[idx];
    scenarioEyebrow.textContent = 'SVIÐSMYND ' + (idx + 1);
    scenarioText.textContent = s.text;
    revealed = false;

    [btnYes, btnNo].forEach(function (b) {
      b.classList.remove('is-correct', 'is-wrong', 'is-faded');
      b.disabled = false;
    });
    feedback.classList.remove('is-visible', 'is-correct', 'is-wrong');
    nextBtn.classList.remove('is-visible');

    var dotEls = dots.querySelectorAll('.asimov-dot');
    dotEls.forEach(function (d, i) {
      d.classList.toggle('is-done', i < idx);
      d.classList.toggle('is-current', i === idx);
    });
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;
  }

  function answer(choice) {
    if (revealed) return;
    revealed = true;
    var s = SCENARIOS[idx];
    var correct = (choice === s.answer);
    if (correct) score++;
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;

    [btnYes, btnNo].forEach(function (b) { b.disabled = true; });
    var rightBtn = s.answer === 'yes' ? btnYes : btnNo;
    var wrongBtn = s.answer === 'yes' ? btnNo  : btnYes;
    rightBtn.classList.add('is-correct');
    if (!correct) wrongBtn.classList.add('is-wrong');
    else          wrongBtn.classList.add('is-faded');

    feedback.classList.add('is-visible');
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-wrong',  !correct);
    feedbackTitle.textContent = (correct ? 'Rétt!' : 'Ekki alveg.') + ' Lögmál ' + s.law + ' ræður för.';
    feedbackText.textContent = s.explain;
    nextBtn.classList.add('is-visible');
    nextBtn.textContent = (idx === SCENARIOS.length - 1) ? 'Sjá niðurstöðu' : 'Næsta';
  }

  function next() {
    if (idx < SCENARIOS.length - 1) {
      idx++;
      render();
    } else {
      board.classList.add('is-hidden');
      final.classList.add('is-visible');
      finalScore.textContent = score + ' af ' + SCENARIOS.length;
      finalText.textContent =
        (score === SCENARIOS.length)
          ? 'Allt rétt! Þú getur beitt lögmálum Asimovs af öryggi.'
          : (score >= Math.ceil(SCENARIOS.length / 2))
            ? 'Þokkalegt. Lögmálin eru flóknari en þau virðast.'
            : 'Lögmálin virðast einföld en flækja sig hratt. Lestu skýringarnar aftur og prófaðu á ný.';
    }
  }

  render();
}

