
    <!-- Footer -->
    <footer>
        <p>&copy; 2026 ARTI Betul - Portfolio étudiant</p>
    </footer>
<script>
    // Smooth scroll pour les liens de navigation
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

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.competence-card, .stage-card, .activite-card, .bulletin-card, .diplome-card, .projet-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Active link dans la navigation
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href').slice(1) === current) {
                link.style.color = 'var(--secondary)';
            }
        });
    });

  
			// Gestion du clic sur les cartes diplômes - Chaque carte est INDÉPENDANTE
    document.querySelectorAll('.diplome-card-flip').forEach(card => {
        card.addEventListener('click', function() {
            // On bascule la classe 'flipped' uniquement sur la carte cliquée
            // SANS toucher aux autres cartes
            this.classList.toggle('flipped');
      
        });
    });
