// ==========================================
// ANIMATION LETTRES QUI TOMBENT UNE PAR UNE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    if (welcomeScreen) {
        // Fonction pour animer les lettres une par une
        function animateText(element, delay = 0) {
            const text = element.textContent;
            element.textContent = '';
            element.style.display = 'inline-block';
            
            // Créer un span pour chaque lettre
            text.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter === ' ' ? '\u00A0' : letter;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.animation = `letterFall 0.5s ease-out forwards`;
                span.style.animationDelay = `${delay + index * 0.05}s`;
                element.appendChild(span);
            });
        }
        
        // Animer chaque mot du titre
        const titleWords = document.querySelectorAll('.welcome-title .word');
        titleWords.forEach((word, index) => {
            animateText(word, index * 0.5);
        });
        
        // Animer le sous-titre
        const subtitleWords = document.querySelectorAll('.welcome-subtitle .subtitle-word');
        subtitleWords.forEach((word, index) => {
            animateText(word, 2 + index * 0.3);
        });
        
        // Faire disparaître l'écran après l'animation
        setTimeout(() => {
            welcomeScreen.style.animation = 'fadeOutScreen 1s forwards';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 1000);
        }, 5000);
    }
});

// Ajouter l'animation dans une balise style
const style = document.createElement('style');
style.textContent = `
@keyframes letterFall {
    0% {
        transform: translateY(-100px) rotateZ(-10deg);
        opacity: 0;
    }
    60% {
        transform: translateY(5px) rotateZ(2deg);
    }
    100% {
        transform: translateY(0) rotateZ(0);
        opacity: 1;
    }
}

@keyframes fadeOutScreen {
    to {
        opacity: 0;
        visibility: hidden;
    }
}
`;
document.head.appendChild(style);