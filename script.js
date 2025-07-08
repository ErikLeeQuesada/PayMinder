// Demo Carousel Functionality
let currentSlide = 0;
let demoPhones;
let phones;

// Touch/swipe variables
let startX = 0;
let endX = 0;
let isDragging = false;

function moveCarousel(direction) {
    const phoneWidth = phones[0].offsetWidth + 20; // width + gap (20px on mobile)
    const maxSlides = phones.length - 1; // Show 1 phone at a time on mobile
    
    currentSlide += direction;
    
    // Looping logic
    if (currentSlide < 0) {
        currentSlide = maxSlides;
    } else if (currentSlide > maxSlides) {
        currentSlide = 0;
    }
    
    // Scroll to the new position
    const scrollPosition = currentSlide * phoneWidth;
    demoPhones.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    // Update arrow states
    updateArrowStates();
}

function updateArrowStates() {
    // For a looping carousel, both arrows are always enabled
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    if (leftArrow && rightArrow) {
        leftArrow.style.opacity = '1';
        leftArrow.style.cursor = 'pointer';
        rightArrow.style.opacity = '1';
        rightArrow.style.cursor = 'pointer';
    }
}

// Touch event handlers for swipe functionality
function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    
    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const minSwipeDistance = 50; // Minimum distance for a swipe
    
    if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
            // Swiped left - go to next slide
            moveCarousel(1);
        } else {
            // Swiped right - go to previous slide
            moveCarousel(-1);
        }
    }
    
    isDragging = false;
}

// Mobile Menu Functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    
    if (mobileMenu && hamburgerMenu) {
        mobileMenu.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Scroll Animation Functionality
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-stagger');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Trigger when element is 150px from viewport
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Throttle function to limit scroll event frequency
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    demoPhones = document.querySelector('.demo-phones');
    phones = document.querySelectorAll('.demo-phone');
    
    if (demoPhones && phones.length > 0) {
        updateArrowStates();
        
        // Add touch event listeners for swipe functionality
        demoPhones.addEventListener('touchstart', handleTouchStart, { passive: false });
        demoPhones.addEventListener('touchmove', handleTouchMove, { passive: false });
        demoPhones.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Add mouse event listeners for desktop drag functionality
        demoPhones.addEventListener('mousedown', function(e) {
            startX = e.clientX;
            isDragging = true;
        });
        
        demoPhones.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        demoPhones.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            
            endX = e.clientX;
            const diffX = startX - endX;
            const minSwipeDistance = 50;
            
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    moveCarousel(1);
                } else {
                    moveCarousel(-1);
                }
            }
            
            isDragging = false;
        });
        
        // Prevent text selection during drag
        demoPhones.addEventListener('selectstart', function(e) {
            if (isDragging) e.preventDefault();
        });
    }
    
    // Feature items click functionality
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    // Mobile menu link functionality
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function() {
            toggleMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        
        if (mobileMenu && hamburgerMenu && 
            mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close mobile menu with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        // Reset to first slide when switching between mobile/desktop
        currentSlide = 0;
        updateArrowStates();
    });
    
    // Initialize scroll animations
    handleScrollAnimations();
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttle(handleScrollAnimations, 100));
});
