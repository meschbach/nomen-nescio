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
