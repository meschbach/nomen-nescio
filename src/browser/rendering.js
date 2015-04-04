//http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
function init(){
	var system = init_system();
	system.init();
	var sys = system;

//			init_skybox( sys );

	var player = init_player( sys );
	init_player_controls( sys, player.actions );

	var dock = init_dock( sys );

	//Level
	var done = false;
	player.collidedWith = function( other ){
		if( !done ){
			if( other.object == dock ){
				done = true;
				console.log( "Docking complete. Hmm...we need more objectives." );
			}
		}
	}

	var textGeom;
	var text = {
		animate_tick: function( scene ){
			if( !textGeom ){
				textGeom = new THREE.TextGeometry( "Hello, intersect with the cube." );
				scene.add( textGeom );
			}
			textGeom.position.y = 1.2;
		}
	}
}
