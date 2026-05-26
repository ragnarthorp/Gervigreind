/* ---------- Hvers konar nám er þetta? (quiz) ---------- */
function renderLearningQuiz(figure) {
  figure.className = 'mlq-figure';
  figure.setAttribute('aria-label',
    'Quiz: flokkaðu sex sviðsmyndir eftir því hvort um er að ræða viðgjafarnám, viðgjafarlaust nám eða styrkingarnám.');

  figure.appendChild(el('figcaption', {
    class: 'mlq-title',
    text: 'Hvers konar nám er þetta?'
  }));
  figure.appendChild(el('p', {
    class: 'mlq-hint',
    text: 'Lestu sviðsmyndina og veldu hvaða gerð vélnáms passar best. Þú færð endurgjöf strax.'
  }));

  // ---- gögn ----
  var CATS = [
    { id: 'sup',   label: 'Viðgjafarnám' },
    { id: 'unsup', label: 'Viðgjafarlaust nám' },
    { id: 'reinf', label: 'Styrkingarnám' }
  ];

  var SCENARIOS = [
    {
      text: 'Tölvan fær 1,2 milljónir mynda merktar af manneskjum og lærir að flokka þær eftir merkingunni.',
      answer: 'sup',
      explain: 'Manneskjur sögðu fyrir fram hvaða merking átti við hverja mynd. Tauganetið fékk svörin og þjálfaðist með því að líkja eftir þeim. Þetta er nákvæmlega aðferðin sem ImageNet og AlexNet notuðu.'
    },
    {
      text: 'TikTok setur þig sjálfkrafa í hóp með notendum sem horfa á svipuð myndbönd og ýtir að ykkur sams konar efni.',
      answer: 'unsup',
      explain: 'Engin manneskja segir kerfinu „þessi notandi er í þennan hóp“. Það finnur sjálft sameiginleg einkenni og raðar fólki saman — eins og barnið sem flokkar kubba eftir lit án fyrirmæla.'
    },
    {
      text: 'Forrit fær eitt stig fyrir hverja skák sem það vinnur og ekkert milli skáka. Smátt og smátt finnur það aðferð sem oftar leiðir til sigurs.',
      answer: 'reinf',
      explain: 'Forritið er ekki sagt hvernig það á að tefla — bara verðlaunað eftir á þegar það vinnur. Þetta er styrkingarnám og er sama aðferð og AlphaGo átti eftir að nota.'
    },
    {
      text: 'Þú sannar að þú sért ekki vélmenni með því að velja allar myndir sem sýna umferðarljós.',
      answer: 'sup',
      explain: 'Þú gætir haldið að þetta sé bara öryggispróf — en fyrirtækin nota svörin þín til að merkja gögn. Hver mynd sem þú smellir á verður þjálfunardæmi fyrir tauganet. Þú varst að taka þátt í viðgjafarnámi án þess að vita af því.'
    },
    {
      text: 'Forrit flokkar tölvupósta í hópa eftir orðanotkun og efni, án þess að nokkur segi því hvaða hópar eigi að vera til.',
      answer: 'unsup',
      explain: 'Engar fyrirfram skilgreindar flokkanir, engin merking frá manneskju. Forritið finnur sjálft mynstur í gögnunum og raðar þeim saman. Það er viðgjafarlaust nám.'
    },
    {
      text: 'Vélmenni prófar mismunandi hreyfingar á gólfinu. Þegar það kemst nær markinu fær það sælgæti; annars ekkert.',
      answer: 'reinf',
      explain: 'Vélmennið er ekki sagt hvernig á að ganga — það prófar sig áfram og er verðlaunað þegar það fer í rétta átt. Þetta er styrkingarnám og minnir á hundinn sem lærir að sitja gegn umbun.'
    }
  ];

  // ---- state ----
  var idx = 0;
  var score = 0;
  var revealed = false;

  // ---- DOM ----
  var board = el('div', { class: 'mlq-board' });

  var progress = el('div', { class: 'mlq-progress' });
  var progressDots = el('div', { class: 'mlq-progress-dots' });
  for (var i = 0; i < SCENARIOS.length; i++) {
    var dot = el('span', { class: 'mlq-dot' });
    progressDots.appendChild(dot);
  }
  progress.appendChild(progressDots);
  var scoreLabel = el('span', { class: 'mlq-score', text: '0 / ' + SCENARIOS.length });
  progress.appendChild(scoreLabel);
  board.appendChild(progress);

  var scenario = el('div', { class: 'mlq-scenario' });
  var scenarioEyebrow = el('div', { class: 'mlq-scenario-eyebrow', text: 'SVIÐSMYND 1' });
  var scenarioText = el('p', { class: 'mlq-scenario-text', text: '' });
  scenario.appendChild(scenarioEyebrow);
  scenario.appendChild(scenarioText);
  board.appendChild(scenario);

  var choices = el('div', { class: 'mlq-choices', role: 'group', 'aria-label': 'Veldu tegund náms' });
  var choiceBtns = CATS.map(function (cat) {
    var btn = el('button', {
      type: 'button',
      class: 'mlq-choice',
      'data-cat': cat.id,
      text: cat.label
    });
    btn.addEventListener('click', function () { answer(cat.id); });
    choices.appendChild(btn);
    return btn;
  });
  board.appendChild(choices);

  var feedback = el('div', { class: 'mlq-feedback' });
  var feedbackTitle = el('div', { class: 'mlq-feedback-title', text: '' });
  var feedbackText = el('p', { class: 'mlq-feedback-text', text: '' });
  feedback.appendChild(feedbackTitle);
  feedback.appendChild(feedbackText);
  board.appendChild(feedback);

  var nextBtn = el('button', {
    type: 'button',
    class: 'mlq-next',
    text: 'Næsta'
  });
  nextBtn.addEventListener('click', next);
  board.appendChild(nextBtn);

  figure.appendChild(board);

  // ---- final screen ----
  var final = el('div', { class: 'mlq-final' });
  var finalScore = el('div', { class: 'mlq-final-score', text: '' });
  var finalText = el('p', { class: 'mlq-final-text', text: '' });
  var restartBtn = el('button', { type: 'button', class: 'mlq-next', text: 'Aftur' });
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

    choiceBtns.forEach(function (btn) {
      btn.classList.remove('is-correct', 'is-wrong', 'is-faded');
      btn.disabled = false;
    });
    feedback.classList.remove('is-visible', 'is-correct', 'is-wrong');
    feedbackTitle.textContent = '';
    feedbackText.textContent = '';
    nextBtn.classList.remove('is-visible');

    var dots = progressDots.querySelectorAll('.mlq-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('is-done', i < idx);
      d.classList.toggle('is-current', i === idx);
    });
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;
  }

  function answer(catId) {
    if (revealed) return;
    revealed = true;
    var s = SCENARIOS[idx];
    var correct = catId === s.answer;
    if (correct) score++;
    scoreLabel.textContent = score + ' / ' + SCENARIOS.length;

    choiceBtns.forEach(function (btn) {
      var bc = btn.getAttribute('data-cat');
      if (bc === s.answer) btn.classList.add('is-correct');
      else if (bc === catId) btn.classList.add('is-wrong');
      else btn.classList.add('is-faded');
      btn.disabled = true;
    });

    feedback.classList.add('is-visible');
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-wrong',  !correct);
    feedbackTitle.textContent = correct ? 'Rétt!' : 'Ekki alveg.';
    // bæta við réttu svari ef rangt:
    var rightLabel = CATS.find(function (c) { return c.id === s.answer; }).label;
    feedbackText.textContent = (correct ? '' : 'Rétta svarið er ' + rightLabel + '. ') + s.explain;
    nextBtn.classList.add('is-visible');
    nextBtn.textContent = (idx === SCENARIOS.length - 1) ? 'Sjá niðurstöðu' : 'Næsta';
  }

  function next() {
    if (idx < SCENARIOS.length - 1) {
      idx++;
      render();
    } else {
      showFinal();
    }
  }

  function showFinal() {
    board.classList.add('is-hidden');
    final.classList.add('is-visible');
    finalScore.textContent = score + ' af ' + SCENARIOS.length;
    var msg;
    if (score === SCENARIOS.length) {
      msg = 'Allt rétt! Þú getur greint á milli aðferðanna þriggja.';
    } else if (score >= SCENARIOS.length - 1) {
      msg = 'Næstum allt. Þú hefur gott vald á þessum hugtökum.';
    } else if (score >= Math.ceil(SCENARIOS.length / 2)) {
      msg = 'Þokkalegt. Renndu aftur yfir kaflann og prófaðu aftur.';
    } else {
      msg = 'Endilega lestu yfir kaflann aftur og prófaðu þig á ný.';
    }
    finalText.textContent = msg;
  }

  render();
}

