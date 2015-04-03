function init_gl(){
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

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

	render();
	return {
		camera: camera,
		animatable: animatables
	};
}
