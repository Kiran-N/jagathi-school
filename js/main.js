/* ============================================================
   JAGATHI INTERNATIONAL SCHOOL — MAIN JS
   ============================================================ */

/* ── AOS (Animate on Scroll) ── */
AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 70 });

/* ── Preloader ── */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  setTimeout(() => pre.classList.add('hidden'), 700);
});

/* ── Navbar scroll effect ── */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backTop.classList.toggle('visible', y > 400);
  highlightNav();
});

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const spans     = hamburger.querySelectorAll('span');

hamburger.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

document.querySelectorAll('.nav-list a, .nav-cta').forEach(el => {
  el.addEventListener('click', () => {
    navMenu.classList.remove('open');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list a');

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ── Animated counters ── */
function runCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let val = 0;
  const t = setInterval(() => {
    val += step;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = Math.floor(val);
  }, 16);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) runCounter(e.target); });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => io.observe(el));

/* ── Gallery Lightbox ── */
const gallery = [
  { src: 'images/hero-school.jpg',            cap: 'School Campus' },
  { src: 'images/activity-cooking.jpg',        cap: 'Culinary Arts Program' },
  { src: 'images/activity-sports.jpg',         cap: 'Sports Day' },
  { src: 'images/activity-cooking-display.jpg',cap: 'No-Fire Cooking Display' },
  { src: 'images/activity-event.jpg',          cap: 'Annual School Event' },
];
let lbIdx = 0;

function openLightbox(i) {
  lbIdx = i;
  document.getElementById('lbImg').src       = gallery[i].src;
  document.getElementById('lbCaption').textContent = gallery[i].cap;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function shiftLightbox(dir) {
  lbIdx = (lbIdx + dir + gallery.length) % gallery.length;
  document.getElementById('lbImg').src       = gallery[lbIdx].src;
  document.getElementById('lbCaption').textContent = gallery[lbIdx].cap;
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   shiftLightbox(-1);
  if (e.key === 'ArrowRight')  shiftLightbox(1);
});

/* Make lightbox functions global (called from onclick) */
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;
window.shiftLightbox = shiftLightbox;

/* ── Contact form ── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg   = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    /* If Formspree ID is still placeholder, just show a call-to-action */
    if (form.action.includes('YOUR_FORM_ID')) {
      showMsg('Please call us at +91 95815 03555 or set up Formspree to enable email enquiries.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        showMsg('Thank you! We will contact you shortly. 🙏', 'success');
        form.reset();
      } else {
        throw new Error();
      }
    } catch {
      showMsg('Something went wrong. Please call us directly at +91 95815 03555', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
    }
  });
}

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className   = 'form-msg ' + type;
  formMsg.hidden      = false;
  setTimeout(() => { formMsg.hidden = true; }, 7000);
}

/* ── Smooth section scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
