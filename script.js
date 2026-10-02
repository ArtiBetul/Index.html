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

    // ==========================================
    // UNE CARTE SUR DEUX AVEC UNE LUMIÈRE BLANCHE FIXE
    // ==========================================
    // Liste des groupes de cartes
    const groupesDeCartes = [
        '.competence-card',
        '.timeline-content',
        '.diplome-card-flip',
        '.stage-card',
        '.activite-card',
        '.engagement-card',
        '.projet-card',
        '.cyber-box',
        '.covaciel-column'
    ];

    // Pour chaque groupe...
    groupesDeCartes.forEach(groupe => {
        // ...on prend toutes les cartes du groupe
        document.querySelectorAll(groupe).forEach((carte, numero) => {
            // numero = 0, 1, 2, 3...
            // Si le numéro est impair (1, 3, 5...) => lumière blanche
            // Sinon la carte garde la lumière dorée
            if (numero % 2 === 1) {
                carte.classList.add('glow-white');
            }
        });
    });

    // ==========================================
    // LUMIÈRE QUI SUIT LA SOURIS SUR LES CARTES
    // ==========================================
    // Quand la souris bouge sur une carte,
    // on calcule où elle est (en %) et on le donne au CSS (--mx et --my)
    document.querySelectorAll('.competence-card, .timeline-content, .stage-card, .activite-card, .engagement-card, .projet-card, .cyber-box').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            this.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
            this.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
            this.classList.add('glow-spot');
        });
        // Quand la souris sort de la carte, on enlève la lumière
        card.addEventListener('mouseleave', function() {
            this.classList.remove('glow-spot');
        });
    });

    // ==========================================
    // FORMATION : LES CARTES ARRIVENT UNE FOIS DE GAUCHE, UNE FOIS DE DROITE
    // ==========================================
    // Les cartes de gauche (1re, 3e, 5e...) glissent depuis la gauche,
    // celles de droite (2e, 4e, 6e...) glissent depuis la droite.
    // Le style de l'animation est dans style.css (.slide-left, .slide-right, .slide-in)
    const cartesFormation = document.querySelectorAll('#etudes .timeline-item .timeline-content');
    const animationsCoupees = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!animationsCoupees && 'IntersectionObserver' in window) {
        // Quand une carte apparaît à l'écran, on la fait glisser à sa place
        const observerFormation = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                    observerFormation.unobserve(entry.target); // une seule fois
                }
            });
        }, { threshold: 0.2 });

        cartesFormation.forEach((carte, numero) => {
            // numero = 0, 1, 2... : pair = à gauche, impair = à droite
            carte.classList.add(numero % 2 === 0 ? 'slide-left' : 'slide-right');
            observerFormation.observe(carte);
        });
    }

    // Message de confirmation
    console.log('✅ Portfolio chargé!');
	
	
	
});
