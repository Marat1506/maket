// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Простая логика маршрутизации
function checkRoute() {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/str') {
        // Загружаем содержимое index2.html и вставляем в body
        fetch('./index2.html')
            .then(response => response.text())
            .then(html => {
                // Извлекаем содержимое body из index2.html
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newBodyContent = doc.body.innerHTML;
                
                // Заменяем содержимое текущего body
                document.body.innerHTML = newBodyContent;
                
                // Обновляем заголовок страницы
                document.title = doc.title;
            })
            .catch(error => {
                console.error('Ошибка загрузки index2.html:', error);
            });
    }

    if (currentPath === '/str3') {
        // Загружаем содержимое index2.html и вставляем в body
        fetch('./index3.html')
            .then(response => response.text())
            .then(html => {
                // Извлекаем содержимое body из index2.html
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newBodyContent = doc.body.innerHTML;

                // Заменяем содержимое текущего body
                document.body.innerHTML = newBodyContent;

                // Обновляем заголовок страницы
                document.title = doc.title;
            })
            .catch(error => {
                console.error('Ошибка загрузки index2.html:', error);
            });
    }
}

// Проверяем маршрут при загрузке страницы
checkRoute();

// Динамическая подгрузка header.html
// fetch('./components/header.html')
//     .then(response => response.text())
//     .then(html => {
//         document.getElementById('header-placeholder').innerHTML = html;
//     })
//     .catch(error => console.error('Ошибка загрузки header.html:', error));