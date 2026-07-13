export function initUI(posters) {
    const detailPanel = document.getElementById('detail-panel');
    const closeViewerBtn = document.getElementById('close-viewer');
    const fullscreenViewer = document.getElementById('fullscreen-viewer');
    
    // Setup Masonry Grid for Collection Section
    const masonryGrid = document.getElementById('masonry-grid');
    if (masonryGrid) {
        posters.forEach(poster => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            
            const img = document.createElement('img');
            img.src = `assets/posters/${poster.file}`;
            img.alt = poster.title;
            img.loading = 'lazy';
            
            item.appendChild(img);
            masonryGrid.appendChild(item);
            
            // Interaction for Masonry grid clicks
            item.addEventListener('click', () => {
                openFullscreenViewer(poster);
            });
        });
    }

    // Close Fullscreen Viewer
    if (closeViewerBtn) {
        closeViewerBtn.addEventListener('click', () => {
            fullscreenViewer.classList.add('hidden');
        });
    }

    // Handle clicks on webgl canvas via raycasting (will be setup in main or scene if needed, but we keep it simple for now)
    
    // Show panel after scroll starts
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.5) {
            detailPanel.classList.remove('hidden');
        } else {
            detailPanel.classList.add('hidden');
        }
    });
}

export function updateUI(activePoster) {
    if (!activePoster) return;
    
    const detailTitle = document.getElementById('detail-title');
    const detailAnime = document.getElementById('detail-anime');
    const detailCharacter = document.getElementById('detail-character');
    const detailTags = document.getElementById('detail-tags');
    
    // Animate text change
    gsap.to([detailTitle, detailAnime, detailCharacter, detailTags], {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
            detailTitle.innerText = activePoster.title;
            detailAnime.innerText = activePoster.anime;
            detailCharacter.innerText = activePoster.character;
            
            detailTags.innerHTML = '';
            activePoster.tags.forEach(tag => {
                const span = document.createElement('span');
                span.innerText = tag;
                detailTags.appendChild(span);
            });
            
            gsap.to([detailTitle, detailAnime, detailCharacter, detailTags], {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.05
            });
        }
    });
}

function openFullscreenViewer(poster) {
    const viewer = document.getElementById('fullscreen-viewer');
    viewer.classList.remove('hidden');
    
    viewer.style.backgroundImage = `url('assets/posters/${poster.file}')`;
    viewer.style.backgroundSize = 'contain';
    viewer.style.backgroundPosition = 'center';
    viewer.style.backgroundRepeat = 'no-repeat';
}
