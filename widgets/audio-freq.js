/* ---------- 10. Tíðnis-skoðari (Audio) ---------- */
    function renderAudioFreq(figure) {
      figure.className = 'audiofreq-figure';
      figure.setAttribute('aria-label', 'Gagnvirkur tíðnis-skoðari með sínus-bylgju og hljóði');
      figure.appendChild(el('figcaption', { class: 'audiofreq-title', text: 'Prófaðu: hlustaðu á tíðnina' }));

      var hzDisplay = el('p', { class: 'audiofreq-hz', text: '440 Hz' }); figure.appendChild(hzDisplay);

      var sliderWrap = el('div', { class: 'audiofreq-slider-wrap' });
      var slider = el('input', { type: 'range', min: '0', max: '1000', value: '450', class: 'audiofreq-slider', 'aria-label': 'Tíðni' });
      sliderWrap.appendChild(slider); figure.appendChild(sliderWrap);

      var canvas = el('canvas', { class: 'audiofreq-canvas', width: '640', height: '120' }); figure.appendChild(canvas);
      var ctx2d = canvas.getContext('2d');

      var playBtn = el('button', { type: 'button', class: 'audiofreq-play', text: '🔊 Halda inni til að hlusta' });
      figure.appendChild(playBtn);

      var currentFreq = 440;
      function sliderToFreq(s) { return Math.round(20 * Math.pow(1000, s / 1000)); }
      function updateFreq() {
        currentFreq = sliderToFreq(parseInt(slider.value, 10)); hzDisplay.textContent = currentFreq + ' Hz';
        if (oscillator) { try { oscillator.frequency.setValueAtTime(currentFreq, audioCtx.currentTime); } catch (e) {} }
      }

      var phase = 0;
      function drawWave() {
        var w = canvas.width; var h = canvas.height; ctx2d.clearRect(0, 0, w, h);
        ctx2d.strokeStyle = '#DAD7CE'; ctx2d.beginPath(); ctx2d.moveTo(0, h/2); ctx2d.lineTo(w, h/2); ctx2d.stroke();

        var cycles = Math.max(0.4, Math.log2(currentFreq / 20) * 2.4 + 0.6);
        ctx2d.strokeStyle = '#2A5C66'; ctx2d.lineWidth = 2; ctx2d.beginPath();
        for (var x = 0; x <= w; x++) {
          var y = h / 2 + (h * 0.36) * Math.sin(((x / w) * cycles + phase) * Math.PI * 2);
          if (x === 0) ctx2d.moveTo(x, y); else ctx2d.lineTo(x, y);
        }
        ctx2d.stroke();
      }

      function animTick() {
        if (!document.contains(figure)) { stopTone(); return; }
        phase += 0.005 + Math.log10(currentFreq / 20) * 0.018; if (phase > 1) phase -= 1;
        drawWave(); requestAnimationFrame(animTick);
      }

      var audioCtx = null; var oscillator = null; var gainNode = null; var playing = false;
      function startTone() {
        if (playing) return;
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        if (!audioCtx) audioCtx = new AC();
        try {
          oscillator = audioCtx.createOscillator(); gainNode = audioCtx.createGain();
          oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(currentFreq, audioCtx.currentTime);
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.02);
          oscillator.connect(gainNode); gainNode.connect(audioCtx.destination); oscillator.start();
          playing = true; playBtn.classList.add('is-playing');
        } catch (e) {}
      }
      function stopTone() {
        if (!playing || !oscillator) return;
        try { gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.03); oscillator.stop(audioCtx.currentTime + 0.05); } catch (e) {}
        oscillator = null; playing = false; playBtn.classList.remove('is-playing');
      }

      slider.addEventListener('input', updateFreq);
      playBtn.addEventListener('pointerdown', function(e) { e.preventDefault(); startTone(); });
      playBtn.addEventListener('pointerup', stopTone);
      playBtn.addEventListener('pointercancel', stopTone);
      updateFreq(); requestAnimationFrame(animTick);
    }