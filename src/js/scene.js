//librerias necesarias

import * as THREE from "three";
import * as dat from "dat.gui";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/shaderpass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import {ClearPass} from 'three/examples/jsm/postprocessing/ClearPass';



//imagenes y modelos
const elevatorUrl = new URL("../assets/models/elevator.glb", import.meta.url);
//axiliares

//importacion
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AmbientLight } from "three";


//set the main components
const scene = new THREE.Scene();
const neonScene = new THREE.Scene();

const mainCamera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 150, window.innerHeight - 15);
document.body.appendChild(renderer.domElement);
const loader = new GLTFLoader();

//SET OBJECTS FOR SCENE

//items

//lights
const dirLight = new THREE.DirectionalLight(0x0ffffff, 1);
//SET PROPETIES TO ITEMS IN SCENE

dirLight.position.set(10, 11, 0);
dirLight.intensity = 12;
dirLight.color.set(0xebfa);
//dirlight
/*
intensity 5.2
color 0xa9fa,
posY 20
posZ 16
rotZ 1
//ambientLight
intensity .4
color 0xc09f
//mainCamera
posY 2.8
posZ5
rotZ 10
*/

//cameras
mainCamera.position.set(0, 2.8, 10);

//lights

//HELPERS TO THE SCENE
const axesHelper = new THREE.AxesHelper(4);
const gridHelper = new THREE.GridHelper(40, 25);
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);

//ADD ITEMS TO SCENE

//objs

//cameras

scene.add(mainCamera);

//lights

scene.add(dirLight);
//helpers

scene.add(axesHelper);
scene.add(gridHelper);
scene.add(dirLightHelper);

//ELEVATOR GLTF
loader.load(elevatorUrl.href, (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  const elevatorModel = model;
  //set propeties
  elevatorModel.rotation.y = 5.2;

  const mainBody = elevatorModel.getObjectByName("main_body");

  const mainBodyMaterial = new THREE.MeshPhysicalMaterial();
  console.log("return from by let", elevatorModel);

  //set materials
  mainBody.material = mainBodyMaterial;
  mainBodyMaterial.color.set();
  mainBody.material.roughness = 0.45;
  mainBody.material.clearcoat = 1;
  mainBody.material.metalness = 1;

  //materials for the componenst

  //gui for models
  const GUI = new dat.GUI();
  const elevatorFolder = GUI.addFolder("elevator");

  const options = {
    metalness: mainBodyMaterial.metalness,
    roughness: mainBodyMaterial.roughness,
    clearcoat: mainBodyMaterial.clearcoat,
    rotation: elevatorModel.rotation.clone(),
  };

  setGuiOptionMat(
    elevatorFolder,
    options,
    "metalness",
    mainBody,
    "metalness",
    0,
    1
  );
  setGuiOptionMat(
    elevatorFolder,
    options,
    "roughness",
    mainBody,
    "roughness",
    0,
    1
  );
  setGuiOptionMat(
    elevatorFolder,
    options,
    "clearcoat",
    mainBody,
    "clearcoat",
    0,
    1
  );
  setGuiTransform(
    elevatorFolder,
    options.rotation,
    "y",
    elevatorModel,
    "rotation"
  );
});

const neonUrl = new URL("../assets/models/neon.glb", import.meta.url);
//load neon model
loader.load(neonUrl.href, (gltf) => {
  //set model
  const neonModel = gltf.scene;
  const neon = neonModel.getObjectByName('neon_');

  //load model
  neonScene.add(neonModel);
  //neonScene.add(dirLight);
  neonScene.add(mainCamera);

  //set propeties
  neonModel.rotation.y = 5.2;

  console.log(neon);

  //set materials

  const neonLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff00f0,
    emissive: new THREE.Color(0xff00f0),
    emissiveIntensity: 1,
  });

  //neon lights material
  neon.material = neonLightMaterial;

  const GUI = new dat.GUI();
  const neonFolder = GUI.addFolder("Neon");
  ///
  //for options
  const options = {
    emissive: neonLightMaterial.emissive.getHex(),
    intensity: neonLightMaterial.emissiveIntensity,
  };

  //neon
  setGuiOptionColorMat(neonFolder,
    options,
    "emissive",
    neonModel,
    "emissive");
/*
  setGuiOptionMat(
    neonFolder,
    options,
    "emissiveIntensity",
    neonModel,
    "emissiveIntensity"
  );
  */
});

//SET POST PROCESING

//set aux effects
const clearPass = new ClearPass();

//set scenes
const renderScene = new RenderPass(scene, mainCamera);
renderScene.clear = false;
const renderNeonScene = new RenderPass(neonScene, mainCamera);
renderNeonScene.clear = false;

//set bloom
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
const strengh = 1.5;
const radius = 0.5;
const threshold = 0;

const unrealBloomPass = new UnrealBloomPass(
  resolution,
  strengh,
  radius,
  threshold
);

//set mains outputs

const composer = new EffectComposer(renderer);
const outpuPass = new ShaderPass(CopyShader);
outpuPass.renderToScreen = true;


//set postProcesing effects
composer.addPass(clearPass);
composer.addPass(renderNeonScene);
composer.addPass(unrealBloomPass);

composer.addPass(renderScene);
composer.addPass(outpuPass);


//LOAD MODELS

//call to MAIN RENDER FUNCTION
renderer.setAnimationLoop(animate);

//DAT.GUI HERE!!
const GUI = new dat.GUI();
const options = {
  camPos: mainCamera.position.clone(),

  color: dirLight.color.getHex(),
  intensity: dirLight.intensity,
  position: dirLight.position.clone(),
  rotation: dirLight.rotation.clone(),
};

//organizar todo

const dirLighFolder = GUI.addFolder("DirectionalLight");
const cameraFolder = GUI.addFolder("Main Camera");
//set events

//dir light
setGuiValue(dirLighFolder, options, "intensity", dirLight, "intensity");
setGuiColor(dirLighFolder, options, "color", dirLight);
//pos
setGuiTransform(dirLighFolder, options.position, "x", dirLight, "position");
setGuiTransform(dirLighFolder, options.position, "y", dirLight, "position");
setGuiTransform(dirLighFolder, options.position, "z", dirLight, "position");
//rot
setGuiTransform(dirLighFolder, options.rotation, "x", dirLight, "rotation");
setGuiTransform(dirLighFolder, options.rotation, "y", dirLight, "rotation");
setGuiTransform(dirLighFolder, options.rotation, "z", dirLight, "rotation");

//camera transform edit
//pos
setGuiTransform(cameraFolder, options.camPos, "x", mainCamera, "position");
setGuiTransform(cameraFolder, options.camPos, "y", mainCamera, "position");
setGuiTransform(cameraFolder, options.camPos, "z", mainCamera, "position");

//rot
setGuiTransform(cameraFolder, options.camPos, "x", mainCamera, "rotation");
setGuiTransform(cameraFolder, options.camPos, "y", mainCamera, "rotation");
setGuiTransform(cameraFolder, options.camPos, "z", mainCamera, "rotation");

//ONLY FUNCTIONS HERE!!
//main render function
function animate() {
  // renderer.render(scene, mainCamera);
  composer.render();
}

//the actions for the GUI PANEL

//set simple propety
function setGuiValue(folder, parameters, guiName, obj, propety, min, max) {
  folder.add(parameters, guiName, min, max).onChange(() => {
    obj[propety] = parameters[guiName];
  });
}

//set color
function setGuiColor(folder, parameters, guiName, obj) {
  folder.addColor(parameters, guiName).onChange(() => {
    obj.color.set(parameters[guiName]);
  });
}

//set pos, rot, scale
function setGuiTransform(folder, parameters, axe, obj, propety) {
  folder
    .add(parameters, axe)
    .name(propety + " " + axe)
    .onChange(() => {
      obj[propety][axe] = parameters[axe];
    });
}
//set vlaues to  setGuiOptionColorMat
function setGuiOptionMat(folder, parameters, guiName, obj, propety, min, max) {
  folder.add(parameters, guiName, min, max).onChange(() => {
    obj.material[propety] = parameters[guiName];
  });
}

//set color to materials
function setGuiOptionColorMat(folder, parameters, guiName, obj, propety) {
  folder.addColor(parameters, guiName).onChange(() => {
    obj.material[propety] = parameters[guiName];
  });
}

//GTLF LOADER FUCNTION
