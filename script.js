document.addEventListener('DOMContentLoaded', () => {
    const shapes = document.querySelectorAll('.floating-shape');
    
    let currentScroll = 0;
    let targetScroll = 0;
    let isAnimating = false;
    
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    function updateParallax() {
        currentScroll = lerp(currentScroll, targetScroll, 0.08);
        
        shapes.forEach((shape, index) => {
            const depth = parseFloat(shape.closest('.parallax-layer')?.dataset.speed) || 0.5;
            const baseY = currentScroll * depth;
            const floatOffset = Math.sin(currentScroll * 0.003 + index * 1.5) * 15;
            const driftOffset = Math.cos(currentScroll * 0.002 + index) * 10;
            
            shape.style.transform = `translate3d(${driftOffset}px, ${baseY + floatOffset}px, 0)`;
        });
        
        const backgrounds = document.querySelectorAll('.parallax-layer.background');
        backgrounds.forEach((bg, index) => {
            const yPos = currentScroll * 0.15;
            bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        if (Math.abs(currentScroll - targetScroll) > 0.1) {
            requestAnimationFrame(updateParallax);
        } else {
            isAnimating = false;
        }
    }
    
    function onScroll() {
        targetScroll = window.scrollY;
        
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(updateParallax);
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    shapes.forEach(shape => {
        shape.style.willChange = 'transform';
    });
    
    document.querySelectorAll('.parallax-layer.background').forEach(bg => {
        bg.style.willChange = 'transform';
    });
});

function scrollToBlog() {
    const blogSection = document.getElementById('blog1');
    if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(card);
});