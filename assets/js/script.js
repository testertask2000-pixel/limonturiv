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
    // 13. MOBILE BURGER MENU (БРОНЕБОЙНАЯ ВЕРСИЯ)
    // ========================================================================
    const initGlobalBurger = () => {
        const burger = document.querySelector('.js-burger') || document.querySelector('.burger');
        const nav = document.querySelector('.header__nav') || document.querySelector('.nav');

        if (burger && nav) {
            const newBurger = burger.cloneNode(true);
            burger.parentNode.replaceChild(newBurger, burger);

            newBurger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('is-active');
                nav.classList.toggle('is-active');
                
                if (nav.classList.contains('is-active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    newBurger.classList.remove('is-active');
                    nav.classList.remove('is-active');
                    document.body.style.overflow = '';
                });
            });
        }
    };
    
    initGlobalBurger();
    setTimeout(initGlobalBurger, 500);

}); 

// ========================================================================
    // ИНТЕГРАЦИЯ BINOTEL (Привязка желтой кнопки)
    // ========================================================================
    const initBinotelTrigger = () => {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.js-binotel-trigger');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                
                // Вызываем модальное окно Binotel через глобальные методы API
                if (typeof bingc !== 'undefined' && typeof bingc.showActive === 'function') {
                    bingc.showActive();
                } else if (window.bingcgetcall && typeof window.bingcgetcall.call === 'function') {
                    window.bingcgetcall.call();
                } else {
                    const binotelNative = document.querySelector('#bingc-phone-button, .bingc-phone-button');
                    if (binotelNative) binotelNative.click();
                }
            }
        }, true);
    };
    /* ==========================================================================
   УНИВЕРСАЛЬНЫЙ АВТОМАТИЧЕСКИЙ БИНОТЕЛЬ (ЖЕСТКИЙ ОБХОД ДЛЯ ВСЕХ СТРАНИЦ)
   ========================================================================== */
(function initGlobalBinotelIntegration() {
    // 1. Авто-подключение внешнего скрипта Binotel (если его нет в HTML)
    const BINOTEL_SCRIPT_URL = 'https://widgets.binotel.com/getcall/widgets/u9o8vbf0aiz3xdotcm2w.js';
    if (!document.querySelector(`script[src="${BINOTEL_SCRIPT_URL}"]`)) {
        const script = document.createElement('script');
        script.src = BINOTEL_SCRIPT_URL;
        script.async = true;
        document.head.appendChild(script);
    }

    // 2. Авто-создание плавающего виджета
    const createWidgetMarkup = () => {
        if (document.querySelector('.floating-widget')) return;

        const widgetHTML = `
            <div class="floating-widget" style="position: fixed; bottom: 25px; right: 25px; z-index: 999999; display: flex; flex-direction: column; gap: 12px;">
                <a href="https://t.me/+RaOD2fhct10TR5Jp" target="_blank" class="fw-btn fw-btn--tg" aria-label="Telegram" style="width: 60px; height: 60px; border-radius: 50%; background-color: #2AABEE; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.2); transition: transform 0.2s ease;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </a>
                <button type="button" class="fw-btn fw-btn--call js-binotel-force-trigger" aria-label="Заказать звонок" style="width: 60px; height: 60px; border-radius: 50%; background-color: #FFEC00; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.2); transition: transform 0.2s ease;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidgetMarkup);
    } else {
        createWidgetMarkup();
    }

    // 3. БРОНЕБОЙНАЯ ФУНКЦИЯ ОТКРЫТИЯ ОКНА БИНОТЕЛЯ
    function triggerBinotelOpen() {
        // Вариант 1: Через официальные глобальные объекты API Binotel
        if (window.bingcgetcall && typeof window.bingcgetcall.openWidget === 'function') {
            window.bingcgetcall.openWidget();
            return true;
        }
        if (window.bingcgetcall && typeof window.bingcgetcall.call === 'function') {
            window.bingcgetcall.call();
            return true;
        }
        if (window.bingc && typeof window.bingc.click === 'function') {
            window.bingc.click();
            return true;
        }

        // Вариант 2: Физический клик по скрытым кнопкам Binotel в DOM
        const targetSelectors = [
            '#bingc-phone-button',
            '.bingc-phone-button-icon',
            '.bingc-phone-button',
            '#bingc-passive-phone-form',
            '.bingc-passive-phone'
        ];

        for (let selector of targetSelectors) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                // Генерируем настоящее событие мыши на случай, если обычный .click() перехвачен
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                el.dispatchEvent(event);
                return true;
            }
        }

        // Вариант 3: Попытка принудительно отобразить скрытое окно Binotel
        const passiveForm = document.querySelector('#bingc-passive') || document.querySelector('.bingc-passive-phone-container');
        if (passiveForm) {
            passiveForm.style.display = 'block';
            passiveForm.style.opacity = '1';
            passiveForm.style.visibility = 'visible';
            return true;
        }

        return false;
    }

    // 4. Глобальный делегированный клик
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.js-binotel-force-trigger, .js-binotel-trigger, .bingc-action-open-passive-form, [data-binotel-call]');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();

            let success = triggerBinotelOpen();

            // Если Бинотель ещё загружается с сервера, делаем повторные попытки с интервалом
            if (!success) {
                let retries = 0;
                const interval = setInterval(() => {
                    retries++;
                    if (triggerBinotelOpen() || retries > 10) {
                        clearInterval(interval);
                    }
                }, 300);
            }
        }
    }, true);
})();
    initBinotelTrigger();
    /* ==========================================================================
   ГЛОБАЛЬНА ВІДПРАВКА ВСІХ ФОРМ ЧЕРЕЗ FORMSPREE
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // ЄДИНИЙ ключ для всього сайту
    const formspreeEndpoint = 'https://formspree.io/f/mnjkeezq'; 

    // Знаходимо всі форми на сайті, у яких є клас js-form
    const forms = document.querySelectorAll('form.js-form'); 
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Зупиняємо стандартну відправку (щоб сторінка не стрибала)

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Показуємо, що йде відправка
            submitBtn.innerText = 'Відправка...';
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Дякуємо! Ваша заявка успішно відправлена.');
                    form.reset(); // Очищуємо поля
                    
                    // Якщо форма була в модалці - автоматично закриваємо її
                    const modal = form.closest('.js-modal');
                    if(modal) {
                        modal.classList.remove('is-open');
                        document.body.classList.remove('modal-open-lock');
                    }
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert('Помилка: ' + data.errors.map(error => error.message).join(', '));
                        } else {
                            alert('Упс! Виникла помилка при відправці.');
                        }
                    })
                }
            })
            .catch(error => {
                alert('Помилка з\'єднання. Перевірте інтернет та спробуйте ще раз.');
            })
            .finally(() => {
                // Повертаємо кнопку в нормальний стан
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    });
});

/* ==========================================================================
   ПЕРЕХОД НА ГЛАВНУЮ ПРИ КЛИКЕ НА ЛОГО (ВЕРХ / НИЗ)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Находим верхний и нижний логотипы по их классам
    const logos = document.querySelectorAll('.header__logo, .footer__logo');
    
    logos.forEach(logo => {
        // Делаем так, чтобы при наведении на нижний логотип появлялся пальчик (как у ссылки)
        logo.style.cursor = 'pointer';
        
        logo.addEventListener('click', function(e) {
            e.preventDefault(); // Отменяем дефолтный переход, если это была кривая ссылка
            window.location.href = 'index.html'; // Жестко перенаправляем на главную
        });
    });
});