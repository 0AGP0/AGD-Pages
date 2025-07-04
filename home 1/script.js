// JavaScript dosyası 

// Değişen yazı animasyonu - Typewriter efekti
function initTypeWriter() {
    const changingTexts = ['Dil Okuluna', 'Üniversiteye', 'Kariyere'];
    let currentIndex = 0;
    let currentTextIndex = 0;
    let isDeleting = false;
    const changingTextElement = document.getElementById('changingText');
    
    if (!changingTextElement) {
        console.log('changingText element bulunamadı');
        return;
    }
    
    function typeWriter() {
        const currentText = changingTexts[currentIndex];
        
        if (isDeleting) {
            // Silme işlemi
            changingTextElement.textContent = currentText.substring(0, currentTextIndex - 1);
            currentTextIndex--;
        } else {
            // Yazma işlemi
            changingTextElement.textContent = currentText.substring(0, currentTextIndex + 1);
            currentTextIndex++;
        }
        
        // Yazma hızı
        let typeSpeed = isDeleting ? 80 : 120;
        
        // Silme işlemi bittiğinde
        if (!isDeleting && currentTextIndex === currentText.length) {
            typeSpeed = 1500; // 1.5 saniye bekle
            isDeleting = true;
        } else if (isDeleting && currentTextIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % changingTexts.length;
            typeSpeed = 300; // Yeni kelimeye geçmeden önce bekle
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Animasyonu başlat
    setTimeout(typeWriter, 1000);
}

// Yorum Slider Fonksiyonu
function initReviewsSlider() {
    let currentSlide = 0;
    const reviewsContainer = document.getElementById('reviewsContainer');
    const dots = document.querySelectorAll('.slider-dot');
    const totalSlides = 5;
    
    if (!reviewsContainer || dots.length === 0) {
        console.log('Reviews slider elementleri bulunamadı');
        return;
    }
    
    function showSlide(slideIndex) {
        const translateX = -slideIndex * 260; // 240px card width + 20px gap
        reviewsContainer.style.transform = `translateX(${translateX}px)`;
        
        // Aktif dot'u güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Dot click eventleri
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Otomatik slider
    setInterval(nextSlide, 4000);
}

// Video Slider Fonksiyonalitesi
document.addEventListener('DOMContentLoaded', function() {
    // Typewriter animasyonunu başlat
    initTypeWriter();
    
    // Reviews slider'ı başlat
    initReviewsSlider();
    const videosTrack = document.querySelector('.videos-track');
    const prevBtn = document.querySelector('.avprevbtn');
    const nextBtn = document.querySelector('.avnextbtn');
    const dots = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = 2; // 2 slide var (4 video, 2'şer 2'şer)
    
    function updateSlider() {
        const translateX = -currentSlide * 100;
        videosTrack.style.transform = `translateX(${translateX}%)`;
        
        // Dots güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Butonları güncelle
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Buton eventleri
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlider();
            }
        });
    }
    
    // Dot eventleri
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Otomatik slider kaldırıldı - sadece manuel kontrol
    
    // Ekip Slider Fonksiyonalitesi
    const teamTrack = document.querySelector('.team-slider-track');
    const prevTeamBtn = document.querySelector('.avprevteam');
    const nextTeamBtn = document.querySelector('.avnextteam');
    const teamDots = document.querySelectorAll('.team-dot');
    
    let currentTeamSlide = 0;
    const totalTeamSlides = 9; // 9 slide var (17 resim, 2'şer 2'şer)
    
    function updateTeamSlider() {
        const translateX = -currentTeamSlide * 100;
        teamTrack.style.transform = `translateX(${translateX}%)`;
        
        // Dots güncelle
        teamDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTeamSlide);
        });
        
        // Butonları güncelle
        prevTeamBtn.disabled = currentTeamSlide === 0;
        nextTeamBtn.disabled = currentTeamSlide === totalTeamSlides - 1;
    }
    
    // Buton eventleri
    if (prevTeamBtn) {
        prevTeamBtn.addEventListener('click', () => {
            if (currentTeamSlide > 0) {
                currentTeamSlide--;
                updateTeamSlider();
            }
        });
    }
    
    if (nextTeamBtn) {
        nextTeamBtn.addEventListener('click', () => {
            if (currentTeamSlide < totalTeamSlides - 1) {
                currentTeamSlide++;
                updateTeamSlider();
            }
        });
    }
    
    // Dot eventleri
    teamDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTeamSlide = index;
            updateTeamSlider();
        });
    });
    
    // Otomatik ekip slider
    setInterval(() => {
        currentTeamSlide = (currentTeamSlide + 1) % totalTeamSlides;
        updateTeamSlider();
    }, 4000);
    
    // FAQ Fonksiyonalitesi - Güçlü Override
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        if (faqItems.length === 0) {
            console.log('FAQ itemları bulunamadı');
            return;
        }
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon i');
            
            if (question && answer && icon) {
                // Click event'ini kaldır ve yeniden ekle
                question.removeEventListener('click', handleFAQClick);
                question.addEventListener('click', handleFAQClick);
                
                function handleFAQClick(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isActive = item.classList.contains('active');
                    
                    // Tüm FAQ itemlarını kapat
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.faq-icon i');
                        if (otherIcon) {
                            otherIcon.className = 'fas fa-plus';
                        }
                    });
                    
                    // Eğer tıklanan item aktif değilse aç
                    if (!isActive) {
                        item.classList.add('active');
                        icon.className = 'fas fa-minus';
                    }
                }
            }
        });
    }
    
    // FAQ'yu başlat
    initFAQ();
    
    // Form gönderimi
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Burada form verilerini işleyebilirsiniz
            console.log('Form verileri:', data);
            
            // Başarı mesajı göster
            alert('Form başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
            
            // Formu temizle
            form.reset();
        });
    }
    
    // Öğrenci Deneyimleri Slider Fonksiyonalitesi
    const experiencesTrack = document.querySelector('.experiences-track');
    const expPrevBtn = document.querySelector('.avexprevbtn');
    const expNextBtn = document.querySelector('.avexnextbtn');
    const expDots = document.querySelectorAll('.exp-dot');
    
    let currentExpSlide = 0;
    const totalExpSlides = 9; // 9 slide var (6 video + 3 öğrenci resmi)
    
    function updateExperiencesSlider() {
        // Smooth scroll ile kaydırma
        const itemWidth = experiencesTrack.querySelector('.experience-item').offsetWidth + 32; // 32px gap
        const scrollPosition = currentExpSlide * itemWidth;
        
        experiencesTrack.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Dots güncelle
        expDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentExpSlide);
        });
        
        // Butonları güncelle
        expPrevBtn.disabled = currentExpSlide === 0;
        expNextBtn.disabled = currentExpSlide >= totalExpSlides - 1;
    }
    
    // Buton eventleri
    if (expPrevBtn) {
        expPrevBtn.addEventListener('click', () => {
            if (currentExpSlide > 0) {
                currentExpSlide--;
                updateExperiencesSlider();
            }
        });
    }
    
    if (expNextBtn) {
        expNextBtn.addEventListener('click', () => {
            if (currentExpSlide < totalExpSlides - 1) {
                currentExpSlide++;
                updateExperiencesSlider();
            }
        });
    }
    
    // Dot eventleri
    expDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentExpSlide = index;
            updateExperiencesSlider();
        });
    });
    
    // Scroll eventi ile current slide'ı güncelle
    experiencesTrack.addEventListener('scroll', () => {
        const itemWidth = experiencesTrack.querySelector('.experience-item').offsetWidth + 32;
        const scrollLeft = experiencesTrack.scrollLeft;
        currentExpSlide = Math.round(scrollLeft / itemWidth);
        
        // Dots güncelle
        expDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentExpSlide);
        });
        
        // Butonları güncelle
        expPrevBtn.disabled = currentExpSlide === 0;
        expNextBtn.disabled = currentExpSlide >= totalExpSlides - 1;
    });
    
    // Video Modal Fonksiyonalitesi
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.querySelector('.close-modal');
    const playButtons = document.querySelectorAll('.play-button-overlay');
    
    // Play butonlarına click eventi ekle
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = button.getAttribute('data-video');
            modalVideo.src = videoSrc;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Scroll'u engelle
        });
    });
    
    // Modal'ı kapat
    closeModal.addEventListener('click', () => {
        videoModal.style.display = 'none';
        modalVideo.src = ''; // Video'yu durdur
        document.body.style.overflow = 'auto'; // Scroll'u geri aç
    });
    
    // Modal dışına tıklayınca kapat
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            modalVideo.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.style.display === 'block') {
            videoModal.style.display = 'none';
            modalVideo.src = '';
            document.body.style.overflow = 'auto';
        }
    });
});

 