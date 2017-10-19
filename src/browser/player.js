import { thrust_aspect, rotational_thrust_aspect } from './thrusters'
import { collidable_aspect } from './collidable'

export function init_player( sys ){
	var visuals = sys.visuals;
	var sim = sys.sim;

	var player = {
		name: "player",
		momentum: { x: 0, y: 0, z: 0 },
		rotation: { x: 0, y: 0, z: 0 },
		position: { x: 0, y: 0, z: 5 },
		animate_tick: function(){
			var camera = visuals.camera;
			camera.position.x = this.position.x;
			camera.position.y = this.position.y;
			camera.position.z = this.position.z;

			camera.rotation.x = this.rotation.x;
			camera.rotation.y = this.rotation.y;
			camera.rotation.z = this.rotation.z;
		},
		simulation_tick: function(){
			this.position.x += this.momentum.x;
			this.position.y += this.momentum.y;
			this.position.z += this.momentum.z;
		},
		collidedWith: function( hit ){}
	};
	visuals.animatable.push( player );
	sys.sim.simulate.push(  player );
	var primary_thruster = thrust_aspect( sys, player, { x: 0, y: 0, z: -1 } );
	var top_nav_thruster = thrust_aspect( sys, player, { x: 0, y: 1, z: 0 } );
	var bottom_nav_thruster = thrust_aspect( sys, player, { x: 0, y: -1, z: 0 } );
	var starboard_nav_thruster = thrust_aspect( sys, player, { x: 1, y: 0, z: 0 } );
	var port_nav_thruster = thrust_aspect( sys, player, { x: -1, y: 0, z: 0 } );

	var hitbox = collidable_aspect( sys, player, {x: 1, y: 1, z: 1} );
	hitbox.collided = function( hitOthers ){
		primary_thruster.stop();
		player.momentum.z = 0;
		hitOthers.forEach( function( other ){
			player.collidedWith( other );
		});
	}

	var pitchThrust = rotational_thrust_aspect( sys, player, { x: 1, y:0, z:0 } );
	function pitch_forward(){
		pitchThrust.increase();
	}
	function pitch_back(){
		pitchThrust.decrease();
	}

	var yawThrust = rotational_thrust_aspect( sys, player, { x: 0, y:1, z:0 } );
	function yaw_port(){
		yawThrust.increase();
	}
	function yaw_starboard(){
		yawThrust.decrease();
	}

	var rollThrust = rotational_thrust_aspect( sys, player, { x: 0, y:0, z:1 } );
	function roll_port(){
		rollThrust.increase();
	}
	function roll_starboard(){
		rollThrust.decrease();
	}

	player.actions = {
		translate_up: { perform: function(){
			top_nav_thruster.increase();
			bottom_nav_thruster.stop();
		}, description: "Use upward thruster" },

		translate_down: { perform: function(){
			bottom_nav_thruster.increase();
			top_nav_thruster.stop();
		}, description: "Use downward thruster" },

		translate_port: { perform: function(){
			port_nav_thruster.increase();
			starboard_nav_thruster.stop();
			player.momentum.x = 0;
		}, description: "Use port thruster" },

		translate_starboard: { perform: function(){
			starboard_nav_thruster.increase();
			port_nav_thruster.stop();
			player.momentum.x = 0;
		}, description: "Use starboard thruster" },

		translate_fore: { perform: function(){
			primary_thruster.increase();
		}, description: "Use primary thruster" },

		translate_aft: { perform: function(){
			primary_thruster.decrease();
		}, description: "Use braking thruster" },

		full_stop: { perform: function(){
			primary_thruster.stop();
			starboard_nav_thruster.stop();
			port_nav_thruster.stop();
			bottom_nav_thruster.stop();
			top_nav_thruster.stop();
			player.momentum.x = 0;
			player.momentum.y = 0;
			player.momentum.z = 0;
		}, description: "Disable all thrusters" },

		pitch_forward: { perform: function(){
			pitch_forward();
		}, description: "pitch forward" },
		pitch_back: { perform: function(){
			pitch_back();
		}, description: "pitch back" },

		yaw_port: { perform: function(){
			yaw_port();
		}, description: "yaw port" },
		yaw_starboard: { perform: function(){
			 yaw_starboard();
		}, description: "yaw starboard" },

		roll_port: { perform: function(){
			roll_port();
		}, description: "roll port" },
		roll_starboard: { perform: function(){
			roll_starboard();
		}, description: "roll starboard" },
	};
	return player;
}
