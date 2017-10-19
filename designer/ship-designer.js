function init_ship_designer(){
	var system = init_system();
	system.init();

	warehouse( system );
}

function warehouse( system ){
	var loaded = false;

	var height = 50;
	var averageHumanHeight = 1.65;

/*
 * Raw Gemoetry
 */
	var box = new THREE.BoxGeometry( 20, height, 20 );
	var material = new THREE.MeshPhongMaterial({ color: 0x123456, specular: 0x040910, shininess: 30 });
	material.side = THREE.DoubleSide;
	var warehouse = new THREE.Mesh( box, material );
	warehouse.position.y = ( height / 2 ) - averageHumanHeight;
	system.attach({
		animate_tick: function( scene ){
			if( !loaded ){
				console.log("Loading scene");
				loaded = true;
				scene.add( light );
				scene.add( warehouse );
			}
		}
	});

/*
 * Light
 */
 var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
 light.target.set( 0, 0, 0 );
 light.position.set( 0, height, 0 );
}
