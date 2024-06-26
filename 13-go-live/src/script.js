import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// // Axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/11.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
console.log(matcapTexture);




//Font
const fontLoader = new FontLoader()

fontLoader.load('/fonts/Kanit_Italic.json', (font) => {
    const textGeometry = new TextGeometry('dsplaced.', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.01, // Adjusted
        bevelSize: 0.02,      // Adjusted
        bevelOffset: 0,
        bevelSegments: 10     // Adjusted
    });
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )
    

    
    textGeometry.center()

    textGeometry.computeBoundingBox()
    console.log(textGeometry.boundingBox);

    
    const material = new THREE.MeshMatcapMaterial()
    material.matcap = matcapTexture

    //Clearcoat
    material.clearcoat = 0
    material.clearcoatRoughness = 0
    // gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
    // gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

    
    const text = new THREE.Mesh(textGeometry, material)

    textGeometry.center()
    textGeometry.computeVertexNormals();
    scene.add(text)
    console.time('donut')

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    
for (let i = 0; i < 200; i++) {
    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}

console.timeEnd('donut')

})


scene.background = new THREE.Color('lightgray'); 

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 100000)
pointLight.position.x = 1.5
pointLight.position.y = 1.5
pointLight.position.z = 20
scene.add(pointLight)

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
camera.position.z = 5
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()