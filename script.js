// Бургер меню
const burgerBtn = document.getElementById('burgerBtn');
const burgerMenu = document.getElementById('burgerMenu');
const burgerOverlay = document.getElementById('burgerOverlay');
const burgerLinks = document.querySelectorAll('.burger-link');

if (burgerBtn && burgerMenu) {
    burgerBtn.addEventListener('click', () => {
        const isActive = burgerMenu.classList.contains('active');
        if (isActive) {
            burgerMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            burgerMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

if (burgerOverlay) {
    burgerOverlay.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

burgerLinks.forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Кнопка прокрутки вниз
const scrollDown = document.getElementById('scrollDown');
if (scrollDown) {
    scrollDown.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Слайдер услуг
const servicesTrack = document.getElementById('servicesTrack');
const servicesNext = document.getElementById('servicesNext');
const servicesPrev = document.getElementById('servicesPrev');

if (servicesTrack && servicesNext) {
    let currentServiceIndex = 0;
    let isScrolling = false;
    
    const getCardsPerView = () => {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };
    
    const getCardWidth = () => {
        const cardsPerView = getCardsPerView();
        const gap = 30;
        return (servicesTrack.offsetWidth - (gap * (cardsPerView - 1))) / cardsPerView + gap;
    };
    
    const getTotalCards = () => {
        return document.querySelectorAll('.service-card').length;
    };
    
    const getMaxIndex = () => {
        const totalCards = getTotalCards();
        const cardsPerView = getCardsPerView();
        return Math.max(0, totalCards - cardsPerView);
    };
    
    // Бесконечное листание вперед
    const goToNext = () => {
        if (isScrolling) return;
        isScrolling = true;
        
        const cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();
        currentServiceIndex++;
        
        if (currentServiceIndex > maxIndex) {
            // Плавно переходим к началу
            currentServiceIndex = 0;
            servicesTrack.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        } else {
            servicesTrack.scrollTo({
                left: currentServiceIndex * cardWidth,
                behavior: 'smooth'
            });
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 300);
    };
    
    // Бесконечное листание назад
    const goToPrev = () => {
        if (isScrolling) return;
        isScrolling = true;
        
        const cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();
        currentServiceIndex--;
        
        if (currentServiceIndex < 0) {
            // Плавно переходим к концу
            currentServiceIndex = maxIndex;
            servicesTrack.scrollTo({
                left: maxIndex * cardWidth,
                behavior: 'smooth'
            });
        } else {
            servicesTrack.scrollTo({
                left: currentServiceIndex * cardWidth,
                behavior: 'smooth'
            });
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 300);
    };

    servicesNext.addEventListener('click', goToNext);
    
    if (servicesPrev) {
        servicesPrev.addEventListener('click', goToPrev);
    }
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const cardWidth = getCardWidth();
            servicesTrack.scrollTo({
                left: currentServiceIndex * cardWidth,
                behavior: 'auto'
            });
        }, 250);
    });
}

// Слайдер отзывов
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsNext = document.getElementById('reviewsNext');
const reviewsPrev = document.getElementById('reviewsPrev');

if (reviewsTrack && reviewsNext) {
    const reviewCards = document.querySelectorAll('.review-card');
    let currentReviewIndex = 0;
    let isScrolling = false;
    
    const getReviewWidth = () => {
        return reviewsTrack.offsetWidth;
    };

    const collapseAllReviews = () => {
        // Сворачиваем все развернутые отзывы
        reviewCards.forEach(card => {
            const reviewText = card.querySelector('.review-text');
            const readMore = card.querySelector('.review-read-more');
            if (reviewText && reviewText.classList.contains('review-text-full')) {
                reviewText.classList.remove('review-text-full');
                if (readMore) {
                    readMore.textContent = 'Читать полностью...';
                }
            }
        });
    };

    const scrollToReview = (index) => {
        if (isScrolling) return;
        isScrolling = true;
        
        // Сворачиваем все отзывы перед переключением
        collapseAllReviews();
        
        const reviewWidth = getReviewWidth();
        currentReviewIndex = index;
        
        reviewsTrack.scrollTo({
            left: currentReviewIndex * reviewWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
            initReviewReadMore();
        }, 300);
    };

    const handleNextReview = () => {
        // Сворачиваем все отзывы перед переключением
        collapseAllReviews();
        if (currentReviewIndex < reviewCards.length - 1) {
            scrollToReview(currentReviewIndex + 1);
        } else {
            scrollToReview(0);
        }
    };

    reviewsNext.addEventListener('click', handleNextReview);
    
    // Обработка кнопок "Следующий отзыв" внутри карточек на мобильных
    document.querySelectorAll('.review-next-mobile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNextReview();
        });
    });
    
    if (reviewsPrev) {
        reviewsPrev.addEventListener('click', () => {
            if (currentReviewIndex > 0) {
                scrollToReview(currentReviewIndex - 1);
            } else {
                scrollToReview(reviewCards.length - 1);
            }
        });
    }
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const reviewWidth = getReviewWidth();
            reviewsTrack.scrollTo({
                left: currentReviewIndex * reviewWidth,
                behavior: 'auto'
            });
            initReviewReadMore();
        }, 250);
    });
}

// Слайдер интерьера (с авто-прокруткой)
const interiorTrack = document.getElementById('interiorTrack');
const interiorPrev = document.getElementById('interiorPrev');
const interiorNext = document.getElementById('interiorNext');
const interiorDots = document.getElementById('interiorDots');

if (interiorTrack) {
    const interiorItems = document.querySelectorAll('.interior-item');
    let currentInteriorIndex = 0;
    let isScrolling = false;
    let autoSlideInterval = null;
    const totalItems = interiorItems.length;
    
    const getItemWidth = () => {
        return interiorTrack.offsetWidth;
    };
    
    const getMaxIndex = () => {
        return interiorItems.length - 1;
    };
    
    const updateDots = () => {
        if (!interiorDots) return;
        
        // Очищаем точки
        interiorDots.innerHTML = '';
        
        // Создаем точки для каждой фотографии
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'interior-dot';
            
            // Определяем активность точки
            const isActive = currentInteriorIndex === i;
            
            if (isActive) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                scrollToIndex(i);
                resetAutoSlide();
            });
            
            interiorDots.appendChild(dot);
        }
    };
    
    const updateCurrentIndex = () => {
        const itemWidth = getItemWidth();
        if (itemWidth === 0) return; // Защита от деления на ноль
        
        const scrollLeft = interiorTrack.scrollLeft;
        const newIndex = Math.round(scrollLeft / itemWidth);
        
        // Обработка граничных случаев
        if (newIndex < 0) {
            currentInteriorIndex = 0;
        } else if (newIndex >= totalItems) {
            currentInteriorIndex = totalItems - 1;
        } else if (newIndex !== currentInteriorIndex) {
            currentInteriorIndex = newIndex;
        }
        updateDots();
    };
    
    const scrollToIndex = (index) => {
        if (isScrolling) return;
        isScrolling = true;
        
        const itemWidth = getItemWidth();
        currentInteriorIndex = index;
        
        interiorTrack.scrollTo({
            left: currentInteriorIndex * itemWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
            updateCurrentIndex();
        }, 300);
    };
    
    let isAutoScrolling = false;
    
    const goToNext = () => {
        if (isScrolling && !isAutoScrolling) return;
        isScrolling = true;
        isAutoScrolling = true;
        
        const itemWidth = getItemWidth();
        if (itemWidth === 0) {
            isScrolling = false;
            isAutoScrolling = false;
            return;
        }
        
        const maxIndex = getMaxIndex();
        
        if (currentInteriorIndex < maxIndex) {
            currentInteriorIndex++;
        } else {
            currentInteriorIndex = 0;
        }
        
        interiorTrack.scrollTo({
            left: currentInteriorIndex * itemWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
            isAutoScrolling = false;
            updateCurrentIndex();
        }, 400); // Увеличил время для более плавной работы
    };

    if (interiorNext) {
        interiorNext.addEventListener('click', () => {
            goToNext();
            resetAutoSlide();
        });
    }

    if (interiorPrev) {
        interiorPrev.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            
            const itemWidth = getItemWidth();
            const maxIndex = getMaxIndex();
            
            if (currentInteriorIndex > 0) {
                currentInteriorIndex--;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'smooth'
                });
            } else {
                currentInteriorIndex = maxIndex;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'smooth'
                });
            }
            
            setTimeout(() => {
                isScrolling = false;
                updateCurrentIndex();
            }, 300);
            resetAutoSlide();
        });
    }
    
    // Авто-прокрутка
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            goToNext();
        }, 1500); // каждые 1.5 секунды
    };
    
    const resetAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        startAutoSlide();
    };
    
    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };
    
    // Останавливаем авто-прокрутку при наведении
    interiorTrack.addEventListener('mouseenter', stopAutoSlide);
    interiorTrack.addEventListener('mouseleave', startAutoSlide);
    
    // Приостанавливаем автопрокрутку при взаимодействии пользователя
    let isUserInteracting = false;
    let interactionTimeout = null;
    
    const handleUserInteraction = () => {
        isUserInteracting = true;
        stopAutoSlide();
        
        // Очищаем предыдущий таймаут
        if (interactionTimeout) {
            clearTimeout(interactionTimeout);
        }
        
        // Возобновляем автопрокрутку через 3 секунды после окончания взаимодействия
        interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
            if (!isUserInteracting) {
                startAutoSlide();
            }
        }, 3000);
    };
    
    // Обработка касаний (мобильные устройства)
    interiorTrack.addEventListener('touchstart', handleUserInteraction);
    interiorTrack.addEventListener('touchmove', handleUserInteraction);
    interiorTrack.addEventListener('touchend', () => {
        handleUserInteraction();
    });
    
    // Обработка зажатия мышью (десктоп)
    interiorTrack.addEventListener('mousedown', handleUserInteraction);
    interiorTrack.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) { // Левая кнопка мыши зажата
            handleUserInteraction();
        }
    });
    interiorTrack.addEventListener('mouseup', () => {
        handleUserInteraction();
    });
    
    // Отслеживание скролла для обновления точек
    let scrollTimeout;
    let lastScrollLeft = 0;
    interiorTrack.addEventListener('scroll', () => {
        // Проверяем, действительно ли произошел скролл
        if (interiorTrack.scrollLeft === lastScrollLeft) return;
        lastScrollLeft = interiorTrack.scrollLeft;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateCurrentIndex();
        }, 100); // Увеличил задержку для более стабильной работы
        
        // Если пользователь скроллит (не автопрокрутка), приостанавливаем автопрокрутку
        if (!isUserInteracting && !isAutoScrolling) {
            handleUserInteraction();
        }
    });
    
    // Инициализация точек
    updateDots();
    
    // Запускаем авто-прокрутку
    startAutoSlide();
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const itemWidth = getItemWidth();
            interiorTrack.scrollTo({
                left: currentInteriorIndex * itemWidth,
                behavior: 'auto'
            });
            updateDots();
        }, 250);
    });
}

// Гармошка FAQ
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Закрываем все остальные
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Переключаем текущий
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
});

// Яндекс карта
function initMap() {
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function () {
            const map = new ymaps.Map('yandex-map', {
                center: [64.5622, 39.8302], // Координаты Северодвинска, Беломорский проспект, 35
                zoom: 16,
                controls: ['zoomControl', 'fullscreenControl']
            });

            // Отключаем все лишние слои и элементы
            map.behaviors.disable('scrollZoom');
            
            // Убираем метку такси и другие лишние элементы
            map.options.set('suppressMapOpenBlock', true);

            // Добавляем только одну метку
            const placemark = new ymaps.Placemark([64.5622, 39.8302], {
                balloonContent: 'Аромацентр "Вербена"<br>Беломорский проспект, 35'
            }, {
                preset: 'islands#greenDotIcon'
            });

            map.geoObjects.add(placemark);
        });
    } else {
        // Если API не загружен, показываем заглушку
        const mapContainer = document.getElementById('yandex-map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f1f8e9; color: #2d5016; font-size: 1.2rem;">Карта загружается...</div>';
        }
    }
}

// Инициализация карты при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Применяем анимацию к секциям
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Telegram Web App интеграция
if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.setHeaderColor('#2d5016');
    Telegram.WebApp.setBackgroundColor('#ffffff');
}

// Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Учитываем высоту меню
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Кнопка "наверх"
const scrollToTop = document.getElementById('scrollToTop');
if (scrollToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Обработка длинных отзывов - добавление "Читать полностью"
function initReviewReadMore() {
    const reviewTexts = document.querySelectorAll('.review-text');
    reviewTexts.forEach(reviewText => {
        // Пропускаем, если уже есть кнопка "Читать полностью"
        if (reviewText.nextElementSibling && reviewText.nextElementSibling.classList.contains('review-read-more')) {
            return;
        }
        
        // Проверяем, обрезан ли текст (scrollHeight больше clientHeight)
        if (reviewText.scrollHeight > reviewText.clientHeight + 5) {
            const readMore = document.createElement('span');
            readMore.className = 'review-read-more';
            readMore.textContent = 'Читать полностью...';
            
            readMore.addEventListener('click', function(e) {
                e.stopPropagation();
                if (reviewText.classList.contains('review-text-full')) {
                    reviewText.classList.remove('review-text-full');
                    readMore.textContent = 'Читать полностью...';
                } else {
                    reviewText.classList.add('review-text-full');
                    readMore.textContent = 'Свернуть';
                }
            });
            
            reviewText.parentNode.insertBefore(readMore, reviewText.nextSibling);
        }
    });
}

// Инициализация при загрузке и изменении размера окна
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewReadMore);
} else {
    initReviewReadMore();
}

window.addEventListener('resize', () => {
    setTimeout(initReviewReadMore, 100);
});

// Re-initialize after slider movement to ensure buttons are correctly added/removed
if (reviewsTrack) {
    reviewsTrack.addEventListener('scroll', () => {
        // Debounce to avoid excessive calls during scroll
        clearTimeout(window.reviewReadMoreTimeout);
        window.reviewReadMoreTimeout = setTimeout(initReviewReadMore, 100);
    });
}
