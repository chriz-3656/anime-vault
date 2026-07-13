export function buildGallery(ctx, textures, posters) {
    const { cylinderGroup } = ctx;
    const items = [];
    
    // Cylinder radius and calculation
    const radius = window.innerWidth < 768 ? 4 : 7;
    const angleStep = (Math.PI * 2) / posters.length;
    
    // Poster geometry (Plane)
    // Create a slight curve by using multiple segments
    const geometry = new THREE.PlaneGeometry(2.4, 3.6, 32, 32);
    
    // To give it a cylinder-like curve, modify vertices based on radius
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        // Map x to angle on a cylinder of radius R
        const theta = x / radius;
        pos.setX(i, Math.sin(theta) * radius);
        pos.setZ(i, Math.cos(theta) * radius - radius);
    }
    geometry.computeVertexNormals();

    posters.forEach((poster, index) => {
        const material = new THREE.MeshPhysicalMaterial({
            map: textures[poster.id],
            roughness: 0.2,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            side: THREE.DoubleSide,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Position around the cylinder
        const angle = index * angleStep;
        
        mesh.position.x = Math.sin(angle) * radius;
        mesh.position.z = Math.cos(angle) * radius;
        // Align rotation to face outward from center
        mesh.rotation.y = angle;
        
        // Custom data
        mesh.userData = {
            id: poster.id,
            index: index,
            angle: angle,
            posterData: poster
        };
        
        cylinderGroup.add(mesh);
        items.push(mesh);
    });
    
    return items;
}
