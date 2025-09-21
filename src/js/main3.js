
import '../scss/styles3.module.scss'

document.addEventListener('DOMContentLoaded', function() {
    const flagDropdowns = document.querySelectorAll('.flag-dropdown');
    flagDropdowns.forEach(flagDropdown => {
        const trigger = flagDropdown.querySelector('.selected-flag');
        const list = flagDropdown.querySelector('.dropdown-list');
        const items = list.querySelectorAll('.dropdown-item');

        // Открытие/закрытие по клику на триггер
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
             console.log('Dropdown clicked');
            const isOpen = flagDropdown.classList.contains('open');
            // Закрываем все другие dropdown
            document.querySelectorAll('.flag-dropdown.open').forEach(other => {
                if (other !== flagDropdown) {
                    other.classList.remove('open');
                    other.querySelector('.dropdown-list').style.display = 'none';
                }
            });
            flagDropdown.classList.toggle('open');
            list.style.display = isOpen ? 'none' : 'block';
        });

        // Выбор элемента
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                const img = this.querySelector('img');
                const selectedImg = flagDropdown.querySelector('.selected-flag-icon');
                selectedImg.src = img.src;
                selectedImg.alt = this.querySelector('span').textContent;
                // Пример: смена языка сайта
                document.documentElement.lang = this.dataset.value;
                // Закрытие
                flagDropdown.classList.remove('open');
                list.style.display = 'none';
            });
        });
    });

    // Закрытие при клике вне dropdown
    document.addEventListener('click', function(e) {
        document.querySelectorAll('.flag-dropdown.open').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                dropdown.querySelector('.dropdown-list').style.display = 'none';
            }
        });
    });
});