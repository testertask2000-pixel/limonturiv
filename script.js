/**
 * ========================================================================
 * ЛИМОН ТУРІВ - CORE JAVASCRIPT
 * ========================================================================
 * Архітектура побудована на модульному підході (ES6 Classes & IIFE).
 * Жодних сторонніх бібліотек типу jQuery. Тільки чистий Vanilla JS.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. GLOBAL LOADER (Прелоадер)
    // ========================================================================
    const initLoader = () => {
        const loader = document.getElementById('global-loader');
        if (loader) {
            // Імітація завантаження важких ассетів (у реальності можна прив'язати до window.onload)
            setTimeout(() => {
                loader.classList.add('is-hidden');
                document.body.classList.remove('is-locked');
                
                // Запускаємо анімації Hero-екрану після зникнення лоадера
                document.querySelector('.hero-screen__title').style.opacity = '1';
                document.querySelector('.hero-screen__title').style.transform = 'translateY(0)';
            }, 800);
        }
    };

    // Спочатку блокуємо скролл, поки йде завантаження
    document.body.classList.add('is-locked');
    window.addEventListener('load', initLoader);
    // Фолбек, якщо load не спрацює
    setTimeout(initLoader, 3000);


    // ========================================================================
    // 2. STICKY HEADER & SCROLL LOGIC
    // ========================================================================
    class StickyHeader {
        constructor() {
            this.header = document.querySelector('.js-header');
            this.scrollThreshold = 50;
            this.lastScroll = 0;
            
            if (this.header) {
                this.init();
            }
        }

        init() {
            window.addEventListener('scroll', () => {
                this.checkScroll();
            }, { passive: true });
            // Перевірка при завантаженні
            this.checkScroll();
        }

        checkScroll() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > this.scrollThreshold) {
                this.header.classList.add('is-scrolled');
            } else {
                this.header.classList.remove('is-scrolled');
            }
            this.lastScroll = currentScroll;
        }
    }
    new StickyHeader();


    // ========================================================================
    // 3. PARALLAX EFFECT (Пальми та Фон)
    // ========================================================================
    class ParallaxManager {
        constructor() {
            this.elements = document.querySelectorAll('.parallax-el');
            this.bg = document.querySelector('.js-parallax-bg');
            this.ticking = false;

            // Відключаємо паралакс на мобільних для продуктивності
            if (window.innerWidth > 1024) {
                this.init();
            }
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
            // Декоративні елементи (Пальми)
            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.speed || 0.1);
                const yPos = scrollPos * speed;
                el.style.transform = `translateY(${yPos}px) translateZ(0)`;
            });

            // Фон Hero-екрану
            if (this.bg && scrollPos < window.innerHeight) {
                const bgSpeed = 0.4;
                this.bg.style.transform = `translateY(${scrollPos * bgSpeed}px) scale(1.05)`;
            }
        }
    }
    new ParallaxManager();


    // ========================================================================
    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ========================================================================
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.js-reveal');
        
        if (!revealElements.length || !('IntersectionObserver' in window)) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target); // Анімуємо тільки 1 раз
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    };
    initScrollReveal();


    // ========================================================================
    // 5. MODAL WINDOW LOGIC
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
            this.openBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            });

            this.closeBtns.forEach(btn => {
                btn.addEventListener('click', () => this.close());
            });

            // Закриття по кліку на бекдроп
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });

            // Закриття по ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
                    this.close();
                }
            });
        }

        open() {
            this.modal.classList.add('is-open');
            this.html.classList.add('is-locked');
            this.modal.setAttribute('aria-hidden', 'false');
        }

        close() {
            this.modal.classList.remove('is-open');
            this.html.classList.remove('is-locked');
            this.modal.setAttribute('aria-hidden', 'true');
        }
    }
    const modal = new ModalManager();


    // ========================================================================
    // 6. CUSTOM UI COUNTERS (+ / - in Modal)
    // ========================================================================
    const initCounters = () => {
        const counters = document.querySelectorAll('.ui-counter');

        counters.forEach(counter => {
            const btnMinus = counter.querySelector('.js-count-minus');
            const btnPlus = counter.querySelector('.js-count-plus');
            const input = counter.querySelector('input[type="number"]');

            if (!btnMinus || !btnPlus || !input) return;

            btnMinus.addEventListener('click', () => {
                let val = parseInt(input.value);
                // Обмеження: мінімум 0 (для дітей) або 1 (для дорослих)
                const min = input.getAttribute('min') || 0;
                if (val > min) {
                    input.value = val - 1;
                }
            });

            btnPlus.addEventListener('click', () => {
                let val = parseInt(input.value);
                const max = input.getAttribute('max') || 10;
                if (val < max) {
                    input.value = val + 1;
                }
            });
        });
    };
    initCounters();


    // ========================================================================
    // 7. ACCORDION (FAQ LOGIC)
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
                    
                    // Закриваємо всі інші (якщо треба поведінка "тільки один відкритий")
                    this.closeAll();

                    // Відкриваємо поточний, якщо він був закритий
                    if (!isExpanded) {
                        trigger.setAttribute('aria-expanded', 'true');
                    }
                });
            });
        }

        closeAll() {
            this.triggers.forEach(trigger => {
                trigger.setAttribute('aria-expanded', 'false');
            });
        }
    }
    new Accordion();


    // ========================================================================
    // 8. FORM VALIDATION & MOCK SUBMISSION
    // ========================================================================
    const initForms = () => {
        const forms = document.querySelectorAll('.js-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Зміна стану кнопки на "Завантаження"
                submitBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Відправка...';
                submitBtn.style.opacity = '0.8';
                submitBtn.style.pointerEvents = 'none';

                // Імітація AJAX запиту
                setTimeout(() => {
                    submitBtn.innerHTML = '✓ Відправлено успішно';
                    submitBtn.style.backgroundColor = '#2ECC71';
                    submitBtn.style.color = '#fff';
                    
                    // Очищення форми
                    form.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.pointerEvents = 'auto';
                        
                        // Якщо це форма в модалці - закриваємо модалку
                        if (form.id === 'modal-lead-form' && modal) {
                            modal.close();
                        }
                    }, 3000);
                }, 1500);
            });
        });
    };
    initForms();


    // ========================================================================
    // 9. SIMPLE MASKS (PHONE & DATE)
    // ========================================================================
    const initMasks = () => {
        // Телефони
        const phoneInputs = document.querySelectorAll('.js-phone-mask');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let val = e.target.value.replace(/\D/g, '');
                let formatted = '';
                
                if (val.length > 0) {
                    formatted = '+38 (' + val.substring(2, 5);
                    if (val.length > 5) formatted += ') ' + val.substring(5, 8);
                    if (val.length > 8) formatted += '-' + val.substring(8, 10);
                    if (val.length > 10) formatted += '-' + val.substring(10, 12);
                }
                
                // Якщо користувач щойно почав вводити, підставляємо код
                if(val.length === 0) formatted = '';
                else if (val.length <= 2) formatted = '+38 (';
                
                e.target.value = formatted;
            });
        });

        // Дати (дд.мм.рррр)
        const dateInputs = document.querySelectorAll('.js-date-mask');
        dateInputs.forEach(input => {
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
    // 10. SMOOTH ANCHOR SCROLLING
    // ========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = document.querySelector('.js-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================================================
    // 11. LANGUAGE SWITCHER MOCK
    // ========================================================================
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('is-active'));
            e.target.classList.add('is-active');
            // Тут в майбутньому можна додати логіку зміни перекладів через JSON
        });
    });

});
