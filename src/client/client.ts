import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import * as core from '@theatre/core'
import studio from '@theatre/studio'

//#region Studio
let sheet: any;
if (process.env.NODE_ENV === 'development') {
    studio.initialize();
    const proj = core.getProject("Main");
    sheet = proj.sheet("Scene");
}
//#endregion

//#region scene

var scene = new THREE.Scene();

//#endregion 

//#region camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );

camera.position.x = 142.75045088038718;
camera.position.y = 131.92094293881487;
camera.position.z = 209.76686235092527;

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
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

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
let coffe: THREE.Mesh;
objLoader.load('Coffe.obj', function (object: any) {
    object.traverse( function (obj: any) {
        if (obj.isMesh){
            obj.material.color.set(0x00ffff);
            obj.material.wireframe = true;
            obj.material.opacity = 0.7;
            obj.material.transparent = true;
            obj.material.emissive.set(0x00ffff);
            console.log(obj.material);
        }
        } );

    object.scale.set(100,100,100);
    scene.add(object);

    object.position.y -= 60;
    coffe = object;

    //#region STUDIO
    if (process.env.NODE_ENV === 'development') {
        const coffeStudio = sheet.object("Coffe", {
            position: {x: 0 , y: -60, z: 0 },
            rotation: {x: 0 , y: -60, z: 0 }
        });
        coffeStudio.onValuesChange((v: any) => {
            coffe.rotation.x = (v.rotation.x);
            coffe.rotation.y = (v.rotation.y);
            coffe.rotation.z = (v.rotation.z);
            
            coffe.position.x = (v.position.x);
            coffe.position.y = (v.position.y);
            coffe.position.z = (v.position.z);
        });
    }
    //#endregion

});

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
    //Coffe animation
    if (coffe != undefined) {
        coffe.rotation.y += 0.003;
    }

};
//#endregion

animate();