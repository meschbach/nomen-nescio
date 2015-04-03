//http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
		function init(){
			var sys = {
				visuals: init_gl(),
				sim: init_simulation( )
			};
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

		function init_player_controls( sys, actions ){
			var keyActionMap = {
				R: actions.translate_up,
				Z: actions.translate_down,

				W: actions.translate_fore,
				S: actions.translate_aft,

				A: actions.translate_port,
				D: actions.translate_starboard,

				I: actions.pitch_forward,
				K: actions.pitch_back,

				J: actions.yaw_port,
				L: actions.yaw_starboard,

				Q: actions.roll_port,
				E: actions.roll_starboard,

				P: actions.full_stop
			};

			window.addEventListener( "keydown", function( k ){
				var c = String.fromCharCode( k.keyCode );
				var action = keyActionMap[c];
				if( action ){
					console.log( action.description );
					action.perform();
				}else{
					console.log( "No binding for ", c );
					console.log( keyActionMap );
				}
			});
		}

		function init_dock( sys ){
			// Interesting object to fly through
			var stationMesh;
			var simulatedStation = {
				position: { x: 0, y: 0, z: -5 },
				animate_tick: function( scene ){
					if( !stationMesh ){
						var geometry = new THREE.TorusGeometry( .7, .1, 64, 32);
						var material = new THREE.MeshBasicMaterial( { color: 0x0000FF } );
						stationMesh= new THREE.Mesh( geometry, material );
						scene.add( stationMesh );
					}

					stationMesh.matrixWorldNeedsUpdate = true; 
					stationMesh.position.x = this.position.x;
					stationMesh.position.y = this.position.y;
					stationMesh.position.z = this.position.z;
				}
			};
			sys.visuals.animatable.push( simulatedStation );

			// Objective area
			var waypointMesh;
			var dock = {
				name: "dock",
				momentum: { x: 0, y: 0, z: 0 },
				position: { x: 0, y: 0, z: -5 },
				animate_tick: function( scene ){
					if( !waypointMesh ){
						var geometry = new THREE.BoxGeometry( 1, 1, .1 );
						var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
						material.transparent= true;
						material.opacity = .4;
						waypointMesh= new THREE.Mesh( geometry, material );
						scene.add( waypointMesh );
					}

					waypointMesh.position.x = this.position.x;
					waypointMesh.position.y = this.position.y;
					waypointMesh.position.z = this.position.z;

				},
				simulation_tick: function(){
					this.position.x += this.momentum.x;
					this.position.y += this.momentum.y;
					this.position.z += this.momentum.z;
				}
			};
			sys.visuals.animatable.push( dock );
			var hitbox = collidable_aspect( sys, dock, {x:1,y: 1,z: .1} );
			return dock;
		}

		function init_player( sys ){
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

var print = true;
		function collidable_aspect( sys, object, boundingBox ){
			var max = new THREE.Vector3( boundingBox.x / 2, boundingBox.y / 2, boundingBox.z / 2 );
			var min = new THREE.Vector3();
			min.copy( max ).negate();

			var visual;
			var collidable = {
				object: object,
				bounds: boundingBox,
				calc: function(){
					var box = new THREE.Box3( min.clone(), max.clone() );
					var point = new THREE.Vector3( this.object.position.x, this.object.position.y, this.object.position.z );
					return box.translate( point );
				},
				animate_tick: function( scene ){
					if( !visual ){
						var geometry = new THREE.BoxGeometry( boundingBox.x, boundingBox.y, boundingBox.z );
						var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
						var mesh = new THREE.Mesh( geometry, material );

						visual = new THREE.WireframeHelper( mesh, 0xff0000 );
						visual.matrixAutoUpdate = true; //GAH!  :-(

						scene.add( visual );
					}
					function sync_position( target, source ){
						target.position.x = source.position.x;
						target.position.y = source.position.y;
						target.position.z = source.position.z;
					}
					sync_position( visual, this.object );
				},

				collision_tick: function( others ){
					var count = 0;
					var self = this;
					var realArea = this.calc();
					var hit = others.filter( function( other ){
						if( other == self ) return false;
						var check = other.calc();
						if( count % 997 == 0 ){
							//console.log( check.min, check.max, realArea.min, realArea.max );
						}
						count++;
						var hit = realArea.isIntersectionBox( check );
						if( hit ){
							if( print ){ console.log( check, realArea ); }
						}
						return hit;
					});
					if( hit.length > 0 ){
						if( print ){
							print= false;
							console.log( hit );
						}
						this.collided( hit );
					}
				},

				collided: function(){}
			};
			sys.visuals.animatable.push( collidable );
			sys.sim.collidables.push( collidable );
			return collidable;
		}

		function rotational_thrust_aspect( sys, object, vector ){
			var thruster = {
				step: 0.10 / 60.0,
				maximum: 1.00 / 60.0,
				minimum: -1.00 / 60.0,
				thrust: 0,
				vector: vector,
				simulation_tick: function(){
					//TODO model real thrust curve (bell?); physics of exhaust?
					object.rotation.x += this.vector.x * this.thrust;
					object.rotation.y += this.vector.y * this.thrust;
					object.rotation.z += this.vector.z * this.thrust;
				},
				increase: function(){
					var more = this.thrust + this.step;
					if( more <= this.maximum ){
						this.thrust = more;
					}
				},
				decrease: function(){
					var less = this.thrust - this.step;
					if( less >= this.minimum ){
						this.thrust = less;
					}
				},
				stop: function(){
					this.thrust = 0;
				}
			};
			sys.sim.simulate.push( thruster );
			return thruster;
		}

		function thrust_aspect( sys, object, vector ){
			var thruster = {
				step: 0.10 / 60.0,
				maximum: 1.00 / 60.0,
				minimum: -1.00 / 60.0,
				thrust: 0,
				vector: vector,
				simulation_tick: function(){
					//TODO model real thrust curve (bell?); physics of exhaust?
					object.momentum.x += this.vector.x * this.thrust;
					object.momentum.y += this.vector.y * this.thrust;
					object.momentum.z += this.vector.z * this.thrust;
				},
				increase: function(){
					var more = this.thrust + this.step;
					if( more <= this.maximum ){
						this.thrust = more;
					}
				},
				decrease: function(){
					var less = this.thrust - this.step;
					if( less >= this.minimum ){
						this.thrust = less;
					}
				},
				stop: function(){
					this.thrust = 0;
				}
			};
			sys.sim.simulate.push( thruster );
			return thruster;
		}

		function init_simulation( visuals /* don't really belong here */ ){
			var tickables = [];
			var collidables = [];

			var simStats = init_stats();
			var collisionStats = init_stats();

			function game_tick(){
				var done = false;
				try {
					simStats.begin();
					tickables.forEach( function( t ) { t.simulation_tick(); } );
					simStats.end();

					collisionStats.begin();
					collidables.forEach( function( t ) { t.collision_tick( collidables ); } );
					collisionStats.end();

					done=true;
				}finally{
					if( !done ){
						clearInterval( sim_clock );
					}
				}
			}

			var sim_clock = setInterval( game_tick, 1000 / 60 );
			return { simulate: tickables, collidables: collidables };
		}
