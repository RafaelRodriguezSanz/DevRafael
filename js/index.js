
//#region scene

var scene = new THREE.Scene();

//#endregion 

//#region camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

camera.position.x = 142.75045088038718;
camera.position.y = 131.92094293881487;
camera.position.z = 209.76686235092527;

//#endregion

//#region Canvas
var renderer = new THREE.WebGLRenderer();
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


//#region Object

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/models/');
mtlLoader.setPath('/models/');
mtlLoader.load('Tree.mtl', function (materials) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/models/');
    objLoader.load('Tree.obj', function (object) {
        object.scale.set(10,10,10);
        scene.add(object);
        object.position.y -= 60;

    });

});

//#endregion

//#region Setup
var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render(scene, camera);
};
//#endregion

animate();