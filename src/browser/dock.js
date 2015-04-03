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
