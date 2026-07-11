/* ============================================================
   Mistrz Łazienek — main.js
   Меню, анимации, слайдер до/после, FAQ, счётчики, форма
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    var gaMeasurementIdMeta = document.querySelector('meta[name="ga4-measurement-id"]');
    var gaMeasurementId = gaMeasurementIdMeta ? gaMeasurementIdMeta.getAttribute('content') : '';
    var googleAdsConversionIdMeta = document.querySelector('meta[name="google-ads-conversion-id"]');
    var googleAdsConversionId = googleAdsConversionIdMeta ? googleAdsConversionIdMeta.getAttribute('content') : '';
    var googleAdsLeadConversionLabelMeta = document.querySelector('meta[name="google-ads-lead-conversion-label"]');
    var googleAdsLeadConversionLabel = googleAdsLeadConversionLabelMeta ? googleAdsLeadConversionLabelMeta.getAttribute('content') : '';
    var googleAdsLeadConversionValueMeta = document.querySelector('meta[name="google-ads-lead-conversion-value"]');
    var googleAdsLeadConversionValue = googleAdsLeadConversionValueMeta ? googleAdsLeadConversionValueMeta.getAttribute('content') : '';
    var googleAdsLeadConversionCurrencyMeta = document.querySelector('meta[name="google-ads-lead-conversion-currency"]');
    var googleAdsLeadConversionCurrency = googleAdsLeadConversionCurrencyMeta ? googleAdsLeadConversionCurrencyMeta.getAttribute('content') : '';

    function initAnalytics() {
        if ((!gaMeasurementId && !googleAdsConversionId) || window.gtag) return;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        if (gaMeasurementId) {
            window.gtag('config', gaMeasurementId);
        }
        if (googleAdsConversionId) {
            window.gtag('config', googleAdsConversionId);
        }

        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaMeasurementId || googleAdsConversionId);
        document.head.appendChild(script);
    }

    function trackEvent(name, params) {
        if (!gaMeasurementId && !googleAdsConversionId) return;
        initAnalytics();
        window.gtag('event', name, params || {});
    }

    function getAnalyticsLabel(el) {
        var explicitLabel = el.getAttribute('data-analytics-label');
        if (explicitLabel) return explicitLabel;
        return (el.textContent || '').replace(/\s+/g, ' ').trim();
    }

    initAnalytics();

    /* ----- Шапка: тень при скролле ----- */
    var header = document.getElementById('siteHeader');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 12);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ----- Мобильное меню ----- */
    var menuToggle = document.getElementById('menuToggle');
    var nav = document.getElementById('nav');
    if (menuToggle && nav) {
        function closeMenu() {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            nav.classList.remove('open');
            document.body.classList.remove('menu-open');
        }

        function openMenu() {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            nav.classList.add('open');
            document.body.classList.add('menu-open');
        }

        menuToggle.addEventListener('click', function () {
            if (nav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    /* ----- Анимации при скролле ----- */
    var animated = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
        animated.forEach(function (el) { observer.observe(el); });
    } else {
        animated.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ----- Слайдер «до / после» ----- */
    (function () {
        var ba = document.getElementById('heroBa');
        if (!ba) return;
        var before = document.getElementById('heroBaBefore');
        var handle = document.getElementById('heroBaHandle');
        var range = document.getElementById('heroBaRange');
        if (!before || !handle || !range) return;

        function set(v) {
            v = Math.max(0, Math.min(100, v));
            before.style.clipPath = 'inset(0 0 0 ' + v + '%)';
            handle.style.left = v + '%';
        }
        range.addEventListener('input', function () { set(parseFloat(this.value)); });
        set(parseFloat(range.value));
    })();

    /* ----- FAQ-аккордеон ----- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var q = item.querySelector('.faq-q');
        var a = item.querySelector('.faq-a');
        if (!q || !a) return;
        q.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            // Закрыть остальные
            document.querySelectorAll('.faq-item.open').forEach(function (other) {
                if (other !== item) {
                    other.classList.remove('open');
                    var oa = other.querySelector('.faq-a');
                    if (oa) oa.style.maxHeight = null;
                }
            });
            if (isOpen) {
                item.classList.remove('open');
                a.style.maxHeight = null;
            } else {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
            }
        });
    });

    /* ----- Счётчики статистики ----- */
    (function () {
        var nums = document.querySelectorAll('.stat-val[data-count]');
        if (!nums.length) return;
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function animate(el) {
            var target = parseFloat(el.getAttribute('data-count'));
            var prefix = el.getAttribute('data-prefix') || '';
            var suffix = el.getAttribute('data-suffix') || '';
            if (reduce || isNaN(target)) { el.textContent = prefix + target + suffix; return; }
            var dur = 1200, start = null;
            function step(ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                var val = Math.round(target * eased);
                el.textContent = prefix + val + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
                });
            }, { threshold: 0.4 });
            nums.forEach(function (el) { obs.observe(el); });
        } else {
            nums.forEach(animate);
        }
    })();

    /* ----- Переключатель города ----- */
    var cityToggle = document.querySelector('.city-switch-toggle');
    if (cityToggle) {
        cityToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            this.parentElement.classList.toggle('open');
        });
        document.addEventListener('click', function () {
            var open = document.querySelector('.city-switch.open');
            if (open) open.classList.remove('open');
        });
    }

    /* ----- Обфускация email ----- */
    (function () {
        var user = 'kontakt';
        var domain = 'mistrzlazienek.pl';
        var addr = user + '@' + domain;
        document.querySelectorAll('.email-obfuscated').forEach(function (el) {
            el.innerHTML = '<a href="mailto:' + addr + '">' + addr + '</a>';
        });
        document.querySelectorAll('.email-obfuscated-text').forEach(function (el) {
            el.textContent = addr;
        });
    })();

    /* ----- Аналитика: клики по телефону и CTA ----- */
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
            trackEvent('click_phone', {
                phone_number: (link.getAttribute('href') || '').replace(/^tel:/, ''),
                link_text: getAnalyticsLabel(link),
                page_location: window.location.pathname
            });
        });
    });

    document.querySelectorAll('[data-analytics-event]').forEach(function (el) {
        el.addEventListener('click', function () {
            trackEvent(el.getAttribute('data-analytics-event'), {
                cta_label: getAnalyticsLabel(el),
                page_location: window.location.pathname
            });
        });
    });

    /* ----- Контактная форма (отправка заявки через Forminit) ----- */
    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');
    var formError = document.getElementById('formError');
    if (contactForm) {
        var formStarted = false;
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var labelSubmit = contactForm.getAttribute('data-submit') || 'Отправить';
        var labelSending = contactForm.getAttribute('data-sending') || 'Отправляем…';

        function trackFormStart() {
            if (formStarted) return;
            formStarted = true;
            trackEvent('form_start', {
                form_id: contactForm.id || 'contactForm',
                page_location: window.location.pathname
            });
        }

        contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('focus', trackFormStart, { once: true });
            field.addEventListener('input', trackFormStart, { once: true });
            field.addEventListener('change', trackFormStart, { once: true });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Honeypot: бот заполнит скрытое поле — тихо игнорируем.
            var honeypot = document.getElementById('website');
            if (honeypot && honeypot.value) return;

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (formError) formError.classList.remove('visible');
            if (formSuccess) formSuccess.classList.remove('visible');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = labelSending; }

            var formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                redirect: 'manual'
            })
                .then(function (res) {
                    var redirected = res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400);
                    if (!res.ok && !redirected) throw new Error('Bad status ' + res.status);
                    return res.text();
                })
                .then(function () {
                    contactForm.reset();
                    formStarted = false;
                    trackEvent('form_submit', {
                        form_id: contactForm.id || 'contactForm',
                        page_location: window.location.pathname
                    });
                    trackEvent('generate_lead', {
                        form_id: contactForm.id || 'contactForm',
                        event_category: 'lead',
                        event_label: 'contact_form',
                        page_location: window.location.pathname
                    });
                    if (googleAdsConversionId && googleAdsLeadConversionLabel) {
                        trackEvent('conversion', {
                            send_to: googleAdsConversionId + '/' + googleAdsLeadConversionLabel,
                            value: parseFloat(googleAdsLeadConversionValue || '1') || 1,
                            currency: googleAdsLeadConversionCurrency || 'PLN'
                        });
                    }
                    if (formSuccess) {
                        formSuccess.classList.add('visible');
                        setTimeout(function () { formSuccess.classList.remove('visible'); }, 8000);
                    }
                })
                .catch(function () {
                    if (formError) formError.classList.add('visible');
                })
                .then(function () {
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = labelSubmit; }
                });
        });
    }

    /* ----- Галерея объектов ----- */
    (function () {
        var lightbox = document.getElementById('workLightbox');
        if (!lightbox) return;

        var title = document.getElementById('workLightboxTitle');
        var counter = document.getElementById('workLightboxCounter');
        var image = document.getElementById('workLightboxImage');
        var panel = lightbox.querySelector('.work-lightbox-panel');
        var prev = lightbox.querySelector('[data-lightbox-prev]');
        var next = lightbox.querySelector('[data-lightbox-next]');
        var closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
        var photos = [];
        var current = 0;
        var lastTrigger = null;

        function getFocusableElements() {
            if (!panel) return [];
            return Array.prototype.slice.call(panel.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ));
        }

        function render() {
            if (!photos.length || !image) return;
            image.src = photos[current];
            image.alt = (title ? title.textContent : 'Фото объекта') + ' — ' + (current + 1);
            if (counter) counter.textContent = (current + 1) + ' / ' + photos.length;
        }

        function move(delta) {
            if (!photos.length) return;
            current = (current + delta + photos.length) % photos.length;
            render();
        }

        function close() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-lock');
            if (image) image.removeAttribute('src');
            if (lastTrigger && typeof lastTrigger.focus === 'function') {
                lastTrigger.focus();
            }
        }

        document.querySelectorAll('.gallery-project[data-gallery-images]').forEach(function (card) {
            card.addEventListener('click', function () {
                lastTrigger = card;
                photos = (card.getAttribute('data-gallery-images') || '')
                    .split(',')
                    .map(function (src) { return src.trim(); })
                    .filter(Boolean);
                if (!photos.length) return;
                current = 0;
                if (title) title.textContent = card.getAttribute('data-gallery-title') || '';
                lightbox.classList.add('open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.classList.add('lightbox-lock');
                render();
                if (panel) panel.focus();
            });
        });

        if (prev) prev.addEventListener('click', function () { move(-1); });
        if (next) next.addEventListener('click', function () { move(1); });
        closeButtons.forEach(function (button) { button.addEventListener('click', close); });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') move(-1);
            if (e.key === 'ArrowRight') move(1);
            if (e.key === 'Tab') {
                var focusable = getFocusableElements();
                if (!focusable.length) return;
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    })();

    /* ----- Карусель архива на странице работ ----- */
    document.querySelectorAll('[data-archive-carousel]').forEach(function (carousel) {
        var viewport = carousel.querySelector('[data-archive-viewport]');
        var prev = carousel.querySelector('[data-archive-prev]');
        var next = carousel.querySelector('[data-archive-next]');
        if (!viewport || !prev || !next) return;

        function updateControls() {
            var maxScroll = viewport.scrollWidth - viewport.clientWidth;
            prev.disabled = viewport.scrollLeft <= 2;
            next.disabled = viewport.scrollLeft >= maxScroll - 2;
        }

        function pageWidth() {
            return viewport.clientWidth;
        }

        prev.addEventListener('click', function () {
            viewport.scrollBy({ left: -pageWidth(), behavior: 'smooth' });
        });

        next.addEventListener('click', function () {
            viewport.scrollBy({ left: pageWidth(), behavior: 'smooth' });
        });

        viewport.addEventListener('scroll', updateControls, { passive: true });
        window.addEventListener('resize', updateControls);
        updateControls();
    });

    /* ----- Плавный скролл к якорям ----- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            if (!/^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(targetId)) return;
            var target = document.getElementById(targetId.substring(1));
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 70;
                var pos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    /* ----- Активная ссылка навигации ----- */
    (function () {
        var currentPath = window.location.pathname;
        var navLinks = document.querySelectorAll('.nav a:not(.lang-toggle-mobile), .footer-links a');
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href || href.indexOf('#') === 0) return;
            var linkPath = new URL(href, window.location.origin).pathname;
            var isActive = currentPath === linkPath
                || (currentPath === '/' && linkPath === '/index.html')
                || (currentPath === '/index.html' && linkPath === '/')
                || (currentPath.endsWith('/') && linkPath === currentPath + 'index.html');
            if (isActive) link.classList.add('active');
        });
    })();

    /* ----- Языковой селектор (3+ языков) ----- */
    var langSelector = document.querySelector('.lang-selector-toggle');
    if (langSelector) {
        langSelector.addEventListener('click', function (e) {
            e.stopPropagation();
            var parent = this.parentElement;
            var isOpen = parent.classList.contains('open');
            parent.classList.toggle('open');
            this.setAttribute('aria-expanded', !isOpen);
        });
        document.addEventListener('click', function () {
            var openSel = document.querySelector('.lang-selector.open');
            if (openSel) {
                openSel.classList.remove('open');
                openSel.querySelector('.lang-selector-toggle').setAttribute('aria-expanded', 'false');
            }
        });
    }

});
