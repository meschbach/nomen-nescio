import { init_stats } from './stats'
import { Scene, PerspectiveCamera, WebGLRenderer } from 'THREE'

function update_view(renderer, camera) {
    console.log('view update');
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

export function init_gl(){
	var scene = new Scene();
	var camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	var renderer = new WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener('resize', () => {
		update_view(renderer, camera)
	});

	camera.position.z = 5;

	var renderingStats = init_stats( "stats-renderer" );
	var animatables = [];
	var render = function () {
		requestAnimationFrame( render );

		renderingStats.begin();

		animatables.forEach( function( visual ){
			visual.animate_tick( scene );
		});

		renderingStats.end();

		renderer.render(scene, camera);
	};
	requestAnimationFrame( render );

	return {
		camera: camera,
		animatable: animatables
	};
}
