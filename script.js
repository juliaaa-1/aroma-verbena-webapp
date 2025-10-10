document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Взаимодействие с Telegram Web App
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Настраиваем интерфейс под Telegram
        Telegram.WebApp.setHeaderColor('#4CAF50');
        Telegram.WebApp.setBackgroundColor('#f8fdf8');
    }
});