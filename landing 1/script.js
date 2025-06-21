document.addEventListener('DOMContentLoaded', function() {
    // AOS (Animate On Scroll) başlatma
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50,
        delay: 0,
        anchorPlacement: 'top-bottom',
        disable: 'mobile', // Mobil cihazlarda animasyonları devre dışı bırakarak yükleme sorunlarını önleyelim
        startEvent: 'load' // DOMContentLoaded yerine load olayında başlatsın
    });

    // Bütün içeriğin hemen yüklenmesini sağlamak için
    setTimeout(function() {
        // Tüm AOS animasyonlarının hemen etkinleştirilmesi
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
        
        // Tüm içeriğin görünür olması için
        refreshPageElements(false);
    }, 500);

    // Navbar scroll efekti
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Ekip Slider başlatma
    initSliders();
    
    // Video Modal başlatma
    initVideoModal();
    
    // Form İşlemleri
    initContactForm();
    
    // Sayfa içi linkler
    initSmoothScroll();
    
    // Video konteyner efektleri
    initVideoContainerEffects();
    
    // YouTube videolarını tıklamaya duyarlı yap
    setupYouTubeVideoPlaceholders();
    
    // Footer ve iletişim bölümü görünürlüğünü zorlama
    ensureFooterVisibility();

    // Sayfa yüklenirken ve sonrasında birkaç kez tekrar kontrol et
    window.addEventListener('load', onPageFullyLoaded);
    
    // Sayfa kaydırma olayını dinle
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if (window.scrollY > window.innerHeight / 2) {
                ensureFooterVisibility();
                refreshPageElements();
            }
        }, 200);
    });

    // Öğrenci videoları için mobil slider fonksiyonu
    initMobileVideoSlider();
    
    // Floating videolar için mobil slider fonksiyonu
    initFloatingVideoSlider();
    
    // Ekran boyutu değiştiğinde tekrar çağır
    window.addEventListener('resize', function() {
        initMobileVideoSlider();
        initFloatingVideoSlider();
    });

    // İyileştirilmiş video önizleme tıklamalarını işle
    initVideoClickHandlers();
});

// Sayfa tamamen yüklendiğinde çalışacak kod
window.addEventListener('load', function() {
    // Sayfa yüklendi işareti
    document.body.classList.add('page-loaded');
    
    // Tüm AOS elementlerini hemen göster
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
    });
    
    // Tüm içeriği görünür yap
    makeAllContentVisible();
    
    // Slick slider'ları yeniden başlat
    if (typeof $.fn.slick !== 'undefined') {
        $('.slick-slider').each(function() {
            $(this).slick('setPosition');
        });
    }
    
    // Son bir kez daha içeriği yenile
    setTimeout(function() {
        refreshPageElements(false);
    }, 1000);
});

// Tüm içeriği görünür yapan yardımcı fonksiyon
function makeAllContentVisible() {
    // Tüm ana bölümleri göster
    document.querySelectorAll('section, .container, header, footer').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Tüm service kartlarını göster
    document.querySelectorAll('.service-card, .service-slide').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Tüm video konteynerlerini göster
    document.querySelectorAll('.video-container, .student-video-container, .inline-video-container, .youtube-video-container, .floating-video').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Tüm team slide'ları göster
    document.querySelectorAll('.team-slide, .team-member').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Form ve diğer elementleri göster
    document.querySelectorAll('.form-wrapper, .advantage-item, .agency-feature, .contact-item').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
}

// YouTube videolarını tıklamaya duyarlı yapan fonksiyon
function setupYouTubeVideoPlaceholders() {
    try {
        // Önce videoları işle, API'yi sadece ihtiyaç olduğunda yükle
        processYouTubeVideos();
        
        // YouTube API'si sadece tıklandığında yüklenmesi için global değişken
        window.isYouTubeAPILoaded = false;
        window.pendingYouTubePlayers = [];
        
        // YouTube API'sini yükleme fonksiyonu, sadece bir kez çağrılacak
        window.loadYouTubeAPI = function() {
            if (window.isYouTubeAPILoaded) return;
            
            console.log("YouTube API yükleniyor...");
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // API hazır olduğunda bekleyen oynatıcıları yükle
            window.onYouTubeIframeAPIReady = function() {
                console.log("YouTube API hazır, bekleyen videolar yükleniyor...");
                window.isYouTubeAPILoaded = true;
                
                // Bekleyen tüm oynatıcıları yükle
                window.pendingYouTubePlayers.forEach(function(playerConfig) {
                    try {
                        new YT.Player(playerConfig.id, playerConfig.options);
                    } catch (e) {
                        console.error("Bekleyen YouTube player yükleme hatası:", e);
                    }
                });
                
                // Bekleyen listesini temizle
                window.pendingYouTubePlayers = [];
            };
        };
        
        // Bir video oynatıcıyı yükleyen veya kuyruğa ekleyen fonksiyon
        window.loadOrQueueYouTubePlayer = function(playerId, options) {
            // Eğer API yüklenmemişse, API'yi yükle ve oynatıcıyı kuyruğa ekle
            if (!window.isYouTubeAPILoaded) {
                if (!window.YT) {
                    window.loadYouTubeAPI();
                }
                
                window.pendingYouTubePlayers.push({
                    id: playerId,
                    options: options
                });
                
                return false;
            } 
            // API yüklenmişse doğrudan oynatıcıyı yükle
            else {
                try {
                    new YT.Player(playerId, options);
                    return true;
                } catch (e) {
                    console.error("YouTube player yükleme hatası:", e);
                    return false;
                }
            }
        };
    } catch (e) {
        console.error("YouTube video önizleme hatası:", e);
    }
}

// YouTube videolarını işle
function processYouTubeVideos() {
    try {
        // Tüm YouTube iframe'lerini bul
        const youtubeIframes = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="youtu.be"]');
        
        if (youtubeIframes.length > 0) {
            console.log(`${youtubeIframes.length} YouTube videosu için işleniyor...`);
            
            youtubeIframes.forEach((iframe, index) => {
                // Video ID'sini src'den çıkart
                let videoId = '';
                const src = iframe.src;
                
                // YouTube video ID'sini çıkart
                if (src.includes('youtube.com/embed/')) {
                    videoId = src.split('youtube.com/embed/')[1].split('?')[0];
                } else if (src.includes('youtube.com/watch')) {
                    const urlParams = new URLSearchParams(src.split('?')[1]);
                    videoId = urlParams.get('v');
                } else if (src.includes('youtu.be/')) {
                    videoId = src.split('youtu.be/')[1].split('?')[0];
                }
                
                if (videoId) {
                    // İframe'in boyutlarını al
                    const width = iframe.width || iframe.style.width || '100%';
                    const height = iframe.height || iframe.style.height || '100%';
                    
                    // İframe'in parent elementini al
                    const parent = iframe.parentElement;
                    
                    // Video başlığını al
                    const videoTitle = iframe.getAttribute('title') || `Video ${index + 1}`;
                    
                    // İframe'i sakla
                    iframe.style.display = 'none';
                    
                    // Eğer video ID'si varsa, özel bir div oluştur
                    const videoContainer = document.createElement('div');
                    videoContainer.id = 'youtube-player-' + index;
                    videoContainer.className = 'youtube-api-player';
                    videoContainer.dataset.videoId = videoId;
                    videoContainer.style.width = width;
                    videoContainer.style.height = height;
                    videoContainer.style.backgroundColor = '#000';
                    videoContainer.style.borderRadius = '8px';
                    videoContainer.style.overflow = 'hidden';
                    videoContainer.style.position = 'relative';
                    
                    // Placeholder görüntüsü (daha yüksek kalite)
                    const placeholderImage = document.createElement('div');
                    placeholderImage.className = 'youtube-placeholder-image';
                    placeholderImage.style.backgroundImage = `url(https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp)`;
                    placeholderImage.style.backgroundSize = 'cover';
                    placeholderImage.style.backgroundPosition = 'center';
                    placeholderImage.style.width = '100%';
                    placeholderImage.style.height = '100%';
                    placeholderImage.style.position = 'absolute';
                    placeholderImage.style.top = '0';
                    placeholderImage.style.left = '0';
                    placeholderImage.style.transition = 'all 0.3s ease';
                    placeholderImage.style.cursor = 'pointer';
                    
                    // Yedek oluştur (maxresdefault çalışmazsa)
                    placeholderImage.onerror = function() {
                        this.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
                    };
                    
                    // Daha iyi bir ön yükleme performansı için görüntüleri ön yükleme
                    const preloadImage = new Image();
                    preloadImage.src = `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`;
                    preloadImage.onerror = function() {
                        const fallbackImage = new Image();
                        fallbackImage.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                    };
                    
                    // Koyu overlay ekle
                    const overlay = document.createElement('div');
                    overlay.className = 'youtube-overlay';
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    overlay.style.transition = 'all 0.3s ease';
                    
                    // Play butonu oluştur
                    const playButton = document.createElement('div');
                    playButton.className = 'youtube-play-button';
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                    playButton.style.position = 'absolute';
                    playButton.style.top = '50%';
                    playButton.style.left = '50%';
                    playButton.style.transform = 'translate(-50%, -50%)';
                    playButton.style.backgroundColor = '#ff0000';
                    playButton.style.color = 'white';
                    playButton.style.width = '60px';
                    playButton.style.height = '60px';
                    playButton.style.borderRadius = '50%';
                    playButton.style.display = 'flex';
                    playButton.style.justifyContent = 'center';
                    playButton.style.alignItems = 'center';
                    playButton.style.fontSize = '24px';
                    playButton.style.transition = 'all 0.3s ease';
                    playButton.style.zIndex = '2';
                    playButton.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
                    
                    // Hata mesajı
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'youtube-error-message';
                    errorMessage.innerHTML = 'Bu video kullanılamıyor veya gömülemez durumda. <br>Lütfen daha sonra tekrar deneyin.';
                    errorMessage.style.position = 'absolute';
                    errorMessage.style.top = '50%';
                    errorMessage.style.left = '50%';
                    errorMessage.style.transform = 'translate(-50%, -50%)';
                    errorMessage.style.color = 'white';
                    errorMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    errorMessage.style.padding = '15px 20px';
                    errorMessage.style.borderRadius = '5px';
                    errorMessage.style.textAlign = 'center';
                    errorMessage.style.width = '80%';
                    errorMessage.style.display = 'none';
                    errorMessage.style.zIndex = '3';
                    
                    // Video başlığı
                    const titleElement = document.createElement('div');
                    titleElement.className = 'youtube-video-title';
                    titleElement.textContent = videoTitle;
                    titleElement.style.position = 'absolute';
                    titleElement.style.bottom = '0';
                    titleElement.style.left = '0';
                    titleElement.style.width = '100%';
                    titleElement.style.padding = '10px';
                    titleElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    titleElement.style.color = 'white';
                    titleElement.style.textAlign = 'center';
                    
                    // Bileşenleri ekle
                    videoContainer.appendChild(placeholderImage);
                    videoContainer.appendChild(overlay);
                    videoContainer.appendChild(playButton);
                    videoContainer.appendChild(errorMessage);
                    videoContainer.appendChild(titleElement);
                    
                    // YouTube oynatıcısını yükleme ve oynatma fonksiyonu
                    const loadYouTubePlayer = function() {
                        // Görsel değişiklikleri
                        placeholderImage.style.opacity = '0.7';
                        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                        playButton.style.display = 'none';
                        titleElement.style.display = 'none';
                        
                        try {
                            // Player yapılandırmasını hazırla
                            const playerConfig = {
                                videoId: videoId,
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                    autoplay: 1,
                                    modestbranding: 1,
                                    rel: 0,
                                    showinfo: 0,
                                    fs: 1,
                                    playsinline: 1
                                },
                                events: {
                                    onReady: function(event) {
                                        console.log(`Video ${index + 1} hazır`);
                                        event.target.playVideo();
                                    },
                                    onError: function(event) {
                                        console.error(`Video yükleme hatası: ${event.data}`);
                                        let errorText = 'Bu video kullanılamıyor.';
                                        
                                        switch(event.data) {
                                            case 2: errorText = 'Geçersiz video ID.'; break;
                                            case 5: errorText = 'HTML5 player hatası.'; break;
                                            case 100: errorText = 'Video bulunamadı veya kaldırılmış.'; break;
                                            case 101:
                                            case 150: errorText = 'Video sahibi tarafından gömülmeye izin verilmiyor.'; break;
                                        }
                                        
                                        // Hata mesajını göster
                                        placeholderImage.style.opacity = '0.3';
                                        placeholderImage.style.filter = 'blur(3px)';
                                        errorMessage.textContent = errorText;
                                        errorMessage.style.display = 'block';
                                        
                                        // Tekrar tıklama için ikonu değiştir
                                        setTimeout(() => {
                                            playButton.innerHTML = '<i class="fas fa-redo"></i>';
                                            playButton.style.display = 'flex';
                                        }, 1000);
                                    },
                                    onStateChange: function(event) {
                                        if (event.data === YT.PlayerState.PLAYING) {
                                            console.log(`Video ${index + 1} oynatılıyor`);
                                            // Video başladı, placeholder'ı tamamen kaldır
                                            placeholderImage.style.display = 'none';
                                            overlay.style.display = 'none';
                                        }
                                    }
                                }
                            };
                            
                            // YouTube API'yi kullanarak veya kuyruğa ekleyerek oynatıcıyı yükle
                            if (window.loadOrQueueYouTubePlayer) {
                                window.loadOrQueueYouTubePlayer(videoContainer.id, playerConfig);
                            } else {
                                // Eski yöntem - API henüz yüklenmemiş olabilir
                                if (window.YT && window.YT.Player) {
                                    new YT.Player(videoContainer.id, playerConfig);
                                } else {
                                    console.error("YouTube API henüz yüklenmemiş");
                                    setTimeout(() => {
                                        if (window.YT && window.YT.Player) {
                                            new YT.Player(videoContainer.id, playerConfig);
                                        } else {
                                            errorMessage.textContent = "YouTube API yüklenemedi. Lütfen sayfayı yenileyin.";
                                            errorMessage.style.display = 'block';
                                        }
                                    }, 1000);
                                }
                            }
                        } catch (e) {
                            console.error("YouTube player oluşturma hatası:", e);
                            errorMessage.textContent = "Video yüklenemedi. Lütfen daha sonra tekrar deneyin.";
                            errorMessage.style.display = 'block';
                            playButton.style.display = 'flex';
                        }
                    };
                    
                    // Elemana tıklama olayı ekle - play butonuna veya resme tıklanabilir
                    videoContainer.addEventListener('click', function() {
                        if (!this.classList.contains('youtube-player-loaded')) {
                            this.classList.add('youtube-player-loaded');
                            loadYouTubePlayer();
                        }
                    });
                    
                    // Placeholder'ı iframe yerine ekle
                    parent.insertBefore(videoContainer, iframe);
                    
                    // Container elementlerini görünür yap
                    const container = parent.closest('.video-container, .youtube-video-container, .student-video-container, .floating-video');
                    if (container) {
                        container.style.visibility = 'visible';
                        container.style.opacity = '1';
                        container.style.display = 'block';
                    }
                    
                    // Hover efekti
                    videoContainer.addEventListener('mouseenter', function() {
                        if (!this.classList.contains('youtube-player-loaded')) {
                            playButton.style.transform = 'translate(-50%, -50%) scale(1.2)';
                            playButton.style.backgroundColor = '#cc0000';
                            this.style.transform = 'scale(1.05)';
                            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                        }
                    });
                    
                    videoContainer.addEventListener('mouseleave', function() {
                        if (!this.classList.contains('youtube-player-loaded')) {
                            playButton.style.transform = 'translate(-50%, -50%) scale(1)';
                            playButton.style.backgroundColor = '#ff0000';
                            this.style.transform = 'scale(1)';
                            this.style.boxShadow = 'none';
                            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                        }
                    });
                    
                    // IntersectionObserver kullanarak video görünür olduğunda daha kaliteli resim yükleme
                    if ('IntersectionObserver' in window) {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // Görünür olduğunda yüksek kaliteli resim yükle
                                    const betterImage = new Image();
                                    betterImage.onload = function() {
                                        placeholderImage.style.backgroundImage = `url(${this.src})`;
                                    };
                                    betterImage.src = `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`;
                                    
                                    // Gözlemlemeyi sonlandır
                                    observer.unobserve(entry.target);
                                }
                            });
                        }, {
                            threshold: 0.1
                        });
                        
                        observer.observe(videoContainer);
                    }
                } else {
                    // Video ID bulunamadıysa iframe'i normal olarak göster
                    iframe.style.display = 'block';
                    iframe.style.visibility = 'visible';
                    iframe.style.opacity = '1';
                    
                    // Lazy loading ekle
                    iframe.loading = 'lazy';
                }
            });
        } else {
            console.log("Sayfada YouTube videosu bulunamadı");
        }
    } catch (e) {
        console.error("YouTube işleme hatası:", e);
    }
}

function initSliders() {
    // Team slider
    $('.team-slider').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        dots: true,
        prevArrow: $('.team-prev-arrow'),
        nextArrow: $('.team-next-arrow'),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: false
                }
            }
        ]
    });
    
    // Hizmet Kartları Slider başlatma
    $('.services-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: $('.services-prev-arrow'),
        nextArrow: $('.services-next-arrow'),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '30px'
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    centerMode: false
                }
            }
        ]
    });
}

function initVideoModal() {
    // Video Modal oluşturma ve başlatma
    try {
        const modal = document.createElement('div');
        modal.classList.add('video-modal');
        
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay');
        
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('close-modal');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('modal-video-container');
        
        const videoElement = document.createElement('video');
        videoElement.setAttribute('controls', '');
        videoElement.setAttribute('autoplay', '');
        
        videoContainer.appendChild(videoElement);
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(videoContainer);
        modal.appendChild(modalOverlay);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Modal açılma animasyonu
        function openModal(videoSrc) {
            videoElement.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
            videoElement.load();
            
            document.body.classList.add('modal-open');
            modal.classList.add('active');
            
            setTimeout(() => {
                modalContent.classList.add('animate-in');
            }, 50);
        }
        
        // Modal kapanma animasyonu
        function closeModal() {
            modalContent.classList.remove('animate-in');
            
            setTimeout(() => {
                videoElement.pause();
                videoElement.innerHTML = '';
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }, 300);
        }
        
        // Modal kapatma işlevi
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        
        // ESC tuşu ile kapatma
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Video thumbnail'lere tıklama
        document.querySelectorAll('.video-play-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const videoSrc = this.getAttribute('data-video');
                openModal(videoSrc);
            });
        });
    } catch (e) {
        console.error("Video modal hatası:", e);
    }
}

// İletişim formu için webhook entegrasyonu
function initContactForm() {
    // İletişim formu işlemleri
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        try {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Form doğrulama
                let isValid = true;
                let firstInvalidField = null;
                
                // Tüm gerekli alanları doğrula
                contactForm.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('is-invalid');
                        if (!firstInvalidField) firstInvalidField = field;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                if (!isValid) {
                    if (firstInvalidField) firstInvalidField.focus();
                    return;
                }
                
                // Form gönderim simülasyonu
                const submitBtn = contactForm.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
                    submitBtn.disabled = true;
                    
                    // Form verilerini topla
                    const formData = new FormData(contactForm);
                    const data = {};
                    
                    // FormData'yı JSON formatına dönüştür
                    for (const [key, value] of formData.entries()) {
                        data[key] = value;
                    }

                    // Webhook URL
                    const webhookUrl = 'https://hook.eu2.make.com/3bkg46furfi9hwtrr7mug4hjk3rc7rzl';
                    
                    // Webhook'a veri gönder
                    fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        }
                        throw new Error('Webhook yanıtı başarısız');
                    })
                    .then(responseText => {
                        console.log('Webhook yanıtı:', responseText);
                        
                        // Başarılı form gönderimi mesajı
                        alert('Form başarıyla gönderildi! Teşekkürler.');
                        contactForm.reset();
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Hemen Başvuru Yap';
                        submitBtn.disabled = false;
                    })
                    .catch(error => {
                        console.error('Webhook hatası:', error);
                        alert('Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Hemen Başvuru Yap';
                        submitBtn.disabled = false;
                    });
                }
            });
            
            // Input alanları için iyileştirilmiş stil kontrolleri
            contactForm.querySelectorAll('.form-control').forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('input-focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('input-focused');
                    }
                });
            });
        } catch (e) {
            console.error("Form işleme hatası:", e);
        }
    }
}

function initSmoothScroll() {
    // Sayfa içi bağlantılar için kaydırma efekti
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Elementleri görünür kıl
                    setTimeout(() => {
                        ensureElementVisible(targetElement);
                    }, 100);
                }
            });
        });
    } catch (e) {
        console.error("Smooth scroll hatası:", e);
    }
}

function initVideoContainerEffects() {
    // Video konteynerlerine hover efektleri
    try {
        const containers = document.querySelectorAll('.video-container, .student-video-container, .youtube-video-container, .floating-video');
        containers.forEach(container => {
            // Hover efekti ekle
            container.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            });
            
            container.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });
    } catch (e) {
        console.error("Video konteyner efekt hatası:", e);
    }
}

function ensureFooterVisibility() {
    // İletişim formu ve footer elementlerinin görünürlüğünü garantile
    try {
        // Sayfanın son kısmındaki elementleri seç
        const footerSections = document.querySelectorAll('.contact-form-section, .agency-section, .about-agency-section, .footer-section, #contact-form, #contact');
        
        // Her bir elementi görünür hale getir
        footerSections.forEach(section => {
            if (section) {
                // Element stillerini zorla
                section.style.visibility = 'visible';
                section.style.display = 'block';
                section.style.opacity = '1';
                
                // İç elementleri de görünür yap
                const children = section.querySelectorAll('*');
                children.forEach(child => {
                    child.style.visibility = 'visible';
                    child.style.opacity = '1';
                    
                    // Özel elementler için ek kontroller
                    if (child.tagName === 'IFRAME') {
                        child.style.display = 'block';
                    }
                });
                
                // İçerisindeki iframe'leri yenile
                const iframes = section.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    const src = iframe.src;
                    iframe.style.display = 'block';
                    
                    // Sadece src değerini değiştirerek iframe'i yenileme
                    // Bu yapıyı aynı değerle atama ile yeniliyoruz (iframe'in yeniden yüklenmesini tetikler)
                    // Bu yöntem iframe'i komple değiştirmeden hafif bir yenileme sağlar
                    if (src) {
                        iframe.src = src;
                    }
                });
            }
        });
        
        // Özel olarak harita iframe'ini kontrol et
        const mapIframe = document.querySelector('.map-container iframe');
        if (mapIframe) {
            mapIframe.style.display = 'block';
            mapIframe.style.visibility = 'visible';
            mapIframe.style.opacity = '1';
            mapIframe.style.height = '450px';
        }
    } catch (e) {
        console.error("Footer görünürlük hatası:", e);
    }
}

function ensureElementVisible(element) {
    // Herhangi bir elementi görünür yapmak için
    if (!element) return;
    
    // Element ve üst elementlerini görünür yap
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    element.style.display = element.tagName === 'IFRAME' ? 'block' : '';
    
    // Parent elementler için de görünürlük sağla
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
        parent.style.visibility = 'visible';
        parent.style.opacity = '1';
        parent = parent.parentElement;
    }
    
    // Element içindeki iframe'leri yenile
    const iframes = element.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        if (iframe.src) {
            iframe.style.display = 'block';
            // iframe src değerini aynı değerle atayarak yeniden yüklenmesini sağla
            iframe.src = iframe.src;
        }
    });
}

function refreshPageElements(skipVideoIframes = false) {
    // Tüm AOS elementlerini animasyon durumuna getir
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
    });
    
    // Tüm slick karusellerini yeniden başlat
    if (typeof $.fn.slick !== 'undefined') {
        $('.slick-slider').each(function() {
            $(this).slick('setPosition');
        });
    }
    
    // Video içeriklerini yenileme
    if (!skipVideoIframes) {
        // YouTube iframelerini yeniden yükle
        document.querySelectorAll('iframe[src*="youtube.com"]').forEach(iframe => {
            let src = iframe.src;
            iframe.src = src;
        });
    }
    
    // Görünürlük sorunu olan elementleri zorla göster
    document.querySelectorAll('.service-card, .video-container, .student-video-container, .team-slide, .floating-video, .agency-feature').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
}

function onPageFullyLoaded() {
    document.body.classList.add('loaded');
    
    // Sayfa sonuna yakın elementlerin görünürlüğünü sağla
    ensureFooterVisibility();
    
    // YouTube videolarını tekrar başlatma olaylarını engelle
    preventVideoAutoRestart();
}

// İyileştirilmiş Öğrenci Videoları için mobil slider fonksiyonu
function initMobileVideoSlider() {
    if (window.innerWidth <= 768) {
        const videoRow = document.querySelector('.video-grid .row');
        if (!videoRow) return;
        
        // Slider göstergeleri oluştur
        createSliderDots(videoRow, 'video-slider-dots');
        
        // Slider için değişkenler
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragged = false;
        let activeIndex = 0;
        let prevScrollLeft = 0;
        const videoItems = videoRow.querySelectorAll('.col-md-4');
        
        // Mouse olayları
        videoRow.addEventListener('mousedown', (e) => {
            isDown = true;
            videoRow.style.cursor = 'grabbing';
            startX = e.pageX - videoRow.offsetLeft;
            scrollLeft = videoRow.scrollLeft;
            prevScrollLeft = scrollLeft;
            isDragged = false;
        });
        
        videoRow.addEventListener('mouseleave', () => {
            isDown = false;
            videoRow.style.cursor = 'grab';
        });
        
        videoRow.addEventListener('mouseup', (e) => {
            isDown = false;
            videoRow.style.cursor = 'grab';
            
            // Sadece çok az bir kaydırma olduysa (tıklama) videoyu ortala
            if (Math.abs(prevScrollLeft - videoRow.scrollLeft) < 10) {
                const rect = videoRow.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                // Hangi videonun tıklandığını bul
                videoItems.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    if (clickX >= itemRect.left - rect.left && clickX <= itemRect.right - rect.left) {
                        scrollToVideoItem(videoRow, index);
                    }
                });
            } else {
                // Kaydırma sonrası en yakın videoyu hizala
                snapToClosestVideo(videoRow);
            }
        });
        
        videoRow.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            isDragged = true;
            const x = e.pageX - videoRow.offsetLeft;
            const walk = (x - startX) * 2;
            videoRow.scrollLeft = scrollLeft - walk;
            updateActiveVideo(videoRow);
        });
        
        // Dokunmatik ekran olayları
        videoRow.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - videoRow.offsetLeft;
            scrollLeft = videoRow.scrollLeft;
            prevScrollLeft = scrollLeft;
            isDragged = false;
        });
        
        videoRow.addEventListener('touchend', () => {
            isDown = false;
            
            // Kaydırma sonrası en yakın videoyu hizala
            snapToClosestVideo(videoRow);
        });
        
        videoRow.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            isDragged = true;
            const x = e.touches[0].pageX - videoRow.offsetLeft;
            const walk = (x - startX) * 1.5;
            videoRow.scrollLeft = scrollLeft - walk;
            updateActiveVideo(videoRow);
        });
        
        // Scroll olayı
        videoRow.addEventListener('scroll', () => {
            updateActiveVideo(videoRow);
        });
        
        // İlk aktif videoyu ayarla
        setTimeout(() => {
            // İlk videoyu ortala
            if (videoItems.length > 0) {
                scrollToVideoItem(videoRow, 0);
                updateActiveVideo(videoRow);
            }
        }, 100);
    }
}

// İyileştirilmiş Floating Videolar için mobil slider fonksiyonu
function initFloatingVideoSlider() {
    if (window.innerWidth <= 992) {
        const floatingVideosContainer = document.querySelector('.floating-videos-container');
        if (!floatingVideosContainer) return;
        
        // Slider göstergeleri oluştur
        createSliderDots(floatingVideosContainer, 'floating-slider-dots');
        
        // Slider için değişkenler
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragged = false;
        let prevScrollLeft = 0;
        const videoItems = floatingVideosContainer.querySelectorAll('.floating-video');
        
        // Mouse olayları
        floatingVideosContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            floatingVideosContainer.style.cursor = 'grabbing';
            startX = e.pageX - floatingVideosContainer.offsetLeft;
            scrollLeft = floatingVideosContainer.scrollLeft;
            prevScrollLeft = scrollLeft;
            isDragged = false;
        });
        
        floatingVideosContainer.addEventListener('mouseleave', () => {
            isDown = false;
            floatingVideosContainer.style.cursor = 'grab';
        });
        
        floatingVideosContainer.addEventListener('mouseup', (e) => {
            isDown = false;
            floatingVideosContainer.style.cursor = 'grab';
            
            // Sadece çok az bir kaydırma olduysa (tıklama) videoyu ortala
            if (Math.abs(prevScrollLeft - floatingVideosContainer.scrollLeft) < 10) {
                const rect = floatingVideosContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                
                // Hangi videonun tıklandığını bul
                videoItems.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    if (clickX >= itemRect.left - rect.left && clickX <= itemRect.right - rect.left) {
                        scrollToVideoItem(floatingVideosContainer, index);
                    }
                });
            } else {
                // Kaydırma sonrası en yakın videoyu hizala
                snapToClosestVideo(floatingVideosContainer);
            }
        });
        
        floatingVideosContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            isDragged = true;
            const x = e.pageX - floatingVideosContainer.offsetLeft;
            const walk = (x - startX) * 2;
            floatingVideosContainer.scrollLeft = scrollLeft - walk;
            updateActiveVideo(floatingVideosContainer);
        });
        
        // Dokunmatik ekran olayları
        floatingVideosContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - floatingVideosContainer.offsetLeft;
            scrollLeft = floatingVideosContainer.scrollLeft;
            prevScrollLeft = scrollLeft;
            isDragged = false;
        });
        
        floatingVideosContainer.addEventListener('touchend', () => {
            isDown = false;
            
            // Kaydırma sonrası en yakın videoyu hizala
            snapToClosestVideo(floatingVideosContainer);
        });
        
        floatingVideosContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            isDragged = true;
            const x = e.touches[0].pageX - floatingVideosContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            floatingVideosContainer.scrollLeft = scrollLeft - walk;
            updateActiveVideo(floatingVideosContainer);
        });
        
        // Scroll olayı
        floatingVideosContainer.addEventListener('scroll', () => {
            updateActiveVideo(floatingVideosContainer);
        });
        
        // Slider görünümünü ayarla
        floatingVideosContainer.style.cursor = 'grab';
        
        // İlk aktif videoyu ayarla
        setTimeout(() => {
            // İkinci videoyu ortala (eğer varsa)
            if (videoItems.length > 1) {
                scrollToVideoItem(floatingVideosContainer, 1);
            } else if (videoItems.length > 0) {
                scrollToVideoItem(floatingVideosContainer, 0);
            }
            updateActiveVideo(floatingVideosContainer);
        }, 100);
    }
}

// Slider göstergeleri oluştur
function createSliderDots(container, className) {
    // Önce varsa eski göstergeleri kaldır
    const oldDots = document.querySelector('.' + className);
    if (oldDots) {
        oldDots.remove();
    }
    
    // Konteynerdeki çocuk elementleri seç
    let items;
    if (container.classList.contains('floating-videos-container')) {
        items = container.querySelectorAll('.floating-video');
    } else {
        items = container.querySelectorAll('.col-md-4');
    }
    
    // Gösterge yoksa oluşturma
    if (items.length <= 1) return;
    
    // Göstergeleri oluştur
    const dots = document.createElement('ul');
    dots.className = className;
    
    items.forEach((_, index) => {
        const dot = document.createElement('li');
        dot.addEventListener('click', () => {
            scrollToVideoItem(container, index);
        });
        dots.appendChild(dot);
    });
    
    // Göstergeleri konteyner sonrasına ekle
    container.parentNode.appendChild(dots);
}

// En yakın videoyu hizala
function snapToClosestVideo(container) {
    // Konteynerdeki çocuk elementleri seç
    let items;
    if (container.classList.contains('floating-videos-container')) {
        items = container.querySelectorAll('.floating-video');
    } else {
        items = container.querySelectorAll('.col-md-4');
    }
    
    if (items.length === 0) return;
    
    // Merkeze en yakın öğeyi bul
    const containerCenter = container.offsetWidth / 2;
    let closestItem = null;
    let closestDistance = Infinity;
    let closestIndex = 0;
    
    items.forEach((item, index) => {
        const itemLeft = item.offsetLeft - container.scrollLeft;
        const itemCenter = itemLeft + (item.offsetWidth / 2);
        const distance = Math.abs(containerCenter - itemCenter);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
            closestIndex = index;
        }
    });
    
    // En yakın öğeye kaydır
    if (closestItem) {
        scrollToVideoItem(container, closestIndex);
    }
}

// Belirli bir video öğesine kaydır
function scrollToVideoItem(container, index) {
    // Konteynerdeki çocuk elementleri seç
    let items;
    if (container.classList.contains('floating-videos-container')) {
        items = container.querySelectorAll('.floating-video');
    } else {
        items = container.querySelectorAll('.col-md-4');
    }
    
    if (index >= items.length || index < 0) return;
    
    const item = items[index];
    const containerWidth = container.offsetWidth;
    const itemWidth = item.offsetWidth;
    
    // Öğeyi merkeze hizala
    const scrollPosition = item.offsetLeft - (containerWidth / 2) + (itemWidth / 2);
    
    // Animasyonlu kaydırma
    container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    // Dots güncelle
    updateDots(container, index);
}

// Aktif videoyu güncelle
function updateActiveVideo(container) {
    // Konteynerdeki çocuk elementleri seç
    let items, dotClass;
    if (container.classList.contains('floating-videos-container')) {
        items = container.querySelectorAll('.floating-video');
        dotClass = 'floating-slider-dots';
    } else {
        items = container.querySelectorAll('.col-md-4');
        dotClass = 'video-slider-dots';
    }
    
    if (items.length === 0) return;
    
    // Merkeze en yakın öğeyi bul
    const containerCenter = container.offsetWidth / 2;
    let closestItem = null;
    let closestDistance = Infinity;
    let closestIndex = 0;
    
    items.forEach((item, index) => {
        const itemLeft = item.offsetLeft - container.scrollLeft;
        const itemCenter = itemLeft + (item.offsetWidth / 2);
        const distance = Math.abs(containerCenter - itemCenter);
        
        // Ölçeklendirme ve opaklık efektleri
        const scale = 0.92 + ((1 - Math.min(distance / (container.offsetWidth / 2), 1)) * 0.08);
        const opacity = 0.8 + ((1 - Math.min(distance / (container.offsetWidth / 2), 1)) * 0.2);
        
        item.style.transform = `scale(${scale})`;
        item.style.opacity = opacity;
        
        // active sınıfını kaldır
        item.classList.remove('active');
        
        // Öğrenci videolarında, video kaplarına active sınıfını kaldır
        if (!container.classList.contains('floating-videos-container')) {
            const videoContainer = item.querySelector('.student-video-container');
            if (videoContainer) {
                videoContainer.classList.remove('active');
            }
        }
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
            closestIndex = index;
        }
    });
    
    // En yakın öğeyi aktifleştir
    if (closestItem) {
        closestItem.classList.add('active');
        
        // Öğrenci videolarında, video kabına active sınıfı ekle
        if (!container.classList.contains('floating-videos-container')) {
            const videoContainer = closestItem.querySelector('.student-video-container');
            if (videoContainer) {
                videoContainer.classList.add('active');
            }
        }
        
        // Dots güncelle
        updateDots(container, closestIndex);
    }
}

// Gösterge noktalarını güncelle
function updateDots(container, activeIndex) {
    let dotClass;
    if (container.classList.contains('floating-videos-container')) {
        dotClass = 'floating-slider-dots';
    } else {
        dotClass = 'video-slider-dots';
    }
    
    const dots = document.querySelectorAll('.' + dotClass + ' li');
    if (dots.length === 0) return;
    
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Video önizlemeler için tıklama işleyicilerini başlat
function initVideoClickHandlers() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    
    if (videoThumbnails.length === 0) {
        console.log("Sayfada hiç video önizleme bulunamadı");
        return;
    }
    
    console.log(`${videoThumbnails.length} video önizleme bulundu ve tıklama işleyicileri ekleniyor`);
    
    // Sayfa yenilenmesini engellemek için
    window.addEventListener('beforeunload', function(e) {
        const videoIframe = document.querySelector('iframe[src*="youtube.com/embed"][data-video-active="true"]');
        if (videoIframe) {
            // Aktif video varsa onay iste
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
    
    // Video iframe'lerini scroll olayından koru
    window.protectYouTubeIframes = function() {
        document.querySelectorAll('iframe[src*="youtube.com/embed"]').forEach(iframe => {
            // Video iframe'leri için özel sınıf ve veri özniteliği ekle
            iframe.classList.add('protected-youtube-iframe');
            iframe.dataset.videoActive = "true";
            
            // Parent elementi de koru
            const parent = iframe.parentElement;
            if (parent) {
                parent.classList.add('video-iframe-protected');
                
                // Tüm üst seviye containerları da koru
                let ancestor = parent.parentElement;
                while (ancestor && !ancestor.classList.contains('video-iframe-ancestor-protected')) {
                    ancestor.classList.add('video-iframe-ancestor-protected');
                    ancestor = ancestor.parentElement;
                }
            }
        });
    };
    
    videoThumbnails.forEach((thumbnail, index) => {
        // Daha önce olayı dinlemeye başlamış olabilir, önce temizle
        const oldThumb = thumbnail.cloneNode(true);
        thumbnail.parentNode.replaceChild(oldThumb, thumbnail);
        
        // Yeni dinleyici ekle
        oldThumb.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation(); // Olayın üst elementlere yayılmasını engelle
            
            const videoId = this.getAttribute('data-video-id');
            
            if (!videoId) {
                console.error(`Video ID bulunamadı [Thumbnail ${index}]`);
                return;
            }
            
            console.log(`Tıklanan video: ${videoId} [Thumbnail ${index}]`);
            
            // Video container
            const container = this.parentNode;
            const height = this.offsetHeight || 300;
            
            // Loading göster
            this.innerHTML = `
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; background-color:rgba(0,0,0,0.6);">
                    <div style="color:white; font-size:18px;">
                        <i class="fas fa-spinner fa-spin" style="margin-right:10px;"></i> Video Yükleniyor...
                    </div>
                </div>
            ` + this.innerHTML;
            
            try {
                // Korumalı video container oluştur
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'video-iframe-container video-iframe-protected';
                
                // İframe oluştur - otomatik yenileme olmayan versiyon
                const iframe = document.createElement('iframe');
                iframe.className = 'protected-youtube-iframe youtube-player';
                
                // Video ID ve aktif durumu
                iframe.dataset.videoId = videoId;
                iframe.dataset.videoActive = "true";
                
                // rel=0 ve fs=1 parametreleri önemli
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&fs=1&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`;
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.title = 'YouTube video';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
                iframe.allowFullscreen = true;
                
                // YouTube API eklemek için ID ekle
                iframe.id = 'youtube-player-' + index;
                
                // Wrapper'a iframe'i ekle
                videoWrapper.appendChild(iframe);
                
                // Thumbnail'ı temizle ve wrapper ekle
                container.innerHTML = '';
                container.style.height = height + 'px';
                container.classList.add('video-iframe-ancestor-protected');
                container.appendChild(videoWrapper);
                
                // Tüm scroll işleyicilerini durdur
                stopAllScrollHandlers();
                
                // Video iframelerini koru
                window.protectYouTubeIframes();
                
                // İfame'in yüklenmesini izle
                iframe.onload = function() {
                    console.log(`Video ${videoId} başarıyla yüklendi`);
                    
                    // YouTube API entegrasyonu
                    if (window.YT && window.YT.Player) {
                        try {
                            new YT.Player(iframe.id, {
                                events: {
                                    'onStateChange': function(event) {
                                        // Video durduğunda
                                        if (event.data === YT.PlayerState.PAUSED) {
                                            console.log('Video duraklatıldı');
                                        }
                                    }
                                }
                            });
                        } catch(e) {
                            console.error('YouTube API hatası:', e);
                        }
                    }
                };
            } catch (error) {
                console.error("Video yükleme hatası:", error);
                showErrorMessage(this, "Video yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            }
        });
    });
}

// Tüm scroll işleyicilerini durdur
function stopAllScrollHandlers() {
    // Scroll olayı zaten atanmış mı kontrol et
    if (window.scrollHandlersStopped) return;
    
    window.scrollHandlersStopped = true;
    console.log("Scroll işleyicileri video için durduruldu");
    
    // AOS kütüphanesini koru ancak yenilenmeyi engelle
    if (window.AOS) {
        try {
            window.AOS.refresh = function() {
                console.log("AOS yenileme engellendi");
                return;
            };
        } catch(e) {
            console.error("AOS hata:", e);
        }
    }
}

// Sayfa scroll olayında da içeriği yenileme
window.addEventListener('scroll', function() {
    // Throttle scroll eventi için zamanlayıcı
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(function() {
        refreshPageElements(true);
    }, 200);
}, { passive: true });

// Video elementlerini otomatik oynatılmasını engelleme
function preventVideoAutoRestart() {
    document.querySelectorAll('iframe[src*="youtube.com"]').forEach(iframe => {
        // Videoyu otomatik yeniden başlatmayı engelle
        let src = iframe.src;
        if (src.indexOf('autoplay=1') > -1) {
            iframe.src = src.replace('autoplay=1', 'autoplay=0');
        }
    });
}

// Sayfadaki tüm video konteynerlerinin görünür olmasını sağla
function ensureVideoContainersVisible() {
    document.querySelectorAll('.video-container, .student-video-container, .inline-video-container, .youtube-video-container').forEach(container => {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
    });
}

// İnternet bağlantısını kontrol et
function checkInternetConnection() {
    return new Promise(resolve => {
        // Basit bir bağlantı kontrolü
        const testImage = new Image();
        testImage.onload = () => resolve(true);
        testImage.onerror = () => resolve(false);
        testImage.src = "https://www.google.com/favicon.ico?" + new Date().getTime();
        
        // 3 saniye sonra timeout
        setTimeout(() => resolve(navigator.onLine), 3000);
    });
}

// YouTube sunucu kontrolü
function checkYouTubeAvailability(videoId) {
    return new Promise(resolve => {
        const testImage = new Image();
        testImage.onload = () => resolve(true);
        testImage.onerror = () => resolve(false);
        testImage.src = `https://img.youtube.com/vi/${videoId}/default.jpg?` + new Date().getTime();
        
        // 3 saniye sonra timeout
        setTimeout(() => resolve(true), 3000);
    });
}

// Hata mesajı göster
function showErrorMessage(container, message) {
    container.innerHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; background-color:rgba(0,0,0,0.7); color:white; text-align:center; padding:20px;">
            <div>
                <i class="fas fa-exclamation-triangle" style="font-size:32px; margin-bottom:15px; display:block;"></i>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top:15px; padding:8px 15px; background:#4a6bff; border:none; color:white; border-radius:5px; cursor:pointer;">
                    <i class="fas fa-redo"></i> Yeniden Dene
                </button>
            </div>
        </div>
    `;
} 
