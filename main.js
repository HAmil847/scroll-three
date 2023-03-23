//iniciar three.js
const scene = new THREE.Scene(); //esta es la escena de three.js
//esta es la camara principal             pov,  
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGlRenderer(); //se encarga de renderizar toda la escena

//configurar el render
renderer.setSize(window.innerWidth, window.innerHeight); //setea el tamano del render
document.body.appendChild(renderer.domElement); //agregamos el componente render a el html

//configurar elementos de la escena
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//set the camera
camera.position.z = 5;

//mostrar escena
renderer.render( scene, camera );