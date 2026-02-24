// ==========================================
// PORTFOLIO BETUL ARTI - JAVASCRIPT
// Fichier : style.js
// Description : Gestion des animations et interactions
// ==========================================

// Attendre que tout le HTML soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // SMOOTH SCROLL POUR LA NAVIGATION
    // ==========================================
    // Sélectionner tous les liens qui commencent par "#" (liens internes)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Ajouter un écouteur d'événement sur chaque lien
        anchor.addEventListener('click', function (e) {
            // Empêcher le comportement par défaut du lien
            e.preventDefault();
            // Récupérer la cible du lien (la section vers laquelle on veut scroller)
            const target = document.querySelector(this.getAttribute('href'));
            // Si la cible existe
            if (target) {
                // Faire défiler la page de manière fluide vers la section
                target.scrollIntoView({
                    behavior: 'smooth',    // Animation fluide
                    block: 'start'         // Aligner en haut de la page
                });
            }
        });
    });

    // ==========================================
    // ANIMATION AU SCROLL (APPARITION DES CARTES)
    // ==========================================
    // Options pour l'observateur d'intersection
    const observerOptions = {
        threshold: 0.1,                      // Déclencher quand 10% de l'élément est visible
        rootMargin: '0px 0px -100px 0px'    // Marge de 100px en bas pour déclencher plus tôt
    };

    // Créer un observateur d'intersection pour détecter quand les éléments apparaissent
    const observer = new IntersectionObserver((entries) => {
        // Pour chaque élément observé
        entries.forEach(entry => {
            // Si l'élément est visible à l'écran
            if (entry.isIntersecting) {
                // Rendre l'élément complètement opaque
                entry.target.style.opacity = '1';
                // Remettre l'élément à sa position normale (annuler le translateY)
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Sélectionner toutes les cartes à animer
    document.querySelectorAll('.competence-card, .stage-card, .activite-card, .bulletin-card, .diplome-card, .projet-card, .engagement-card, .cyber-box').forEach(el => {
        // Initialiser l'opacité à 0 (invisible)
        el.style.opacity = '0';
        // Décaler l'élément vers le bas de 30px
        el.style.transform = 'translateY(30px)';
        // Définir la transition pour une animation fluide
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        // Observer cet élément
        observer.observe(el);
    });

    // ==========================================
    // NAVIGATION ACTIVE (SURLIGNER LA SECTION COURANTE)
    // ==========================================
    // Écouter l'événement de scroll
    window.addEventListener('scroll', () => {
        // Variable pour stocker l'ID de la section actuelle
        let current = '';
        // Sélectionner toutes les sections
        const sections = document.querySelectorAll('section');
        
        // Pour chaque section
        sections.forEach(section => {
            // Récupérer la position du haut de la section
            const sectionTop = section.offsetTop;
            // Si on a scrollé jusqu'à cette section (avec une marge de 150px)
            if (pageYOffset >= sectionTop - 150) {
                // Mettre à jour la section courante
                current = section.getAttribute('id');
            }
        });

        // Pour chaque lien de navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            // Enlever la classe active de tous les liens
            link.classList.remove('active');
            // Si le lien correspond à la section courante
            if (link.getAttribute('href').slice(1) === current) {
                // Ajouter la classe active
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // GESTION DU FLIP DES CARTES
    // Chaque carte est INDÉPENDANTE
    // ==========================================
    // Sélectionner toutes les cartes avec effet flip
    document.querySelectorAll('.diplome-card-flip').forEach(card => {
        // Ajouter un écouteur de clic sur chaque carte
        card.addEventListener('click', function(e) {
            // Empêcher le flip si on clique sur le bouton de téléchargement
            if (e.target.classList.contains('download-btn') || e.target.closest('.download-btn')) {
                return;
            }
            // Basculer la classe 'flipped'
            this.classList.toggle('flipped');
        });
    });

    // Message de confirmation
    console.log('✅ Portfolio chargé!');
	
	
	
});