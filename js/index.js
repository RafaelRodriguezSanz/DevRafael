
//#region scene

var scene = new THREE.Scene();

//#endregion 

//#region camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

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
var controls = new THREE.OrbitControls(camera, renderer.domElement);
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
var mtlLoader = new THREE.MTLLoader(loadingManager);
mtlLoader.setTexturePath('/models/');
mtlLoader.setPath('/models/');
var objLoader = new THREE.OBJLoader();

objLoader.setPath('/models/');
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
let coffe;

    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('/models/');
    objLoader.load('Coffe.obj', function (object) {
        object.traverse( function (obj) {
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

    });

//#endregion

//#region Setup
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
    if (coffe != undefined) {
        coffe.rotation.y += 0.003;
    }

};
//#endregion

animate();