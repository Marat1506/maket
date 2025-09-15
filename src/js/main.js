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
        
        // Close on nav link click
        const sidebarNavLinks = mobileSidebar.querySelectorAll('.sidebar-nav-link');
        sidebarNavLinks.forEach(link => {
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
    
    // Auto-slide variables
    let autoSlideInterval = null;
    const autoSlideDelay = 5000; // 5 seconds

    // Helper to format slide number as 01, 02...
    function formatSlideNumber(index) {
        const num = index + 1;
        return num < 10 ? `0${num}` : `${num}`;
    }

    // Update slide number display
    function updateSlideNumber() {
        slideNumberEl.textContent = formatSlideNumber(currentSlide);
    }

    // Start auto-slide functionality
    function startAutoSlide() {
        // Clear any existing interval
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        
        // Set new interval
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, autoSlideDelay);
    }

    // Stop auto-slide functionality
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Restart auto-slide (useful when manually navigating)
    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
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
        // Restart auto-slide timer when manually navigating
        restartAutoSlide();
    }

    // Go to previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
        // Restart auto-slide timer when manually navigating
        restartAutoSlide();
    }

    // Initialize carousel
    function initCarousel() {
        // Set initial position
        carouselTrack.style.transform = 'translateX(0%)';
        updateSlideNumber();
        
        // Set first slide as active
        slides[0].classList.add('active');
        
        // Start auto-slide
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

    // Pause auto-slide on hover
    footer.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });

    // Resume auto-slide when mouse leaves
    footer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Initialize the carousel
    initCarousel();
});

// Tournament footer mobile carousel with automatic sliding
document.addEventListener('DOMContentLoaded', () => {
    const mobileFooter = document.querySelector('.tournament-footer-mobile');
    if (!mobileFooter) return;

    const carouselTrack = mobileFooter.querySelector('.carousel-track');
    const slides = mobileFooter.querySelectorAll('.carousel-slide');

    if (!carouselTrack || !slides.length) return;

    let currentSlide = 0;
    let isAnimating = false;
    const totalSlides = slides.length;
    
    // Auto-slide variables
    let autoSlideInterval = null;
    const autoSlideDelay = 5000; // 5 seconds

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
        // But we need to ensure we don't go beyond the last slide
        const translateX = -index * 25;
        
        // Ensure the track doesn't go beyond the container bounds
        const maxTranslateX = -75; // Maximum translation for the last slide (3 * 25%)
        const clampedTranslateX = Math.max(translateX, maxTranslateX);
        carouselTrack.style.transform = `translateX(${clampedTranslateX}%)`;
        
        currentSlide = index;
        
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

    // Start auto-slide functionality
    function startAutoSlide() {
        // Clear any existing interval
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        
        // Set new interval
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, autoSlideDelay);
    }

    // Stop auto-slide functionality
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Initialize mobile carousel
    function initMobileCarousel() {
        // Set initial position
        carouselTrack.style.transform = 'translateX(0%)';
        
        // Set first slide as active
        slides[0].classList.add('active');
        
        // Start auto-slide
        startAutoSlide();
    }

    // Pause auto-slide on touch start
    mobileFooter.addEventListener('touchstart', () => {
        stopAutoSlide();
    });

    // Resume auto-slide when touch ends
    mobileFooter.addEventListener('touchend', () => {
        startAutoSlide();
    });

    // Pause auto-slide on mouse enter (for desktop testing)
    mobileFooter.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });

    // Resume auto-slide when mouse leaves (for desktop testing)
    mobileFooter.addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Initialize the mobile carousel
    initMobileCarousel();
});