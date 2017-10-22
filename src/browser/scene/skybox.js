import {
	BackSide,
	ImageUtils,
	Mesh,
	MeshPhongMaterial,
	SphereGeometry,
} from 'THREE';

export function init_skybox(sys) {

    var skyboxGeometry = new SphereGeometry(25, 25, 25);
    var skyboxMaterial = new MeshPhongMaterial({
        map:  ImageUtils.loadTexture('space.jpg'),
        side: BackSide
    });
    var skyboxMesh = new Mesh(skyboxGeometry, skyboxMaterial);
    skyboxMesh.position.z = -5;

	var skybox = {
		animate_tick: scene => {
            scene.add( skyboxMesh );
        }
    };

	sys.visuals.animatable.push( skybox );
}
