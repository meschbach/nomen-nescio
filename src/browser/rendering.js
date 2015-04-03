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
