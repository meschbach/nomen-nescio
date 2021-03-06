import Stats from 'stats.js'

export function init_stats( targetID ){
	/*
	 * Wire in the stats library
	 */
	var stats = new Stats();
	stats.domElement.style.display = 'inline-block'
	stats.domElement.style.position = 'inherit'

	document.getElementById( targetID || "stats-container" ).appendChild( stats.domElement );
	return stats;
}
