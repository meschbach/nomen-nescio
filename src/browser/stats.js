function init_stats(){
	/*
	 * Wire in the stats library
	 */
	var stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	// align top-left
	stats.domElement.style.display = 'inline-block';

	document.getElementById( "stats-container" ).appendChild( stats.domElement );
	return stats;
}
