// Fetch LinkedIn Profile Photo for Hero Section
async function fetchLinkedInPhoto() {
    const img = document.getElementById('linkedin-profile-img');
    if (!img) return;
    
    // Check if a direct LinkedIn URL is already set (not the placeholder)
    const currentSrc = img.src;
    if (currentSrc.includes('media.licdn.com') && !currentSrc.includes('1234567890')) {
        console.log('Direct LinkedIn URL already set');
        return;
    }
    
    console.log('Attempting to fetch LinkedIn profile photo...');
    
    // Method 1: Try using LinkedIn profile photo API service
    const serviceUrl = 'https://linkedin-profile-photo.vercel.app/abhayjaiswal21';
    
    // Test if the service URL works
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    
    testImg.onload = function() {
        img.src = serviceUrl;
        console.log('✓ LinkedIn photo loaded from service');
    };
    
    testImg.onerror = function() {
        console.log('Service method failed, trying proxy method...');
        // Method 2: Try to fetch via proxy and extract
        fetchLinkedInPhotoViaProxy();
    };
    
    testImg.src = serviceUrl;
}

// Alternative method: Fetch via proxy
async function fetchLinkedInPhotoViaProxy() {
    const img = document.getElementById('linkedin-profile-img');
    if (!img) return;
    
    try {
        // Use CORS proxy to fetch LinkedIn profile HTML
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const linkedinUrl = encodeURIComponent('https://www.linkedin.com/in/abhayjaiswal21/');
        
        console.log('Fetching LinkedIn profile via proxy...');
        const response = await fetch(proxyUrl + linkedinUrl);
        const data = await response.json();
        
        if (data.contents) {
            const html = data.contents;
            
            // Try to find profile photo URL in various formats
            const patterns = [
                /https:\/\/media\.licdn\.com\/dms\/image\/[^"'\s>]+profile-displayphoto[^"'\s>]+/g,
                /https:\/\/media\.licdn\.com\/dms\/image\/[A-Za-z0-9]+\/profile-displayphoto-shrink_[0-9_]+/g,
                /"image":"([^"]*profile[^"]*)"/
            ];
            
            for (const pattern of patterns) {
                const matches = html.match(pattern);
                if (matches && matches.length > 0) {
                    let photoUrl = matches[0];
                    // Clean up the URL
                    photoUrl = photoUrl.replace(/["']/g, '').replace(/\\/g, '');
                    if (photoUrl.includes('profile-displayphoto')) {
                        // Remove query parameters that might cause issues
                        photoUrl = photoUrl.split('?')[0] + '?v=1';
                        img.src = photoUrl;
                        console.log('✓ LinkedIn photo extracted from profile page:', photoUrl);
                        return;
                    }
                }
            }
        }
        
        console.log('Could not extract photo URL from profile page');
    } catch (error) {
        console.log('Error fetching LinkedIn photo:', error);
        // Keep the fallback image
    }
}

// Call on page load to fetch LinkedIn photo
window.addEventListener('DOMContentLoaded', () => {
    fetchLinkedInPhoto();
});

// Also try again after a short delay in case of network issues
setTimeout(() => {
    const img = document.getElementById('linkedin-profile-img');
    if (img && img.src.includes('pexels')) {
        console.log('Retrying LinkedIn photo fetch...');
        fetchLinkedInPhoto();
    }
}, 2000);

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - updated for dark theme
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.7)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.project-card, .skill-category, .certificate-card, .education-item, .training-card, .about-image, .about-content, .training-image, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Add hover effect to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add click animation to social links
document.querySelectorAll('.social-link, .project-link, .cert-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .social-link, .project-link, .cert-link {
        position: relative;
        overflow: hidden;
    }

    .animated {
        animation: slideInUp 0.8s ease forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .skill-tag, .tech-tag, .course-tag {
        transition: all 0.3s ease;
    }

    .skill-tag:hover, .tech-tag:hover, .course-tag:hover {
        transform: translateY(-2px) scale(1.05);
    }
`;
document.head.appendChild(style);

// Add stagger animation to skill tags
document.querySelectorAll('.skill-category').forEach(category => {
    const tags = category.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add scroll reveal animation with different delays
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(10px)';
    tag.style.transition = 'all 0.3s ease';
    revealObserver.observe(tag);
});

// Add hover effect to project images
document.querySelectorAll('.project-image').forEach(imgContainer => {
    imgContainer.addEventListener('mouseenter', function() {
        this.querySelector('.project-img').style.transform = 'scale(1.15)';
    });
    imgContainer.addEventListener('mouseleave', function() {
        this.querySelector('.project-img').style.transform = 'scale(1)';
    });
});

// Smooth reveal for feature items
document.querySelectorAll('.feature-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
});

// Add cursor trail effect (optional elegant touch)
let cursorTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    if (cursorTrail.length >= maxTrailLength) {
        const oldTrail = cursorTrail.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
    
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '6px';
    trail.style.height = '6px';
    trail.style.borderRadius = '50%';
    trail.style.background = 'rgba(99, 102, 241, 0.5)';
    trail.style.pointerEvents = 'none';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.zIndex = '9999';
    trail.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 500);
    }, 100);
});

