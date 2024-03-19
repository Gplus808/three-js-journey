import * as THREE from 'three'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader();
const imageTexture = textureLoader.load('../AlanJohnson_GloryDays_Cover.jpg'); // Replace with the path to your image

// Materials
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Right side
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Left side
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Top side
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Bottom side
    new THREE.MeshBasicMaterial({ color: 0xffffff }), // Back side
    new THREE.MeshBasicMaterial({ map: imageTexture }), // Front side
];



// Object
const mesh = new THREE.Mesh(
    // new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    // new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

const sleeveGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.05); // Assuming 1.2 units is visually equivalent to 12 inches in your scene scale
const sleeveMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color
const sleeveMesh = new THREE.Mesh(sleeveGeometry, materials);
scene.add(sleeveMesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 2
camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sleeveMesh.rotation.y = elapsedTime;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()