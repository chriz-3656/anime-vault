export async function loadAssets(posters) {
    const textureLoader = new THREE.TextureLoader();
    const textures = {};
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loaderElement = document.getElementById('loader');
    
    let loadedCount = 0;
    const totalToLoad = posters.length;
    
    return new Promise((resolve) => {
        posters.forEach(poster => {
            textureLoader.load(
                `assets/posters/${poster.file}`,
                (texture) => {
                    texture.generateMipmaps = true;
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.anisotropy = 16;
                    
                    textures[poster.id] = texture;
                    loadedCount++;
                    
                    const progress = (loadedCount / totalToLoad) * 100;
                    progressBar.style.width = `${progress}%`;
                    loadingPercentage.innerText = `${Math.floor(progress)}%`;
                    
                    if (loadedCount === totalToLoad) {
                        setTimeout(() => {
                            // Fade out loader
                            loaderElement.style.opacity = '0';
                            setTimeout(() => {
                                loaderElement.style.display = 'none';
                            }, 800);
                            resolve(textures);
                        }, 500); // Small delay for smooth transition
                    }
                },
                undefined,
                (err) => {
                    console.error(`Error loading texture: ${poster.file}`, err);
                    loadedCount++; // Increment anyway to not block
                    if (loadedCount === totalToLoad) resolve(textures);
                }
            );
        });
    });
}
