//*************************************************
//
//  A short demo of using shaders in Three.js
//
//  Shader Distortion with Texture Selection
//
//      Ringo Cheung 2025/11/27
//
//*************************************************


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vertexShader from './vshader.js';
import fragmentShader from './fshader.js';
import galaxyImage from '../image/galaxy.jpg';
import uvcheckerImage from '../image/uvchecker.png';
import waveImage from '../image/wave.jpg';
import glassImage from '../image/glassrain.jpg';
import woodImage from '../image/wood.jpg';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js'

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Mouse controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;

// Array for textures
const texArray = [ 'Wave', 'Glass', 'Wood', 'UV Checker', 'Galaxy' ];

// GUI
const gui = new GUI();

// UI for texture selection
const texFolder = gui.addFolder( 'Texture Selection' );
const texController = texFolder.add( { texture: 'Wave' }, 'texture', texArray ).name( 'Texture' );
texController.onChange( function( value ) {
    let selectedImage;
    switch ( value ) {
        case 'Wave':
            selectedImage = waveImage;
            break;
        case 'Glass':
            selectedImage = glassImage;
            break;
        case 'Wood':
            selectedImage = woodImage;
            break;
        case 'UV Checker':
            selectedImage = uvcheckerImage;
            break;
        case 'Galaxy':
            selectedImage = galaxyImage;
            break;
    }
    const newTexture = new THREE.TextureLoader().load( selectedImage );
    //newTexture.wrapS = newTexture.wrapT = THREE.MirroredRepeatWrapping;
    //newTexture.repeat.set( 8, 1 );
    shaderMaterial.uniforms.myTexture.value = newTexture;
} );

texFolder.open();

const waveAmplitude = { waveAmplitude: 2.0 };
const waveFrequency = { waveFrequency: 2.0 };

// UI for distortion parameters
const distFolder = gui.addFolder( 'Distortion Parameters' );
distFolder.add( waveAmplitude, 'waveAmplitude', 1.0, 5.0 ).name( 'Wave Amplitude' ).onChange( function( param ) {
    shaderMaterial.uniforms.waveAmplitude.value = param;
    shaderMaterial.needsUpdate = true;
} );
distFolder.open();

distFolder.add( waveFrequency, 'waveFrequency', 0.5, 5.0 ).name( 'Wave Frequency' ).onChange( function( param ) {
    shaderMaterial.uniforms.uTime.value = clock.getElapsedTime() * param;
    shaderMaterial.needsUpdate = true;
} );


// Initialize texture
const uvTexture = new THREE.TextureLoader().load( waveImage );

// Define Uniforms for shaders
let clock = new THREE.Clock();
const uniformData = {
    myTexture : {
        type: "t",
        value: uvTexture,
    },
    uTime : {
        type: "f",
        value: clock.getElapsedTime() * waveFrequency.waveFrequency,
    },
    waveAmplitude: {
        type: "f",
        value: 2.0,
    },
};

// Shader material
const shaderMaterial = new THREE.ShaderMaterial( { 
    wireframe: false, 
    vertexShader, 
    fragmentShader, 
    uniforms: uniformData,
    side: THREE.DoubleSide,
} );
 
// Mesh
const boxGeometry = new THREE.BoxGeometry( 10, 10, 10, 30, 30, 30 );
const meshMaterial = new THREE.MeshStandardMaterial({ 
    map: uvTexture,
    roughness: 0,
});
const mesh = new THREE.Mesh( boxGeometry, shaderMaterial );
scene.add( mesh );

// Lighting
const light1 = new THREE.DirectionalLight( 0xffffff, 1 );
const light2 = new THREE.DirectionalLight( 0xffffff, 1 );
const light3 = new THREE.DirectionalLight( 0xffffff, 1 );
light1.position.set( 1, 1, -1 );
light2.position.set( 1, 1, 1 );
light3.position.set( 1, -1, 1 );
scene.add( light1 );
scene.add( light2 );
scene.add( light3 );

// Helper axes
const axesHelper = new THREE.AxesHelper( 10 );
scene.add( axesHelper );

// Camera position
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;
controls.update();

// Stats
const stats = new Stats();
document.body.appendChild( stats.dom );

// Background color
renderer.setClearColor( 0x000000, 1.0 );

// Color array and index for cycling colors (not used currently)
//const colors = [ "red", "green", "blue", "yellow", "purple", "orange" ];
//let colorIndex = 0;

// Create animation for the model
function animate() {

    uniformData.uTime.value = clock.getElapsedTime() * waveFrequency.waveFrequency;

    renderer.render( scene, camera );
    controls.update();
    stats.update();

    // Change color every 10 frames (not used currently)
    //if ( Math.floor( performance.now() / 10 ) % 10 === 0 ) {
    //    mesh.material.color.set( colors[ colorIndex ] );
    //    colorIndex = ( colorIndex + 1 ) % colors.length;
    //}

    //mesh.rotation.x += 0.005;
    //mesh.rotation.y += 0.003;

}
renderer.setAnimationLoop( animate );

// Handle window resize
window.addEventListener( 'resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});
    