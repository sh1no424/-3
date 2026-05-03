const root = document.documentElement;
    const reveals = document.querySelectorAll('.reveal');
    const polaroids = document.querySelectorAll('.polaroid');
    const toast = document.getElementById('toast');
    const form = document.querySelector('.form');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.16 });

    reveals.forEach((item) => observer.observe(item));

    let sparkleTimer = 0;

    document.addEventListener('pointermove', (event) => {
      const px = event.clientX / window.innerWidth;
      const py = event.clientY / window.innerHeight;
      root.style.setProperty('--mx', px.toFixed(3));
      root.style.setProperty('--my', py.toFixed(3));

      const x = (px - .5) * 2;
      const y = (py - .5) * 2;

      polaroids.forEach((card) => {
        const depth = Number(card.dataset.depth || 1);
        card.style.transform = `translate3d(${x * depth * 16}px, ${y * depth * 12}px, 0)`;
      });

      const now = Date.now();
      if (now - sparkleTimer > 95 && window.innerWidth > 760) {
        sparkleTimer = now;
        createSparkle(event.clientX, event.clientY);
      }
    });

    document.addEventListener('pointerleave', () => {
      polaroids.forEach((card) => {
        card.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    function createSparkle(x, y) {
      const dot = document.createElement('span');
      const palette = ['#e5484f', '#ee7aa1', '#6fa7df', '#74b48a', '#e7bd5d'];
      dot.className = 'sparkle';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.background = palette[Math.floor(Math.random() * palette.length)];
      dot.style.setProperty('--x', `${Math.random() * 34 - 17}px`);
      dot.style.setProperty('--y', `${Math.random() * 34 - 17}px`);
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 740);
    }

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxUnLy5TXicaoz2nW2Jpcs3nYlzywfCI_xGYtzA_GCdSgYicBfEhjMLOacipXBjsx2_Eg/exec';

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submit = form.querySelector('.submit');
      const formData = new FormData(form);
      const drinks = formData.getAll('drinks').join(', ');

      formData.delete('drinks');
      formData.append('drinks', drinks || 'Не выбрано');
      formData.append('date', new Date().toLocaleString('ru-RU'));

      submit.disabled = true;
      submit.textContent = 'Отправляем...';

      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        });

        form.reset();
        showToast('Спасибо! Ответ отправлен ♡');
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showToast('Не получилось отправить. Попробуйте ещё раз');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Отправить';
      }
    });
