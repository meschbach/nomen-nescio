import { init_system } from './system'
import { init_player } from './player'
import { init_player_controls } from './player-controls'
import { init_dock } from './dock'
import { init_skybox } from './scene/skybox'
import { init_ship } from "./scene/ship";

import {
	AmbientLight,
	Color,
	Face3,
	Group,
	Geometry,
	Math as TMath,
	Matrix4,
	Mesh,
	MeshPhongMaterial,
	Object3D,
	Vector2,
	Vector3
} from 'THREE'

import {
    SpotLight
} from 'THREE';

//http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
export function init(){
	var sys = init_system();
	sys.init();

	init_skybox(sys);
	init_ship(sys);

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

	// Add Lighting

	var ambientLight = new AmbientLight(0xCCCCCC);

    var spotLight = new SpotLight(0xF4DF42, 1);
    spotLight.position.set(0, 2, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 200;

	sys.attach({
		animate_tick: scene => {
            scene.add(ambientLight);
            scene.add(spotLight);
		}
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
