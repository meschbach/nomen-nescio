import { init_gl } from './renderer'
import { init_simulation } from './simulation'

export function init_system(){
	function System(){ }
	System.prototype.init = function(){
		this.visuals = init_gl();
		this.sim = init_simulation();
	}
	System.prototype.attach = function( what ){
		if( what.simulation_tick ){ this.sim.tickables.push( what ); }
		if( what.collision_tick ){ this.sim.collidables.push( what ); }
		if( what.animate_tick ){ this.visuals.animatable.push( what ); }
	}

	var sys = new System();
	return sys;
}
