// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeParallax();
    initializeIntersectionObserver();
    initializeParticleSystem();
    initializeStatsCounter();
    initializeImageEffects();
    initializeMobileEffects();
    initializeCountrySections();
    initializeProcessSection();
    initializeFormSection();
    initializeAboutSection();
    initializeReviewsSection();
    initializeSuccessButton();
    initializeHeroForm();
    initializeGoogleReviews();
    initializeTeamSlider();
    initializeFAQ();
    initializeAnimatedText();
    initializeProgramsSection();
    initializeBadgeSlider();
});

// Animasyonları başlat
function initializeAnimations() {
    // Floating shapes animasyonları
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });

    // Floating icons animasyonları
    const icons = document.querySelectorAll('.icon-item');
    icons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.8}s`;
    });
}

// Mobil efektlerini başlat
function initializeMobileEffects() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobil için özel animasyonlar
        initializeMobileAnimations();
        initializeMobileTouchEffects();
        initializeMobileScrollEffects();
    }
}

// Mobil animasyonları
function initializeMobileAnimations() {
    // Mobil hero text animasyonu
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        heroText.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 300);
    }

    // Mobil floating icons animasyonu
    const mobileIcons = document.querySelectorAll('.floating-icons .icon-item');
    mobileIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateX(50px)';
        icon.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            icon.style.opacity = '1';
            icon.style.transform = 'translateX(0)';
        }, 800 + (index * 200));
    });
}

// Mobil touch efektleri
function initializeMobileTouchEffects() {
    const heroText = document.querySelector('.hero-text');
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    if (heroText) {
        heroText.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        heroText.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    ctaButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Mobil scroll efektleri
function initializeMobileScrollEffects() {
    let lastScrollY = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;
        
        // Mobil floating icons scroll efekti
        const floatingIcons = document.querySelector('.floating-icons');
        if (floatingIcons) {
            if (isScrollingDown) {
                floatingIcons.style.transform = 'translateY(-50%) translateX(20px)';
                floatingIcons.style.opacity = '0.7';
            } else {
                floatingIcons.style.transform = 'translateY(-50%) translateX(0)';
                floatingIcons.style.opacity = '1';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

// Resim efektlerini başlat
function initializeImageEffects() {
    const mainImage = document.querySelector('.main-image');
    const imageFrame = document.querySelector('.image-frame');
    
    if (mainImage && imageFrame) {
        // Resim yüklendiğinde özel efekt
        mainImage.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 500);
        });
        
        // Resim hover efekti (sadece desktop)
        if (window.innerWidth > 768) {
            imageFrame.addEventListener('mouseenter', function() {
                mainImage.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 40px 100px rgba(0, 0, 0, 0.5)';
            });
            
            imageFrame.addEventListener('mouseleave', function() {
                mainImage.style.transform = 'scale(1)';
                this.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)';
            });
        }
    }
}

// Particle system animasyonları
function initializeParticleSystem() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * 1}s`;
        particle.style.animationDuration = `${8 + index * 2}s`;
    });
}

// İstatistik sayaç animasyonu
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isTime = finalValue.includes('/');
                
                if (isPercentage) {
                    animatePercentage(target, finalValue);
                } else if (isTime) {
                    target.textContent = finalValue;
                } else {
                    animateNumber(target, finalValue);
                }
                observer.unobserve(target);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, finalValue) {
    const final = parseInt(finalValue.replace(/\D/g, ''));
    let current = 0;
    const increment = final / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= final) {
            current = final;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 50);
}

function animatePercentage(element, finalValue) {
    const final = parseInt(finalValue.replace(/\D/g, ''));
    let current = 0;
    const increment = final / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= final) {
            current = final;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 80);
}

// Mobil menü işlevselliği
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });

        // Menü linklerine tıklandığında menüyü kapat
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        });
    }
}

// Scroll efektleri
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // Navbar scroll efekti
        if (scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(25px)';
            navbar.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
        }
    });
}

// Parallax efektleri (sadece desktop)
function initializeParallax() {
    // Parallax efekti kaldırıldı
    return;
}

// Intersection Observer ile animasyonları tetikle
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Animasyon eklenecek elementleri gözlemle
    const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .cta-button, .main-image, .badge, .hero-stats, .trust-indicators, .success-badge, .expert-badge');
    animatedElements.forEach(el => observer.observe(el));
}

// Smooth scroll için tüm iç linkleri seç
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Sayfa yüklendiğinde animasyon efekti
window.addEventListener('load', function() {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        // Desktop animasyonları
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }

        // Floating elements animasyonu
        const floatingElements = document.querySelectorAll('.floating-shapes, .floating-icons');
        floatingElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 500 + (index * 200));
        });
    }
});

// Gelişmiş mouse move efekti (sadece desktop)
document.addEventListener('mousemove', function(e) {
    if (window.innerWidth <= 768) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // Hero image'da gelişmiş mouse hareketi efekti
    const heroImage = document.querySelector('.main-image');
    const imageFrame = document.querySelector('.image-frame');
    
    if (heroImage && imageFrame) {
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        const rotateX = (mouseY - 0.5) * 5;
        const rotateY = (mouseX - 0.5) * 5;
        
        heroImage.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        imageFrame.style.transform = `perspective(1000px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
    }
    
    // Floating icons'da gelişmiş mouse hareketi efekti
    const icons = document.querySelectorAll('.icon-item');
    icons.forEach((icon, index) => {
        const moveX = (mouseX - 0.5) * (25 + index * 5);
        const moveY = (mouseY - 0.5) * (25 + index * 5);
        icon.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Particle system mouse efekti
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const moveX = (mouseX - 0.5) * (15 + index * 2);
        const moveY = (mouseY - 0.5) * (15 + index * 2);
        particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// CTA button hover efektleri
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        if (window.innerWidth > 768) {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
});

// Gelişmiş icon hover efektleri (sadece desktop)
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) return;
    
    const iconItems = document.querySelectorAll('.icon-item');
    
    iconItems.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3) rotate(20deg)';
            this.style.boxShadow = '0 25px 70px rgba(0, 0, 0, 0.5)';
            this.style.zIndex = '10';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
            this.style.zIndex = '3';
        });
    });
});

// Badge pulse efektleri
document.addEventListener('DOMContentLoaded', function() {
    const successBadge = document.querySelector('.success-badge');
    const expertBadge = document.querySelector('.expert-badge');
    
    if (successBadge) {
        setInterval(() => {
            successBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                successBadge.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
    
    if (expertBadge) {
        setInterval(() => {
            expertBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                expertBadge.style.transform = 'scale(1)';
            }, 200);
        }, 4000);
    }
});

// Resim click efekti (sadece desktop)
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) return;
    
    const mainImage = document.querySelector('.main-image');
    
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 768;
    
    // Mobil/Desktop geçişlerinde sayfayı yeniden yükle
    if ((isMobile && window.innerWidth > 768) || (!isMobile && window.innerWidth <= 768)) {
        location.reload();
    }
}); 

// Ülke kartları için özel fonksiyonlar
function initializeCountrySections() {
    const sections = document.querySelectorAll('.country-section');
    
    sections.forEach(section => {
        const serviceCards = section.querySelectorAll('.service-card');
        
        // Service cards hover efektleri
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Diğer kartları hafifçe soluklaştır
                serviceCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.style.opacity = '0.7';
                        otherCard.style.transform = 'scale(0.95)';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                // Tüm kartları normal haline getir
                serviceCards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                    otherCard.style.transform = 'scale(1)';
                });
            });
        });
        
        // Section scroll animasyonu
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
        
        // Background image parallax efekti (sadece desktop)
        if (window.innerWidth > 768) {
            const bgImage = section.querySelector('.bg-image');
            if (bgImage) {
                window.addEventListener('scroll', function() {
                    const rect = section.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.5;
                    
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        bgImage.style.transform = `translateY(${rate}px)`;
                    }
                });
            }
        }
    });
    
    // Mobil cihazlar için dokunmatik etkileşim
    if (window.innerWidth <= 768) {
        sections.forEach(section => {
            const serviceCards = section.querySelectorAll('.service-card');
            
            serviceCards.forEach(card => {
                card.addEventListener('touchstart', () => {
                    serviceCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.style.opacity = '0.7';
                        }
                    });
                });
                
                card.addEventListener('touchend', () => {
                    serviceCards.forEach(otherCard => {
                        otherCard.style.opacity = '1';
                    });
                });
            });
        });
    }
}

// Process section için özel fonksiyonlar
function initializeProcessSection() {
    const stepItems = document.querySelectorAll('.step-item');
    
    // Step items için scroll animasyonu
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    
                    // Step circle animasyonu
                    const stepCircle = entry.target.querySelector('.step-circle');
                    if (stepCircle) {
                        setTimeout(() => {
                            stepCircle.style.opacity = '1';
                            stepCircle.style.transform = 'scale(1) rotate(360deg)';
                        }, 300);
                    }
                    
                    // Step content animasyonu
                    const stepContent = entry.target.querySelector('.step-content');
                    if (stepContent) {
                        setTimeout(() => {
                            stepContent.style.opacity = '1';
                            stepContent.style.transform = 'translateY(0)';
                        }, 600);
                    }
                }, index * 400);
            }
        });
    }, observerOptions);

    stepItems.forEach((item, index) => {
        stepObserver.observe(item);
        
        // Step circle başlangıç durumu
        const stepCircle = item.querySelector('.step-circle');
        if (stepCircle) {
            stepCircle.style.opacity = '0';
            stepCircle.style.transform = 'scale(0.5) rotate(0deg)';
            stepCircle.style.transition = 'all 0.8s ease';
        }
        
        // Step content başlangıç durumu
        const stepContent = item.querySelector('.step-content');
        if (stepContent) {
            stepContent.style.opacity = '0';
            stepContent.style.transform = 'translateY(30px)';
            stepContent.style.transition = 'all 0.8s ease';
        }
    });

    // Step content cards hover efektleri
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => {
        content.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        content.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Step circles hover efektleri
    const stepCircles = document.querySelectorAll('.step-circle');
    stepCircles.forEach(circle => {
        circle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
            this.style.boxShadow = '0 25px 60px rgba(59, 130, 246, 0.5)';
        });
        
        circle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.3)';
        });
    });

    // Bağlantı çizgileri animasyonu
    const processConnections = document.querySelector('.process-connections');
    if (processConnections) {
        const connectionsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const paths = entry.target.querySelectorAll('.connection-path');
                    paths.forEach((path, index) => {
                        setTimeout(() => {
                            path.style.opacity = '1';
                            path.style.transform = path.style.transform.replace('scaleX(0)', 'scaleX(1)');
                        }, index * 500);
                    });
                }
            });
        }, { threshold: 0.5 });

        connectionsObserver.observe(processConnections);
        
        // Çizgiler başlangıç durumu
        const paths = processConnections.querySelectorAll('.connection-path');
        paths.forEach(path => {
            path.style.opacity = '0';
            path.style.transform = path.style.transform + ' scaleX(0)';
            path.style.transition = 'all 1s ease';
        });
    }
}

// Form section için özel fonksiyonlar
function initializeFormSection() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form submit işlemi
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Input focus efektleri
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
        
        // Form validation
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    }
    
    // Form videoları için efektler
    const formVideos = document.querySelectorAll('.form-video .video-placeholder');
    formVideos.forEach(video => {
        // Video hover efektleri
        video.addEventListener('mouseenter', function() {
            const playButton = this.querySelector('.play-button');
            const overlay = this.querySelector('.video-overlay');
            
            if (playButton) {
                playButton.style.transform = 'scale(1.2)';
                playButton.style.background = 'rgba(255, 255, 255, 0.3)';
                playButton.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }
            
            if (overlay) {
                overlay.style.transform = 'translateY(-5px)';
            }
        });
        
        video.addEventListener('mouseleave', function() {
            const playButton = this.querySelector('.play-button');
            const overlay = this.querySelector('.video-overlay');
            
            if (playButton) {
                playButton.style.transform = 'scale(1)';
                playButton.style.background = 'rgba(255, 255, 255, 0.2)';
                playButton.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }
            
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
            }
        });
        
        // Video tıklama efekti
        video.addEventListener('click', function() {
            const videoType = this.closest('.form-video').classList.contains('left-video') ? 'başarı hikayeleri' : 'hizmetlerimiz';
            showVideoModal(videoType);
        });
        
        // Video animasyonu
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(video);
        
        // Başlangıç durumu
        video.style.opacity = '0';
        video.style.transform = 'translateY(30px)';
        video.style.transition = 'all 0.6s ease';
    });
    
    // Form container animasyonu
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        const formObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        formObserver.observe(formContainer);
        
        // Başlangıç durumu
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(30px)';
        formContainer.style.transition = 'all 0.6s ease';
    }
}

// Form gönderimi işlemi
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Loading durumu
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    submitBtn.disabled = true;
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
        // Başarılı gönderim
        showFormSuccess();
        
        // Formu sıfırla
        form.reset();
        
        // Butonu eski haline getir
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Form başarı mesajı
function showFormSuccess() {
    const formContent = document.querySelector('.form-content');
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Başvurunuz Alındı!</h3>
            <p>En kısa sürede sizinle iletişime geçeceğiz.</p>
        </div>
    `;
    
    formContent.appendChild(successMessage);
    
    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Alan validasyonu
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Hata mesajını kaldır
    removeFieldError(field);
    
    // Validasyon kuralları
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Bu alan zorunludur');
        return false;
    }
    
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Geçerli bir e-posta adresi giriniz');
            return false;
        }
    }
    
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Geçerli bir telefon numarası giriniz');
            return false;
        }
    }
    
    return true;
}

// Alan hatası göster
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 5px;
        padding: 5px 10px;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 8px;
        border-left: 3px solid #ef4444;
        animation: slideIn 0.3s ease;
    `;
    
    field.parentElement.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

// Alan hatasını kaldır
function removeFieldError(field) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
}

// Form success animasyonu için CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-success {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(16, 185, 129, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        animation: fadeIn 0.5s ease;
        z-index: 10;
    }
    
    .success-content {
        text-align: center;
        color: white;
    }
    
    .success-content i {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 0.6s ease;
    }
    
    .success-content h3 {
        font-size: 1.8rem;
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .success-content p {
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// About section için özel fonksiyonlar
function initializeAboutSection() {
    const floatingCards = document.querySelectorAll('.floating-card');
    const statItems = document.querySelectorAll('.stat-item-large');
    const aboutCta = document.querySelector('.about-cta-modern');
    
    // Floating cards için scroll animasyonu
    const floatingObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotate(0deg)';
                }, index * 300);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    floatingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) rotate(10deg)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        floatingObserver.observe(card);
    });

    // Stats items için animasyon
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    statItems.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px) scale(0.9)';
        stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        statsObserver.observe(stat);
    });

    // CTA section için animasyon
    const ctaObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    if (aboutCta) {
        aboutCta.style.opacity = '0';
        aboutCta.style.transform = 'translateY(30px)';
        aboutCta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        ctaObserver.observe(aboutCta);
    }

    // Floating cards hover efektleri
    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.1) rotate(0deg)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            this.style.zIndex = '1';
        });
    });

    // Stats items hover efektleri
    statItems.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });

    // Modern buttons hover efektleri
    const teamBtn = document.querySelector('.team-btn-modern');
    const aboutBtn = document.querySelector('.about-btn-modern');
    
    if (teamBtn) {
        teamBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        teamBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px)';
        });
    }
    
    if (aboutBtn) {
        aboutBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        aboutBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px)';
        });
    }

    // Stats counter animasyonu
    const statNumbers = document.querySelectorAll('.stat-item-large .stat-number');
    const statsCounterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isTime = finalValue.includes('/');
                
                if (isPercentage) {
                    animatePercentage(target, finalValue);
                } else if (isTime) {
                    target.textContent = finalValue;
                } else {
                    animateNumber(target, finalValue);
                }
                statsCounterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsCounterObserver.observe(stat));
}

// Reviews Slider ve Success Stories için özel fonksiyonlar
function initializeReviewsSection() {
    initializeReviewsSlider();
    initializeVideoEffects();
    initializeSuccessStats();
}

// Reviews Slider işlevselliği
function initializeReviewsSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!sliderTrack) return;
    
    let currentSlide = 0;
    const slideWidth = 380; // card width + gap
    const maxSlides = 3; // 3 cards visible at once
    
    // Slider pozisyonunu güncelle
    function updateSlider() {
        const translateX = -currentSlide * slideWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // Dots güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(currentSlide + 1, 2); // 3 slide groups
            updateSlider();
        });
    }
    
    // Prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - 1, 0);
            updateSlider();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide (5 saniyede bir)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % 3;
        updateSlider();
    }, 5000);
    
    // Touch/swipe desteği (mobil)
    let startX = 0;
    let endX = 0;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    sliderTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentSlide = Math.min(currentSlide + 1, 2);
            } else {
                // Swipe right - prev
                currentSlide = Math.max(currentSlide - 1, 0);
            }
            updateSlider();
        }
    }
    
    // Review cards hover efektleri
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-8px) scale(1)';
        });
    });
}

// Video efektleri
function initializeVideoEffects() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = document.querySelector('.play-button');
    
    if (!videoPlaceholder) return;
    
    // Video click efekti
    videoPlaceholder.addEventListener('click', function() {
        // Video oynatma simülasyonu
        showVideoModal();
    });
    
    // Play button pulse animasyonu
    if (playButton) {
        setInterval(() => {
            playButton.style.transform = 'scale(1.1)';
            setTimeout(() => {
                playButton.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
    
    // Video hover efektleri
    videoPlaceholder.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.5)';
    });
    
    videoPlaceholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
    });
}

// Video modal gösterimi
function showVideoModal(videoType = 'başarı hikayeleri') {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    
    const videoTitle = videoType === 'başarı hikayeleri' ? 'Başarı Hikayelerimiz' : 'Hizmetlerimiz';
    const videoDescription = videoType === 'başarı hikayeleri' 
        ? 'Öğrencilerimizin Avrupa\'ya giden yolculuklarından kesitler' 
        : 'Sunduğumuz hizmetlerin detaylı açıklamaları';
    
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${videoTitle}</h3>
                    <button class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="video-placeholder-modal">
                        <div class="play-button-modal">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="video-info">
                            <h4>${videoTitle}</h4>
                            <p>${videoDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Modal CSS
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .video-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            max-height: 80vh;
            overflow: hidden;
            animation: slideIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h3 {
            color: #fff;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0;
        }
        
        .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.1);
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .video-placeholder-modal {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .play-button-modal {
            width: 100px;
            height: 100px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 3px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 2.5rem;
            margin-bottom: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .play-button-modal:hover {
            transform: scale(1.1);
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.8);
        }
        
        .video-info {
            text-align: center;
            color: #fff;
        }
        
        .video-info h4 {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .video-info p {
            font-size: 1rem;
            opacity: 0.9;
            line-height: 1.5;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-width: 95%;
                margin: 10px;
            }
            
            .modal-header {
                padding: 15px 20px;
            }
            
            .modal-header h3 {
                font-size: 1.3rem;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .video-placeholder-modal {
                height: 300px;
            }
            
            .play-button-modal {
                width: 80px;
                height: 80px;
                font-size: 2rem;
            }
        }
    `;
    
    document.head.appendChild(modalStyle);
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
        modal.remove();
            modalStyle.remove();
        }, 300);
    });
    
    // Click outside to close
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeBtn.click();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            closeBtn.click();
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
    
    // Play button click
    const playButton = modal.querySelector('.play-button-modal');
    playButton.addEventListener('click', () => {
        playButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        playButton.style.background = 'rgba(255, 255, 255, 0.3)';
        
        // Simulate video loading
        setTimeout(() => {
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            playButton.style.background = 'rgba(255, 255, 255, 0.4)';
        }, 2000);
    });
}

// Success stats animasyonu
function initializeSuccessStats() {
    const successStats = document.querySelectorAll('.success-stat .stat-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isPercentage = finalValue.includes('%');
                const isPlus = finalValue.includes('+');
                
                if (isPercentage) {
                    animatePercentage(target, finalValue);
                } else if (isPlus) {
                    animateNumber(target, finalValue);
                } else {
                    animateNumber(target, finalValue);
                }
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    successStats.forEach(stat => statsObserver.observe(stat));
}

// Success button hover efektleri
function initializeSuccessButton() {
    const successBtn = document.querySelector('.success-btn');
    
    if (successBtn) {
        successBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        successBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
    }
}

// Hero Form işlevselliği
function initializeHeroForm() {
    const heroForm = document.querySelector('.hero-contact-form');
    
    if (heroForm) {
        // Form submit işlemi
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleHeroFormSubmission(this);
        });
        
        // Input focus efektleri
        const inputs = heroForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });
        
        // Form validation
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateHeroField(this);
            });
        });
    }
}

// Hero Form gönderimi işlemi
function handleHeroFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.hero-form-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Loading durumu
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
    submitBtn.disabled = true;
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
        // Başarılı gönderim
        showHeroFormSuccess();
        
        // Formu sıfırla
        form.reset();
        
        // Butonu eski haline getir
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Hero Form başarı mesajı
function showHeroFormSuccess() {
    const formContainer = document.querySelector('.hero-form-container');
    const successMessage = document.createElement('div');
    successMessage.className = 'hero-form-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Başvurunuz Alındı!</h3>
            <p>En kısa sürede sizinle iletişime geçeceğiz.</p>
        </div>
    `;
    
    formContainer.appendChild(successMessage);
    
    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Hero Form alan validasyonu
function validateHeroField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Hata mesajını kaldır
    removeHeroFieldError(field);
    
    // Validasyon kuralları
    if (field.hasAttribute('required') && !value) {
        showHeroFieldError(field, 'Bu alan zorunludur');
        return false;
    }
    
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showHeroFieldError(field, 'Geçerli bir e-posta adresi giriniz');
            return false;
        }
    }
    
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showHeroFieldError(field, 'Geçerli bir telefon numarası giriniz');
            return false;
        }
    }
    
    return true;
}

// Hero Form alan hatası göster
function showHeroFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'hero-field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 5px;
        padding: 5px 10px;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 8px;
        border-left: 3px solid #ef4444;
        animation: slideIn 0.3s ease;
    `;
    
    field.parentElement.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

// Hero Form alan hatasını kaldır
function removeHeroFieldError(field) {
    const existingError = field.parentElement.querySelector('.hero-field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e5e7eb';
}

// Hero Form success animasyonu için CSS
const heroFormStyle = document.createElement('style');
heroFormStyle.textContent = `
    .hero-form-success {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(16, 185, 129, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        animation: fadeIn 0.5s ease;
        z-index: 10;
    }
    
    .hero-form-success .success-content {
        text-align: center;
        color: white;
    }
    
    .hero-form-success .success-content i {
        font-size: 3rem;
        margin-bottom: 15px;
        animation: bounce 0.6s ease;
    }
    
    .hero-form-success .success-content h3 {
        font-size: 1.5rem;
        margin-bottom: 8px;
        font-weight: 600;
    }
    
    .hero-form-success .success-content p {
        font-size: 1rem;
        opacity: 0.9;
    }
`;
document.head.appendChild(heroFormStyle);

// Google Yorumları Slider işlevselliği
function initializeGoogleReviews() {
    const reviewsTrack = document.querySelector('.reviews-track');
    const prevBtn = document.querySelector('.prev-review');
    const nextBtn = document.querySelector('.next-review');
    const dots = document.querySelectorAll('.review-dot');
    
    if (!reviewsTrack) return;
    
    let currentSlide = 0;
    const slideWidth = 380; // card width + gap
    const maxSlides = 6; // toplam yorum sayısı
    const visibleSlides = 3; // aynı anda görünen yorum sayısı
    
    // Slider pozisyonunu güncelle
    function updateSlider() {
        const translateX = -currentSlide * slideWidth;
        reviewsTrack.style.transform = `translateX(${translateX}px)`;
        
        // Dots güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentSlide / visibleSlides));
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(currentSlide + visibleSlides, maxSlides - visibleSlides);
            updateSlider();
        });
    }
    
    // Prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - visibleSlides, 0);
            updateSlider();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index * visibleSlides;
            updateSlider();
        });
    });
    
    // Auto slide (6 saniyede bir)
    setInterval(() => {
        currentSlide = (currentSlide + visibleSlides) % maxSlides;
        if (currentSlide > maxSlides - visibleSlides) {
            currentSlide = 0;
        }
        updateSlider();
    }, 6000);
    
    // Touch/swipe desteği (mobil)
    let startX = 0;
    let endX = 0;
    
    reviewsTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    reviewsTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentSlide = Math.min(currentSlide + visibleSlides, maxSlides - visibleSlides);
            } else {
                // Swipe right - prev
                currentSlide = Math.max(currentSlide - visibleSlides, 0);
            }
            updateSlider();
        }
    }
    
    // Review cards hover efektleri
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });
    
    // Review cards için scroll animasyonu
    const reviewObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(-5px)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    reviewItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        reviewObserver.observe(item);
    });
}

// Ekibimiz Slider işlevselliği
function initializeTeamSlider() {
    const teamTrack = document.querySelector('.team-slider-track');
    const prevBtn = document.querySelector('.prev-team');
    const nextBtn = document.querySelector('.next-team');
    const dots = document.querySelectorAll('.team-dot');
    
    if (!teamTrack) return;
    
    let currentSlide = 0;
    let slideWidth = 280; // photo item width + padding
    const maxSlides = 16; // toplam ekip üyesi sayısı
    const visibleSlides = 2; // aynı anda görünen üye sayısı (2 tane)
    
    // Slider pozisyonunu güncelle
    function updateSlider() {
        const translateX = -currentSlide * slideWidth;
        teamTrack.style.transform = `translateX(${translateX}px)`;
        
        // Dots güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentSlide / visibleSlides));
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(currentSlide + visibleSlides, maxSlides - visibleSlides);
            updateSlider();
        });
    }
    
    // Prev button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(currentSlide - visibleSlides, 0);
            updateSlider();
        });
    }
    
    // Dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index * visibleSlides;
            updateSlider();
        });
    });
    
    // Auto slide (8 saniyede bir)
    setInterval(() => {
        currentSlide = (currentSlide + visibleSlides) % maxSlides;
        if (currentSlide > maxSlides - visibleSlides) {
            currentSlide = 0;
        }
        updateSlider();
    }, 8000);
    
    // Touch/swipe desteği (mobil)
    let startX = 0;
    let endX = 0;
    
    teamTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    teamTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentSlide = Math.min(currentSlide + visibleSlides, maxSlides - visibleSlides);
            } else {
                // Swipe right - prev
                currentSlide = Math.max(currentSlide - visibleSlides, 0);
            }
            updateSlider();
        }
    }
    
    // Team photo items için scroll animasyonu
    const teamObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    const teamPhotos = document.querySelectorAll('.team-photo-item');
    teamPhotos.forEach((photo, index) => {
        photo.style.opacity = '0';
        photo.style.transform = 'translateY(30px) scale(0.9)';
        photo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(photo);
    });
    
    // Photo hover efektleri
    teamPhotos.forEach(photo => {
        photo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
    
    // Responsive slide width ayarlaması
    function updateSlideWidth() {
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        if (isSmallMobile) {
            slideWidth = 160; // 160px + padding
        } else if (isMobile) {
            slideWidth = 200; // 200px + padding
        } else if (window.innerWidth <= 1024) {
            slideWidth = 240; // 240px + padding
        } else {
            slideWidth = 280; // 280px + padding
        }
        
        updateSlider();
    }
    
    // Window resize handler
    window.addEventListener('resize', updateSlideWidth);
    
    // İlk yükleme
    updateSlideWidth();
}

// Sık Sorulan Sorular Accordion işlevselliği
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon i');
        
        // Tıklama ile açma/kapama
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Diğer tüm açık soruları kapat
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-icon i');
                    otherIcon.className = 'fas fa-plus';
                }
            });
            
            // Bu soruyu aç/kapat
            if (isActive) {
                item.classList.remove('active');
                icon.className = 'fas fa-plus';
            } else {
                item.classList.add('active');
                icon.className = 'fas fa-minus';
            }
        });
        
        // Hover efektleri
        question.addEventListener('mouseenter', function() {
            if (!item.classList.contains('active')) {
                this.style.background = 'rgba(59, 130, 246, 0.08)';
            }
        });
        
        question.addEventListener('mouseleave', function() {
            if (!item.classList.contains('active')) {
                this.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Accessibility
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
        
        answer.setAttribute('id', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
        answer.setAttribute('role', 'region');
        answer.setAttribute('aria-labelledby', `faq-question-${Array.from(faqItems).indexOf(item)}`);
        
        question.setAttribute('id', `faq-question-${Array.from(faqItems).indexOf(item)}`);
    });
    
    // FAQ items için scroll animasyonu
    const faqObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        faqObserver.observe(item);
    });
    
    // FAQ CTA için scroll animasyonu
    const faqCta = document.querySelector('.faq-cta');
    if (faqCta) {
        const ctaObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

        faqCta.style.opacity = '0';
        faqCta.style.transform = 'translateY(30px) scale(0.95)';
        faqCta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        ctaObserver.observe(faqCta);
    }
    
    // FAQ CTA button hover efektleri
    const faqCtaBtn = document.querySelector('.faq-cta-btn');
    if (faqCtaBtn) {
        faqCtaBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        faqCtaBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-3px) scale(1)';
        });
    }
    
    // Smooth scroll to contact section
    const contactLink = document.querySelector('.faq-cta-btn[href="#iletisim"]');
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#iletisim') || document.querySelector('.hero');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Animasyonlu text değişimi
function initializeAnimatedText() {
    const textItems = document.querySelectorAll('.text-item');
    if (textItems.length === 0) return;
    
    let currentIndex = 0;
    const totalItems = textItems.length;
    
    // İlk text'i aktif yap
    textItems[currentIndex].classList.add('active');
    
    // Text değişim fonksiyonu
    function changeText() {
        // Mevcut text'i gizle
        textItems[currentIndex].classList.remove('active');
        textItems[currentIndex].style.animation = 'textSlideOut 0.5s ease forwards';
        
        // Sonraki index'e geç
        currentIndex = (currentIndex + 1) % totalItems;
        
        // Yeni text'i göster
        setTimeout(() => {
            textItems[currentIndex].classList.add('active');
            textItems[currentIndex].style.animation = 'textSlideIn 0.5s ease forwards';
        }, 500);
    }
    
    // Her 3 saniyede bir text değiştir
    setInterval(changeText, 3000);
}

// Programları Kategorilerini Keşfet Section için özel fonksiyonlar
function initializeProgramsSection() {
    const programCards = document.querySelectorAll('.program-card');
    
    // Program cards için scroll animasyonu
    const programsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 200);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    programCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        programsObserver.observe(card);
    });

    // Program cards hover efektleri
    programCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.zIndex = '10';
            
            // Diğer kartları hafifçe soluklaştır
            programCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'translateY(-5px) scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
            
            // Tüm kartları normal haline getir
            programCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'translateY(0) scale(1)';
            });
        });
    });

    // Program images için özel efektler
    const programImages = document.querySelectorAll('.program-image');
    programImages.forEach(image => {
        // Image click efekti
        image.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
        
        // Image hover efekti
        image.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });
        
        image.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // Section header animasyonu
    const programsHeader = document.querySelector('.programs-section .section-header');
    if (programsHeader) {
        const headerObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });

        programsHeader.style.opacity = '0';
        programsHeader.style.transform = 'translateY(30px)';
        programsHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        headerObserver.observe(programsHeader);
    }

    // Mobil cihazlar için dokunmatik etkileşim
    if (window.innerWidth <= 768) {
        programCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.01)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Badge Slider Animasyonu
function initializeBadgeSlider() {
    const slides = document.querySelectorAll('.badge-slide');
    let current = 0;
    let timer;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i === (index - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
        current = index;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    function startAutoSlide() {
        timer = setInterval(nextSlide, 2500);
    }

    function stopAutoSlide() {
        clearInterval(timer);
    }

    showSlide(0);
    startAutoSlide();
}

document.addEventListener('DOMContentLoaded', function() {
    initializeBadgeSlider();
}); 