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
