import { initScene, animateScene } from './scene.js';
import { loadAssets } from './loader.js';
import { buildGallery } from './gallery.js';
import { setupScroll } from './scroll.js';
import { initUI } from './ui.js';
import { initEffects } from './effects.js';

// Configuration
export const posters = [
    { id: 'gojo', file: 'gojo.png', title: 'Satoru Gojo', anime: 'Jujutsu Kaisen', character: 'Gojo', color: '#7b2cbf', gradient: 'radial-gradient(circle at center, #7b2cbf 0%, #30005a 50%, #030303 100%)', tags: ['Curse', 'Infinity'] },
    { id: 'naruto', file: 'naruto.png', title: 'Naruto Uzumaki', anime: 'Naruto Shippuden', character: 'Naruto', color: '#ff7b00', gradient: 'radial-gradient(circle at center, #ff7b00 0%, #662200 50%, #030303 100%)', tags: ['Hokage', 'Kurama'] },
    { id: 'tanjiro', file: 'tanjiro.png', title: 'Tanjiro Kamado', anime: 'Demon Slayer', character: 'Tanjiro', color: '#00b4d8', gradient: 'radial-gradient(circle at center, #00b4d8 0%, #003b5c 50%, #030303 100%)', tags: ['Water', 'Sun'] },
    { id: 'goku', file: 'goku.png', title: 'Son Goku', anime: 'Dragon Ball', character: 'Goku', color: '#0077b6', gradient: 'radial-gradient(circle at center, #0077b6 0%, #001a33 50%, #030303 100%)', tags: ['Saiyan', 'Ultra Instinct'] },
    { id: 'luffy', file: 'luffy.png', title: 'Monkey D. Luffy', anime: 'One Piece', character: 'Luffy', color: '#d90429', gradient: 'radial-gradient(circle at center, #d90429 0%, #4a0005 50%, #030303 100%)', tags: ['Pirate King', 'Joyboy'] },
    { id: 'jinwoo', file: 'jinwoo.png', title: 'Sung Jin-Woo', anime: 'Solo Leveling', character: 'Jinwoo', color: '#3c096c', gradient: 'radial-gradient(circle at center, #3c096c 0%, #15002b 50%, #030303 100%)', tags: ['Shadow Monarch', 'Hunter'] },
    { id: 'deku', file: 'deku.png', title: 'Izuku Midoriya', anime: 'My Hero Academia', character: 'Deku', color: '#38b000', gradient: 'radial-gradient(circle at center, #38b000 0%, #123300 50%, #030303 100%)', tags: ['OFA', 'Hero'] }
];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Initialize Lenis (smooth scrolling)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. Initialize Three.js Scene
        const sceneContext = initScene();

        // 3. Setup UI interactions early
        initUI(posters);

        // 4. Load Assets (Textures, Models if any)
        const textures = await loadAssets(posters);

        // 5. Build the 3D Gallery (Cylinder)
        const galleryItems = buildGallery(sceneContext, textures, posters);

        // 6. Initialize Post Processing / Effects
        initEffects(sceneContext);

        // 7. Setup GSAP ScrollTrigger logic
        setupScroll(sceneContext, galleryItems, posters, lenis);

        // 8. Start Animation Loop
        animateScene(sceneContext);
        
        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh();
    } catch (error) {
        document.getElementById('loading-percentage').innerText = "ERROR: " + error.message;
        console.error(error);
    }
});
