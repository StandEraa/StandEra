/* =========================================================
   StandEra — Main Script
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Navbar scroll state ---------------- */
  var navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');

      document.querySelectorAll('.nav-link').forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  /* ---------------- Highlight active nav link on scroll ---------------- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  function highlightNav() {
    var scrollPos = window.scrollY + 140;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------------- Hero image slider ---------------- */
  var slides = document.querySelectorAll('.hero-slider .slide');
  var dotsContainer = document.getElementById('sliderDots');
  var currentSlide = 0;
  var slideTimer;
  var SLIDE_INTERVAL = 5500;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', function () { goToSlide(i); resetTimer(); });
    dotsContainer.appendChild(dot);
  });
  var dots = dotsContainer.querySelectorAll('.dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  document.getElementById('nextSlide').addEventListener('click', function () { nextSlide(); resetTimer(); });
  document.getElementById('prevSlide').addEventListener('click', function () { prevSlide(); resetTimer(); });

  resetTimer();

  /* ---------------- Scroll reveal animations ---------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 90;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------------- FAQ accordion (only one open at a time) ---------------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('active');

      /* Close every item first */
      faqItems.forEach(function (other) {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      /* Re-open the clicked one only if it was previously closed */
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* Keep the open FAQ answer sized correctly if the viewport is resized */
  window.addEventListener('resize', function () {
    var activeItem = document.querySelector('.faq-item.active');
    if (activeItem) {
      var openAnswer = activeItem.querySelector('.faq-answer');
      openAnswer.style.maxHeight = openAnswer.scrollHeight + 'px';
    }
  });

  /* ---------------- Registration form ---------------- */
  var BACKEND_URL = 'https://script.google.com/macros/s/AKfycbxOXjU22nDsrplxEFHBmi-hN-h6EfM-kRn2Ee01BOBft7fQ6DTiAqBJ7kUMRiRDAqhPPw/exec';
  var REGISTERED_FLAG = 'standeraRegistered';

  var regForm = document.getElementById('registrationForm');

  if (regForm) {
    var regSuccessBox = document.getElementById('regSuccess');
    var regErrorBox = document.getElementById('regError');
    var regSubmitBtn = document.getElementById('regSubmitBtn');
    var regSpinner = document.getElementById('regSpinner');
    var regSubmitText = document.getElementById('regSubmitText');

    function regShowSuccess(message) {
      regForm.hidden = true;
      regSuccessBox.textContent = message;
      regSuccessBox.hidden = false;
    }

    function regShowError(message) {
      regErrorBox.textContent = message;
      regErrorBox.hidden = false;
    }

    function regHideError() {
      regErrorBox.hidden = true;
      regErrorBox.textContent = '';
    }

    function regSetLoading(isLoading) {
      regSubmitBtn.disabled = isLoading;
      regSpinner.hidden = !isLoading;
      regSubmitText.textContent = isLoading ? 'Submitting...' : 'Apply Now';
    }

    /* If this browser already registered successfully, keep the form hidden */
    try {
      if (localStorage.getItem(REGISTERED_FLAG) === 'true') {
        regShowSuccess("🎉 You're already registered with StandEra. We'll be in touch soon!");
      }
    } catch (storageErr) {
      /* localStorage unavailable (e.g. private browsing) — fail silently and show the form */
    }

    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      regHideError();
      regSetLoading(true);

  var payload = {
    name: regForm.fullName.value.trim(),
    email: regForm.email.value.trim(),
    phone: regForm.phone.value.trim(),
    education: regForm.education.value,
    college: regForm.institute.value.trim(),
    interest: regForm.interest.value.trim(),
    reason: regForm.reason.value.trim()
};

      fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response.text().then(function (rawText) {
            return { ok: response.ok, raw: rawText };
          });
        })
        .then(function (result) {
          var data = null;
          try { data = JSON.parse(result.raw); } catch (parseErr) { data = null; }

          var message = (data && (data.message || data.error || data.result))
            ? String(data.message || data.error || data.result)
            : result.raw;

          var isDuplicate = /already registered/i.test(message);
          var isSuccess = !isDuplicate && (
            (data && (data.status === 'success' || data.success === true)) ||
            /success/i.test(message)
          );

          if (isDuplicate) {
            regShowError(message);
          } else if (isSuccess) {
            regShowSuccess('🎉 Registration Successful! Please check your email.');
            try { localStorage.setItem(REGISTERED_FLAG, 'true'); } catch (storageErr) { /* ignore */ }
          } else {
            regShowError(message || 'Something went wrong. Please try again.');
          }
        })
        .catch(function () {
          regShowError('Unable to reach the server. Please check your connection and try again.');
        })
        .finally(function () {
          regSetLoading(false);
        });
    });
  }

});
