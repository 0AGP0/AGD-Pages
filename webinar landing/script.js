// DOM yüklendikten sonra çalışacak kodlar
document.addEventListener('DOMContentLoaded', function() {
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) document.body.classList.add('mobile-device');

    // Dokunmatik cihaz kontrolü
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    if (isTouchDevice) document.body.classList.add('touch-device');

    // AOS Animasyon kütüphanesini başlat
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: isMobile ? 800 : 1000,
            once: true,
            offset: isMobile ? 50 : 100,
            disable: window.innerWidth < 480
        });
    }

    // --- Webhook ile Form Gönderme Mekaniği ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor…';

            // Form verilerini al
            const data = {};
            new FormData(this).forEach((value, key) => data[key] = value);

            // UTM parametrelerini ekle (varsa)
            function getCookie(name) {
                const v = `; ${document.cookie}`;
                const parts = v.split(`; ${name}=`);
                return parts.length === 2 ? parts.pop().split(';').shift() : '';
            }
            ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']
                .forEach(p => data[p] = getCookie(p) || '');

            try {
                const response = await fetch('https://hook.eu2.make.com/bshsrihqhsr558q8xtlepnptkzf55kls', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(`HTTP status ${response.status}`);

                // Başarılıysa
                this.reset();
                document.getElementById('whatsappPopup')?.classList.add('active');
            } catch (error) {
                console.error('Form gönderim hatası:', error);
                alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gönder';
            }
        });
    }
    // --- /Webhook Form Gönderme ---

    // WhatsApp popup'ını kapatma fonksiyonu
    function closeWhatsappPopup() {
        const whatsappPopup = document.getElementById('whatsappPopup');
        whatsappPopup?.classList.remove('active');
    }
    document.getElementById('whatsappPopup')?.addEventListener('click', function(e) {
        if (e.target === this) closeWhatsappPopup();
    });

    // Menü düğmeleri
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const closeMenuButton = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenuIcon && mobileMenu) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeMenuButton) closeMenuButton.addEventListener('click', () => mobileMenu?.classList.remove('active'));

    // Scroll-down, Header scroll efekti, Animasyon kontrolleri, ESC engelleme vb. (Mevcut kodunuz devam eder)

    // --- Avantajlar Carousel Kontrolleri ---
    const advContainer = document.querySelector('.advantages-carousel.mobile-only');
    if (advContainer) {
        const track = advContainer.querySelector('.carousel-track');
        const cards = track.querySelectorAll('.carousel-card');
        const prevBtn = advContainer.querySelector('.carousel-prev');
        const nextBtn = advContainer.querySelector('.carousel-next');
        const dots = advContainer.querySelectorAll('.dot');
        let currentIndex = 0;

        function updateAdvantage(index) {
            if (index < 0) index = cards.length - 1;
            if (index >= cards.length) index = 0;
            const card = cards[index];
            track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            currentIndex = index;
        }

        prevBtn?.addEventListener('click', () => updateAdvantage(currentIndex - 1));
        nextBtn?.addEventListener('click', () => updateAdvantage(currentIndex + 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => updateAdvantage(i)));
    }
    // --- /Avantajlar Carousel ---
});

// Video Modal Yöneticisi (değişmedi)
const VideoModalManager = {
    modal: null,
    closeBtn: null,
    container: null,
    iframe: null,
    isInitialized: false,

    init() {
        this.modal = document.querySelector('.video-modal');
        this.closeBtn = document.querySelector('.close-modal');
        this.container = document.querySelector('.video-container');
        this.iframe = this.container?.querySelector('iframe');
        if (!this.modal || !this.closeBtn || !this.container || !this.iframe) return;
        this.attachEventListeners();
        this.isInitialized = true;
    },

    attachEventListeners() {
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', e => { if (e.target === this.modal) this.closeModal(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) this.closeModal();
        });
        document.querySelectorAll('[data-video]').forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const url = trigger.getAttribute('data-video');
                if (url) this.openModal(url);
            });
        });
    },

    openModal(url) {
        if (!this.isInitialized) this.init();
        if (this.iframe) {
            this.iframe.src = url;
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal() {
        this.iframe.src = '';
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => VideoModalManager.init());
