import THREE from 'THREE';

export function init_skybox(sys) {

    var skyboxGeometry = new THREE.SphereGeometry(25, 25, 25);
    var skyboxMaterial = new THREE.MeshPhongMaterial({
        map:  THREE.ImageUtils.loadTexture('space.jpg'),
        side: THREE.BackSide
    });
    var skyboxMesh = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    skyboxMesh.position.z = -5;

	var skybox = {
		animate_tick: scene => {
            scene.add( skyboxMesh );
        }
    };

	sys.visuals.animatable.push( skybox );
}
