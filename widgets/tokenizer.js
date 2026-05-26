/* ---------- Tókun — hvernig mállíkön lesa íslensku ---------- */
function renderTokenizer(figure) {
  figure.className = 'tokenz-figure';
  figure.setAttribute('aria-label',
    'Samanburður á tókun ensku og íslensku í tveimur mállíkönum.');

  figure.appendChild(el('figcaption', {
    class: 'tokenz-title',
    text: 'Hvernig mállíkön lesa texta'
  }));
  figure.appendChild(el('p', {
    class: 'tokenz-hint',
    text: 'Smelltu á milli líkana og sjáðu hversu mörgum bútum sama setningin er brotin niður í — fyrst á ensku, svo á íslensku.'
  }));

  // ---- gögn ----
  var MODELS = {
    gpt4: {
      label: 'GPT-4',
      en: ['The',' Universal',' Declaration',' of',' Human',' Rights'],
      is: ['M','ann','r','é','tt','ind','ay','firl','ý','sing',' Sa','me','in','uð','u',' þ','jóð','anna'],
      note: 'Í GPT-4 brotnar íslenska setningin niður í 20 tóka — sumir jafnvel stakir bókstafir. Sama setning á ensku fær 6 tóka. Þetta er merki þess að líkanið þekkti íslensku lítið við þjálfun: fleiri tókar þýða dýrari og erfiðari úrvinnslu.'
    },
    gpt4o: {
      label: 'GPT-4o',
      en: ['The',' Universal',' Declaration',' of',' Human',' Rights'],
      is: ['Mann','réttind','ay','firlý','sing',' Samein','uðu',' þjóð','anna'],
      note: 'Í GPT-4o var nýr og fjöltyngdari orðabrotaforði innleiddur — niðurstaða markvissrar samvinnu Miðeindar og OpenAI. Íslenska fær nú 9 tóka í stað 20: 55% framför. Íslenska er þó enn á eftir ensku (6 tókar).'
    }
  };

  var ORDER = ['gpt4', 'gpt4o'];
  var current = 'gpt4';

  // ---- model row ----
  var modelRow = el('div', { class: 'tokenz-models', role: 'group', 'aria-label': 'Veldu líkan' });
  modelRow.appendChild(el('span', { class: 'tokenz-models-label', text: 'LÍKAN' }));
  var modelBtns = {};
  ORDER.forEach(function (k) {
    var btn = el('button', {
      type: 'button',
      class: 'tokenz-model-btn' + (k === current ? ' is-active' : ''),
      'aria-pressed': k === current ? 'true' : 'false',
      text: MODELS[k].label
    });
    btn.addEventListener('click', function () {
      current = k;
      Object.keys(modelBtns).forEach(function (id) {
        modelBtns[id].classList.toggle('is-active', id === k);
        modelBtns[id].setAttribute('aria-pressed', id === k ? 'true' : 'false');
      });
      update();
    });
    modelRow.appendChild(btn);
    modelBtns[k] = btn;
  });
  figure.appendChild(modelRow);

  // ---- english ----
  var enWrap = el('div', { class: 'tokenz-lang' });
  enWrap.appendChild(el('div', { class: 'tokenz-lang-label', text: 'ENSKA' }));
  var enBox = el('div', { class: 'tokenz-sentence' });
  enBox.appendChild(el('div', { class: 'tokenz-sentence-text', text: '“The Universal Declaration of Human Rights”' }));
  enBox.appendChild(el('div', { class: 'tokenz-sentence-stats', text: '6 orð · 44 stafir' }));
  enWrap.appendChild(enBox);
  var enTokens = el('div', { class: 'tokenz-tokens' });
  enWrap.appendChild(enTokens);
  figure.appendChild(enWrap);

  // ---- icelandic ----
  var isWrap = el('div', { class: 'tokenz-lang' });
  isWrap.appendChild(el('div', { class: 'tokenz-lang-label', text: 'ÍSLENSKA' }));
  var isBox = el('div', { class: 'tokenz-sentence' });
  isBox.appendChild(el('div', { class: 'tokenz-sentence-text', text: '“Mannréttindayfirlýsing Sameinuðu þjóðanna”' }));
  isBox.appendChild(el('div', { class: 'tokenz-sentence-stats', text: '3 orð · 43 stafir' }));
  isWrap.appendChild(isBox);
  var isTokens = el('div', { class: 'tokenz-tokens' });
  isWrap.appendChild(isTokens);
  figure.appendChild(isWrap);

  // ---- stats grid ----
  var statsLabel = el('div', { class: 'tokenz-lang-label', text: 'SAMANBURÐUR' });
  figure.appendChild(statsLabel);
  var stats = el('div', { class: 'tokenz-stats' });
  function statCard(label, sub) {
    var card = el('div', { class: 'tokenz-stat' });
    card.appendChild(el('div', { class: 'tokenz-stat-label', text: label }));
    var num = el('div', { class: 'tokenz-stat-num', text: '' });
    card.appendChild(num);
    card.appendChild(el('div', { class: 'tokenz-stat-sub', text: sub }));
    stats.appendChild(card);
    return num;
  }
  var statEn = statCard('Enska', 'tókar');
  var statIs = statCard('Íslenska', 'tókar');
  var statRatio = statCard('Hlutfall', 'fleiri í íslensku');
  figure.appendChild(stats);

  // ---- note ----
  var note = el('p', { class: 'tokenz-note', text: '' });
  figure.appendChild(note);

  function renderTokens(target, list, langClass) {
    target.innerHTML = '';
    list.forEach(function (t, i) {
      var span = el('span', {
        class: 'tokenz-tok ' + langClass,
        text: t.replace(/ /g, '·')
      });
      span.style.animationDelay = (i * 25) + 'ms';
      target.appendChild(span);
    });
  }

  function update() {
    var d = MODELS[current];
    renderTokens(enTokens, d.en, 'tokenz-tok-en');
    renderTokens(isTokens, d.is, 'tokenz-tok-is');
    var enN = d.en.length, isN = d.is.length;
    statEn.textContent = String(enN);
    statIs.textContent = String(isN);
    statRatio.textContent = (isN / enN).toFixed(1) + '×';
    note.textContent = d.note;
  }

  update();
}

