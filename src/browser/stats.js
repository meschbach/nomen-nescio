function init_stats( targetID ){
	/*
	 * Wire in the stats library
	 */
	var stats = new Stats();
	stats.setMode(1); // 0: fps, 1: ms

	// align top-left
	stats.domElement.style.display = 'inline-block';

	document.getElementById( targetID || "stats-container" ).appendChild( stats.domElement );
	return stats;
}
