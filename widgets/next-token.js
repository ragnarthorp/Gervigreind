/* ---------- Hvernig ChatGPT skrifar — næsta-tóka spá ---------- */
function renderNextToken(figure) {
  figure.className = 'nextok-figure';
  figure.setAttribute('aria-label',
    'Sýning á því hvernig mállíkan velur einn tóka í einu með hæsta líkindi.');

  figure.appendChild(el('figcaption', {
    class: 'nextok-title',
    text: 'Hvernig ChatGPT skrifar — einn tóki í einu'
  }));
  figure.appendChild(el('p', {
    class: 'nextok-hint',
    text: 'Líkanið skrifar ekki orð heldur tóka. Á hverju skrefi reiknar það út hvaða tóki er líklegasta framhaldið og velur þann sem fær hæsta líkindi. Smelltu og horfðu á setninguna verða til.'
  }));

  // ---- gögn — GPT-4o tókar fyrir „Mannréttindayfirlýsing Sameinuðu þjóðanna“ ----
  var PROMPT = 'Hvað heitir mikilvæg yfirlýsing um rétt fólks?';
  var STEPS = [
    {
      candidates: [
        { tok: 'Mann',  pct: 40 },
        { tok: 'Sjálf', pct: 18 },
        { tok: 'Sátt',  pct: 14 },
        { tok: 'Stjórn',pct: 10 },
        { tok: 'Yfir',  pct: 8  },
        { tok: 'Frjáls',pct: 5  }
      ]
    },
    {
      candidates: [
        { tok: 'réttind',  pct: 75 },
        { tok: 'kyn',      pct: 8  },
        { tok: 'kynssögu', pct: 5  },
        { tok: 'fjölda',   pct: 4  },
        { tok: 'gildi',    pct: 4  }
      ]
    },
    {
      candidates: [
        { tok: 'ay', pct: 70 },
        { tok: 'i',  pct: 12 },
        { tok: 'um', pct: 7  },
        { tok: 'in', pct: 6  },
        { tok: 'u',  pct: 5  }
      ]
    },
    {
      candidates: [
        { tok: 'firlý', pct: 65 },
        { tok: 'ndi',   pct: 12 },
        { tok: 'ng',    pct: 11 },
        { tok: 'l',     pct: 7  },
        { tok: 'tr',    pct: 5  }
      ]
    },
    {
      candidates: [
        { tok: 'sing', pct: 92 },
        { tok: 'st',   pct: 3  },
        { tok: 'sa',   pct: 2  },
        { tok: 's',    pct: 2  },
        { tok: 't',    pct: 1  }
      ]
    },
    {
      candidates: [
        { tok: '·Samein', pct: 56, space: true },
        { tok: '·Ísland', pct: 14, space: true },
        { tok: '·heim',   pct: 10, space: true },
        { tok: 'ar',      pct: 12 },
        { tok: 'in',      pct: 8  }
      ]
    },
    {
      candidates: [
        { tok: 'uðu', pct: 88 },
        { tok: 'ar',  pct: 4  },
        { tok: 'uð',  pct: 3  },
        { tok: 'um',  pct: 2  },
        { tok: 'ing', pct: 3  }
      ]
    },
    {
      candidates: [
        { tok: '·þjóð', pct: 78, space: true },
        { tok: '·fólk', pct: 8,  space: true },
        { tok: '·okk',  pct: 5,  space: true },
        { tok: '·ekki', pct: 6,  space: true },
        { tok: '·oft',  pct: 3,  space: true }
      ]
    },
    {
      candidates: [
        { tok: 'anna',  pct: 87 },
        { tok: 'ir',    pct: 5  },
        { tok: 'um',    pct: 3  },
        { tok: 'unum',  pct: 3  },
        { tok: 'söng',  pct: 2  }
      ]
    }
  ];

  var TOTAL_STEPS = STEPS.length;

  // hjálpari: birta tóka (· framan við þýðir „bil")
  function displayToken(t) {
    return t.replace(/^·/, '');
  }
  function jointToken(t) {
    return (t.charAt(0) === '·') ? ' ' + t.slice(1) : t;
  }

  // ---- prompt + setningu-blokk ----
  var promptBox = el('div', { class: 'nextok-prompt' });
  promptBox.appendChild(el('span', { class: 'nextok-prompt-eyebrow', text: 'KVEIKJA' }));
  promptBox.appendChild(el('span', { class: 'nextok-prompt-text', text: PROMPT }));
  figure.appendChild(promptBox);

  var sentenceBox = el('div', { class: 'nextok-sentence' });
  var sentenceLabel = el('div', { class: 'nextok-sentence-label', text: 'SVAR LÍKANSINS' });
  var sentenceText = el('div', { class: 'nextok-sentence-text', text: '' });
  var sentenceCursor = el('span', { class: 'nextok-cursor', text: '▍' });
  sentenceText.appendChild(sentenceCursor);
  sentenceBox.appendChild(sentenceLabel);
  sentenceBox.appendChild(sentenceText);
  figure.appendChild(sentenceBox);

  // ---- kandidat-spjald ----
  var candCard = el('div', { class: 'nextok-card' });
  var candHead = el('div', { class: 'nextok-card-head' });
  candHead.appendChild(el('div', { class: 'nextok-card-eyebrow', text: 'NÆSTI TÓKI · LÍKINDI' }));
  var stepLabel = el('div', { class: 'nextok-step', text: '' });
  candHead.appendChild(stepLabel);
  candCard.appendChild(candHead);

  var candList = el('div', { class: 'nextok-cands' });
  candCard.appendChild(candList);
  figure.appendChild(candCard);

  // ---- hnappur ----
  var btnRow = el('div', { class: 'nextok-btn-row' });
  var btn = el('button', {
    type: 'button',
    class: 'nextok-btn',
    text: 'Velja næsta tóka'
  });
  btnRow.appendChild(btn);
  figure.appendChild(btnRow);

  // ---- state ----
  var idx = 0;
  var chosen = []; // array af tókum sem hafa verið valdar

  function renderCandidates(candidates, highlightTop) {
    candList.innerHTML = '';
    candidates.forEach(function (c, i) {
      var row = el('div', { class: 'nextok-cand' + (highlightTop && i === 0 ? ' is-winner' : '') });
      var tokSpan = el('span', { class: 'nextok-cand-tok', text: displayToken(c.tok) });
      if (c.space || c.tok.charAt(0) === '·') {
        tokSpan.classList.add('has-space');
      }
      row.appendChild(tokSpan);
      var barWrap = el('div', { class: 'nextok-cand-bar' });
      var fill = el('div', { class: 'nextok-cand-fill' });
      barWrap.appendChild(fill);
      row.appendChild(barWrap);
      row.appendChild(el('span', { class: 'nextok-cand-pct', text: c.pct + '%' }));
      candList.appendChild(row);

      // animatera fyllinguna
      setTimeout(function () {
        fill.style.width = c.pct + '%';
      }, 80 + i * 40);
    });
  }

  function renderSentence() {
    // tæma og bæta inn aftur með klassa
    sentenceText.innerHTML = '';
    chosen.forEach(function (c, i) {
      var span = el('span', {
        class: 'nextok-tok-piece' + (i === chosen.length - 1 ? ' is-fresh' : ''),
        text: jointToken(c.tok)
      });
      sentenceText.appendChild(span);
    });
    sentenceText.appendChild(sentenceCursor);
  }

  function update() {
    if (idx < TOTAL_STEPS) {
      stepLabel.textContent = 'SKREF ' + (idx + 1) + ' / ' + TOTAL_STEPS;
      renderCandidates(STEPS[idx].candidates, false);
      btn.disabled = false;
      btn.textContent = idx === 0 ? 'Velja fyrsta tóka' : 'Velja næsta tóka';
    } else {
      stepLabel.textContent = 'SETNING FULLBYGGÐ';
      candList.innerHTML = '';
      var done = el('p', {
        class: 'nextok-done',
        text: 'Setningin sprakk upp einum tóka í einu, eingöngu með því að velja líklegasta framhaldið á hverju skrefi. Þannig „skrifar“ mállíkan.'
      });
      candList.appendChild(done);
      btn.textContent = 'Aftur';
    }
  }

  function pickNext() {
    if (idx >= TOTAL_STEPS) {
      // restart
      idx = 0;
      chosen = [];
      renderSentence();
      update();
      return;
    }

    var c = STEPS[idx].candidates[0];
    // sýna „winner" um stund
    btn.disabled = true;
    renderCandidates(STEPS[idx].candidates, true);

    setTimeout(function () {
      chosen.push(c);
      idx++;
      renderSentence();
      update();
    }, 600);
  }

  btn.addEventListener('click', pickNext);

  // ---- init ----
  renderSentence();
  update();
}

