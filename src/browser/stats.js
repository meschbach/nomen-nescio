function init_stats( targetID ){
	/*
	 * Wire in the stats library
	 */
	var stats = new Stats();
	stats.domElement.style.display = 'inline-block';

	document.getElementById( targetID || "stats-container" ).appendChild( stats.domElement );
	return stats;
}
