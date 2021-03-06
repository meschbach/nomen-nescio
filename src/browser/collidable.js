import {
	Box3,
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	Vector3,
	WireframeHelper,
} from 'THREE'

var print = true;

export function collidable_aspect( sys, object, boundingBox ){
	var max = new Vector3( boundingBox.x / 2, boundingBox.y / 2, boundingBox.z / 2 );
	var min = new Vector3();
	min.copy( max ).negate();

	var visual;
	var collidable = {
		object: object,
		bounds: boundingBox,
		calc: function(){
			var box = new Box3( min.clone(), max.clone() );
			var point = new Vector3( this.object.position.x, this.object.position.y, this.object.position.z );
			return box.translate( point );
		},
		animate_tick: function( scene ){
			if( !visual ){
				var geometry = new BoxGeometry( boundingBox.x, boundingBox.y, boundingBox.z );
				var material = new MeshBasicMaterial( { color: 0xff0000 } );
				var mesh = new Mesh( geometry, material );

				visual = new WireframeHelper( mesh, 0xff0000 );
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
				var hit = realArea.intersectsBox( check );
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
