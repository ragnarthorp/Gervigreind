/* ---------- Deep Blue — 200 milljón hugsanir á sekúndu ---------- */
function renderDeepBlueThink(figure) {
  figure.className = 'dbthink-figure';
  figure.setAttribute('aria-label',
    'Sýning á hraða Deep Blue: tölvan mat 200 milljón skákstöður á sekúndu, manneskja kemst í eina eða tvær.');

  figure.appendChild(el('figcaption', {
    class: 'dbthink-title',
    text: '200 milljón hugsanir á sekúndu'
  }));
  figure.appendChild(el('p', {
    class: 'dbthink-hint',
    text: 'Smelltu og horfðu á tölvuna meta skákstöður á þeim hraða sem Deep Blue gat — 200.000.000 á einni sekúndu. Manneskja nær einni eða tveimur.'
  }));

  // ---------------- Layout ----------------
  var arena = el('div', { class: 'dbthink-arena' });

  // Vinstri spjald — Deep Blue
  var blueCard = el('div', { class: 'dbthink-card is-blue' });
  blueCard.appendChild(el('div', { class: 'dbthink-card-label', text: 'DEEP BLUE · 1997' }));
  var blueBoardWrap = el('div', { class: 'dbthink-board-wrap' });
  var blueBoard = buildMiniBoard();
  blueBoardWrap.appendChild(blueBoard.el);
  blueCard.appendChild(blueBoardWrap);
  var blueCount = el('div', { class: 'dbthink-count is-blue', text: '0' });
  blueCard.appendChild(blueCount);
  blueCard.appendChild(el('div', { class: 'dbthink-count-sub', text: 'stöður metnar' }));
  arena.appendChild(blueCard);

  // Hægri spjald — Manneskja
  var humanCard = el('div', { class: 'dbthink-card is-human' });
  humanCard.appendChild(el('div', { class: 'dbthink-card-label', text: 'MANNESKJA' }));
  var humanBoardWrap = el('div', { class: 'dbthink-board-wrap' });
  var humanBoard = buildMiniBoard();
  humanBoardWrap.appendChild(humanBoard.el);
  humanCard.appendChild(humanBoardWrap);
  var humanCount = el('div', { class: 'dbthink-count is-human', text: '0' });
  humanCard.appendChild(humanCount);
  humanCard.appendChild(el('div', { class: 'dbthink-count-sub', text: 'stöður metnar' }));
  arena.appendChild(humanCard);

  figure.appendChild(arena);

  // Hnappur
  var btn = el('button', {
    type: 'button',
    class: 'dbthink-btn',
    text: 'Hugsaðu eins og Deep Blue'
  });
  figure.appendChild(btn);

  // Eftirskýring (birtist eftir keyrslu)
  var aftermath = el('div', { class: 'dbthink-aftermath' });
  aftermath.appendChild(el('div', { class: 'dbthink-ratio', html: '<span>200.000.000</span> á móti <span>1</span>' }));
  aftermath.appendChild(el('p', {
    class: 'dbthink-aftermath-text',
    text: 'Á einni sekúndu hugsaði Deep Blue um eitthvað í kringum 200 milljón mismunandi skákstöður. Á sama tíma náði Kasparov að meta eina — kannski tvær. Tölvan vann engan veginn á því að vera gáfaðri. Hún vann á því að vera ótrúlega hröð.'
  }));
  figure.appendChild(aftermath);

  // ---------------- Mini chess board ----------------
  function buildMiniBoard() {
    var svgNS = 'http://www.w3.org/2000/svg';
    var board = document.createElementNS(svgNS, 'svg');
    board.setAttribute('viewBox', '0 0 80 80');
    board.setAttribute('class', 'dbthink-board');
    board.setAttribute('aria-hidden', 'true');

    // skákborð — köflótt
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        var r = document.createElementNS(svgNS, 'rect');
        r.setAttribute('x', x * 10);
        r.setAttribute('y', y * 10);
        r.setAttribute('width', 10);
        r.setAttribute('height', 10);
        r.setAttribute('class', (x + y) % 2 === 0 ? 'dbthink-sq-light' : 'dbthink-sq-dark');
        board.appendChild(r);
      }
    }

    // 16 „taflmanns"-doppur, færðar með hverjum nýjum stöðu
    var dots = [];
    for (var i = 0; i < 16; i++) {
      var c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('r', '2.6');
      c.setAttribute('class', i < 8 ? 'dbthink-piece is-white' : 'dbthink-piece is-black');
      c.setAttribute('cx', '40');
      c.setAttribute('cy', '40');
      board.appendChild(c);
      dots.push(c);
    }

    function randomize() {
      // veldur dreifðar staðsetningar fyrir 16 doppur, allar á aðskildum reitum
      var used = {};
      for (var i = 0; i < dots.length; i++) {
        var sq;
        do {
          var sx = Math.floor(Math.random() * 8);
          var sy = Math.floor(Math.random() * 8);
          sq = sx + ',' + sy;
        } while (used[sq]);
        used[sq] = true;
        dots[i].setAttribute('cx', sx * 10 + 5);
        dots[i].setAttribute('cy', sy * 10 + 5);
      }
    }

    return { el: board, randomize: randomize, dots: dots };
  }

  // ---------------- Keyrsla ----------------
  var TARGET = 200000000;       // 200 milljón
  var DURATION = 1000;          // 1 sekúnda fyrir Deep Blue
  var HUMAN_DURATION = 8000;    // manneskjan tekur 8 sek að meta 1 stöðu (sýnt þannig)
  var HUMAN_TARGET = 1;

  var running = false;

  function formatNumber(n) {
    return Math.round(n).toLocaleString('is-IS');
  }

  function run() {
    if (running) return;
    running = true;

    btn.disabled = true;
    btn.textContent = 'Að hugsa …';
    aftermath.classList.remove('is-visible');

    blueBoard.el.classList.add('is-flashing');
    humanBoard.el.classList.add('is-thinking');

    var startTime = performance.now();
    var lastFlash = startTime;

    function frame(now) {
      var elapsed = now - startTime;

      // Deep Blue talari
      var bluePct = Math.min(1, elapsed / DURATION);
      var blueVal = Math.floor(TARGET * easeOut(bluePct));
      blueCount.textContent = formatNumber(blueVal);

      // staða-blikk fyrir Deep Blue (á ~30 ms millibili meðan hún er á ferð)
      if (bluePct < 1 && (now - lastFlash) > 30) {
        blueBoard.randomize();
        lastFlash = now;
      }

      // Manneskjan — telur upp hægt
      var humanPct = Math.min(1, elapsed / HUMAN_DURATION);
      var humanVal = humanPct * HUMAN_TARGET;
      // sýnum sem heiltala eða „0" þangað til komið er á áfangastað
      humanCount.textContent = humanPct >= 1 ? '1' : '0';

      if (bluePct < 1 || humanPct < 1) {
        requestAnimationFrame(frame);
      } else {
        finish();
      }
    }

    function easeOut(t) {
      // mjúk lending á síðustu míkró
      return 1 - Math.pow(1 - t, 2.6);
    }

    function finish() {
      running = false;
      blueBoard.el.classList.remove('is-flashing');
      humanBoard.el.classList.remove('is-thinking');
      // fryst lokastaða — hvor ein
      blueBoard.randomize();
      humanBoard.randomize();
      btn.disabled = false;
      btn.textContent = 'Aftur';
      aftermath.classList.add('is-visible');
    }

    requestAnimationFrame(frame);
  }

  btn.addEventListener('click', run);
}
