/**
 * ========================================================================
 * ЛИМОН ТУРІВ - CORE JAVASCRIPT (VERSION 2026)
 * ========================================================================
 * Архитектура построена на модульном подходе (ES6 Classes & IIFE).
 * Никаких сторонних библиотек вроде jQuery. Только чистый Vanilla JS.
 */

'use strict';

// Отключаем автоматическое восстановление скролла браузером (решает баг при возврате "Назад")
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================
    // 1. GLOBAL LOADER ТА ФИКС КЭШИРОВАНИЯ БРАУЗЕРА (BFCache)
    // ========================================================================
    const initLoader = () => {
        const loader = document.getElementById('global-loader');
        if (loader) {
            // Имитация загрузки
            setTimeout(() => {
                loader.classList.add('is-hidden');
                
                // Жестко снимаем любые блокировки скролла
                document.body.classList.remove('is-locked');
                document.documentElement.classList.remove('is-locked');
                document.body.style.overflow = ''; 
                document.documentElement.style.overflow = '';
                
                // Запускаем анимации Hero-экрана после исчезновения лоадера
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

    // Блокируем скролл на старте
    document.body.classList.add('is-locked');
    window.addEventListener('load', initLoader);
    setTimeout(initLoader, 3000); // Фолбэк на случай долгой загрузки

    // САМОЕ ВАЖНОЕ: ФИКС "КНОПКИ НАЗАД" (BFCache)
    // Если страница достается из кэша браузера, жестко снимаем блокировку скролла
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
    // 2. ФИКС ПЕРЕХОДА ПО ЯКОРЮ С ДРУГОЙ СТРАНИЦЫ (напр. index.html#search-module)
    // ========================================================================
    if (window.location.hash) {
        // Ждем 1.2 секунды, пока виджеты (Otpusk/Mvoyage) подгрузятся и раздвинут страницу
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const header = document.querySelector('.js-header');
                const headerOffset = header ? header.offsetHeight : 80;
                // Высчитываем позицию элемента + отступ под шапку
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - headerOffset - 20, 
                    behavior: 'smooth'
                });
            }
        }, 1200); 
    }

    // ========================================================================
    // 3. ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ
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
    // 4. STICKY HEADER & SCROLL LOGIC
    // ========================================================================
    class StickyHeader {
        constructor() {
            this.header = document.querySelector('.js-header');
            this.scrollThreshold = 50;
            
            if (this.header) {
                this.init();
            }
        }

        init() {
            window.addEventListener('scroll', () => {
                this.checkScroll();
            }, { passive: true });
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
    // 5. PARALLAX EFFECT (Пальмы и Фон)
    // ========================================================================
    class ParallaxManager {
        constructor() {
            this.elements = document.querySelectorAll('.parallax-el');
            this.bg = document.querySelector('.js-parallax-bg');
            this.ticking = false;

            // Отключаем параллакс на мобильных для производительности
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
    // 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
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
                    obs.unobserve(entry.target); // Анимируем только 1 раз
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
            this.openBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            });

            this.closeBtns.forEach(btn => {
                btn.addEventListener('click', () => this.close());
            });

            // Закрытие по клику на бэкдроп
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.close();
                }
            });

            // Закрытие по ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
                    this.close();
                }
            });
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
    // Делаем модалку глобально доступной для других скриптов
    window.siteModal = new ModalManager();

    // ========================================================================
    // 8. CUSTOM UI COUNTERS (+ / - in Modal)
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
                const min = parseInt(input.getAttribute('min')) || 0;
                if (val > min) {
                    input.value = val - 1;
                }
            });

            btnPlus.addEventListener('click', () => {
                let val = parseInt(input.value);
                const max = parseInt(input.getAttribute('max')) || 10;
                if (val < max) {
                    input.value = val + 1;
                }
            });
        });
    };
    initCounters();

    // ========================================================================
    // 9. ACCORDION (FAQ LOGIC)
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
    // 10. FORM VALIDATION & MOCK SUBMISSION (Формы и Отзывы)
    // ========================================================================
    const initForms = () => {
        const forms = document.querySelectorAll('.js-form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                if(!submitBtn) return;
                
                const originalText = submitBtn.innerHTML;
                
                // Анимация загрузки
                submitBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; vertical-align: middle; margin-right: 8px;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Обробка...';
                submitBtn.style.opacity = '0.8';
                submitBtn.style.pointerEvents = 'none';

                // Имитация отправки (Ajax)
                setTimeout(() => {
                    submitBtn.innerHTML = '✓ Відправлено успішно';
                    submitBtn.style.backgroundColor = '#2ECC71';
                    submitBtn.style.borderColor = '#2ECC71';
                    submitBtn.style.color = '#fff';
                    
                    form.reset();
                    
                    // Сброс звездочек
                    const stars = form.querySelectorAll('input[name="rating"]');
                    if(stars) stars.forEach(star => star.checked = false);
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.style.color = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.pointerEvents = 'auto';
                        
                        // Если это форма в модалке - закрываем ее
                        if (form.id === 'modal-lead-form' && window.siteModal) {
                            window.siteModal.close();
                        }
                    }, 3000);
                }, 1500);
            });
        });
    };
    initForms();

    // ========================================================================
    // 11. SIMPLE MASKS (PHONE & DATE)
    // ========================================================================
    const initMasks = () => {
        // Телефон +38
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
                
                if(val.length === 0) formatted = '';
                else if (val.length <= 2 && e.inputType !== "deleteContentBackward") formatted = '+38 (';
                
                e.target.value = formatted;
            });
        });

        // Дата
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
    // 12. SMOOTH ANCHOR SCROLLING (Внутренние ссылки на странице)
    // ========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.includes('.html')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const header = document.querySelector('.js-header');
                const headerOffset = header ? header.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
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

        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
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