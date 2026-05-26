/* ---------- Monty Hall hermir (gagnvirkur) ---------- */
function renderMontyHall(figure) {
  figure.className = 'monty-figure';
  figure.setAttribute('aria-label', 'Gagnvirk Monty Hall þraut');

  figure.appendChild(el('figcaption', {
    class: 'monty-title',
    text: 'Prófaðu Monty Hall-þrautina'
  }));

  var promptEl = el('p', { class: 'monty-prompt', role: 'status', 'aria-live': 'polite',
                            text: 'Veldu einar af þremur dyrum.' });
  figure.appendChild(promptEl);

  var doorsRow = el('div', { class: 'monty-doors' });
  var doorEls = [];
  for (var i = 0; i < 3; i++) {
    var door = el('button', { class: 'monty-door', type: 'button', 'data-door': String(i),
                               'aria-label': 'Dyr ' + (i + 1) });
    var num = el('div', { class: 'monty-door-num', text: 'Dyr ' + (i + 1) });
    var content = el('div', { class: 'monty-door-content', text: '?' });
    door.appendChild(num);
    door.appendChild(content);
    door.addEventListener('click', function () {
      onDoorClick(parseInt(this.getAttribute('data-door'), 10));
    });
    doorsRow.appendChild(door);
    doorEls.push({ el: door, content: content });
  }
  figure.appendChild(doorsRow);

  var controls = el('div', { class: 'monty-controls' });
  var switchBtn = el('button', { class: 'monty-btn monty-btn-primary', type: 'button', text: 'Skipta' });
  var stayBtn   = el('button', { class: 'monty-btn',                  type: 'button', text: 'Halda' });
  controls.appendChild(switchBtn);
  controls.appendChild(stayBtn);
  figure.appendChild(controls);

  var replayBtn = el('button', { class: 'monty-btn monty-btn-primary monty-replay',
                                  type: 'button', text: '↻ Leika aftur' });
  figure.appendChild(replayBtn);

  var scoreboard = el('div', { class: 'monty-scoreboard' });
  function buildScoreRow(label) {
    var row = el('div');
    row.appendChild(el('span', { text: label }));
    var val = el('span', { class: 'monty-stat', text: '—' });
    row.appendChild(val);
    scoreboard.appendChild(row);
    return val;
  }
  var totalVal  = buildScoreRow('Leikir alls');
  var switchVal = buildScoreRow('Skipti og vann');
  var stayVal   = buildScoreRow('Hélt og vann');
  figure.appendChild(scoreboard);

  var note = el('p', { class: 'monty-note',
    text: 'Þú vinnur oftar með því að skipta — líkurnar eru ⅔ með skiptingu en aðeins ⅓ með að halda.'
  });
  figure.appendChild(note);

  var stats = { total: 0, switchWins: 0, switchGames: 0, stayWins: 0, stayGames: 0 };
  var prize = 0, chosen = -1, opened = -1, phase = 'choose';

  function setControlsVisibility() {
    controls.style.display = (phase === 'switch') ? 'flex' : 'none';
    replayBtn.style.display = (phase === 'reveal') ? 'inline-flex' : 'none';
  }

  function startNewRound() {
    prize = Math.floor(Math.random() * 3);
    chosen = -1;
    opened = -1;
    phase = 'choose';
    promptEl.textContent = 'Veldu einar af þremur dyrum.';
    for (var i = 0; i < 3; i++) {
      doorEls[i].el.disabled = false;
      doorEls[i].el.classList.remove('is-chosen', 'is-opened', 'is-final-win', 'is-final-loss', 'is-revealed');
      doorEls[i].content.textContent = '?';
    }
    setControlsVisibility();
  }

  function onDoorClick(d) {
    if (phase !== 'choose') return;
    chosen = d;
    var options = [0, 1, 2].filter(function (k) { return k !== chosen && k !== prize; });
    opened = options[Math.floor(Math.random() * options.length)];

    doorEls[chosen].el.classList.add('is-chosen');
    doorEls[opened].el.classList.add('is-opened');
    doorEls[opened].content.textContent = '🐐';
    for (var i = 0; i < 3; i++) doorEls[i].el.disabled = true;

    phase = 'switch';
    promptEl.textContent = 'Viltu skipta um dyr?';
    setControlsVisibility();
  }

  function decide(switching) {
    var finalDoor = switching
      ? [0, 1, 2].filter(function (k) { return k !== chosen && k !== opened; })[0]
      : chosen;
    var won = (finalDoor === prize);

    for (var i = 0; i < 3; i++) {
      doorEls[i].el.classList.add('is-revealed');
      doorEls[i].content.textContent = (i === prize) ? '🏆' : '🐐';
    }
    doorEls[finalDoor].el.classList.add(won ? 'is-final-win' : 'is-final-loss');

    stats.total++;
    if (switching) {
      stats.switchGames++;
      if (won) stats.switchWins++;
    } else {
      stats.stayGames++;
      if (won) stats.stayWins++;
    }

    promptEl.textContent = won ? 'Þú vannst! 🎉' : 'Því miður — vinningurinn var bak við aðrar dyr.';
    phase = 'reveal';
    setControlsVisibility();
    updateScoreboard();
  }

  function updateScoreboard() {
    totalVal.textContent = String(stats.total);
    function ratio(wins, games) {
      if (games === 0) return '—';
      return wins + '/' + games + ' (' + Math.round(100 * wins / games) + '%)';
    }
    switchVal.textContent = ratio(stats.switchWins, stats.switchGames);
    stayVal.textContent   = ratio(stats.stayWins,   stats.stayGames);
    note.classList.toggle('is-visible', stats.total >= 5);
  }

  switchBtn.addEventListener('click', function () { decide(true);  });
  stayBtn.addEventListener('click',   function () { decide(false); });
  replayBtn.addEventListener('click', startNewRound);

  startNewRound();
}