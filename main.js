//Import the THREE.js library
import * as THREE from 'three';
// To allow for the camera to move around the scene

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

import Stats from 'three/examples/jsm/libs/stats.module'

//INIT SCENE
const scene = new THREE.Scene();
//scene.background = new THREE.Color().setHSL( 0.07, 1.0, 0.04, THREE.SRGBColorSpace );
//scene.fog = new THREE.Fog( scene.background, 10, 50 );
//scene.background = null;
//CAMERA
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
//MOUSE
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object; //Keep the 3D object on a global variable so we can access it later
let controls; //OrbitControls allow the camera to move around the scene
let objToRender = 'kroete'; //Set which object to render

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(    //If the file is loaded, add it to the scene
  `./assets/`+ objToRender +`/scene.gltf`,
  function (gltf) {
    object = gltf.scene;

    scene.add(object);

  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded'); //While it is loading, log the progress
  },
  function (error) {
    console.error(error);  //If there is an error, log it
  }
);
//Set the position of the object to the origin (0,0,0) in the scene


//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } ); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.set(0, 0, 50) //This sets the camera to be 50 units away from the origin (0,0,0) in the scene 
scene.position.set(0, -5, 0); //This sets the scene to be at the origin (0,0,0) in the scene
//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xab7a68, 0,2); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
//scene.add(topLight);

const spotLight = new THREE.SpotLight( 0xc47335, 10 );
				spotLight.position.set( -50, 50, -40 );
				spotLight.angle = Math.PI / 6;
				spotLight.penumbra = 1;
				spotLight.decay = 0;
				spotLight.distance = 0;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 4096;  // default
        spotLight.shadow.mapSize.height = 4096; // default
        spotLight.shadow.camera.near = 10;       // default
        spotLight.shadow.camera.far = 100;       // default
        spotLight.shadow.camera.fov = 30;        // default
        spotLight.shadow.bias = 1; // default
        spotLight.shadow.radius = 0; // default
        spotLight.shadow.intensity = 1;
        spotLight.receiveShadow = true; // Allow the object to receive shadows
        scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x4b3d2b, objToRender === objToRender ? 1.4 : 1); // (color, intensity)
scene.add(ambientLight);


				// lensflares
				const textureLoader = new THREE.TextureLoader();

				const textureFlare0 = textureLoader.load( 'assets/textures/lensflare/lensflare0_alpha.png' );
				const textureFlare3 = textureLoader.load( 'assets/textures/lensflare/lensflare3_alpha.png' );

				//addLight( 0.55, 0.9, 0.5, 10, 0, 0 );
				//addLight( 0.08, 0.8, 0.5, 20, 0, 0 );
				addLight( 1.0, 0.3, 1.0, 2, 14.49, 5.3);

				function addLight( h, s, l, x, y, z ) {

					const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
					light.color.setHSL( h, s, l );
					light.position.set( x, y, z );
					scene.add( light );

					const lensflare = new Lensflare();
					lensflare.addElement( new LensflareElement( textureFlare0, 200, 0, light.color ) );
					lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
					lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
					lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
					lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
					light.add( lensflare );

				}

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "kroete") {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;   //damping 
        controls.dampingFactor = 0.4;   //damping inertia
        controls.enableZoom = true;      //Zooming
        controls.autoRotate = false;       // enable rotation
        controls.maxPolarAngle = Math.PI / 1.5; // Limit angle of visibility
        controls.maxDistance = 400.0;
        controls.minDistance = 35.0;
        controls.keyPanSpeed = 7.0;
        controls.enablePan = true; //Enable panning
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}
}

const stats = new Stats();
document.body.appendChild(stats.dom);

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

    if (object && objToRender === "kroete") {
    //I've played with the constants here until it looked good
    
  scene.rotation.y += 0.001;
  }
  stats.update();
  renderer.render(scene, camera);

}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();
