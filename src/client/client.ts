import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier.js'; // Example https://github.com/mrdoob/three.js/blob/master/examples/webgl_modifier_simplifier.html

import * as core from '@theatre/core';
//import studio from '@theatre/studio';

import state from '../../dist/client/states/state1.json';

//#region Studio
let sheet: any;
//studio.initialize();
const config = { state }
const proj = core.getProject("Main", config);
//const proj = core.getProject("Main");
sheet = proj.sheet("Scene");
//#endregion

//#region scene

var scene = new THREE.Scene();

//#endregion 

//#region camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );

camera.position.x = 0;
camera.position.y = 10;
camera.position.z = 0;

//#region STUDIO
const cameraStudio = sheet.object("Camera", {
    position: {x: 0, y: 10, z: 0 }
});
//#endregion

//#endregion

//#region Loader
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function(url, item, total){
    console.log(`Started loading: ${url}`);
}

loadingManager.onProgress = function(url, loaded, total){
    console.log(`Loading: ${url}`);
}

loadingManager.onLoad = function(){
    console.log(`Finish loading`);
}

loadingManager.onError = function(url){
    console.log(`Error loading:  ${url}`);
}

//#endregion 

//#region Canvas
var renderer = new THREE.WebGLRenderer({
    antialias : true,
    alpha: true
});
renderer.outputEncoding = THREE.sRGBEncoding;
scene.background = new THREE.Color( 0x000000 );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//#endregion

//#region Controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
//#endregion

//#region lights

var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 20, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 20, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 20, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

//#endregion

//#region Loaders
var mtlLoader = new MTLLoader(loadingManager);
mtlLoader.setPath('models/');
var objLoader = new OBJLoader();
objLoader.setPath('models/');
var fbxLoader = new FBXLoader();
fbxLoader.setPath('models/');

var gltfLoader = new GLTFLoader();
gltfLoader.setPath('models/');

var tgaLoader = new TGALoader();
tgaLoader.setPath('models/');

//#endregion

//#region Object
//

//mtlLoader.load('Tree.mtl', function (materials) {
//
//    materials.preload();
//
//    var objLoader = new THREE.OBJLoader();
//    objLoader.setMaterials(materials);
//    objLoader.setPath('/models/');
//    objLoader.load('Tree.obj', function (object) {
//        object.scale.set(10,10,10);
//        scene.add(object);
//        object.position.y -= 60;
//
//    });
//
//});
//
//#endregion


//#region Coffe
//let coffe: THREE.Mesh;
//objLoader.load('Coffe.obj', function (object: any) {
//    object.traverse( function (obj: any) {
//        if (obj.isMesh){
//            obj.material.color.set(0x00ffff);
//            obj.material.wireframe = true;
//            obj.material.opacity = 0.7;
//            obj.material.transparent = true;
//            obj.material.emissive.set(0x00ffff);
//            console.log(obj.material);
//        }
//        } );
//
//    object.scale.set(100,100,100);
//    scene.add(object);
//
//    object.position.y -= 60;
//    coffe = object;
//
//    //#region STUDIO
//    const coffeStudio = sheet.object("Coffe", {
//        position: {x: 0 , y: -60, z: 0 },
//        rotation: {x: 0 , y: -60, z: 0 }
//    });
//    coffeStudio.onValuesChange((v: any) => {
//        coffe.rotation.x = (v.rotation.x);
//        coffe.rotation.y = (v.rotation.y);
//        coffe.rotation.z = (v.rotation.z);
//        
//        coffe.position.x = (v.position.x);
//        coffe.position.y = (v.position.y);
//        coffe.position.z = (v.position.z);
//    });
//    //#endregion
//
//});

//#endregion


//#region Load FBX from Unreal
// let cave: THREE.Mesh;
// fbxLoader.load('Cave.fbx', function (object: any) {
//     object.scale.set(100,100,100);
//     object.traverse( function (obj: any) {
//         if (obj.isMesh){
//             obj.material.color.set(0x00ffff);
//             obj.material.wireframe = true;
//             obj.material.opacity = 0.7;
//             obj.material.transparent = true;
//             obj.material.emissive.set(0x00ffff);
//             console.log(obj.material);
//         }
//         } );

//     scene.add(object);
//     object.position.y -= 60;
//     cave = object;
// 
// });
//#endregion


//#region Load Watch
let watch: any;
gltfLoader.load('Watch.gltf', function (object: any) {
    console.log(object.scene);
    object.scene.scale.x = 20;
    object.scene.scale.y = 20;
    object.scene.scale.z = 20;
    object.scene.rotation.y = 180;
    //object.scene.traverse( function (obj: any) {
    //    if (obj.isMesh){
    //        obj.material.color.set(0x00ffff);
    //        obj.material.emissive.set(0x00ffff);
    //    }
    //    } );

    scene.add(object.scene);
    watch = object.scene;

});
//#endregion


//#region PostProcessing
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3,
    0.1,
    0.1
);
composer.addPass(bloomPass);
//#endregion

//#region Setup
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
    composer.render();

    if (watch != undefined) {
        watch.children[0].children[0].children[0].children[2].children[0].rotation.y +=0.05 ;
        watch.children[0].children[0].children[0].children[3].children[0].rotation.y +=0.01 ;
        watch.children[0].children[0].children[0].children[4].children[0].rotation.y +=0.005 ;
    }

    //Coffe animation
    //if (coffe != undefined) {
    //    coffe.rotation.y += 0.003;
    //}

};
//#endregion


//#region STUDIO

cameraStudio.onValuesChange((v: { position: THREE.Vector3}) => {

    camera.position.set(v.position.x, v.position.y, v.position.z);
    
});

//#endregion


animate();