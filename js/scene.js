export function initScene() {
    const canvas = document.getElementById('webgl-canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Move camera further back so the entire cylinder fits well
    camera.position.z = 12;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.SpotLight(0xffffff, 2);
    rimLight.position.set(0, 5, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);
    
    // Group to hold the cylinder for rotating
    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);
    
    // Add particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 35;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Create a soft glowing radial gradient for particles programmatically
    const canvasParticle = document.createElement('canvas');
    canvasParticle.width = 32;
    canvasParticle.height = 32;
    const context = canvasParticle.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    const particleTexture = new THREE.CanvasTexture(canvasParticle);

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        map: particleTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xffffff
    });
    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse Parallax Effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });
    
    const contextObj = {
        scene,
        camera,
        renderer,
        cylinderGroup,
        particlesMesh,
        particleMaterial,
        ambientLight,
        directionalLight,
        rimLight,
        mouseX,
        mouseY,
        targetX,
        targetY
    };

    return contextObj;
}

export function animateScene(ctx) {
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Smooth Mouse Parallax
        ctx.targetX = ctx.mouseX * 0.001;
        ctx.targetY = ctx.mouseY * 0.001;

        ctx.camera.position.x += (ctx.targetX - ctx.camera.position.x) * 0.05;
        ctx.camera.position.y += (-ctx.targetY - ctx.camera.position.y) * 0.05;
        ctx.camera.lookAt(0, 0, 0);

        // Breathe effect (subtle float)
        ctx.cylinderGroup.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
        
        // Particles slow rotation
        ctx.particlesMesh.rotation.y = elapsedTime * 0.02;
        ctx.particlesMesh.rotation.x = elapsedTime * 0.01;

        ctx.renderer.render(ctx.scene, ctx.camera);
        requestAnimationFrame(tick);
    };

    tick();
}
