// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Простая логика маршрутизации
// Создаем роутер
class SimpleRouter {
    constructor() {
        this.routes = {
            '/': 'index.html',
            '/str': 'index2.html',
            '/str3': 'index3.html'
        };
        
        this.init();
    }
    
    init() {
        // Обработка начальной загрузки
        this.navigate(window.location.pathname, false);
        
        // Перехват кликов по ссылкам
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(window.location.origin)) {
                e.preventDefault();
                this.navigate(link.pathname);
            }
        });
        
        // Обработка кнопок браузера
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });
    }
    
    navigate(path, pushState = true) {
        const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
        const page = this.routes[normalizedPath] || 'index.html';
        
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        
        this.loadPage(page);
    }
    
    loadPage(pageName) {
        fetch(`./${pageName}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Анимированная смена контента
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.innerHTML = doc.body.innerHTML;
                    document.title = doc.title;
                    this.restartScripts();
                    
                    document.body.style.opacity = '1';
                }, 200);
            })
            .catch(error => {
                console.error('Ошибка загрузки страницы:', error);
            });
    }
    
    restartScripts() {
        document.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
}

// Инициализация роутера
new SimpleRouter();

// Динамическая подгрузка header.html
// fetch('./components/header.html')
//     .then(response => response.text())
//     .then(html => {
//         document.getElementById('header-placeholder').innerHTML = html;
//     })
//     .catch(error => console.error('Ошибка загрузки header.html:', error));


const screenWidth = window.innerWidth;
console.log('Ширина экрана:', screenWidth, 'px');

// Для отслеживания изменений размера окна
window.addEventListener('resize', function() {
    const currentWidth = window.innerWidth;
    console.log('Текущая ширина:', currentWidth, 'px');
});

// Mobile sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileSidebar = document.querySelector('#mobile-sidebar');
    const sidebarClose = document.querySelector('#sidebar-close');
    const sidebarOverlay = document.querySelector('#sidebar-overlay');
    
    if (mobileMenuBtn && mobileSidebar) {
        let isOpen = false;

        function openSidebar() {
            mobileSidebar.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            isOpen = true;
        }

        function closeSidebar() {
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            isOpen = false;
        }

        function toggleSidebar() {
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        // Toggle on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
        
        // Close on close button click
        if (sidebarClose) {
            sidebarClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeSidebar();
            });
        }
        
        // Close on overlay click
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeSidebar();
            });
        }
        


        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeSidebar();
            }
        });
    }
});

// Tournament footer carousel with horizontal sliding
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.tournament-footer');
    if (!footer) return;

    const carouselTrack = footer.querySelector('.carousel-track');
    const slides = footer.querySelectorAll('.carousel-slide');
    const slideNumberEl = footer.querySelector('.footer-right .slide-number');
    const prevBtn = footer.querySelector('#prev-btn');
    const nextBtn = footer.querySelector('#next-btn');

    if (!carouselTrack || !slides.length || !slideNumberEl || !prevBtn || !nextBtn) return;

    let currentSlide = 1; // Начинаем с первого оригинального слайда
    let isAnimating = false;
    const totalOriginalSlides = 4; // Количество оригинальных слайдов
    const totalSlides = slides.length; // Общее количество слайдов (включая клоны)
    
    // Auto-slide variables
    let autoSlideInterval = null;
    const autoSlideDelay = 5000;

    // Функция для установки стилей карусели в зависимости от количества слайдов
    function setCarouselStyles() {
        const slideWidthPercentage = 100 / totalSlides;
        
        // Устанавливаем ширину карусельной дорожки
        carouselTrack.style.width = `${totalSlides * 100}%`;
        
        // Устанавливаем ширину каждого слайда
        slides.forEach(slide => {
            slide.style.width = `${slideWidthPercentage}%`;
        });
        
        // Устанавливаем начальное положение
        const initialTranslateX = -currentSlide * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${initialTranslateX}%)`;
    }

    function formatSlideNumber(index) {
        // Корректируем индекс для отображения (1-4 вместо 0-5)
        const displayIndex = (index - 1) % totalOriginalSlides;
        const num = displayIndex + 1;
        return num < 10 ? `0${num}` : `${num}`;
    }

    function updateSlideNumber() {
        slideNumberEl.textContent = formatSlideNumber(currentSlide);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function goToSlide(index, instant = false) {
        if (isAnimating) return;
        isAnimating = true;

        if (instant) {
            carouselTrack.style.transition = 'none';
        } else {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }

        const slideWidthPercentage = 100 / totalSlides;
        const translateX = -index * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        currentSlide = index;
        updateSlideNumber();
        
        setTimeout(() => {
            isAnimating = false;
            
            // Проверяем границы для бесконечной карусели
            if (index === 0) {
                // Если достигли клонированного последнего слайда, мгновенно переходим к настоящему последнему
                setTimeout(() => goToSlide(totalSlides - 2, true), 50);
            } else if (index === totalSlides - 1) {
                // Если достигли клонированного первого слайда, мгновенно переходим к настоящему первому
                setTimeout(() => goToSlide(1, true), 50);
            }
        }, instant ? 0 : 500);
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
        restartAutoSlide();
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
        restartAutoSlide();
    }

    function initCarousel() {
        // Устанавливаем стили карусели
        setCarouselStyles();
        
        // Начинаем с первого оригинального слайда (индекс 1)
        goToSlide(1, true);
        startAutoSlide();
    }

    // Event listeners
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
    });

    footer.addEventListener('mouseenter', stopAutoSlide);
    footer.addEventListener('mouseleave', startAutoSlide);

    // Инициализация
    initCarousel();
});

// Tournament footer mobile carousel with automatic sliding
// Tournament footer mobile carousel with automatic sliding
document.addEventListener('DOMContentLoaded', () => {
    const mobileFooter = document.querySelector('.tournament-footer-mobile');
    if (!mobileFooter) return;

    const carouselTrack = mobileFooter.querySelector('.carousel-track');
    const slides = mobileFooter.querySelectorAll('.carousel-slide');

    if (!carouselTrack || !slides.length) return;

    let currentSlide = 1; // Начинаем с первого оригинального слайда
    let isAnimating = false;
    const totalOriginalSlides = 4; // Количество оригинальных слайдов
    const totalSlides = slides.length; // Общее количество слайдов (включая клоны)
    
    // Auto-slide variables
    let autoSlideInterval = null;
    const autoSlideDelay = 5000;

    // Функция для установки стилей карусели в зависимости от количества слайдов
    function setCarouselStyles() {
        const slideWidthPercentage = 100 / totalSlides;
        
        // Устанавливаем ширину карусельной дорожки
        carouselTrack.style.width = `${totalSlides * 100}%`;
        carouselTrack.style.maxWidth = `${totalSlides * 100}%`;
        
        // Устанавливаем ширину каждого слайда
        slides.forEach(slide => {
            slide.style.width = `${slideWidthPercentage}%`;
        });
        
        // Устанавливаем начальное положение
        const initialTranslateX = -currentSlide * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${initialTranslateX}%)`;
    }

    function goToSlide(index, instant = false) {
        if (isAnimating) return;
        isAnimating = true;

        if (instant) {
            carouselTrack.style.transition = 'none';
        } else {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
        }

        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
        
        const slideWidthPercentage = 100 / totalSlides;
        const translateX = -index * slideWidthPercentage;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        currentSlide = index;
        
        setTimeout(() => {
            isAnimating = false;
            
            // Проверяем границы для бесконечной карусели
            if (index === 0) {
                // Если достигли клонированного последнего слайда, мгновенно переходим к настоящему последнему
                setTimeout(() => goToSlide(totalSlides - 2, true), 50);
            } else if (index === totalSlides - 1) {
                // Если достигли клонированного первого слайда, мгновенно переходим к настоящему первому
                setTimeout(() => goToSlide(1, true), 50);
            }
        }, instant ? 0 : 500);
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
        restartAutoSlide();
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Добавляем обработчики свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }

    function handleSwipe() {
        const minSwipeDistance = 50; // Минимальное расстояние свайпа
        
        if (touchEndX < touchStartX && touchStartX - touchEndX > minSwipeDistance) {
            // Свайп влево - следующий слайд
            nextSlide();
        } 
        
        if (touchEndX > touchStartX && touchEndX - touchStartX > minSwipeDistance) {
            // Свайп вправо - предыдущий слайд
            goToSlide(currentSlide - 1);
            restartAutoSlide();
        }
    }

    function initMobileCarousel() {
        // Устанавливаем стили карусели
        setCarouselStyles();
        
        // Начинаем с первого оригинального слайда (индекс 1)
        goToSlide(1, true);
        startAutoSlide();

        // Добавляем обработчики свайпов
        mobileFooter.addEventListener('touchstart', handleTouchStart, false);
        mobileFooter.addEventListener('touchend', handleTouchEnd, false);
    }

    // Pause auto-slide on mouse enter (for desktop testing)
    mobileFooter.addEventListener('mouseenter', stopAutoSlide);
    mobileFooter.addEventListener('mouseleave', startAutoSlide);

    // Initialize the mobile carousel
    initMobileCarousel();

    // Очистка при размонтировании (если нужно)
    window.addEventListener('beforeunload', () => {
        mobileFooter.removeEventListener('touchstart', handleTouchStart);
        mobileFooter.removeEventListener('touchend', handleTouchEnd);
        stopAutoSlide();
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const flagDropdowns = document.querySelectorAll('.flag-dropdown');
    flagDropdowns.forEach(flagDropdown => {
        const trigger = flagDropdown.querySelector('.selected-flag');
        const list = flagDropdown.querySelector('.dropdown-list');
        const items = list.querySelectorAll('.dropdown-item');

        // Открытие/закрытие по клику на триггер
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
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