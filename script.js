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

// Слайдер услуг - рабочая версия из репозитория
const servicesTrack = document.getElementById('servicesTrack');
const servicesNext = document.getElementById('servicesNext');
const servicesPrev = document.getElementById('servicesPrev');

if (servicesTrack && servicesNext) {
    let currentServiceIndex = 0;
    let isScrolling = false;
    
    const getCardsPerView = () => {
        if (window.innerWidth <= 768) return 1;  // До 768px - 1 карточка
        if (window.innerWidth <= 1024) return 2; // От 769px до 1024px - 2 карточки
        return 3; // Свыше 1024px - 3 карточки
    };
    
    const getCardWidth = () => {
        const cardsPerView = getCardsPerView();
        const trackWidth = servicesTrack.offsetWidth;
        
        // Для мобильных (1 карточка) возвращаем полную ширину трека
        if (cardsPerView === 1) {
            return trackWidth;
        }
        
        // Для планшетов и ПК: ширина карточки + gap
        const gap = 30;
        return (trackWidth - (gap * (cardsPerView - 1))) / cardsPerView + gap;
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
        }
        
        servicesTrack.scrollTo({
            left: currentServiceIndex * cardWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 400);
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
        }
        
        servicesTrack.scrollTo({
            left: currentServiceIndex * cardWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 400);
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
            const maxIndex = getMaxIndex();
            
            // Корректируем индекс, если он выходит за пределы
            if (currentServiceIndex > maxIndex) {
                currentServiceIndex = maxIndex;
            }
            
            // Устанавливаем правильную позицию
            const scrollPosition = currentServiceIndex * cardWidth;
            servicesTrack.scrollTo({
                left: scrollPosition,
                behavior: 'auto'
            });
            
            // Сбрасываем флаг скролла
            isScrolling = false;
        }, 250);
    });
    
    // Инициализация: устанавливаем начальную позицию
    setTimeout(() => {
        servicesTrack.scrollTo({
            left: 0,
            behavior: 'auto'
        });
        currentServiceIndex = 0;
    }, 100);
}

// Слайдер отзывов - бесконечный, без быстрого перехода
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsNext = document.getElementById('reviewsNext');
const reviewsPrev = document.getElementById('reviewsPrev');

if (reviewsTrack && reviewsNext) {
    let currentReviewIndex = 1;
    let isScrolling = false;
    
    const getReviewWidth = () => {
        return reviewsTrack.offsetWidth;
    };
    
    const getTotalReviews = () => {
        return document.querySelectorAll('.review-card:not(.review-card-clone)').length;
    };

    const collapseAllReviews = () => {
        document.querySelectorAll('.review-card').forEach(card => {
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
    
    // Добавление кнопок листания в карточки отзывов (только для мобильных 756px и меньше)
    const addReviewCardButtons = () => {
        // Добавляем кнопки только на мобильных устройствах (756px и меньше)
        if (window.innerWidth > 756) {
            // На ПК убираем все кнопки навигации из карточек
            const existingNavs = document.querySelectorAll('.review-card-nav');
            existingNavs.forEach(nav => nav.remove());
            return;
        }
        
        const cards = document.querySelectorAll('.review-card:not(.review-card-clone)');
        cards.forEach(card => {
            // Удаляем старые кнопки, если есть
            const oldNav = card.querySelector('.review-card-nav');
            if (oldNav) {
                oldNav.remove();
            }
            
            const nav = document.createElement('div');
            nav.className = 'review-card-nav';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'review-card-nav-btn review-card-nav-prev';
            prevBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrevReview();
            });
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'review-card-nav-btn review-card-nav-next';
            nextBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNextReview();
            });
            
            nav.appendChild(prevBtn);
            nav.appendChild(nextBtn);
            card.appendChild(nav);
        });
    };
    
    // Инициализация бесконечного слайдера
    const initInfiniteSlider = () => {
        const cards = Array.from(reviewsTrack.querySelectorAll('.review-card:not(.review-card-clone)'));
        if (cards.length === 0) return;
        
        // Удаляем старые клоны
        reviewsTrack.querySelectorAll('.review-card-clone').forEach(clone => clone.remove());
        
        // Клонируем последний элемент в начало
        const lastClone = cards[cards.length - 1].cloneNode(true);
        lastClone.classList.add('review-card-clone');
        reviewsTrack.insertBefore(lastClone, cards[0]);
        
        // Клонируем первый элемент в конец
        const firstClone = cards[0].cloneNode(true);
        firstClone.classList.add('review-card-clone');
        reviewsTrack.appendChild(firstClone);
        
        // Прокручиваем к первому реальному элементу
        const reviewWidth = getReviewWidth();
        reviewsTrack.scrollTo({
            left: reviewWidth,
            behavior: 'auto'
        });
        currentReviewIndex = 1;
        
        // Добавляем кнопки в карточки
        addReviewCardButtons();
    };

    const scrollToReview = (index) => {
        const reviewWidth = getReviewWidth();
        const totalReviews = getTotalReviews();
        
        // Обработка бесконечного листания
        if (index >= totalReviews + 1) {
            currentReviewIndex = 1;
            reviewsTrack.scrollTo({
                left: (totalReviews + 1) * reviewWidth,
                behavior: 'smooth'
            });
            setTimeout(() => {
                reviewsTrack.scrollTo({
                    left: currentReviewIndex * reviewWidth,
                    behavior: 'auto'
                });
                isScrolling = false;
                initReviewReadMore();
            }, 300);
            return;
        }
        
        if (index <= 0) {
            currentReviewIndex = totalReviews;
            reviewsTrack.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
            setTimeout(() => {
                reviewsTrack.scrollTo({
                    left: currentReviewIndex * reviewWidth,
                    behavior: 'auto'
                });
                isScrolling = false;
                initReviewReadMore();
            }, 300);
            return;
        }
        
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
    
    // Отслеживание скролла для бесконечного листания
    let scrollTimeout;
    reviewsTrack.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const reviewWidth = getReviewWidth();
            if (reviewWidth === 0) return;
            
            const scrollLeft = reviewsTrack.scrollLeft;
            const totalReviews = getTotalReviews();
            const newIndex = Math.round(scrollLeft / reviewWidth);
            
            if (newIndex >= totalReviews + 1) {
                currentReviewIndex = 1;
                reviewsTrack.scrollTo({
                    left: currentReviewIndex * reviewWidth,
                    behavior: 'auto'
                });
            } else if (newIndex <= 0) {
                currentReviewIndex = totalReviews;
                reviewsTrack.scrollTo({
                    left: currentReviewIndex * reviewWidth,
                    behavior: 'auto'
                });
            } else {
                currentReviewIndex = newIndex;
            }
            
            // Добавляем кнопки при скролле
            addReviewCardButtons();
        }, 50);
    });

    let lastClickTime = 0;
    const CLICK_DEBOUNCE = 400;

    const handleNextReview = () => {
        const now = Date.now();
        if (isScrolling || (now - lastClickTime) < CLICK_DEBOUNCE) {
            return;
        }
        lastClickTime = now;
        isScrolling = true;
        
        collapseAllReviews();
        const totalReviews = getTotalReviews();
        currentReviewIndex++;
        scrollToReview(currentReviewIndex);
    };

    const handlePrevReview = () => {
        const now = Date.now();
        if (isScrolling || (now - lastClickTime) < CLICK_DEBOUNCE) {
            return;
        }
        lastClickTime = now;
        isScrolling = true;
        
        collapseAllReviews();
        const totalReviews = getTotalReviews();
        currentReviewIndex--;
        scrollToReview(currentReviewIndex);
    };
    
    if (reviewsNext) {
        reviewsNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNextReview();
        });
    }
    
    if (reviewsPrev) {
        reviewsPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePrevReview();
        });
    }
    
    // Инициализация при загрузке
    initInfiniteSlider();
    
    // Добавляем кнопки сразу после инициализации
    setTimeout(() => {
        addReviewCardButtons();
    }, 200);
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initInfiniteSlider();
            initReviewReadMore();
            setTimeout(() => {
                addReviewCardButtons();
            }, 200);
        }, 250);
    });
    
    // Добавляем кнопки при изменении слайдера
    reviewsTrack.addEventListener('scroll', () => {
        setTimeout(addReviewCardButtons, 100);
    });
}

// Слайдер интерьера - бесконечный, автопрокрутка каждые 2 секунды, без быстрого перехода
const interiorTrack = document.getElementById('interiorTrack');
const interiorPrev = document.getElementById('interiorPrev');
const interiorNext = document.getElementById('interiorNext');
const interiorDots = document.getElementById('interiorDots');
const interiorNavPrev = document.getElementById('interiorNavPrev');
const interiorNavNext = document.getElementById('interiorNavNext');

if (interiorTrack) {
    let currentInteriorIndex = 1;
    let isScrolling = false;
    let autoSlideInterval = null;
    
    const getItemWidth = () => {
        return interiorTrack.offsetWidth;
    };
    
    const getTotalItems = () => {
        return document.querySelectorAll('.interior-item:not(.interior-item-clone)').length;
    };
    
    // Инициализация бесконечного слайдера
    const initInfiniteSlider = () => {
        const items = Array.from(interiorTrack.querySelectorAll('.interior-item:not(.interior-item-clone)'));
        if (items.length === 0) return;
        
        // Удаляем старые клоны
        interiorTrack.querySelectorAll('.interior-item-clone').forEach(clone => clone.remove());
        
        // Клонируем последний элемент в начало
        const lastClone = items[items.length - 1].cloneNode(true);
        lastClone.classList.add('interior-item-clone');
        interiorTrack.insertBefore(lastClone, items[0]);
        
        // Клонируем первый элемент в конец
        const firstClone = items[0].cloneNode(true);
        firstClone.classList.add('interior-item-clone');
        interiorTrack.appendChild(firstClone);
        
        // Прокручиваем к первому реальному элементу
        const itemWidth = getItemWidth();
        if (itemWidth > 0) {
            interiorTrack.scrollTo({
                left: itemWidth,
                behavior: 'auto'
            });
            currentInteriorIndex = 1;
        }
        updateDots();
    };
    
    const updateDots = () => {
        if (!interiorDots) return;
        
        interiorDots.innerHTML = '';
        
        const totalItems = getTotalItems();
        
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('div');
            dot.className = 'interior-dot';
            
            const isActive = (currentInteriorIndex - 1) === i || (currentInteriorIndex === 0 && i === totalItems - 1) || (currentInteriorIndex === totalItems + 1 && i === 0);
            
            if (isActive) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                scrollToIndex(i + 1);
                resetAutoSlide();
            });
            
            interiorDots.appendChild(dot);
        }
    };
    
    const updateCurrentIndex = () => {
        const itemWidth = getItemWidth();
        if (itemWidth === 0) return;
        
        const scrollLeft = interiorTrack.scrollLeft;
        const newIndex = Math.round(scrollLeft / itemWidth);
        const totalItems = getTotalItems();
        
        if (newIndex !== currentInteriorIndex) {
            if (newIndex === 0) {
                currentInteriorIndex = totalItems;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            } else if (newIndex >= totalItems + 1) {
                currentInteriorIndex = 1;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            } else {
                currentInteriorIndex = newIndex;
            }
            updateDots();
        }
    };
    
    const scrollToIndex = (index) => {
        if (isScrolling) return;
        isScrolling = true;
        
        const itemWidth = getItemWidth();
        if (itemWidth === 0) {
            isScrolling = false;
            return;
        }
        
        currentInteriorIndex = index;
        
        interiorTrack.scrollTo({
            left: currentInteriorIndex * itemWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            const totalItems = getTotalItems();
            if (currentInteriorIndex >= totalItems + 1) {
                currentInteriorIndex = 1;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            }
            if (currentInteriorIndex <= 0) {
                currentInteriorIndex = totalItems;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            }
            isScrolling = false;
            updateCurrentIndex();
        }, 300);
    };
    
    let isAutoScrolling = false;
    
    const goToNext = () => {
        if (isScrolling) return;
        isScrolling = true;
        isAutoScrolling = true;
        
        const itemWidth = getItemWidth();
        if (itemWidth === 0) {
            isScrolling = false;
            isAutoScrolling = false;
            return;
        }
        
        const totalItems = getTotalItems();
        currentInteriorIndex++;
        
        interiorTrack.scrollTo({
            left: currentInteriorIndex * itemWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            if (currentInteriorIndex >= totalItems + 1) {
                currentInteriorIndex = 1;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            }
            isScrolling = false;
            isAutoScrolling = false;
            updateCurrentIndex();
        }, 400);
    };

    if (interiorNext) {
        interiorNext.addEventListener('click', () => {
            goToNext();
            resetAutoSlide();
        });
    }

    const goToPrev = () => {
        if (isScrolling) return;
        isScrolling = true;
        
        const itemWidth = getItemWidth();
        if (itemWidth === 0) {
            isScrolling = false;
            return;
        }
        
        const totalItems = getTotalItems();
        currentInteriorIndex--;
        
        interiorTrack.scrollTo({
            left: currentInteriorIndex * itemWidth,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            if (currentInteriorIndex <= 0) {
                currentInteriorIndex = totalItems;
                interiorTrack.scrollTo({
                    left: currentInteriorIndex * itemWidth,
                    behavior: 'auto'
                });
            }
            isScrolling = false;
            updateCurrentIndex();
        }, 400);
    };

    if (interiorPrev) {
        interiorPrev.addEventListener('click', () => {
            goToPrev();
            resetAutoSlide();
        });
    }
    
    if (interiorNavPrev) {
        interiorNavPrev.addEventListener('click', () => {
            goToPrev();
            resetAutoSlide();
        });
    }
    
    if (interiorNavNext) {
        interiorNavNext.addEventListener('click', () => {
            goToNext();
            resetAutoSlide();
        });
    }
    
    // Авто-прокрутка каждые 2 секунды
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            goToNext();
        }, 2000);
    };
    
    let autoSlideResumeTimeout = null;
    
    const resetAutoSlide = () => {
        // Останавливаем автопрокрутку
        stopAutoSlide();
        
        // Очищаем предыдущий таймер возобновления, если есть
        if (autoSlideResumeTimeout) {
            clearTimeout(autoSlideResumeTimeout);
        }
        
        // Возобновляем автопрокрутку через 2 секунды бездействия
        autoSlideResumeTimeout = setTimeout(() => {
            startAutoSlide();
        }, 2000);
    };
    
    const stopAutoSlide = () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
        // Очищаем таймер возобновления при остановке
        if (autoSlideResumeTimeout) {
            clearTimeout(autoSlideResumeTimeout);
            autoSlideResumeTimeout = null;
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
        
        if (interactionTimeout) {
            clearTimeout(interactionTimeout);
        }
        
        interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
            if (!isUserInteracting) {
                startAutoSlide();
            }
        }, 3000);
    };
    
    interiorTrack.addEventListener('touchstart', handleUserInteraction);
    interiorTrack.addEventListener('touchmove', handleUserInteraction);
    interiorTrack.addEventListener('touchend', () => {
        handleUserInteraction();
    });
    
    interiorTrack.addEventListener('mousedown', handleUserInteraction);
    interiorTrack.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) {
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
        if (interiorTrack.scrollLeft === lastScrollLeft) return;
        lastScrollLeft = interiorTrack.scrollLeft;
        
        if (isAutoScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!isAutoScrolling) {
                updateCurrentIndex();
            }
        }, 150);
        
        if (!isUserInteracting && !isAutoScrolling) {
            handleUserInteraction();
        }
    });
    
    // Инициализация при загрузке
    initInfiniteSlider();
    
    // Запускаем авто-прокрутку
    startAutoSlide();
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initInfiniteSlider();
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
    const mapContainer = document.getElementById('yandex-map');
    if (!mapContainer) return;

    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function () {
            const map = new ymaps.Map('yandex-map', {
                center: [64.5622, 39.8302],
                zoom: 18,
                controls: ['zoomControl', 'fullscreenControl']
            });

            map.behaviors.disable('scrollZoom');
            map.options.set('suppressMapOpenBlock', true);

            const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2d5016"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 11.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 8.5 12 8.5s2.5 1.12 2.5 2.5S13.38 13.5 12 13.5z"/></svg>';
            const iconDataUri = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgIcon);

            const placemark = new ymaps.Placemark([64.5622, 39.8302], {
                balloonContent: 'Аромацентр "Вербена"<br>Беломорский проспект, 35'
            }, {
                iconLayout: 'default#image',
                iconImageHref: iconDataUri,
                iconImageSize: [64, 64],
                iconImageOffset: [-32, -64]
            });

            map.geoObjects.add(placemark);
        });
    } else {
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
            const offsetTop = target.offsetTop - 80;
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

// Обработка длинных отзывов - добавление "Читать полностью" (для всех разрешений)
function initReviewReadMore() {
    const reviewTexts = document.querySelectorAll('.review-text');
    reviewTexts.forEach(reviewText => {
        // Удаляем старую кнопку если есть
        const oldReadMore = reviewText.nextElementSibling;
        if (oldReadMore && oldReadMore.classList.contains('review-read-more')) {
            oldReadMore.remove();
        }
        
        // Добавляем кнопку на всех разрешениях
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

if (reviewsTrack) {
    reviewsTrack.addEventListener('scroll', () => {
        clearTimeout(window.reviewReadMoreTimeout);
        window.reviewReadMoreTimeout = setTimeout(initReviewReadMore, 100);
    });
}
