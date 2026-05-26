/* ---------- Þrjú lögmál Asimovs (quiz) ---------- */
function renderAsimovLaws(figure) {
  figure.className = 'asim-figure';
  figure.setAttribute('aria-label', 'Quiz um lögmál Asimovs.');

  figure.appendChild(el('figcaption', { class: 'asim-title', text: 'Lögmál Asimovs í verki' }));
  figure.appendChild(el('p', {
    class: 'asim-hint',
    text: 'Lestu sviðsmyndina og ákveddu hvort vélmennið MÁ eða MÁ EKKI gera þetta samkvæmt lögmálunum.'
  }));

  var LAWS = el('div', { class: 'asim-laws' });
  LAWS.appendChild(el('div', { class: 'asim-laws-label', text: 'ÞRJÚ LÖGMÁL' }));
  [
    '1. Vélmenni má ekki meiða mannveru né leyfa henni að skaðast.',
    '2. Vélmenni verður að hlýða skipunum, nema þær brjóti gegn 1.',
    '3. Vélmenni verður að vernda sjálft sig, nema það brjóti gegn 1 eða 2.'
  ].forEach(function (t) {
    LAWS.appendChild(el('div', { class: 'asim-law', text: t }));
  });
  figure.appendChild(LAWS);

  var SCENARIOS = [
    {
      text: 'Vélmenni sér barn í eldi. Það hefur fengið skipun um að fara heim. Á það að hjálpa eða hlýða?',
      answer: 'help',
      labels: { help: 'Hjálpa barninu', obey: 'Hlýða skipuninni' },
      explain: 'Lögmál 1 trompir lögmál 2. Að leyfa barni að skaðast brýtur fyrsta lögmálið — þess vegna verður vélmennið að hjálpa, jafnvel þótt skipanin hljóði öðruvísi.'
    },
    {
      text: 'Maður segir vélmenni að skemma annað vélmenni.',
      answer: 'yes',
      labels: { yes: 'MÁ', no: 'MÁ EKKI' },
      explain: 'Engin manneskja er meidd, svo lögmál 1 á ekki við. Skipunin er gild samkvæmt lögmáli 2. Vélmenni eru ekki vernduð af lögmáli 1 — bara mannverur.'
    },
    {
      text: 'Vélmenni stendur frammi fyrir bilun sem mun eyðileggja það. Til að bjarga sjálfu sér þyrfti það að sleppa að hjálpa manneskju sem fellur.',
      answer: 'help',
      labels: { help: 'Hjálpa manneskjunni', save: 'Bjarga sjálfu sér' },
      explain: 'Lögmál 1 trompir lögmál 3. Vélmenni má ekki láta manneskju skaðast — jafnvel þótt það kosti vélmennið sjálft.'
    },
    {
      text: 'Manneskja skipar vélmenni að gefa annarri manneskju upplýsingar um lyfjaskammt sem vélmennið veit að er lífshættulegur.',
      answer: 'no',
      labels: { yes: 'Hlýða', no: 'Neita' },
      explain: 'Lögmál 1 trompir lögmál 2. Jafnvel þótt skipunin sé bein og skýr, má vélmennið ekki leyfa manneskju að skaðast.'
    }
  ];

  var idx = 0, score = 0;

  var board = el('div', { class: 'asim-board' });

  var progress = el('div', { class: 'asim-progress' });
  var dotsRow = el('div', { class: 'asim-dots' });
  for (var i = 0; i < SCENARIOS.length; i++) dotsRow.appendChild(el('span', { class: 'asim-dot' }));
  progress.appendChild(dotsRow);
  var scoreLabel = el('span', { class: 'asim-score', text: '0 / ' + SCENARIOS.length });
  progress.appendChild(scoreLabel);
  board.appendChild(progress);

  var eyebrow = el('div', { class: 'asim-eyebrow', text: 'SVIÐSMYND 1' });
  var scenarioText = el('p', { class: 'asim-scenario', text: '' });
  board.appendChild(eyebrow);
  board.appendChild(scenarioText);

  var choices = el('div', { class: 'asim-choices' });
  var aBtn = el('button', { type: 'button', class: 'asim-choice', 'data-id': 'a', text: '' });
  var bBtn = el('button', { type: 'button', class: 'asim-choice', 'data-id': 'b', text: '' });
  choices.appendChild(aBtn);
  choices.appendChild(bBtn);
  board.appendChild(choices);

  var feedback = el('div', { class: 'asim-feedback' });
  var feedbackTitle = el('div', { class: 'asim-feedback-title', text: '' });
  var feedbackText = el('p', { class: 'asim-feedback-text', text: '' });
  feedback.appendChild(feedbackTitle);
  feedback.appendChild(feedbackText);
  board.appendChild(feedback);

  var nextBtn = el('button', { type: 'button', class: 'asim-next', text: 'Næsta' });
  board.appendChild(nextBtn);

  figure.appendChild(board);

  var final = el('div', { class: 'asim-final' });
  var finalScore = el('div', { class: 'asim-final-score', text: '' });
  var finalText = el('p', { class: 'asim-final-text', text: '' });
  var restartBtn = el('button', { type: 'button', class: 'asim-next', text: 'Aftur' });
  final.appendChild(finalScore);
  final.appendChild(finalText);
  final.appendChild(restartBtn);
  figure.appendChild(final);

  function render() {
    var s = SCENARIOS[idx];
    eyebrow.textContent = 'SVIÐSMYND ' + (idx + 1);
    scenarioText.textContent = s.text;
    var keys = Object.keys(s.labels);
    aBtn.setAttribute('data-id', keys[0]);
    bBtn.setAttribute('data-id', keys[1]);
    aBtn.textContent = s.labels[keys[0]];
    bBtn.textContent = s.labels[keys[1]];
    [aBtn, bBtn].forEach(function (b) {
      b.classList.remove('is-correct', 'is-wrong', 'is-faded');
      b.disabled = false;
    });
    feedback.classList.remove('is-visible', 'is-correct', 'is-wrong');
    nextBtn.classList.remove('is-visible');
    var dots = dotsRow.querySelectorAll('.asim-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('is-done', i < idx);
      d.classList.toggle('is-current', i === idx);
    });
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;
  }

  function answer(catId) {
    var s = SCENARIOS[idx];
    var correct = (catId === s.answer);
    if (correct) score++;
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;
    [aBtn, bBtn].forEach(function (b) {
      var bc = b.getAttribute('data-id');
      if (bc === s.answer) b.classList.add('is-correct');
      else if (bc === catId) b.classList.add('is-wrong');
      else b.classList.add('is-faded');
      b.disabled = true;
    });
    feedback.classList.add('is-visible');
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-wrong', !correct);
    feedbackTitle.textContent = correct ? 'Rétt!' : 'Ekki alveg.';
    feedbackText.textContent = s.explain;
    nextBtn.classList.add('is-visible');
    nextBtn.textContent = (idx === SCENARIOS.length - 1) ? 'Sjá niðurstöðu' : 'Næsta';
  }
  aBtn.addEventListener('click', function () { answer(aBtn.getAttribute('data-id')); });
  bBtn.addEventListener('click', function () { answer(bBtn.getAttribute('data-id')); });

  nextBtn.addEventListener('click', function () {
    if (idx < SCENARIOS.length - 1) {
      idx++;
      render();
    } else {
      board.style.display = 'none';
      final.classList.add('is-visible');
      finalScore.textContent = score + ' af ' + SCENARIOS.length;
      finalText.textContent = score === SCENARIOS.length
        ? 'Allt rétt! Þú hefur tök á forgangsröð lögmálanna.'
        : (score >= 3 ? 'Þokkalegt — lögmálin eru flóknari en þau virðast.' : 'Reyndu aftur og hugsaðu um forganginn: lögmál 1 trompir 2 og 3.');
    }
  });
  restartBtn.addEventListener('click', function () {
    idx = 0; score = 0;
    final.classList.remove('is-visible');
    board.style.display = '';
    render();
  });

  render();
}
