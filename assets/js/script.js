/**
 * ========================================================================
 * ЛИМОН ТУРІВ - CORE JAVASCRIPT (VERSION 2026)
 * ========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. GLOBAL LOADER ТА ФІКС КЕШУВАННЯ (BFCache)
    // ========================================================================
    const initLoader = () => {
        const loader = document.getElementById('global-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('is-hidden');
                
                // Жорстко знімаємо будь-які блокування скролу
                document.body.classList.remove('is-locked');
                document.documentElement.classList.remove('is-locked');
                document.body.style.overflow = ''; 
                document.documentElement.style.overflow = '';
                
                const heroTitle = document.querySelector('.hero-screen__title');
                if(heroTitle) {
                    heroTitle.style.opacity = '1';
                    heroTitle.style.transform = 'translateY(0)';
                }
            }, 800);
        } else {
            document.body.classList.remove('is-locked');
        }
    };

    document.body.classList.add('is-locked');
    window.addEventListener('load', initLoader);
    setTimeout(initLoader, 3000);

    window.addEventListener('pageshow', (event) => {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            document.body.classList.remove('is-locked');
            document.documentElement.classList.remove('modal-open-lock');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            const loader = document.getElementById('global-loader');
            if (loader) loader.classList.add('is-hidden');
        }
    });


    // ========================================================================
    // 3. ПЕРЕМИКАЧ МОВ
    // ========================================================================
    const initLangSwitcher = () => {
        const langSwitchers = document.querySelectorAll('.lang-switcher');
        langSwitchers.forEach(switcher => {
            const btns = switcher.querySelectorAll('.lang-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (this.classList.contains('is-active')) return;
                    
                    const selectedLang = this.textContent.trim().toLowerCase();
                    let currentPath = window.location.pathname;
                    let currentFile = currentPath.split('/').pop() || 'index.html'; 
                    let newUrl = '';
                    
                    if (selectedLang === 'ru') {
                        if (!currentFile.includes('-ru')) {
                            newUrl = currentFile.replace('.html', '-ru.html');
                            if(currentFile === '') newUrl = 'index-ru.html'; 
                        }
                    } else {
                        if (currentFile.includes('-ru')) {
                            newUrl = currentFile.replace('-ru.html', '.html');
                        }
                    }
                    if (newUrl) window.location.href = newUrl;
                });
            });
        });
    };
    initLangSwitcher();

    // ========================================================================
    // 4. STICKY HEADER
    // ========================================================================
    class StickyHeader {
        constructor() {
            this.header = document.querySelector('.js-header');
            this.scrollThreshold = 50;
            if (this.header) this.init();
        }
        init() {
            window.addEventListener('scroll', () => this.checkScroll(), { passive: true });
            this.checkScroll(); 
        }
        checkScroll() {
            if (window.pageYOffset > this.scrollThreshold) {
                this.header.classList.add('is-scrolled');
            } else {
                this.header.classList.remove('is-scrolled');
            }
        }
    }
    new StickyHeader();

    // ========================================================================
    // 5. PARALLAX EFFECT
    // ========================================================================
    class ParallaxManager {
        constructor() {
            this.elements = document.querySelectorAll('.parallax-el');
            this.bg = document.querySelector('.js-parallax-bg');
            this.ticking = false;
            if (window.innerWidth > 1024) this.init();
        }
        init() {
            window.addEventListener('scroll', () => {
                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.updatePositions(window.pageYOffset);
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            }, { passive: true });
        }
        updatePositions(scrollPos) {
            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.speed || 0.1);
                const yPos = scrollPos * speed;
                el.style.transform = `translateY(${yPos}px) translateZ(0)`;
            });
            if (this.bg && scrollPos < window.innerHeight) {
                const bgSpeed = 0.4;
                this.bg.style.transform = `translateY(${scrollPos * bgSpeed}px) scale(1.05)`;
            }
        }
    }
    new ParallaxManager();

    // ========================================================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ========================================================================
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.js-reveal');
        if (!revealElements.length || !('IntersectionObserver' in window)) return;

        const observerOptions = { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    };
    initScrollReveal();

    // ========================================================================
    // 7. MODAL WINDOW LOGIC
    // ========================================================================
    class ModalManager {
        constructor() {
            this.modal = document.getElementById('modal-tour');
            this.openBtns = document.querySelectorAll('.js-open-modal');
            this.closeBtns = document.querySelectorAll('.js-modal-close');
            this.html = document.documentElement;
            if (this.modal) this.init();
        }
        init() {
            this.openBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); this.open(); }));
            this.closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
            this.modal.addEventListener('click', (e) => { if (e.target === this.modal) this.close(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.modal.classList.contains('is-open')) this.close(); });
        }
        open() {
            this.modal.classList.add('is-open');
            this.html.classList.add('modal-open-lock');
            document.body.style.overflow = 'hidden'; 
            this.modal.setAttribute('aria-hidden', 'false');
        }
        close() {
            this.modal.classList.remove('is-open');
            this.html.classList.remove('modal-open-lock');
            document.body.style.overflow = ''; 
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }
    window.siteModal = new ModalManager();

    // ========================================================================
    // 8. CUSTOM UI COUNTERS
    // ========================================================================
    const initCounters = () => {
        document.querySelectorAll('.ui-counter').forEach(counter => {
            const btnMinus = counter.querySelector('.js-count-minus');
            const btnPlus = counter.querySelector('.js-count-plus');
            const input = counter.querySelector('input[type="number"]');
            if (!btnMinus || !btnPlus || !input) return;

            btnMinus.addEventListener('click', () => {
                let val = parseInt(input.value);
                const min = parseInt(input.getAttribute('min')) || 0;
                if (val > min) input.value = val - 1;
            });
            btnPlus.addEventListener('click', () => {
                let val = parseInt(input.value);
                const max = parseInt(input.getAttribute('max')) || 10;
                if (val < max) input.value = val + 1;
            });
        });
    };
    initCounters();

    // ========================================================================
    // 9. ACCORDION (FAQ)
    // ========================================================================
    class Accordion {
        constructor() {
            this.triggers = document.querySelectorAll('.accordion__trigger');
            if (this.triggers.length > 0) this.init();
        }
        init() {
            this.triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                    this.closeAll();
                    if (!isExpanded) trigger.setAttribute('aria-expanded', 'true');
                });
            });
        }
        closeAll() {
            this.triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
        }
    }
    new Accordion();

    // ========================================================================
    // 10. FORMSPREE ЗАХИСТ ВІД БОТІВ (Відправка форми)
    // ========================================================================
    const initForms = () => {
        document.querySelectorAll('.js-form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                if(!submitBtn) return;
                
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Відправка...';
                submitBtn.style.opacity = '0.8';
                submitBtn.style.pointerEvents = 'none';

                try {
                    const response = await fetch('https://formspree.io/f/mnjkeezq', {
                        method: 'POST',
                        body: new FormData(form),
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        submitBtn.innerHTML = '✓ Відправлено успішно';
                        submitBtn.style.backgroundColor = '#2ECC71';
                        submitBtn.style.borderColor = '#2ECC71';
                        submitBtn.style.color = '#fff';
                        
                        form.reset();
                        const stars = form.querySelectorAll('input[name="rating"]');
                        if(stars) stars.forEach(star => star.checked = false);
                        
                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.backgroundColor = '';
                            submitBtn.style.borderColor = '';
                            submitBtn.style.color = '';
                            submitBtn.style.opacity = '1';
                            submitBtn.style.pointerEvents = 'auto';
                            
                            if (form.id === 'modal-lead-form' && window.siteModal) {
                                window.siteModal.close();
                            }
                        }, 3000);
                    } else {
                        throw new Error('Помилка відправки');
                    }
                } catch (error) {
                    submitBtn.innerHTML = '❌ Помилка. Спробуйте ще';
                    submitBtn.style.backgroundColor = '#E74C3C';
                    submitBtn.style.color = '#fff';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.pointerEvents = 'auto';
                    }, 3000);
                }
            });
        });
    };
    initForms();

    // ========================================================================
    // 11. SIMPLE MASKS (Телефон та Дата)
    // ========================================================================
    const initMasks = () => {
        document.querySelectorAll('.js-phone-mask').forEach(input => {
            input.addEventListener('input', function(e) {
                let val = e.target.value.replace(/\D/g, '');
                let formatted = '';
                if (val.length > 0) {
                    formatted = '+38 (' + val.substring(2, 5);
                    if (val.length > 5) formatted += ') ' + val.substring(5, 8);
                    if (val.length > 8) formatted += '-' + val.substring(8, 10);
                    if (val.length > 10) formatted += '-' + val.substring(10, 12);
                }
                if(val.length === 0) formatted = '';
                else if (val.length <= 2 && e.inputType !== "deleteContentBackward") formatted = '+38 (';
                e.target.value = formatted;
            });
        });

        document.querySelectorAll('.js-date-mask').forEach(input => {
            input.addEventListener('input', function(e) {
                let val = e.target.value.replace(/\D/g, '');
                let formatted = val;
                if (val.length > 2) formatted = val.substring(0, 2) + '.' + val.substring(2);
                if (val.length > 4) formatted = formatted.substring(0, 5) + '.' + val.substring(4, 8);
                e.target.value = formatted;
            });
        });
    };
    initMasks();

    // ========================================================================
    // 12. SMOOTH ANCHOR SCROLLING (Внутрішні переходи)
    // ========================================================================
    document.querySelectorAll('a[href^="#"], a[href^="index.html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            let targetId = this.getAttribute('href');
            
            if (targetId.includes('#')) {
                targetId = '#' + targetId.split('#')[1];
            }

            if (targetId === '#' || !targetId) return;

            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                e.preventDefault();
                
                if (targetId === '#search-module' || targetId === '#tours') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    history.pushState(null, null, targetId); 
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const header = document.querySelector('.js-header');
                    const headerOffset = header ? header.offsetHeight : 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ========================================================================
    // 13. MOBILE BURGER MENU
    // ========================================================================
    const burger = document.querySelector('.js-burger');
    const nav = document.querySelector('.header__nav');

    if (burger && nav) {
        burger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            nav.classList.toggle('is-active');
            
            if(nav.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth <= 1150 && !link.parentElement.classList.contains('has-dropdown')) {
                    burger.classList.remove('is-active');
                    nav.classList.remove('is-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

});