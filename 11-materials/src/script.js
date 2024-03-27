import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


//Objects
const material = new THREE.MeshBasicMaterial()

const boxGeometry = new THREE.BoxGeometry(1, 1, 0.01)
const boxMesh = new THREE.Mesh(boxGeometry, material)

const torusGeometry = new THREE.TorusGeometry(0.3, 0.18)
const torusMesh = new THREE.Mesh(torusGeometry, material)
torusMesh.position.x = 1.5

const sphereGeometry = new THREE.SphereGeometry(0.5)
const sphereMesh = new THREE.Mesh(sphereGeometry, material)
sphereMesh.position.x = - 1.5

scene.add(boxMesh, torusMesh, sphereMesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Objects
    boxMesh.rotation.y = 0.1 * elapsedTime
    sphereMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.y = 0.1 * elapsedTime

    boxMesh.rotation.x =  - 0.15 * elapsedTime
    sphereMesh.rotation.x = - 0.15 * elapsedTime
    torusMesh.rotation.x = - 0.15 * elapsedTime
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()