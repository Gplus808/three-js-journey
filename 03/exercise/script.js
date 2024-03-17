import * as THREE from 'three'

//Canvas
const canvas = document.querySelector('canvas.webgl')



//Scene
const scene = new THREE.Scene()

//Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Size
const sizes = {
    width: 800,
    height: 600
}


//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

//Renderer
const rednderer = new THREE.WebGLRenderer({
    canvas: canvas
})
rednderer.setSize(sizes.width, sizes.height)

rednderer.render(scene, camera)




 




//npm run dev -----> runs vite