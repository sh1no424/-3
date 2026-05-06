    const root = document.documentElement;
    const reveals = document.querySelectorAll('.reveal');
    const polaroids = document.querySelectorAll('.polaroid');
    const toast = document.getElementById('toast');
    const form = document.querySelector('.form');
    const menuGuests = document.querySelector('.menu-guests');
    const menuAdd = document.querySelector('.menu-add');
    let menuGuestIndex = menuGuests ? menuGuests.querySelectorAll('[data-menu-guest]').length : 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.16 });

    reveals.forEach((item) => observer.observe(item));

    form.addEventListener('click', (event) => {
      const noteButton = event.target.closest('.note-toggle');
      const removeButton = event.target.closest('.menu-remove');
      const addButton = event.target.closest('.menu-add');

      if (noteButton) {
        const button = noteButton;
        const note = document.getElementById(button.getAttribute('aria-controls'));
        const isOpen = button.getAttribute('aria-expanded') === 'true';

        if (!note) return;

        button.setAttribute('aria-expanded', String(!isOpen));
        note.hidden = isOpen;
        return;
      }

      if (removeButton) {
        removeButton.closest('[data-menu-guest]')?.remove();
        updateMenuGuestTitles();
        return;
      }

      if (addButton) {
        addMenuGuest();
      }
    });

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

    function addMenuGuest() {
      if (!menuGuests) return;

      const item = document.createElement('div');
      item.className = 'menu-guest';
      item.dataset.menuGuest = '';
      item.innerHTML = createMenuGuestMarkup(menuGuestIndex);
      menuGuests.appendChild(item);
      menuGuestIndex += 1;
      updateMenuGuestTitles();
    }

    function updateMenuGuestTitles() {
      if (!menuGuests) return;

      menuGuests.querySelectorAll('[data-menu-guest]').forEach((guest, index) => {
        const title = guest.querySelector('.menu-guest-head b');
        const remove = guest.querySelector('.menu-remove');

        if (title) title.textContent = `Гость ${index + 1}`;
        if (remove) remove.hidden = index === 0 && menuGuests.querySelectorAll('[data-menu-guest]').length === 1;
      });
    }

    function resetMenuGuests() {
      if (!menuGuests) return;

      const guests = menuGuests.querySelectorAll('[data-menu-guest]');
      guests.forEach((guest, index) => {
        if (index > 0) guest.remove();
      });
      updateMenuGuestTitles();
    }

    function createMenuGuestMarkup(index) {
      const dynastyNote = 'Филе цыпленка гриль, отварное филе говядины и отварной язык в сочетании с обжаренными шампиньонами и солеными огурцами под соусом на основе домашнего майонеза и тертого хрена. Сервируется помидорами черри, куриным яйцом с мягким желтком и картофелем Пай.';
      const dynastyValue = `Салат «Династия»: ${dynastyNote}`;

      return `
        <div class="menu-guest-head">
          <b>Гость ${index + 1}</b>
          <button class="menu-remove" type="button">Убрать</button>
        </div>

        <div class="menu-guest-name">
          <label for="guest-name-${index}">Имя гостя</label>
          <input id="guest-name-${index}" class="menu-guest-name-input" type="text" name="guest_${index}_name" placeholder="Можно оставить пустым" autocomplete="name" />
        </div>

        <div class="menu-group">
          <div class="menu-group-title">Салат</div>
          <div class="choice-list">
            <label class="choice">
              <input type="radio" name="salad_${index}" value="Салат с креветками, авокадо и ореховым соусом" data-menu-salad />
              <span class="choice-mark" aria-hidden="true"></span>
              <span>Салат с креветками, авокадо и ореховым соусом</span>
            </label>
            <div class="choice-with-note">
              <label class="choice">
                <input type="radio" name="salad_${index}" value="${dynastyValue}" data-menu-salad />
                <span class="choice-mark" aria-hidden="true"></span>
                <span>Салат «Династия»</span>
              </label>
              <button class="note-toggle" type="button" aria-expanded="false" aria-controls="dynasty-salad-note-${index}">?</button>
              <p class="choice-note" id="dynasty-salad-note-${index}" hidden>${dynastyNote}</p>
            </div>
            <label class="choice">
              <input type="radio" name="salad_${index}" value="Салат с запеченным бедром цыпленка, грибами майо и пармезаном" data-menu-salad />
              <span class="choice-mark" aria-hidden="true"></span>
              <span>Салат с запеченным бедром цыпленка, грибами майо и пармезаном</span>
            </label>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title">Горячее блюдо</div>
          <div class="choice-list">
            <label class="choice">
              <input type="radio" name="hot_dish_${index}" value="Филе форели, запеченное с соусом Шампань" data-menu-hot />
              <span class="choice-mark" aria-hidden="true"></span>
              <span>Филе форели, запеченное с соусом Шампань</span>
            </label>
            <label class="choice">
              <input type="radio" name="hot_dish_${index}" value="Говядина, томленая с Демигласом" data-menu-hot />
              <span class="choice-mark" aria-hidden="true"></span>
              <span>Говядина, томленая с Демигласом</span>
            </label>
            <label class="choice">
              <input type="radio" name="hot_dish_${index}" value="Свинина на гриле с соусом пронто чили" data-menu-hot />
              <span class="choice-mark" aria-hidden="true"></span>
              <span>Свинина на гриле с соусом пронто чили</span>
            </label>
          </div>
        </div>
      `;
    }

    function collectMenuChoices() {
      if (!menuGuests) return [];

      return Array.from(menuGuests.querySelectorAll('[data-menu-guest]')).map((guest, index) => {
        const guestName = guest.querySelector('.menu-guest-name-input')?.value.trim() || `Гость ${index + 1}`;
        const salad = guest.querySelector('[data-menu-salad]:checked')?.value || 'Салат не выбран';
        const hotDish = guest.querySelector('[data-menu-hot]:checked')?.value || 'Горячее не выбрано';

        return {
          guestName,
          salad,
          hotDish,
          text: `${guestName}: салат - ${salad}; горячее - ${hotDish}`
        };
      });
    }

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzOeizFnmI_URYjXPG4uC-eHpNNDSXJxzx7AfRDeCjxTj21bgokEq4-f0ZHwRyjwdhS/exec';

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
      const menuChoices = collectMenuChoices();
      const menu = menuChoices.map((item) => item.text).join('\n');
      const payload = new URLSearchParams();

      payload.append('name', formData.get('name') || '');
      payload.append('attendance', formData.get('attendance') || '');
      payload.append('drinks', drinks || 'Не выбрано');
      payload.append('menu', menu || 'Не выбрано');

      console.log('Отправка формы:', Object.fromEntries(payload));

      submit.disabled = true;
      submit.textContent = 'Отправляем...';

      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: payload
        });

        console.log('Запрос в Apps Script отправлен');
        form.reset();
        resetMenuGuests();
        showToast('Спасибо! Ответ отправлен ♡');
      } catch (error) {
        console.error('Ошибка отправки формы:', error);
        showToast('Не получилось отправить. Попробуйте ещё раз');
      } finally {
        submit.disabled = false;
        submit.textContent = 'Отправить';
      }
    });
