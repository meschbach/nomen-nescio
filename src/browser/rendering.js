import { init_system } from './system'
import { init_player } from './player'
import { init_player_controls } from './player-controls'
import { init_dock } from './dock'
import THREE from 'THREE'
import ColladaLoader from 'three-loaders-collada'
ColladaLoader( THREE )

//http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
export function init(){
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

	//
	test_model( system );
	var add = true;
	sys.attach( {
		animate_tick: function( scene ){
			if( add ){
				add = !add;
				scene.add( new THREE.AmbientLight( 0x404040 ) );
			}
		}
	});
}

function test_model( sys ){
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( 'assets/box-ship.dae', function ( collada ) {
		var object = collada.scene;
		console.log( collada );
		var needsAdding = true;
		var controller = {
			animate_tick: function( scene ){
				if( needsAdding ){
					needsAdding != needsAdding;
					scene.add( object );
				}
			}
		};
		sys.attach( controller );
	});
}

function goal_text(){
	var textGeom;
	var text = {
		animate_tick: function( scene ){
			if( !textGeom ){
				textGeom = new THREE.TextGeometry( "Hello, intersect with the cube.", { height: .01 });
				var wrapper = new THREE.MeshNormalMaterial({color: 0x00ff00});
				var words = new THREE.Mesh( textGeom, wrapper);
				words.scale.x = .001;
				words.scale.y = .001;
				words.scale.z = .001;
				words.matrixWorldNeedsUpdate = true;
				scene.add(words);
			}
		}
	}
	system.attach( text );
}

