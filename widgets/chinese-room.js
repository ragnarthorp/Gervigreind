/* ---------- 5. Kínverska herbergið ---------- */
    function renderChineseRoom(figure) {
      figure.className = 'chinroom-figure';
      figure.setAttribute('aria-label', 'Gagnvirk útgáfa af Kínverska herberginu eftir John Searle');

      figure.appendChild(el('figcaption', { class: 'chinroom-title', text: 'Kínverska herbergið' }));
      figure.appendChild(el('p', { class: 'chinroom-intro', text: 'Þú ert lokuð inni í herbergi. Þú skilur ekki kínversku — en á borðinu er bók með reglutáknum. Tákn rennur inn undir hurðinni og þú notar regluna til að senda rétt tákn til baka.' }));

      var RULES = [
        { input: '鱼', output: '海' }, { input: '鸟', output: '天' },
        { input: '象', output: '地' }, { input: '树', output: '林' }
      ];

      figure.appendChild(el('div', { class: 'chinroom-section-label', text: 'Reglubókin' }));
      var rulesGrid = el('div', { class: 'chinroom-rules' });
      RULES.forEach(function (r) {
        var item = el('div', { class: 'chinroom-rule' });
        item.appendChild(el('span', { class: 'chinroom-rule-in',    text: r.input  }));
        item.appendChild(el('span', { class: 'chinroom-rule-arrow', text: '→'      }));
        item.appendChild(el('span', { class: 'chinroom-rule-out',   text: r.output }));
        rulesGrid.appendChild(item);
      });
      figure.appendChild(rulesGrid);

      figure.appendChild(el('div', { class: 'chinroom-section-label', text: 'Tákn rann inn um hurðina' }));
      var promptBox = el('div', { class: 'chinroom-prompt', role: 'status', 'aria-live': 'polite' });
      figure.appendChild(promptBox);

      figure.appendChild(el('p', { class: 'chinroom-answer-label', text: 'Hvaða tákn áttu að senda til baka?' }));
      var answersRow = el('div', { class: 'chinroom-answers' });
      figure.appendChild(answersRow);

      var feedback = el('div', { class: 'chinroom-feedback', role: 'status', 'aria-live': 'polite' });
      figure.appendChild(feedback);

      var nextBtn = el('button', { class: 'chinroom-next', type: 'button', text: '↻ Næsta tákn' });
      figure.appendChild(nextBtn);

      var currentRule = null;

      function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
      }

      function newPrompt() {
        currentRule = RULES[Math.floor(Math.random() * RULES.length)];
        promptBox.textContent = currentRule.input;
        answersRow.innerHTML = '';
        shuffle(RULES).forEach(function (r) {
          var btn = el('button', { class: 'chinroom-answer', type: 'button', text: r.output, 'aria-label': 'Velja svar ' + r.output });
          btn.addEventListener('click', function () { onAnswer(r, btn); });
          answersRow.appendChild(btn);
        });
        feedback.innerHTML = ''; feedback.className = 'chinroom-feedback'; nextBtn.style.display = 'none';
      }

      function onAnswer(r, btn) {
        var correct = (r.output === currentRule.output);
        var buttons = answersRow.querySelectorAll('.chinroom-answer');
        for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;
        btn.classList.add(correct ? 'is-correct' : 'is-wrong');

        feedback.className = 'chinroom-feedback ' + (correct ? 'is-correct' : 'is-wrong');
        var bubble = el('span', { class: 'chinroom-cn' });
        bubble.textContent = correct ? '这个人会说中文！' : '这是什么乱七八糟！';
        feedback.appendChild(bubble); nextBtn.style.display = 'inline-flex';
      }

      nextBtn.addEventListener('click', newPrompt);
      newPrompt();
    }