/* ===================================
   MODERN RESPONSIVE WEBSITE SCRIPTS
   ================================= */

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Global variables
let lastScroll = 0;
const body = document.body;
const header = document.querySelector('header');

// ===================================
// SCROLL EFFECTS AND HEADER BEHAVIOR
// ===================================
const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class to header for styling
    if (currentScroll > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }

    // Handle scroll direction classes
    if (currentScroll <= 0) {
        body.classList.remove("scroll-up", "scroll-down");
    } else if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        body.classList.add("scroll-down");
        body.classList.remove("scroll-up");
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        body.classList.add("scroll-up");
        body.classList.remove("scroll-down");
    }

    lastScroll = currentScroll;
}, 16); // ~60fps

window.addEventListener("scroll", handleScroll, { passive: true });

// ===================================
// MOBILE MENU FUNCTIONALITY
// ===================================
const initMobileMenu = () => {
    const menuIcon = document.querySelector(".menu-icon");
    const nav = document.querySelector("#bottom-header nav");
    
    if (!menuIcon || !nav) return;

    const toggleMenu = () => {
        nav.classList.toggle("active");
        menuIcon.classList.toggle("active");
        
        // Update aria attributes for accessibility
        const isOpen = nav.classList.contains("active");
        menuIcon.setAttribute("aria-expanded", isOpen);
        nav.setAttribute("aria-hidden", !isOpen);
        
        // Prevent body scroll when menu is open
        if (isOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    menuIcon.addEventListener("click", toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !menuIcon.contains(e.target)) {
            nav.classList.remove("active");
            menuIcon.classList.remove("active");
            menuIcon.setAttribute("aria-expanded", false);
            nav.setAttribute("aria-hidden", true);
            body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("active")) {
            nav.classList.remove("active");
            menuIcon.classList.remove("active");
            menuIcon.setAttribute("aria-expanded", false);
            nav.setAttribute("aria-hidden", true);
            body.style.overflow = '';
            menuIcon.focus();
        }
    });
    
    // Handle menu links
    const menuLinks = nav.querySelectorAll("a");
    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuIcon.classList.remove("active");
            menuIcon.setAttribute("aria-expanded", false);
            nav.setAttribute("aria-hidden", true);
            body.style.overflow = '';
        });
    });
};

// ===================================
// SERVICES DROPDOWN ENHANCEMENT
// ===================================
const initServicesDropdown = () => {
    const servicesDropdowns = document.querySelectorAll('.services-dropdown');

    servicesDropdowns.forEach(dropdown => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const trigger = dropdown.querySelector('.services-trigger');
        
        if (!dropdownContent || !trigger) return;

        let hideTimeout;
        let isHovered = false;

        const showDropdown = () => {
            clearTimeout(hideTimeout);
            dropdownContent.style.opacity = '1';
            dropdownContent.style.visibility = 'visible';
            dropdownContent.style.pointerEvents = 'auto';
            trigger.setAttribute('aria-expanded', 'true');
            isHovered = true;
        };

        const hideDropdown = () => {
            hideTimeout = setTimeout(() => {
                if (!isHovered) {
                    dropdownContent.style.opacity = '0';
                    dropdownContent.style.visibility = 'hidden';
                    dropdownContent.style.pointerEvents = 'none';
                    trigger.setAttribute('aria-expanded', 'false');
                }
            }, 150);
        };

        // Mouse events
        dropdown.addEventListener('mouseenter', showDropdown);
        dropdown.addEventListener('mouseleave', () => {
            isHovered = false;
            hideDropdown();
        });

        // Keyboard navigation
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (dropdownContent.style.visibility === 'visible') {
                    hideDropdown();
                } else {
                    showDropdown();
                }
            }
            if (e.key === 'Escape') {
                hideDropdown();
                trigger.focus();
            }
        });

        // Handle dropdown links keyboard navigation
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextLink = dropdownLinks[index + 1] || dropdownLinks[0];
                    nextLink.focus();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevLink = dropdownLinks[index - 1] || dropdownLinks[dropdownLinks.length - 1];
                    prevLink.focus();
                }
                if (e.key === 'Escape') {
                    hideDropdown();
                    trigger.focus();
                }
            });
        });
    });
};

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .card, .about, .card-container, .footer-section'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
};

// ===================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================
const initSmoothScrolling = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ===================================
// LAZY LOADING FOR IMAGES
// ===================================
const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
};

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================
const initPerformanceOptimizations = () => {
    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'font';
    preloadLink.type = 'font/otf';
    preloadLink.crossOrigin = 'anonymous';
    preloadLink.href = './assets/fonts/Freight Big Pro Semibold.otf';
    document.head.appendChild(preloadLink);

    // Add loading states
    const cards = document.querySelectorAll('.card, .service-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Reveal cards with staggered animation
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
};

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
const initAccessibility = () => {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content landmark
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
    }

    // Enhance button accessibility
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });

    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--color-accent-gold)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
};

// ===================================
// RESPONSIVE UTILITIES
// ===================================
const initResponsiveUtilities = () => {
    const handleResize = debounce(() => {
        // Update CSS custom properties based on viewport
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        document.documentElement.style.setProperty('--vw', `${vw}px`);
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Handle mobile menu on resize
        if (vw > 767) {
            const nav = document.querySelector("#bottom-header nav");
            const menuIcon = document.querySelector(".menu-icon");
            
            if (nav && menuIcon) {
                nav.classList.remove("active");
                menuIcon.classList.remove("active");
                menuIcon.setAttribute("aria-expanded", false);
                nav.setAttribute("aria-hidden", true);
                body.style.overflow = '';
            }
        }
    }, 250);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
};

// ===================================
// FORM ENHANCEMENTS (if forms exist)
// ===================================
const initFormEnhancements = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label effect
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.addEventListener('focus', () => {
                    label.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('focused');
                    }
                });
                
                // Check initial state
                if (input.value) {
                    label.classList.add('focused');
                }
            }
            
            // Add validation styling
            input.addEventListener('invalid', () => {
                input.classList.add('error');
            });
            
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    });
};

// ===================================
// INITIALIZATION
// ===================================
const init = () => {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    // Initialize all modules
    initMobileMenu();
    initServicesDropdown();
    initScrollAnimations();
    initSmoothScrolling();
    initLazyLoading();
    initPerformanceOptimizations();
    initAccessibility();
    initResponsiveUtilities();
    initFormEnhancements();

    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        body.classList.add('loaded');
    }, 100);

    console.log('🚀 Modern responsive website initialized successfully!');
};

// Start initialization
init();

// ===================================
// ERROR HANDLING
// ===================================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===================================
// EXPORT FOR TESTING (if needed)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        initMobileMenu,
        initServicesDropdown,
        initScrollAnimations,
        debounce,
        throttle
    };
}
