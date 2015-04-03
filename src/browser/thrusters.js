function rotational_thrust_aspect( sys, object, vector ){
	var thruster = {
		step: 0.10 / 60.0,
		maximum: 1.00 / 60.0,
		minimum: -1.00 / 60.0,
		thrust: 0,
		vector: vector,
		simulation_tick: function(){
			//TODO model real thrust curve (bell?); physics of exhaust?
			object.rotation.x += this.vector.x * this.thrust;
			object.rotation.y += this.vector.y * this.thrust;
			object.rotation.z += this.vector.z * this.thrust;
		},
		increase: function(){
			var more = this.thrust + this.step;
			if( more <= this.maximum ){
				this.thrust = more;
			}
		},
		decrease: function(){
			var less = this.thrust - this.step;
			if( less >= this.minimum ){
				this.thrust = less;
			}
		},
		stop: function(){
			this.thrust = 0;
		}
	};
	sys.sim.simulate.push( thruster );
	return thruster;
}

function thrust_aspect( sys, object, vector ){
	var thruster = {
		step: 0.10 / 60.0,
		maximum: 1.00 / 60.0,
		minimum: -1.00 / 60.0,
		thrust: 0,
		vector: vector,
		simulation_tick: function(){
			//TODO model real thrust curve (bell?); physics of exhaust?
			object.momentum.x += this.vector.x * this.thrust;
			object.momentum.y += this.vector.y * this.thrust;
			object.momentum.z += this.vector.z * this.thrust;
		},
		increase: function(){
			var more = this.thrust + this.step;
			if( more <= this.maximum ){
				this.thrust = more;
			}
		},
		decrease: function(){
			var less = this.thrust - this.step;
			if( less >= this.minimum ){
				this.thrust = less;
			}
		},
		stop: function(){
			this.thrust = 0;
		}
	};
	sys.sim.simulate.push( thruster );
	return thruster;
}
