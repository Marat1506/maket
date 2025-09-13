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


const screenWidth = window.innerWidth;
console.log('Ширина экрана:', screenWidth, 'px');

// Для отслеживания изменений размера окна
window.addEventListener('resize', function() {
    const currentWidth = window.innerWidth;
    console.log('Текущая ширина:', currentWidth, 'px');
});

// Mobile sidebar close functionality (without Bootstrap)
document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('#mobile-menu-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        let isOpen = false;

        function openSidebar() {
            navbarCollapse.classList.add('show');
            navbarToggler.setAttribute('aria-expanded', 'true');
            isOpen = true;
        }

        function closeSidebar() {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
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
        navbarToggler.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = navbarCollapse.contains(e.target);
            const isClickOnToggler = navbarToggler.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnToggler && isOpen) {
                closeSidebar();
            }
        });
        
        // Close on nav link click
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen) {
                    closeSidebar();
                }
            });
        });

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

    let currentSlide = 0;
    let isAnimating = false;
    const totalSlides = slides.length;

    // Helper to format slide number as 01, 02...
    function formatSlideNumber(index) {
        const num = index + 1;
        return num < 10 ? `0${num}` : `${num}`;
    }

    // Update slide number display
    function updateSlideNumber() {
        slideNumberEl.textContent = formatSlideNumber(currentSlide);
    }

    // Move carousel to specific slide
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
        
        // Calculate transform value for horizontal sliding
        // Since track is 400% wide and each slide is 25%, we move by 25% of track width per slide
        const translateX = -index * 25;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        currentSlide = index;
        updateSlideNumber();
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500); // Match CSS transition duration
    }

    // Go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    // Go to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    // Initialize carousel
    function initCarousel() {
        // Set initial position
        carouselTrack.style.transform = 'translateX(0%)';
        updateSlideNumber();
        
        // Set first slide as active
        slides[0].classList.add('active');
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

    // Initialize the carousel
    initCarousel();
});