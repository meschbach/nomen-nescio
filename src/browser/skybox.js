//Skybox
function init_skybox( sys ){
	var rendered = false;
	var skybox = {
		animate_tick: function( scene ){
			if( !rendered ){
				do_render( scene );
			}
		}
	};
	sys.visuals.animatable.push( skybox );

	function do_render( scene ){
		var geometry = new THREE.SphereGeometry();

		var texture = THREE.ImageUtils.loadTexture('/assets/background.jpg')
		texture.minFilter = THREE.LinearFilter;

		var material = new THREE.MeshBasicMaterial({
			map: texture
		});
/*
		var uniforms = {
			texture: { type: 't', value: texture }
		};
		var material = new THREE.ShaderMaterial( {
			uniforms:       uniforms,
			vertexShader:   document.getElementById('sky-vertex').textContent,
			fragmentShader: document.getElementById('sky-fragment').textContent
		});
*/

		skyBox = new THREE.Mesh(geometry, material);
		skyBox.scale.set(-1, 1, 1);
		skyBox.rotation.order = 'XZY';
		scene.add(skyBox);
	}
}
