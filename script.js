// Initialize Three.js scene
let scene, camera, renderer;
let animationFrame;
let particles;

// Initialize Three.js scene with particle system
function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create renderer with transparency
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to hero background
    const heroBackground = document.getElementById('hero-background');
    if (heroBackground) {
        heroBackground.appendChild(renderer.domElement);
    }

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create material with custom color and size
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#8b5cf6',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Create particle system mesh
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 3;
    
    // Animation loop
    const animate = () => {
        animationFrame = requestAnimationFrame(animate);
        
        // Rotate particles
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
        
        // Mouse interaction
        if (mouseX && mouseY) {
            particles.rotation.x += (mouseY * 0.00001);
            particles.rotation.y += (mouseX * 0.00001);
        }
        
        renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Handle window resize
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Mouse interaction variables
let mouseX = 0;
let mouseY = 0;

// Track mouse movement
function onMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

// Mobile menu functionality
function initMobileMenu() {
    const menuButton = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu?.querySelectorAll('.nav-link');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (menuButton && mobileMenu && overlay) {
        // Add index to each link for staggered animation
        mobileMenuLinks?.forEach((link, index) => {
            link.style.setProperty('--index', index);
        });

        function closeMenu() {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('translate-x-full');
            menuButton.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
            overlay.classList.remove('active');
        }

        function openMenu() {
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            menuButton.classList.add('active');
            document.body.classList.add('overflow-hidden');
            overlay.classList.add('active');
        }

        menuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('translate-x-0');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close mobile menu when clicking overlay
        overlay.addEventListener('click', closeMenu);
        
        // Close mobile menu when clicking a link
        mobileMenuLinks?.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('translate-x-0')) {
                closeMenu();
            }
        });
    }

    // Handle navigation scroll effect and active links
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Add background on scroll
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll functionality
function initSmoothScroll() {
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
}

// Parallax effect for sections
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Button hover effects
function initButtonEffects() {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const x = e.clientX - button.getBoundingClientRect().left;
            const y = e.clientY - button.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initThree();
    initMobileMenu();
    initSmoothScroll();
    initParallax();
    initButtonEffects();
    
    // Add mouse move listener for particle interaction
    window.addEventListener('mousemove', onMouseMove);

    // Journey Slider functionality
    const journeySlides = document.querySelectorAll('.journey-slide');
    const journeyTimer = document.querySelector('.journey-timer');
    const journeyTimerProgress = document.querySelector('.journey-timer-progress');
    const journeyNextButton = document.querySelector('.journey-next-button');
    const currentSlideElement = document.querySelector('.current-slide');
    const totalSlidesElement = document.querySelector('.total-slides');
    let currentJourneySlide = 0;
    let isJourneyHovered = false;
    let slideInterval = null;
    const SLIDE_DURATION = 6000; // 6 seconds
    let isAnimating = false;
    let lastClickTime = 0;
    let ignoreHoverUntil = 0; // Add this line to track when to ignore hover

    // Set total slides number
    if (totalSlidesElement) {
        totalSlidesElement.textContent = String(journeySlides.length).padStart(2, '0');
    }

    // Update counter display
    function updateCounter(index) {
        if (currentSlideElement) {
            currentSlideElement.textContent = String(index + 1).padStart(2, '0');
        }
    }

    // Reset timer animation
    function resetTimer() {
        // Clear any existing interval
        if (slideInterval) {
            clearInterval(slideInterval);
        }

        // Reset timer progress
        journeyTimerProgress.style.transition = 'none';
        journeyTimerProgress.style.strokeDasharray = '100';
        journeyTimerProgress.style.strokeDashoffset = '0';
        
        // Force reflow
        journeyTimerProgress.getBoundingClientRect();
        
        // Start animation
        requestAnimationFrame(() => {
            journeyTimerProgress.style.transition = 'stroke-dashoffset 6s linear';
            journeyTimerProgress.style.strokeDashoffset = '100';
        });

        // Set interval for next slide if not hovered
        if (!isJourneyHovered) {
            slideInterval = setInterval(() => {
                if (!isAnimating) {
                    const nextIndex = (currentJourneySlide + 1) % journeySlides.length;
                    goToSlide(nextIndex, false);
                }
            }, SLIDE_DURATION);
        }
    }

    // Handle slide transitions
    function goToSlide(index, isManualTransition = false) {
        const now = Date.now();
        // Prevent transitions if animating or if it's too soon after last click
        if (isAnimating || (isManualTransition && now - lastClickTime < 500)) return;
        
        isAnimating = true;
        if (isManualTransition) {
            lastClickTime = now;
        }

        // Remove active class from current slide
        journeySlides[currentJourneySlide].classList.remove('active');
        
        // Update current slide index
        currentJourneySlide = index;
        
        // Add active class to new slide
        journeySlides[currentJourneySlide].classList.add('active');
        
        // Update counter
        updateCounter(currentJourneySlide);

        // Reset timer
        resetTimer();

        // Allow next transition after animation completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // Event listeners for hover
    let hoverTimeout;
    journeyTimer.addEventListener('mouseenter', () => {
        // Ignore hover if we're in the cooldown period after a click
        if (Date.now() < ignoreHoverUntil) return;
        
        // Clear any existing hover timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        // Set a small delay before applying hover state
        hoverTimeout = setTimeout(() => {
            isJourneyHovered = true;
            
            // Clear interval
            if (slideInterval) {
                clearInterval(slideInterval);
            }

            // Get current progress
            const computedStyle = window.getComputedStyle(journeyTimerProgress);
            const currentOffset = computedStyle.strokeDashoffset;
            
            // Pause animation
            journeyTimerProgress.style.transition = 'none';
            journeyTimerProgress.style.strokeDashoffset = currentOffset;
        }, 100);
    });

    journeyTimer.addEventListener('mouseleave', (e) => {
        // Clear any existing hover timeout
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }
        
        // Set a small delay before removing hover state
        hoverTimeout = setTimeout(() => {
            // Check if the mouse is moving to the next button
            const nextButtonRect = journeyNextButton.getBoundingClientRect();
            if (e.clientX >= nextButtonRect.left && e.clientX <= nextButtonRect.right &&
                e.clientY >= nextButtonRect.top && e.clientY <= nextButtonRect.bottom) {
                return;
            }

            isJourneyHovered = false;
            
            // Reset timer to start fresh
            resetTimer();
        }, 100);
    });

    // Event listener for next button click
    journeyNextButton.addEventListener('click', () => {
        if (!isAnimating) {
            const nextIndex = (currentJourneySlide + 1) % journeySlides.length;
            goToSlide(nextIndex, true);
            // Set cooldown period after click (300ms)
            ignoreHoverUntil = Date.now() + 300;
        }
    });

    // Initialize first slide
    if (journeySlides.length > 0) {
        journeySlides[0].classList.add('active');
        updateCounter(0);
        resetTimer();
    }
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    if (renderer) {
        renderer.dispose();
    }
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('mousemove', onMouseMove);
});
