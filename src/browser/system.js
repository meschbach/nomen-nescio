import { init_gl } from './renderer'
import { init_simulation } from './simulation'

class System {
	constructor() {}

	init() {
		this.visuals = init_gl();
		this.sim = init_simulation();
	}

	attach( what ){
		if( what.simulation_tick ){ this.sim.tickables.push( what ); }
		if( what.collision_tick ){ this.sim.collidables.push( what ); }
		if( what.animate_tick ){ this.visuals.animatable.push( what ); }
	}
}

export function init_system(){
	var sys = new System();
	return sys;
}
