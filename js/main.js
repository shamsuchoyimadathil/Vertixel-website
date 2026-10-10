/* ============================================================
   Vertixel IT Solutions — Main JS (v2)
   ============================================================ */

(function () {
  'use strict';

  // --- Scroll-based nav background ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  function closeMenu() {
    toggle?.classList.remove('open');
    navLinks?.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle?.classList.add('open');
    navLinks?.classList.add('open');
    overlay?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  toggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- On-scroll reveal ---
  const fadeEls = document.querySelectorAll('.fade-up');

  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- Contact form → WhatsApp ---
  // Builds the message from the form and opens WhatsApp (app or web) with it
  // pre-filled. Nothing is sent to any server; the visitor taps send themselves.
  const form = document.getElementById('contact-form');
  const successMsg = document.querySelector('.form-success');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = (name) => (form.elements[name]?.value || '').trim();
    const subjectEl = form.elements.subject;
    const topic = subjectEl && subjectEl.selectedIndex > 0
      ? subjectEl.options[subjectEl.selectedIndex].text
      : 'General enquiry';

    const text = [
      'Hi Vertixel! I\'m reaching out from your website.',
      '',
      '*Name:* ' + value('name'),
      '*Email:* ' + value('email'),
      '*Topic:* ' + topic,
      '',
      '*Message:*',
      value('message')
    ].join('\n');

    const url = 'https://wa.me/' + form.dataset.whatsapp + '?text=' + encodeURIComponent(text);

    // Open in a new tab; fall back to the same tab if a popup blocker stops it.
    // ('noopener' isn't passed as a feature because it makes window.open return null.)
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;

    form.reset();
    if (successMsg) {
      successMsg.classList.add('show');
      setTimeout(() => successMsg.classList.remove('show'), 10000);
    }
  });

  // --- Scroll Spy for nav active state ---
  const allNavLinks = navLinks?.querySelectorAll('a:not(.btn)');
  const sections = document.querySelectorAll('section[id]');

  // Determine current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === 'index.html' || currentPage === '';

  function clearActiveLinks() {
    allNavLinks?.forEach(link => link.classList.remove('active'));
  }

  function setActiveByHref(href) {
    allNavLinks?.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === href) {
        link.classList.add('active');
      }
    });
  }

  if (isHomePage && sections.length) {
    // On home page: use scroll spy for hash sections
    const NAV_HEIGHT = 80;

    function updateScrollSpy() {
      const scrollY = window.scrollY + NAV_HEIGHT + 20;
      let activeId = null;

      // Walk sections top-to-bottom, find the one we're inside
      sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          activeId = section.getAttribute('id');
        }
      });

      clearActiveLinks();

      if (activeId) {
        // Try to match #id link
        allNavLinks?.forEach(link => {
          const href = link.getAttribute('href');
          // A section can also be represented by its own page (e.g. #about → about.html)
          if (href === '#' + activeId || href === 'index.html#' + activeId || href === activeId + '.html') {
            link.classList.add('active');
          }
        });
      }

      // If nothing matched (we're at the very top, in the hero), highlight Home
      const anyActive = navLinks?.querySelector('a.active:not(.btn)');
      if (!anyActive) {
        setActiveByHref('index.html');
      }
    }

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();

  } else {
    // On other pages: set active based on page file name
    clearActiveLinks();
    allNavLinks?.forEach(link => {
      const href = link.getAttribute('href')?.split('#')[0] || '';
      const linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  }

})();
