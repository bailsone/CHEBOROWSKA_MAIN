/*  ^°°°°°°°°°°°°
TEST
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

}
  */
//Import the THREE.js library
import * as THREE from 'three';
// To allow for the camera to move around the scene
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { controls } from 'three/src/Three.Core.js';

THREE.Clock
//INIT SCENE
const scene = new THREE.Scene();
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



//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.set(100, -20, 200) //This sets the camera to be 50 units away from the origin (0,0,0) in the scene 
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
  LEFT: 'KeyA', //left arrow
	UP: 'KeyW', // up arrow
	RIGHT: 'KeyD', // right arrow
	BOTTOM: 'KeyS' // down arrow
}
}

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
    
 // object.rotation.y += 0.001;
  }

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
