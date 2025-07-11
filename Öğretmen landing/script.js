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

// DOM yüklendikten sonra çalışacak kodlar
document.addEventListener('DOMContentLoaded', function() {
    // Typewriter animasyonunu başlat
    initTypeWriter();
    
    // Mobil cihaz kontrolü
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Dokunmatik cihaz kontrolü
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
    
    // AOS Animasyon kütüphanesini başlat
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: isMobile ? 800 : 1000,
            once: true,
            offset: isMobile ? 50 : 100,
            disable: window.innerWidth < 480
        });
    }
    
    // Menü düğmeleri
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const closeMenuButton = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu li a');
    
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Mobil menü linklerine tıklandığında menüyü kapat
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
                });
    });
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Header scroll efekti
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll-down düğmesi
    const scrollDownButton = document.querySelector('.scroll-down');
    if (scrollDownButton) {
        scrollDownButton.addEventListener('click', function() {
            const formSection = document.querySelector('.form-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Animasyon sınıflarını eklemek için
    const animateElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
    
    // Intersection Observer ile görünürlüğü kontrol et
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Form doğrulama
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = contactForm.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    showError(input, 'Bu alan zorunludur');
                } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Geçerli bir e-posta adresi giriniz');
                } else {
                    clearError(input);
                }
            });
            
            if (isValid) {
                // Form verilerini al
                const formData = new FormData(contactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                // URL'deki UTM parametrelerini yakala ve formObject'e ekle (ÇEREZDEN OKUYACAK ŞEKİLDE GÜNCELLENDİ)
                // const urlParams = new URLSearchParams(window.location.search);
                const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                utmParams.forEach(param => {
                    // formObject[param] = urlParams.get(param) || ''; // Eski URL okuma kodu
                    formObject[param] = getCookie(param) || ''; // Çerezden oku, yoksa boş string ata
                });

                // Butonu devre dışı bırak ve yükleniyor durumunu göster
                const submitButton = contactForm.querySelector('.form-submit-btn');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

                // Webhook'a gönder
                fetch('https://hook.eu2.make.com/k1dkxp5mtefzotojaobz12sa7enkl7al', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                })
                .then(response => {
                    if (!response.ok) {
                        // Sunucu tarafında bir hata olursa
                        throw new Error('Webhook gönderimi başarısız oldu.');
                    }
                    return response.text(); // Veya response.json() eğer webhook JSON dönerse
                })
                .then(data => {
                    console.log('Webhook yanıtı:', data);
                    // Butonu tekrar aktif et ve metni eski haline getir
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Formu Gönder <i class="fas fa-paper-plane"></i>';
                    // Başarılı gönderimden sonra popup göster
                    showSuccessPopup();
                    // Form alanlarını temizle
                    clearForm(contactForm);
                })
                .catch(error => {
                    console.error('Form gönderim hatası:', error);
                    // Hata mesajı göster (opsiyonel)
                    showError(submitButton, 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
                    // Butonu tekrar aktif et
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Formu Gönder <i class="fas fa-paper-plane"></i>';
                });
            }
        });
        
        // Her input değiştiğinde hata mesajlarını temizle
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(input);
            });
        });
    }
    
    // Hero form doğrulama ve webhook gönderimi
    const heroForm = document.querySelector('.hero-right .contact-form form');
    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = heroForm.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    showError(input, 'Bu alan zorunludur');
                } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Geçerli bir e-posta adresi giriniz');
                } else {
                    clearError(input);
                }
            });
            
            if (isValid) {
                // Form verilerini al
                const formData = new FormData(heroForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                // UTM parametrelerini çerezden oku ve ekle
                const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                utmParams.forEach(param => {
                    formObject[param] = getCookie(param) || '';
                });

                // Butonu devre dışı bırak ve yükleniyor durumunu göster
                const submitButton = heroForm.querySelector('.avsubmitbtn');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

                // Webhook'a gönder
                fetch('https://hook.eu2.make.com/k1dkxp5mtefzotojaobz12sa7enkl7al', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Webhook gönderimi başarısız oldu.');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Hero form webhook yanıtı:', data);
                    // Butonu tekrar aktif et ve metni eski haline getir
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Hemen Başvur</span><i class="fas fa-paper-plane" style="margin-left: 10px;"></i>';
                    // Başarılı gönderimden sonra popup göster
                    showSuccessPopup();
                    // Form alanlarını temizle
                    clearForm(heroForm);
                })
                .catch(error => {
                    console.error('Hero form gönderim hatası:', error);
                    showError(submitButton, 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Hemen Başvur</span><i class="fas fa-paper-plane" style="margin-left: 10px;"></i>';
                });
            }
        });
        
        // Her input değiştiğinde hata mesajlarını temizle
        const formInputs = heroForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(input);
            });
        });
    }
    
    // Form için yardımcı fonksiyonlar
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Form alanlarını temizleme fonksiyonu
    function clearForm(form) {
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
            clearError(input);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Çerezden değer okumak için yardımcı fonksiyon
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    // Hero bölümü için gecikmeli animasyon
    setTimeout(() => {
        const fadeRight = document.querySelector('.animate-fade-right');
        const fadeUp = document.querySelector('.animate-fade-up');
        const fadeLeft = document.querySelector('.animate-fade-left');
        
        if (fadeRight) fadeRight.style.animation = 'fadeInRight 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        
        setTimeout(() => {
            if (fadeUp) fadeUp.style.animation = 'fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            
            setTimeout(() => {
                if (fadeLeft) fadeLeft.style.animation = 'fadeInLeft 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }, 300);
        }, 300);
    }, 300);
    
    // Highlight animasyonu
    const highlight = document.querySelector('.highlight');
    
    if (highlight) {
        highlight.style.transition = 'color 0.5s ease';
        
        setInterval(() => {
            highlight.style.color = '#ff8a00';
            setTimeout(() => {
                highlight.style.color = '#ffc105';
            }, 1000);
        }, 2000);
    }
    
    // CTA butonlarına hover efekti
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.querySelector('i').style.transform = 'translateX(5px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.querySelector('i').style.transform = '';
        });
    });
    
    // Contact butonuna hover efekti
    const contactButton = document.querySelector('.btn-contact');
    if (contactButton) {
        contactButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.querySelector('i').style.transform = 'translateX(5px)';
        });
        
        contactButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.querySelector('i').style.transform = '';
        });
    }
    
    // Dünya haritasında noktaların hareketli efekti
    const mapDots = document.querySelectorAll('.map-dot');
    mapDots.forEach((dot, index) => {
        dot.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Sayfa yüklendiğinde fade-in animasyonu
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Anchor link scroll animasyonu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Video modal işlevselliği
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoIframe = document.querySelector('.video-container iframe');
    
    videoThumbnails.forEach((thumbnail, index) => {
        const video = thumbnail.querySelector('video');
        if (!video) return;
        
        thumbnail.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Modal içindeki videoyu ayarla
            if (modalVideo && videoModal) {
                // Modal hazırlama
                videoModal.querySelector('.video-container').classList.remove('video-error');
                
                // Temiz başlangıç için önce video kaynağını temizleyip sonra yeni kaynağı atayalım
                modalVideo.pause();
                
                // Videoyu sıfırlama ve yeniden yükleme
                const videoSource = document.getElementById('video-source');
                if (videoSource) {
                    videoSource.src = video.src;
                    modalVideo.load();
                } else {
                    modalVideo.src = video.src;
                }
                
                // Modal'ı göster
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Video sesi açık ve tam ekran oynat
                modalVideo.muted = false;
                modalVideo.controls = true;
                
                // Video yüklendiğinde oynat
                modalVideo.addEventListener('loadeddata', function onceLoaded() {
                    modalVideo.play().catch(e => {
                        console.log('Modal video oynatma hatası:', e);
                        videoModal.querySelector('.video-container').classList.add('video-error');
                    });
                    modalVideo.removeEventListener('loadeddata', onceLoaded);
                });
                
                // Video hata verdiğinde
                modalVideo.addEventListener('error', function(e) {
                    console.error('Video yüklenirken hata:', e);
                    videoModal.querySelector('.video-container').classList.add('video-error');
                });
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            closeVideoModal();
        });
    }
    
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
    });
    
    function closeVideoModal() {
        const videoModal = document.querySelector('.video-modal');
        const modalVideo = document.getElementById('modal-video');
        
        if (videoModal && modalVideo) {
            cleanupAndCloseModal(videoModal, modalVideo);
        } else {
            // Eski versiyonla uyumluluk için
            console.warn('VideoModal kapatılırken eski yöntem kullanıldı');
            
            if (videoModal) {
                videoModal.classList.remove('active');
                videoModal.style.display = 'none';
            }
            
            if (modalVideo) {
                try {
                    modalVideo.pause();
                    modalVideo.src = '';
                    modalVideo.load();
                } catch (e) {}
            }
            
            document.body.style.overflow = '';
        }
    }
    
    // Hizmet Kartları Carousel İyileştirmesi
    const servicesCarousel = document.querySelector('.services-carousel');
    if (servicesCarousel) {
        const servicesScrollIndicator = servicesCarousel.parentElement.querySelector('.mobile-scroll-indicator');
            
        // Başlangıçta carousel sınıfı ekle
        servicesCarousel.classList.add('unscrolled');
        
        const handleScroll = function() {
            if (this.scrollLeft > 20) {
                this.classList.remove('unscrolled');
                if (servicesScrollIndicator) {
                    servicesScrollIndicator.style.opacity = '0';
                    setTimeout(() => {
                        servicesScrollIndicator.style.display = 'none';
                    }, 300);
                }
                 // Tek seferlik olay dinleyiciyi kaldır
                 this.removeEventListener('scroll', handleScroll);
                 this.removeEventListener('touchstart', handleTouchStart);
            }
            };
            
         const handleTouchStart = function() {
            this.classList.remove('unscrolled');
            if (servicesScrollIndicator) {
                servicesScrollIndicator.style.opacity = '0';
                setTimeout(() => {
                    servicesScrollIndicator.style.display = 'none';
                }, 300);
            }
            // Tek seferlik olay dinleyiciyi kaldır
            this.removeEventListener('scroll', handleScroll);
            this.removeEventListener('touchstart', handleTouchStart);
        };

        // Scroll ve touchstart olaylarını kontrol et
        servicesCarousel.addEventListener('scroll', handleScroll);
        servicesCarousel.addEventListener('touchstart', handleTouchStart);
        
        // Dokunmatik kaydırma kontrolü (Mousedown vb. kısmı zaten vardı, onu olduğu gibi bırakabiliriz veya bu yeni yapıya entegre edebiliriz. Şimdilik ayrı tutalım.)
        let isDownServices = false;
        let startXServices;
        let scrollLeftServices;
        
        servicesCarousel.addEventListener('mousedown', (e) => {
            isDownServices = true;
            servicesCarousel.style.cursor = 'grabbing';
            startXServices = e.pageX - servicesCarousel.offsetLeft;
            scrollLeftServices = servicesCarousel.scrollLeft;
            // Mousedown ile de göstergeyi gizle
            handleTouchStart.call(servicesCarousel);
        });

        servicesCarousel.addEventListener('mouseleave', () => {
            isDownServices = false;
            servicesCarousel.style.cursor = 'grab';
        });

        servicesCarousel.addEventListener('mouseup', () => {
            isDownServices = false;
            servicesCarousel.style.cursor = 'grab';
        });

        servicesCarousel.addEventListener('mousemove', (e) => {
            if (!isDownServices) return;
            e.preventDefault();
            const x = e.pageX - servicesCarousel.offsetLeft;
            const walk = (x - startXServices) * 2;
            servicesCarousel.scrollLeft = scrollLeftServices - walk;
        });
    }
    
    // Öğrenci Videoları Carousel için Scroll Göstergesi
    const videosCarousel = document.querySelector('.videos-carousel');
    if (videosCarousel) {
        const videosScrollIndicator = videosCarousel.parentElement.querySelector('.videos-scroll-indicator');
        
        // Başlangıçta carousel sınıfı ekle
        videosCarousel.classList.add('unscrolled');
        
         const handleVideoScroll = function() {
            if (this.scrollLeft > 20) {
                this.classList.remove('unscrolled');
                if (videosScrollIndicator) {
                    videosScrollIndicator.style.opacity = '0';
                    setTimeout(() => {
                        videosScrollIndicator.style.display = 'none';
                    }, 300);
                }
                 // Tek seferlik olay dinleyiciyi kaldır
                 this.removeEventListener('scroll', handleVideoScroll);
                 this.removeEventListener('touchstart', handleVideoTouchStart);
            }
        };
        
         const handleVideoTouchStart = function() {
            this.classList.remove('unscrolled');
            if (videosScrollIndicator) {
                videosScrollIndicator.style.opacity = '0';
                setTimeout(() => {
                    videosScrollIndicator.style.display = 'none';
                }, 300);
            }
            // Tek seferlik olay dinleyiciyi kaldır
            this.removeEventListener('scroll', handleVideoScroll);
            this.removeEventListener('touchstart', handleVideoTouchStart);
        };

        // Scroll ve touchstart olaylarını kontrol et
        videosCarousel.addEventListener('scroll', handleVideoScroll);
        videosCarousel.addEventListener('touchstart', handleVideoTouchStart);
        
        // Dokunmatik kaydırma (videos için ayrı) 
        let isDownVideos = false;
        let startXVideos;
        let scrollLeftVideos;

        videosCarousel.addEventListener('mousedown', (e) => {
            isDownVideos = true;
            videosCarousel.style.cursor = 'grabbing';
            startXVideos = e.pageX - videosCarousel.offsetLeft;
            scrollLeftVideos = videosCarousel.scrollLeft;
            handleVideoTouchStart.call(videosCarousel); // Göstergeyi gizle
        });

        videosCarousel.addEventListener('mouseleave', () => {
            isDownVideos = false;
            videosCarousel.style.cursor = 'grab';
        });

        videosCarousel.addEventListener('mouseup', () => {
            isDownVideos = false;
            videosCarousel.style.cursor = 'grab';
        });

        videosCarousel.addEventListener('mousemove', (e) => {
            if (!isDownVideos) return;
            e.preventDefault();
            const x = e.pageX - videosCarousel.offsetLeft;
            const walk = (x - startXVideos) * 2;
            videosCarousel.scrollLeft = scrollLeftVideos - walk;
        });
    }
    
    // Servis kartlarına hover efekti
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // İletişim kartlarına hover efekti
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.backgroundColor = 'var(--primary-color)';
                icon.style.color = 'white';
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.backgroundColor = '';
                icon.style.color = '';
                icon.style.transform = '';
            }
        });
    });
    
    // Sosyal medya ikonlarına hover efekti
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(90deg, var(--primary-color), var(--accent-color-2))';
            this.style.color = 'white';
            this.style.transform = 'translateY(-5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.color = '';
            this.style.transform = '';
        });
    });
    
    // Dokunmatik cihazlar için özel ayarlamalar
    if (isTouchDevice) {
        // Butonların aktif durumu için CSS class ekleyelim
        const allButtons = document.querySelectorAll('.btn, .btn-contact, .btn-career, .btn-language, .btn-legal, .btn-videos');
        allButtons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('button-touch-active');
            });
            
            button.addEventListener('touchend', function() {
                this.classList.remove('button-touch-active');
                setTimeout(() => {
                    this.blur();
                }, 300);
            });
        });
        
        // Form alanları için dokunmatik iyileştirmeler
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('input-touch-focus');
            });
            
            input.addEventListener('blur', function() {
                this.classList.remove('input-touch-focus');
            });
        });
        
        // Mobilde menü linklerinin tıklanmasını iyileştirmek
        const menuLinks = document.querySelectorAll('.menu li a, .mobile-menu li a');
        menuLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.classList.add('link-touch-active');
            });
            
            link.addEventListener('touchend', function() {
                this.classList.remove('link-touch-active');
            });
        });
    }
    
    // Sayfa scroll pozisyonunu mobilde daha akıcı yapmak
    let lastScrollTop = 0;
    window.addEventListener("scroll", function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop) {
            // Aşağı scroll
            if (currentScroll > 100 && isMobile) {
                document.body.classList.add('scrolling-down');
            }
            } else {
            // Yukarı scroll
            document.body.classList.remove('scrolling-down');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
    
    // Mobil görünüm yüksekliğini düzeltme
    const setMobileViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // İlk yüklemede ve ekran boyutu değiştiğinde viewport yüksekliğini güncelle
    setMobileViewportHeight();
    window.addEventListener('resize', setMobileViewportHeight);

    // AOS (Animate On Scroll) kütüphanesini başlatma
    AOS.init({
        duration: 800,
        once: false,
        mirror: true
    });

    // Form bölümüne geri dönüş butonu işlemleri
    const formSection = document.getElementById('form-section');
    const backToFormButton = document.getElementById('backToFormButton');

    if (formSection && backToFormButton) {
        // Sayfa kaydırıldığında form görünürlüğünü kontrol et
        window.addEventListener('scroll', checkFormVisibility);

        // Butona tıklanınca form bölümüne git
        backToFormButton.addEventListener('click', function() {
            formSection.scrollIntoView({ behavior: 'smooth' });
        });

        // İlk yükleme sırasında form görünürlüğünü kontrol et
        checkFormVisibility();
    }

    // Video modali için işlemler
    setupVideoModal();

    // Hizmet ve Video karusel işlemleri için dokunma destekli kaydırma
    enableTouchScroll('.services-carousel');
    enableTouchScroll('.videos-carousel');
    
    // Ülkeler kaydırma işlemleri
    enableTouchScroll('.countries-cards');
    updateScrollIndicators('.countries-cards', '.scroll-dot');

    // Form görünürlüğünü kontrol eden fonksiyon
    function checkFormVisibility() {
        if (!isElementInViewport(formSection)) {
            backToFormButton.classList.add('visible');
            } else {
            backToFormButton.classList.remove('visible');
        }
    }

    // Bir elementin viewport içinde olup olmadığını kontrol eden fonksiyon
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom > 0
        );
    }

    // Dokunma destekli kaydırma fonksiyonu
    function enableTouchScroll(selector) {
        const carousel = document.querySelector(selector);
        if (!carousel) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active-drag');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.classList.remove('active-drag');
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active-drag');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // *2 hızı artırır
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Dokunma olayları
        carousel.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('touchend', () => {
            isDown = false;
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    }

    // Scroll göstergelerini güncelleme
    function updateScrollIndicators(carouselSelector, dotSelector) {
        const carousel = document.querySelector(carouselSelector);
        const dots = document.querySelectorAll(dotSelector);
        
        if (!carousel || dots.length === 0) return;
        
        carousel.addEventListener('scroll', () => {
            const scrollPosition = carousel.scrollLeft;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            const scrollPercentage = scrollPosition / maxScroll;
            
            const activeDotIndex = Math.min(
                Math.floor(scrollPercentage * dots.length),
                dots.length - 1
            );
            
            dots.forEach((dot, index) => {
                if (index === activeDotIndex) {
                    dot.classList.add('active');
            } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    // Video modalını ayarlayan fonksiyon
    function setupVideoModal() {
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        const videoModal = document.querySelector('.video-modal');
        const closeModalButton = document.querySelector('.close-modal');
        
        if (!videoThumbnails.length || !videoModal || !closeModalButton) return;
        
        const iframe = videoModal.querySelector('iframe');
        if (!iframe) return;

        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                if (videoId) {
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    videoModal.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            videoModal.classList.remove('active');
            iframe.src = '';
        };

        closeModalButton.addEventListener('click', closeModal);
            
        // Modal dışına tıklanınca kapat
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                closeModal();
            }
        });
        
        // ESC tuşu ile kapatma
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Sayı animasyonu
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(numElement => {
            const targetValue = numElement.getAttribute('data-count');
            const currentText = numElement.textContent;
            const suffix = currentText.replace(/[0-9]/g, ''); // +, % gibi sonekleri alma
            
            if (targetValue) {
                const targetNum = parseInt(targetValue, 10);
                let duration = 2000; // milisaniye cinsinden animasyon süresi
                let startTime;
                let currentNumber = 0;
                
                function updateNumber(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    
                    if (progress < duration) {
                        // Easing fonksiyonu ile daha doğal bir animasyon
                        const easeOutProgress = 1 - Math.pow(1 - progress / duration, 3);
                        currentNumber = Math.floor(easeOutProgress * targetNum);
                        numElement.textContent = currentNumber + suffix;
                        requestAnimationFrame(updateNumber);
            } else {
                        numElement.textContent = targetNum + suffix;
                    }
                }
                
                requestAnimationFrame(updateNumber);
            }
        });
    }
    
    // Intersection Observer ile sayı animasyonunu tetikleme
    const statsContainer = document.querySelector('.services-stats');
    if (statsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.disconnect(); // Bir kez çalıştıktan sonra gözlemi durdur
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(statsContainer);
    }

    // Mobil hizmet carousel'i
    const servicesMobileCarousel = document.querySelector('.services-carousel');
    const serviceScrollDots = document.querySelectorAll('.scroll-dot');
    
    if (servicesMobileCarousel && serviceScrollDots.length > 0) {
        let isDragging = false;
        let startX, scrollLeft;
        let activeSlide = 0;
        const slideCount = servicesMobileCarousel.querySelectorAll('.service-slide').length;
        
        // Touch ve fare etkileşimleri
        servicesMobileCarousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - servicesMobileCarousel.offsetLeft;
            scrollLeft = servicesMobileCarousel.scrollLeft;
            servicesMobileCarousel.style.cursor = 'grabbing';
        });
        
        servicesMobileCarousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - servicesMobileCarousel.offsetLeft;
            scrollLeft = servicesMobileCarousel.scrollLeft;
        });
        
        servicesMobileCarousel.addEventListener('mouseleave', () => {
            isDragging = false;
            servicesMobileCarousel.style.cursor = 'grab';
        });
        
        servicesMobileCarousel.addEventListener('mouseup', () => {
            isDragging = false;
            servicesMobileCarousel.style.cursor = 'grab';
        });
        
        servicesMobileCarousel.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        servicesMobileCarousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - servicesMobileCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            servicesMobileCarousel.scrollLeft = scrollLeft - walk;
            updateActiveDot();
        });
        
        servicesMobileCarousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - servicesMobileCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            servicesMobileCarousel.scrollLeft = scrollLeft - walk;
            updateActiveDot();
        });
        
        // Kaydırma işlemi bittiğinde aktif noktayı güncelle
        servicesMobileCarousel.addEventListener('scroll', () => {
            updateActiveDot();
        });
        
        // Aktif noktayı güncelleme fonksiyonu
        function updateActiveDot() {
            if (!servicesMobileCarousel) return;
            
            const scrollPosition = servicesMobileCarousel.scrollLeft;
            const slideWidth = servicesMobileCarousel.scrollWidth / slideCount;
            const currentSlide = Math.round(scrollPosition / slideWidth);
            
            if (currentSlide !== activeSlide && currentSlide < slideCount) {
                // Önceki aktif noktanın active sınıfını kaldır
                serviceScrollDots.forEach(dot => dot.classList.remove('active'));
                
                // Yeni aktif noktaya active sınıfını ekle
                if (serviceScrollDots[currentSlide]) {
                    serviceScrollDots[currentSlide].classList.add('active');
                }
                
                activeSlide = currentSlide;
            }
        }
        
        // Noktalara tıkladığında o slide'a git
        serviceScrollDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideWidth = servicesMobileCarousel.scrollWidth / slideCount;
                servicesMobileCarousel.scrollTo({
                    left: index * slideWidth,
                    behavior: 'smooth'
                });
                
                // Aktif noktayı güncelle
                serviceScrollDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                activeSlide = index;
            });
        });
    }

    // Dikey Video Carousel İşlevleri
    initVerticalVideoCarousel();

    // Reviews Slider Fonksiyonları
    initReviewsSlider();
});

// Genel Carousel/Slider Fonksiyonu
function setupCarousel(carouselSelector, prevButtonSelector, nextButtonSelector, scrollIndicatorSelector) {
    const carousel = document.querySelector(carouselSelector);
    const prevButton = document.querySelector(prevButtonSelector);
    const nextButton = document.querySelector(nextButtonSelector);
    const scrollIndicator = document.querySelector(scrollIndicatorSelector);

    if (!carousel) return; // Carousel bulunamazsa fonksiyondan çık

    let isDown = false;
    let startX;
    let scrollLeft;

    // Fare ile sürükleme olayları
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active-drag');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active-drag');
    });
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active-drag');
    });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Kaydırma hızını ayarlayabilirsiniz
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Dokunmatik sürükleme olayları
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        carousel.classList.add('active-drag');
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('touchend', () => {
        isDown = false;
        carousel.classList.remove('active-drag');
    });
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        // e.preventDefault(); // Sayfa kaydırmasını engellememek için kaldırıldı
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Kaydırma hızını ayarlayabilirsiniz
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Ok butonları
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            const slideWidth = carousel.querySelector('.video-slide, .service-slide')?.offsetWidth;
            if (slideWidth) {
                carousel.scrollBy({ left: -(slideWidth + 20), behavior: 'smooth' }); // 20px gap
            }
        });

        nextButton.addEventListener('click', () => {
            const slideWidth = carousel.querySelector('.video-slide, .service-slide')?.offsetWidth;
             if (slideWidth) {
                carousel.scrollBy({ left: slideWidth + 20, behavior: 'smooth' }); // 20px gap
            }
        });
    }

    // Mobil kaydırma göstergesi (varsa)
    if (scrollIndicator && window.innerWidth <= 768) {
        carousel.addEventListener('scroll', () => {
            // Kullanıcı kaydırmaya başladığında göstergeyi gizle
            if (carousel.scrollLeft > 10) { 
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
            } else {
                 scrollIndicator.style.opacity = '1'; // Başa dönünce tekrar göster (isteğe bağlı)
            }
        }, { passive: true });
            }
}

// Carousel'ları Çalıştır
document.addEventListener('DOMContentLoaded', () => {
    // Hizmetler Carousel
    setupCarousel('.services-carousel', '.services-prev-arrow', '.services-next-arrow', '.mobile-scroll-indicator:not(.videos-scroll-indicator)');
    
    // Öğrenci Videoları Carousel
    setupCarousel('.videos-carousel', '.videos-prev-arrow', '.videos-next-arrow', '.videos-scroll-indicator');

    // AOS Animasyonları Başlatma
    AOS.init({
        duration: 800, // Animasyon süresi
        once: true, // Animasyonlar sadece bir kere çalışsın
        offset: 50, // Eleman görünmeden ne kadar önce animasyon başlasın
    });
    
    // Mobil Menü İşlevselliği
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenuIcon = document.querySelector('.close-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    if(mobileMenuIcon && mobileMenu && closeMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });

        closeMenuIcon.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
        
        // Mobil menü linklerine tıklanınca menüyü kapat
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Video Modal İşlevselliği
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const videoModal = document.querySelector('.video-modal');
    const closeModalButton = document.querySelector('.close-modal');
    const iframe = videoModal ? videoModal.querySelector('iframe') : null;

    if (videoThumbnails.length > 0 && videoModal && closeModalButton && iframe) {
        videoThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const videoId = thumbnail.getAttribute('data-video-id');
                if (videoId) {
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    videoModal.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            videoModal.classList.remove('active');
            iframe.src = ''; // Videoyu durdurmak için src'yi temizle
            document.body.style.overflow = ''; // Sayfa kaydırmayı tekrar etkinleştir
        };

        closeModalButton.addEventListener('click', closeModal);
            
        // Modal dışına tıklanınca kapat
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) { // Sadece modal arka planına tıklanırsa
                closeModal();
            }
        });
         // ESC tuşu ile kapatma
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && videoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // İletişim Bilgileri Sosyal Medya Hover Efekti
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
    
     // Header scroll efekti
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

});

// Mobil hizmet kartları carousel işlevselliği
function initServiceCarousel() {
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.service-slide');
    const dots = document.querySelectorAll('.scroll-dot');
    
    // İlk slide'ı aktif yap
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    let isDragging = false;
    let startX, startScrollLeft;
    let currentSlideIndex = 0;
    
    // Kaydırma olayını izle
    carousel.addEventListener('scroll', function() {
        if (isDragging) return;
        
        // Hangi slide'ın görünür olduğunu tespit et
        const carouselWidth = carousel.offsetWidth;
        const scrollPosition = carousel.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const slideGap = 15; // CSS'teki gap değeri
        
        const newIndex = Math.round(scrollPosition / (slideWidth + slideGap));
        if (newIndex !== currentSlideIndex && newIndex >= 0 && newIndex < slides.length) {
            updateActiveSlide(newIndex);
        }
    });
    
    // Dokunmatik kaydırma başlangıcı
    carousel.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].pageX;
        startScrollLeft = carousel.scrollLeft;
        carousel.style.scrollBehavior = 'auto';
    });
    
    // Dokunmatik kaydırma
    carousel.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = startScrollLeft - walk;
    });
    
    // Dokunmatik kaydırma sonu
    carousel.addEventListener('touchend', function() {
        isDragging = false;
        carousel.style.scrollBehavior = 'smooth';
        
        // En yakın slide'a snap et
        const carouselWidth = carousel.offsetWidth;
        const scrollPosition = carousel.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const slideGap = 15; // CSS'teki gap değeri
        
        const newIndex = Math.round(scrollPosition / (slideWidth + slideGap));
        if (newIndex >= 0 && newIndex < slides.length) {
            scrollToSlide(newIndex);
        }
    });
    
    // Fare kaydırma olayları
    carousel.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
        carousel.style.scrollBehavior = 'auto';
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const x = e.pageX;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = startScrollLeft - walk;
    });
    
    carousel.addEventListener('mouseup', function() {
        isDragging = false;
        carousel.style.cursor = 'grab';
        carousel.style.scrollBehavior = 'smooth';
        
        // En yakın slide'a snap et
        const carouselWidth = carousel.offsetWidth;
        const scrollPosition = carousel.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const slideGap = 15; // CSS'teki gap değeri
        
        const newIndex = Math.round(scrollPosition / (slideWidth + slideGap));
        if (newIndex >= 0 && newIndex < slides.length) {
            scrollToSlide(newIndex);
        }
    });
    
    carousel.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            carousel.style.cursor = 'grab';
            carousel.style.scrollBehavior = 'smooth';
        }
    });
    
    // Her dot'a tıklama olayını ekle
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            scrollToSlide(index);
        });
    });
    
    // Belirli bir slide'a kaydır
    function scrollToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        const slideWidth = slides[0].offsetWidth;
        const slideGap = 15; // CSS'teki gap değeri
        const scrollTo = index * (slideWidth + slideGap);
        
        carousel.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
        });
        
        updateActiveSlide(index);
    }
    
    // Aktif slide'ı güncelle
    function updateActiveSlide(index) {
        currentSlideIndex = index;
        
        // Tüm slide'ların active sınıfını kaldır
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Tüm dot'ların active sınıfını kaldır
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Aktif slide ve dot'u işaretle
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }
    
    // Otomatik geçiş için zamanlayıcı
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextSlide = (currentSlideIndex + 1) % slides.length;
            scrollToSlide(nextSlide);
        }, 5000); // 5 saniyede bir geçiş
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Carousel'a dokunulduğunda otomatik geçişi durdur
    carousel.addEventListener('touchstart', stopAutoSlide);
    carousel.addEventListener('mousedown', stopAutoSlide);
    
    // Carousel'dan el/fare çekildiğinde otomatik geçişi başlat
    carousel.addEventListener('touchend', startAutoSlide);
    carousel.addEventListener('mouseup', startAutoSlide);
    
    // Sayfa yüklendiğinde otomatik geçişi başlat
    startAutoSlide();
}

// Ülke Popup Formu İşlevselliği
function initCountryFormModal() {
    const countryFormModal = document.getElementById('countryFormModal');
    const closeCountryModal = document.querySelector('.close-country-modal');
    const countryCards = document.querySelectorAll('.country-card');
    const minimalCountries = document.querySelectorAll('.minimal-country:not(.more-countries)');
    
    // Ülke kartlarına tıklama olay dinleyicisi ekle
    if (countryCards.length > 0) {
        countryCards.forEach(card => {
            card.addEventListener('click', function() {
                const countryName = this.querySelector('.country-name').textContent;
                const countryFlagSrc = this.querySelector('.country-flag img').src;
                openCountryModal(countryName, countryFlagSrc);
            });
        });
    }
    
    // Minimal ülke bayraklarına tıklama olay dinleyicisi ekle
    if (minimalCountries.length > 0) {
        minimalCountries.forEach(country => {
            country.addEventListener('click', function() {
                const countryImg = this.querySelector('img');
                const countryFlagSrc = countryImg.src;
                const countryName = countryImg.alt.replace(' Bayrağı', '');
                openCountryModal(countryName, countryFlagSrc);
            });
        });
    }
    
    // Modal kapatma butonunu işlevsel hale getir
    if (closeCountryModal) {
        closeCountryModal.addEventListener('click', function() {
            countryFormModal.classList.remove('show');
            setTimeout(() => {
                countryFormModal.style.display = 'none';
            }, 500);
        });
    }
    
    // Dışarıya tıklandığında modalı kapat
    window.addEventListener('click', function(event) {
        if (event.target === countryFormModal) {
            countryFormModal.classList.remove('show');
                setTimeout(() => {
                countryFormModal.style.display = 'none';
                }, 500);
        }
    });
    
    // Form gönderildiğinde işlem yap
    const countryContactForm = document.getElementById('countryContactForm');
    if (countryContactForm) {
        countryContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formInputs = countryContactForm.querySelectorAll('input, select, textarea');
            
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    showError(input, 'Bu alan zorunludur');
                } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Geçerli bir e-posta adresi giriniz');
                } else {
                    clearError(input);
                }
            });
            
            if (isValid) {
                // Form verilerini al
                const formData = new FormData(countryContactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                // UTM parametrelerini çerezden oku ve ekle
                const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
                utmParams.forEach(param => {
                    formObject[param] = getCookie(param) || '';
                });

                // Butonu devre dışı bırak ve yükleniyor durumunu göster
                const submitButton = countryContactForm.querySelector('.form-submit-btn');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

                // Webhook'a gönder
                fetch('https://hook.eu2.make.com/k1dkxp5mtefzotojaobz12sa7enkl7al', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Webhook gönderimi başarısız oldu.');
                    }
                    return response.text();
                })
                .then(data => {
                    console.log('Ülke formu webhook yanıtı:', data);
                    // Başarılı gönderimden sonra modalı kapat ve yönlendir
                    countryFormModal.classList.remove('show');
                    setTimeout(() => {
                        countryFormModal.style.display = 'none';
                        window.location.href = 'https://avrupagoc.com/tesekkurler';
                    }, 500);
                })
                .catch(error => {
                    console.error('Ülke formu gönderim hatası:', error);
                    showError(submitButton, 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Hemen Başvur</span><i class="fas fa-paper-plane" style="margin-left: 10px;"></i>';
                });
            }
        });
        
        // Her input değiştiğinde hata mesajlarını temizle
        const formInputs = countryContactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                clearError(input);
            });
        });
    }
}

// Ülkeye özel modal açma fonksiyonu
function openCountryModal(countryName, flagSrc) {
    const countryFormModal = document.getElementById('countryFormModal');
    const modalCountryTitle = document.getElementById('modalCountryTitle');
    const modalCountryFlag = document.getElementById('modalCountryFlag');
    const selectedCountryInput = document.getElementById('selectedCountry');
    
    // Modal içeriğini güncelle
    modalCountryTitle.textContent = `${countryName} ile ilgili bilgi almak için hemen iletişime geçin`;
    modalCountryFlag.src = flagSrc;
    selectedCountryInput.value = countryName;
    
    // Modalı göster
    countryFormModal.style.display = 'flex';
    setTimeout(() => {
        countryFormModal.classList.add('show');
    }, 10);
}

// Ekip Carousel İşlevselliği
function initTeamCarousel() {
    const teamCarousel = document.querySelector('.team-carousel');
    if (!teamCarousel) return;
    
    const prevBtn = document.querySelector('button.team-prev-arrow');
    const nextBtn = document.querySelector('button.team-next-arrow');
    const teamDots = document.querySelectorAll('.team-dot');
    const members = teamCarousel.querySelectorAll('.team-member');
    
    let isDragging = false;
    let startX, startScrollLeft;
    let autoScrollInterval;
    let currentIndex = 0;
    const memberWidth = members[0].offsetWidth + 30; // 30px boşluk
    
    // Kaydırma İşlevi
    const scroll = (direction) => {
        if (direction === 'left') {
            teamCarousel.scrollBy({
                left: -memberWidth, 
                behavior: 'smooth'
            });
        } else {
            teamCarousel.scrollBy({
                left: memberWidth, 
                behavior: 'smooth'
            });
        }
    };
    
    // Sayfa numarası göstergesi güncelleme
    const updateIndicator = () => {
        const scrollPosition = teamCarousel.scrollLeft;
        const totalWidth = teamCarousel.scrollWidth;
        const viewportWidth = teamCarousel.offsetWidth;
        const scrollPercentage = scrollPosition / (totalWidth - viewportWidth);
        const maxDot = teamDots.length - 1;
        const activeDot = Math.round(scrollPercentage * maxDot);
        
        teamDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDot);
        });
    };
    
    // Ok butonları işlevselliği
    if (prevBtn) {
        console.log('Prev button found:', prevBtn);
        prevBtn.addEventListener('click', (e) => {
            console.log('Prev button clicked');
            e.preventDefault();
            scroll('left');
            clearInterval(autoScrollInterval);
        });
    } else {
        console.log('Prev button not found');
    }
    
    if (nextBtn) {
        console.log('Next button found:', nextBtn);
        nextBtn.addEventListener('click', (e) => {
            console.log('Next button clicked');
            e.preventDefault();
            scroll('right');
            clearInterval(autoScrollInterval);
        });
    } else {
        console.log('Next button not found');
    }
    
    // Dokunmatik sürükleme işlevselliği
    teamCarousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = teamCarousel.scrollLeft;
        teamCarousel.style.cursor = 'grabbing';
        clearInterval(autoScrollInterval);
    });
    
    teamCarousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = e.pageX;
        const walk = (x - startX) * 2; // * 2 kaydırma hızını artırır
        teamCarousel.scrollLeft = startScrollLeft - walk;
    });
    
    teamCarousel.addEventListener('mouseup', () => {
        isDragging = false;
        teamCarousel.style.cursor = 'grab';
        updateIndicator();
    });
    
    teamCarousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            teamCarousel.style.cursor = 'grab';
            updateIndicator();
        }
    });
    
    // Dokunmatik ekranlar için
    teamCarousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        startScrollLeft = teamCarousel.scrollLeft;
        clearInterval(autoScrollInterval);
    }, { passive: true });
    
    teamCarousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 2;
        teamCarousel.scrollLeft = startScrollLeft - walk;
    }, { passive: true });
    
    teamCarousel.addEventListener('touchend', () => {
        isDragging = false;
        updateIndicator();
    });
    
    // Carousel kaydırma olayını izle
    teamCarousel.addEventListener('scroll', () => {
        requestAnimationFrame(updateIndicator);
    });
    
    // Otomatik kaydırma
    const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
            if (teamCarousel.scrollLeft + teamCarousel.offsetWidth >= teamCarousel.scrollWidth - 50) {
                // Sona ulaşıldığında başa dön
                teamCarousel.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                scroll('right');
            }
        }, 5000); // 5 saniyede bir
    };
    
    // Otomatik kaydırmayı başlat
    startAutoScroll();
    
    // Pencereye odaklanma ve odaklanmayı kaybetme
    window.addEventListener('focus', startAutoScroll);
    window.addEventListener('blur', () => clearInterval(autoScrollInterval));
    
    // Ekran yeniden boyutlandırıldığında göstergeleri güncelle
    window.addEventListener('resize', updateIndicator);
    
    // İlk yükleme
    updateIndicator();
}

// Video Modal'ı açmak için fonksiyon 
function openVideoModal(videoId, videoType) {
    const modal = document.querySelector('.video-modal');
    const iframe = modal.querySelector('iframe');
    
    if (videoType === 'youtube') {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (videoType === 'instagram') {
        iframe.src = `https://www.instagram.com/p/${videoId}/embed/`;
    }
    
    modal.classList.add('active');
}

// Video Modal'ı kapatmak için fonksiyon
function closeVideoModal() {
    const videoModal = document.querySelector('.video-modal');
    const modalVideo = document.getElementById('modal-video');
    
    if (videoModal && modalVideo) {
        cleanupAndCloseModal(videoModal, modalVideo);
    } else {
        // Eski versiyonla uyumluluk için
        console.warn('VideoModal kapatılırken eski yöntem kullanıldı');
        
        if (videoModal) {
            videoModal.classList.remove('active');
            videoModal.style.display = 'none';
        }
        
        if (modalVideo) {
            try {
                modalVideo.pause();
                modalVideo.src = '';
                modalVideo.load();
            } catch (e) {}
        }
        
        document.body.style.overflow = '';
    }
}

// Instagram Reels video thumbnails için click event
document.querySelectorAll('.video-thumbnail[data-video-id]').forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const videoId = this.getAttribute('data-video-id');
        const instagramUrl = this.querySelector('.instagram-media').getAttribute('data-instgrm-permalink');
        // Instagram modal açma fonksiyonunu çağır
        openInstagramModal(instagramUrl);
    });
});

// Instagram Modal'ı açmak için fonksiyon
function openInstagramModal(instagramUrl) {
    // Mevcut Instagram iframe'i varsa kaldır
    const existingModal = document.querySelector('.instagram-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Yeni modal oluştur
    const modal = document.createElement('div');
    modal.classList.add('instagram-modal');
    
    // Modal içeriği oluştur
    modal.innerHTML = `
        <div class="instagram-modal-content">
            <span class="instagram-close-modal">&times;</span>
            <div class="instagram-embed-container">
                <blockquote 
                    class="instagram-media" 
                    data-instgrm-permalink="${instagramUrl}?utm_source=ig_embed&amp;utm_campaign=loading" 
                    data-instgrm-version="14" 
                    style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                </blockquote>
            </div>
        </div>
    `;
    
    // Modal'ı sayfaya ekle
    document.body.appendChild(modal);
    
    // Instagram embedlerin yüklenmesi için Instagram scriptini yeniden yükle
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
    
    // Modal'ı göster
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Modal kapatma butonunu dinle
    const closeBtn = modal.querySelector('.instagram-close-modal');
    closeBtn.addEventListener('click', function() {
        closeInstagramModal(modal);
    });
    
    // Modal dışına tıklanınca da kapat
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeInstagramModal(modal);
        }
    });
}

// Instagram Modal'ı kapatmak için fonksiyon
function closeInstagramModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300); // Aynı geçiş süresi kadar bekle
}

// Video Modal Kapama Butonu
document.querySelector('.close-modal').addEventListener('click', closeVideoModal);

// Modal dışına tıklanınca kapatma
document.querySelector('.video-modal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeVideoModal();
    }
});

// Dikey Video Carousel İşlevleri
function initVerticalVideoCarousel() {
    const verticalVideosCarousel = document.querySelector('.vertical-videos-carousel');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail.vertical');
    const prevBtn = document.querySelector('.vertical-carousel-nav .prev-btn');
    const nextBtn = document.querySelector('.vertical-carousel-nav .next-btn');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const videoModal = document.querySelector('.video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeModalBtn = document.querySelector('.close-modal');
    const allVideos = document.querySelectorAll('.video-thumbnail.vertical video');
    
    if (!verticalVideosCarousel || !videoThumbnails.length) return;
    
    // Tüm videoları başlangıçta durdur
    allVideos.forEach(video => {
        video.pause();
        video.currentTime = 0;
        
        // Video hazır olduğunda poster resmini göster
        video.addEventListener('loadeddata', function() {
            this.parentElement.classList.add('video-loaded');
        });
        
        // Video hata verdiğinde
        video.addEventListener('error', function() {
            console.error('Video yüklenirken hata oluştu:', this.src);
            this.parentElement.classList.add('video-error');
        });
    });
    
    // İntersection Observer ile görünür videoları otomatik oynat
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;
                
                if (entry.isIntersecting) {
                    // Ekranda görünür olan videoya gelince sessiz oynat
                    try {
                        video.play().catch(e => console.log('Otomatik oynatma engellendi:', e));
                    } catch (err) {
                        console.log('Video oynatma hatası:', err);
                    }
                } else {
                    // Ekrandan çıkınca videoyu durdur
                    video.pause();
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });
        
        // Tüm video kartlarını gözlemle
        videoThumbnails.forEach(thumbnail => {
            videoObserver.observe(thumbnail);
        });
    }
    
    // Video thumbnail'lara tıklama olayı
    videoThumbnails.forEach((thumbnail, index) => {
        const video = thumbnail.querySelector('video');
        if (!video) return;
        
        thumbnail.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Modal içindeki videoyu ayarla
            if (modalVideo && videoModal) {
                // Modal hazırlama
                videoModal.querySelector('.video-container').classList.remove('video-error');
                
                // Temiz başlangıç için önce video kaynağını temizleyip sonra yeni kaynağı atayalım
                modalVideo.pause();
                
                // Videoyu sıfırlama ve yeniden yükleme
                const videoSource = document.getElementById('video-source');
                if (videoSource) {
                    videoSource.src = video.src;
                    modalVideo.load();
                } else {
                    modalVideo.src = video.src;
                }
                
                // Modal'ı göster
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Video sesi açık ve tam ekran oynat
                modalVideo.muted = false;
                modalVideo.controls = true;
                
                // Video yüklendiğinde oynat
                modalVideo.addEventListener('loadeddata', function onceLoaded() {
                    modalVideo.play().catch(e => {
                        console.log('Modal video oynatma hatası:', e);
                        videoModal.querySelector('.video-container').classList.add('video-error');
                    });
                    modalVideo.removeEventListener('loadeddata', onceLoaded);
                });
                
                // Video hata verdiğinde
                modalVideo.addEventListener('error', function(e) {
                    console.error('Video yüklenirken hata:', e);
                    videoModal.querySelector('.video-container').classList.add('video-error');
                });
            }
        });
    });
    
    // Video modal kapatma
    if (closeModalBtn && videoModal) {
        closeModalBtn.addEventListener('click', () => {
            cleanupAndCloseModal(videoModal, modalVideo);
        });
        
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                cleanupAndCloseModal(videoModal, modalVideo);
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                cleanupAndCloseModal(videoModal, modalVideo);
            }
        });
    }
    
    // Carousel navigasyon butonları
    if (prevBtn && nextBtn) {
        // İleri butonu tıklaması
        nextBtn.addEventListener('click', () => {
            const cardWidth = videoThumbnails[0].offsetWidth + 20; // 20px gap
            verticalVideosCarousel.scrollBy({
                left: cardWidth * 2,
                behavior: 'smooth'
            });
            setTimeout(updateDots, 500); // Kaydırma sonrası dot'ları güncelle
        });
        
        // Geri butonu tıklaması
        prevBtn.addEventListener('click', () => {
            const cardWidth = videoThumbnails[0].offsetWidth + 20; // 20px gap
            verticalVideosCarousel.scrollBy({
                left: -cardWidth * 2,
                behavior: 'smooth'
            });
            setTimeout(updateDots, 500); // Kaydırma sonrası dot'ları güncelle
        });
    }
    
    // Noktalara tıklama
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideWidth = videoThumbnails[0].offsetWidth + 20; // 20px gap
                const visibleSlides = 2; // Her seferde kaç kart görünür
                const scrollPosition = Math.floor(index / visibleSlides) * slideWidth * visibleSlides;
                
                verticalVideosCarousel.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
                
                updateActiveDot(index);
            });
        });
    }
    
    // Kaydırma olayı
    verticalVideosCarousel.addEventListener('scroll', () => {
        requestAnimationFrame(updateDots);
    });
    
    // Dokunmatik kaydırma
    setupTouchScroll(verticalVideosCarousel);
    
    // Aktif noktayı güncelleme
    function updateDots() {
        if (!verticalVideosCarousel || !dots.length) return;
        
        const scrollPosition = verticalVideosCarousel.scrollLeft;
        const slideWidth = videoThumbnails[0].offsetWidth + 20; // 20px gap
        const totalWidth = verticalVideosCarousel.scrollWidth - verticalVideosCarousel.clientWidth;
        
        // Yüzde olarak kaydırma pozisyonu
        const scrollPercentage = scrollPosition / totalWidth;
        
        // Aktif dot indeksi
        const activeDotIndex = Math.min(
            Math.floor(scrollPercentage * dots.length),
            dots.length - 1
        );
        
        updateActiveDot(activeDotIndex);
    }
    
    // Aktif noktayı ayarla
    function updateActiveDot(index) {
        if (!dots.length) return;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Dokunmatik kaydırma ayarları
    function setupTouchScroll(element) {
        if (!element) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        element.addEventListener('mousedown', (e) => {
            isDown = true;
            element.classList.add('active-drag');
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        });
        
        element.addEventListener('mouseleave', () => {
            isDown = false;
            element.classList.remove('active-drag');
        });
        
        element.addEventListener('mouseup', () => {
            isDown = false;
            element.classList.remove('active-drag');
        });
        
        element.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2; // Kaydırma hızı
            element.scrollLeft = scrollLeft - walk;
        });
        
        // Dokunmatik ekran desteği
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        }, { passive: true });
        
        element.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - element.offsetLeft;
            const walk = (x - startX) * 2;
            element.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            startX = null;
        });
    }
    
    // Başlangıçta aktif noktayı ayarla
    updateDots();
}

// Global bir modalı kapat ve temizle fonksiyonu
function cleanupAndCloseModal(modal, video) {
    if (!modal || !video) return;
    
    // Modal görünürlüğünü kaldır
    modal.classList.remove('active');
    
    // Video durdur
    try {
        video.pause();
    } catch (e) {
        console.error('Video durdurma hatası:', e);
    }
    
    // Sayfayı kaydırmayı etkinleştir
    document.body.style.overflow = '';
    
    // Video kaynağını temizle
    setTimeout(() => {
        try {
            // Video kaynağını temizle - kaynak elementi varsa
            const videoSource = document.getElementById('video-source');
            if (videoSource) {
                videoSource.src = '';
                videoSource.removeAttribute('src');
            }
            
            // Video elementini de temizle
            video.src = '';
            video.removeAttribute('src');
            video.load();
            
            // Hata sınıfını kaldır
            modal.querySelector('.video-container').classList.remove('video-error');
        } catch (err) {
            console.error('Video temizleme hatası:', err);
        }
    }, 300);
}

// Reviews Slider Fonksiyonları
function initReviewsSlider() {
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    const prevBtn = document.querySelector('.reviews-prev-btn');
    const nextBtn = document.querySelector('.reviews-next-btn');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewsDots = document.querySelectorAll('.reviews-dot');
    
    if (!reviewsCarousel || !prevBtn || !nextBtn) {
        console.log('Reviews slider elementleri bulunamadı');
        return;
    }
    
    let currentIndex = 0;
    const cardWidth = reviewCards[0].offsetWidth + 20; // 20px gap
    const visibleCards = Math.floor(reviewsCarousel.offsetWidth / cardWidth);
    const maxIndex = Math.max(0, reviewCards.length - visibleCards);
    
    console.log('Reviews slider başlatıldı:', {
        cardWidth,
        visibleCards,
        maxIndex,
        totalCards: reviewCards.length
    });
    
    // İleri butonu
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Geri butonu
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    // Noktalara tıklama
    reviewsDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = Math.min(index, maxIndex);
            updateSlider();
        });
    });
    
    // Slider'ı güncelle
    function updateSlider() {
        const scrollPosition = currentIndex * cardWidth;
        reviewsCarousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Noktaları güncelle
        reviewsDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Butonları güncelle
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        console.log('Slider güncellendi:', {
            currentIndex,
            scrollPosition,
            maxIndex
        });
    }
    
    // Dokunmatik kaydırma
    let isDown = false;
    let startX;
    let scrollLeft;
    
    reviewsCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - reviewsCarousel.offsetLeft;
        scrollLeft = reviewsCarousel.scrollLeft;
    });
    
    reviewsCarousel.addEventListener('mouseleave', () => {
        isDown = false;
    });
    
    reviewsCarousel.addEventListener('mouseup', () => {
        isDown = false;
        // Kaydırma sonrası en yakın kartı bul
        const scrollPosition = reviewsCarousel.scrollLeft;
        currentIndex = Math.round(scrollPosition / cardWidth);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        updateSlider();
    });
    
    reviewsCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reviewsCarousel.offsetLeft;
        const walk = (x - startX) * 2;
        reviewsCarousel.scrollLeft = scrollLeft - walk;
    });
    
    // Dokunmatik ekran desteği
    reviewsCarousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - reviewsCarousel.offsetLeft;
        scrollLeft = reviewsCarousel.scrollLeft;
    }, { passive: true });
    
    reviewsCarousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - reviewsCarousel.offsetLeft;
        const walk = (x - startX) * 2;
        reviewsCarousel.scrollLeft = scrollLeft - walk;
    }, { passive: true });
    
    reviewsCarousel.addEventListener('touchend', () => {
        if (startX) {
            const scrollPosition = reviewsCarousel.scrollLeft;
            currentIndex = Math.round(scrollPosition / cardWidth);
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            updateSlider();
            startX = null;
        }
    });
    
    // Başlangıç durumu
    updateSlider();
    
    // Ekran boyutu değiştiğinde yeniden hesapla
    window.addEventListener('resize', () => {
        const newCardWidth = reviewCards[0].offsetWidth + 20;
        const newVisibleCards = Math.floor(reviewsCarousel.offsetWidth / newCardWidth);
        const newMaxIndex = Math.max(0, reviewCards.length - newVisibleCards);
        
        if (newMaxIndex !== maxIndex) {
            currentIndex = Math.min(currentIndex, newMaxIndex);
            updateSlider();
        }
    });
}

// Sayfa yüklendiğinde reviews slider'ı başlat
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut kodlar...
    
    // Reviews slider'ı başlat
    initReviewsSlider();
    
    // Dikey video carousel'i başlat
    initVerticalVideoCarousel();
    
    // Video modal'ı başlat
    setupVideoModal();
    
    // Tüm carousel'leri başlat
    setupCarousel('.universities-slider', '.universities-prev', '.universities-next', '.universities-dots');
    setupCarousel('.flags-slider', '.flags-prev', '.flags-next', '.flags-dots');
    
    // Service carousel'i başlat
    initServiceCarousel();
    
    // Team carousel'i başlat
    initTeamCarousel();
    
    // Sayı animasyonlarını başlat
    animateNumbers();
    
    // Form görünürlük kontrolü
    checkFormVisibility();
    
    // Mobil viewport height ayarla
    setMobileViewportHeight();
    
    // Dokunmatik kaydırma etkinleştir
    enableTouchScroll('.mobile-touch-scroll');
}); 

// Başarılı form gönderimi popup'ı
function showSuccessPopup() {
    // Eğer daha önce popup varsa kaldır
    const existing = document.getElementById('success-popup');
    if (existing) existing.remove();

    // Popup elementi oluştur
    const popup = document.createElement('div');
    popup.id = 'success-popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.background = 'rgba(0,0,0,0.5)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.style.zIndex = '9999';

    popup.innerHTML = `
        <div style="background: #fff; padding: 32px 24px; border-radius: 12px; box-shadow: 0 4px 32px rgba(0,0,0,0.15); max-width: 90vw; width: 350px; text-align: center;">
            <div style="font-size: 32px; color: #ff8a00; margin-bottom: 12px;">🎉</div>
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Tebrikler!</div>
            <div style="font-size: 15px; margin-bottom: 18px;">1 haftalık dil kursu kazandınız,<br>Danışmanlarımız sizinle iletişime geçecek.</div>
            <button id="close-success-popup" style="margin-top: 8px; padding: 8px 20px; background: #ff8a00; color: #fff; border: none; border-radius: 6px; font-size: 15px; cursor: pointer;">Tamam</button>
        </div>
    `;

    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';

    document.getElementById('close-success-popup').onclick = function() {
        popup.remove();
        document.body.style.overflow = '';
    };
} 