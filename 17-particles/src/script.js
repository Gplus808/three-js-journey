import { WebMidi } from "webmidi";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

const gui = new GUI();
let canvas, renderer, scene, camera, controls;
let particlesGeometry, particles; // Make particlesGeometry and particles global
const count = 50000; // Make count global

// Global MIDI control variables
let fade1 = 0, fade2 = 0, fade3 = 0;
let modSpeed = 1; // Modifier speed for fader1
let cameraZoom = 1; // Camera zoom for fader2
let cameraRotation = 0; // Camera rotation for fader3

// Create and append canvas element
canvas = document.createElement('canvas');
canvas.className = 'webgl';
document.body.appendChild(canvas);

// Set styles for body to ensure canvas fills the screen
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

function initializeThreeJS() {
    return new Promise((resolve, reject) => {
        try {
            scene = new THREE.Scene();

            // Texture setup
            const textureLoader = new THREE.TextureLoader();
            const particleTexture = textureLoader.load('/textures/particles/1.png', resolve);

            // Particles setup
            particlesGeometry = new THREE.BufferGeometry();

            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            for(let i = 0; i < count * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 10;
                colors[i] = Math.random();
            }

            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.1,
                sizeAttenuation: true,
                alphaMap: particleTexture,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            });

            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);

            // Sizes setup
            const sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            window.addEventListener('resize', () => {
                sizes.width = window.innerWidth;
                sizes.height = window.innerHeight;

                camera.aspect = sizes.width / sizes.height;
                camera.updateProjectionMatrix();

                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            });

            // Camera setup
            camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
            camera.position.z = 3;
            scene.add(camera);

            // Controls setup
            controls = new OrbitControls(camera, canvas);
            controls.enableDamping = true;

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ canvas: canvas });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function animate() {
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = particlesGeometry.attributes.position.array[i3];
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime * modSpeed + x);
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        particles.rotation.y += (fade1 / 10000);
        camera.position.z = cameraZoom;
        camera.rotation.y = cameraRotation * 10;

        controls.update();
        renderer.render(scene, camera);

        window.requestAnimationFrame(tick);
    };

    tick();
}

async function initializeWebMidi() {
    try {
        await WebMidi.enable();
        console.log("WebMidi enabled");

        if (WebMidi.inputs.length < 1) {
            console.log("No device detected");
        } else {
            WebMidi.inputs.forEach((device, index) => {
                console.log(`Device detected: ${device.name}`);
            });

            let mySynth = WebMidi.inputs[0];
            console.log("Selected device:", mySynth);

            if (mySynth) {
                mySynth.addListener("controlchange", e => {
                    console.log(`MIDI control change message received: ${e.data}`);

                    const controllerNumber = e.controller.number;
                    const controllerValue = e.value;

                    console.log(`Controller number: ${controllerNumber}, value: ${controllerValue}`);

                    if (controllerNumber === 77) {
                        modSpeed = 0.1 + (controllerValue / 127) * 100; // Modulation speed range from 0.1 to 20
                        console.log("Modulation speed:", modSpeed);
                    }
                    if (controllerNumber === 78) {
                        cameraZoom = 1 + (controllerValue / 127) * 10000; // Camera zoom range from 1 to 50
                        console.log("Camera zoom:", cameraZoom);
                    }
                    if (controllerNumber === 79) {
                        cameraRotation = (controllerValue / 127) * Math.PI * 10000; // Full rotation range from 0 to 8π radians (4 full rotations)
                        console.log("Camera rotation:", cameraRotation);
                    }
                });
            } else {
                console.log("No synth available");
            }
        }
    } catch (err) {
        console.error("WebMidi could not be enabled.", err);
    }
}

Promise.all([initializeThreeJS(), initializeWebMidi()])
    .then(() => {
        console.log("Both Three.js and WebMidi.js initialized.");
        animate();
    })
    .catch(err => {
        console.error("An error occurred during initialization:", err);
    });
