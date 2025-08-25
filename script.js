// Performance optimized with event delegation and error handling
(function() {
    'use strict';

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            
            // Trap focus in mobile menu when open
            if (!isExpanded) {
                mainNav.querySelector('a').focus();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                mobileMenuToggle.focus();
            }
        });
    }

    // Smooth scrolling with error handling
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            
            if (targetId === '#') return;
            
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (mainNav && mainNav.classList.contains('active')) {
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        mainNav.classList.remove('active');
                    }
                    
                    // Smooth scroll with offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            } catch (error) {
                console.warn('Scroll target not found:', targetId);
            }
        }
    });

    // Intersection Observer for animations with performance optimization
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Use single observer for all elements
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50);
                
                // Stop observing once animated
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => animationObserver.observe(el));

    // Enhanced demo launch with modal
    window.launchDemo = function() {
        // Create modal overlay
        const modalHTML = `
            <div id="demo-modal" class="demo-modal" role="dialog" aria-labelledby="demo-title" aria-modal="true">
                <div class="demo-modal-content">
                    <button class="demo-close" aria-label="Close demo">&times;</button>
                    <h2 id="demo-title">🎉 Demo Scanner</h2>
                    <div class="demo-scanner">
                        <div class="scanner-frame">
                            <div class="scanner-line"></div>
                        </div>
                        <p>Point your camera at a ConfirmSure QR code</p>
                    </div>
                    <div class="demo-result" style="display: none;">
                        <div class="result-icon">✅</div>
                        <h3>Product Authenticated!</h3>
                        <p>This product is genuine and verified by ConfirmSure.</p>
                        <button class="btn-primary" onclick="resetDemo()">Scan Another</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles if not already present
        if (!document.getElementById('demo-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'demo-modal-styles';
            styles.textContent = `
                .demo-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                .demo-modal-content {
                    background: white;
                    border-radius: 1rem;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    animation: slideUp 0.3s ease;
                }
                .demo-close {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    color: #666;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .demo-close:hover {
                    color: #000;
                }
                .demo-scanner {
                    text-align: center;
                    padding: 2rem 0;
                }
                .scanner-frame {
                    width: 200px;
                    height: 200px;
                    border: 3px solid var(--primary-500);
                    border-radius: 1rem;
                    margin: 0 auto 1rem;
                    position: relative;
                    overflow: hidden;
                }
                .scanner-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
                    animation: scan 2s infinite;
                }
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: calc(100% - 3px); }
                    100% { top: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .demo-result {
                    text-align: center;
                    padding: 2rem 0;
                }
                .result-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                .demo-result h3 {
                    color: var(--success-500);
                    margin-bottom: 1rem;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('demo-modal');
        
        // Focus management
        const closeBtn = modal.querySelector('.demo-close');
        closeBtn.focus();

        // Simulate scanning
        setTimeout(() => {
            modal.querySelector('.demo-scanner').style.display = 'none';
            modal.querySelector('.demo-result').style.display = 'block';
        }, 3000);

        // Close modal functionality
        closeBtn.addEventListener('click', closeDemo);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDemo();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeDemo();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    };

    window.resetDemo = function() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.querySelector('.demo-scanner').style.display = 'block';
            modal.querySelector('.demo-result').style.display = 'none';
            
            // Simulate scanning again
            setTimeout(() => {
                modal.querySelector('.demo-scanner').style.display = 'none';
                modal.querySelector('.demo-result').style.display = 'block';
            }, 3000);
        }
    };

    window.closeDemo = function() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // Header background on scroll with throttling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) return;
        
        scrollTimer = setTimeout(() => {
            const header = document.querySelector('header');
            if (header) {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }
            scrollTimer = null;
        }, 10);
    });

    // Enhanced button interactions with event delegation
    document.addEventListener('mousedown', function(e) {
        if (e.target.matches('.btn-primary, .demo-btn')) {
            e.target.style.transform = 'translateY(0px) scale(0.98)';
        }
    });

    document.addEventListener('mouseup', function(e) {
        if (e.target.matches('.btn-primary, .demo-btn')) {
            e.target.style.transform = '';
        }
    });

    document.addEventListener('mouseleave', function(e) {
        if (e.target.matches('.btn-primary, .demo-btn')) {
            e.target.style.transform = '';
        }
    });

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = 'styles.css';
    document.head.appendChild(preloadLink);

    // Service Worker registration for PWA (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Uncomment when you have a service worker file
            // navigator.serviceWorker.register('/sw.js').catch(() => {});
        });
    }

    // Performance monitoring
    if (window.performance && performance.mark) {
        performance.mark('app-interactive');
        
        window.addEventListener('load', () => {
            performance.mark('app-loaded');
            performance.measure('app-load-time', 'app-interactive', 'app-loaded');
            
            const measure = performance.getEntriesByType('measure')[0];
            if (measure) {
                console.log(`🚀 ConfirmSure loaded in ${Math.round(measure.duration)}ms`);
            }
        });
    }

    console.log('🛡️ ConfirmSure Enhanced - Ready for deployment');
})();