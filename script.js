// Находим элементы на странице
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const popup = document.getElementById('popup');
const form = document.getElementById('form');
const result = document.getElementById('result');

// Сюда вставьте свою ссылку с formcarry.com (там её дают после регистрации)
const URL_SERVER = 'https://formcarry.com/s/ВАШ_ID';

// ---------- 1. Открытие и закрытие попапа + History API ----------

function openPopup() {
  popup.classList.add('open');
  // меняем адрес страницы, не перезагружая её
  history.pushState({ popup: true }, '', '#feedback');
}

function closePopup() {
  popup.classList.remove('open');
}

openBtn.addEventListener('click', openPopup);

// Крестик: возвращаемся назад в истории (адрес вернется обратно)
closeBtn.addEventListener('click', function () {
  history.back();
});

// Кнопка "Назад" в браузере (и крестик тоже) вызывает popstate - закрываем форму
window.addEventListener('popstate', closePopup);

// ---------- 2. LocalStorage: сохраняем введенные значения ----------

// Сохраняем все поля в localStorage
function saveData() {
  const data = {
    fio: form.fio.value,
    email: form.email.value,
    phone: form.phone.value,
    organization: form.organization.value,
    message: form.message.value,
    agree: form.agree.checked
  };
  localStorage.setItem('formData', JSON.stringify(data));
}

// Восстанавливаем поля из localStorage
function loadData() {
  const saved = localStorage.getItem('formData');
  if (saved) {
    const data = JSON.parse(saved);
    form.fio.value = data.fio;
    form.email.value = data.email;
    form.phone.value = data.phone;
    form.organization.value = data.organization;
    form.message.value = data.message;
    form.agree.checked = data.agree;
  }
}

// При каждом вводе в форму сохраняем данные
form.addEventListener('input', saveData);

// При загрузке страницы восстанавливаем данные
loadData();

// ---------- 3. Отправка формы через fetch ----------

form.addEventListener('submit', function (event) {
  event.preventDefault(); // отменяем перезагрузку страницы

  // собираем данные для отправки
  const data = {
    fio: form.fio.value,
    email: form.email.value,
    phone: form.phone.value,
    organization: form.organization.value,
    message: form.message.value
  };

  fetch(URL_SERVER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function (response) {
      if (response.ok) {
        result.textContent = 'Спасибо! Сообщение отправлено.';
        form.reset();                        // очищаем поля
        localStorage.removeItem('formData'); // очищаем localStorage
      } else {
        result.textContent = 'Ошибка при отправке. Попробуйте ещё раз.';
      }
    })
    .catch(function () {
      result.textContent = 'Ошибка! Нет связи с сервером.';
    });
});