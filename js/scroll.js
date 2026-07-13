import { updateUI } from './ui.js';

export function setupScroll(ctx, galleryItems, posters, lenis) {
    const { cylinderGroup, scene } = ctx;
    
    gsap.registerPlugin(ScrollTrigger);

    const totalAngle = Math.PI * 2;
    const numItems = galleryItems.length;
    const angleStep = totalAngle / numItems;
    
    // Auto-rotate logic that stops perfectly on the center of each poster
    // This allows the vertical scroll to be free for the rest of the website
    
    let currentIndex = 0;
    
    function animateToNext() {
        currentIndex++;
        const targetRotation = -currentIndex * angleStep;
        
        gsap.to(cylinderGroup.rotation, {
            y: targetRotation,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: updateCylinderEffects,
            onComplete: () => {
                // Pause on center for a moment before moving to the next
                gsap.delayedCall(2.5, animateToNext);
            }
        });
    }
    
    function updateCylinderEffects() {
        let closestDistance = Infinity;
        let activeIndex = 0;
        
        galleryItems.forEach((mesh, idx) => {
            let worldAngle = (mesh.rotation.y + cylinderGroup.rotation.y) % totalAngle;
            if (worldAngle > Math.PI) worldAngle -= totalAngle;
            if (worldAngle < -Math.PI) worldAngle += totalAngle;
            
            const distance = Math.abs(worldAngle);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                activeIndex = idx;
            }
            
            // Opacity & Scale based on distance from center
            const maxDist = Math.PI / 2;
            let intensity = 1.0 - (distance / maxDist);
            intensity = Math.max(0, Math.min(1, intensity));
            
            // Animate material properties directly without gsap for performance during onUpdate, 
            // or just set them since this runs every frame of the tween
            mesh.material.opacity = 0.3 + (0.7 * intensity);
            const scale = 0.8 + (0.2 * intensity);
            mesh.scale.set(scale, scale, scale);
        });
        
        // Trigger UI update if active index changed
        if (ctx.lastActiveIndex !== activeIndex) {
            ctx.lastActiveIndex = activeIndex;
            const activePoster = posters[activeIndex];
            updateUI(activePoster);
            
            // Create an exact match gradient background based on the poster's defined gradient
            gsap.to(document.body, {
                background: activePoster.gradient,
                duration: 1.5,
                ease: "power2.out"
            });
            
            // Sync Three.js lighting and particle glow to the poster's exact hex color
            const targetColor = new THREE.Color(activePoster.color);
            
            if (ctx.rimLight) {
                gsap.to(ctx.rimLight.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1.5, ease: "power2.out" });
            }
            if (ctx.particleMaterial) {
                gsap.to(ctx.particleMaterial.color, { r: targetColor.r, g: targetColor.g, b: targetColor.b, duration: 1.5, ease: "power2.out" });
            }
        }
    }

    // Initialize first state
    updateCylinderEffects();
    
    // Start auto-rotate after initial delay
    gsap.delayedCall(3, animateToNext);

    // Hero section scroll animations
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: -100,
        opacity: 0
    });
}
