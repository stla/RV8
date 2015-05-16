
//load("../libraries/underscore-min.js");
load("../libraries/jStat/core.js");
load("../libraries/jStat/special.js");
load("../libraries/jStat/distribution.js");
load("../libraries/jStat/vector.js");
load("../libraries/jStat/test.js");



function Power0(Theta, precision, I, J, nsims, U, Z){
	if(typeof U == 'undefined'){
		var U = new Array(I);
		for (var i = 0; i < I; i++) {
			U[i] = new Array(nsims);
			for(var sim=0; sim<nsims; sim++){
				U[i][sim] = new Array(J);
				for(var j=0; j<J; j++){
					U[i][sim][j] = Math.random();
				}
			}
		}
	}
	if(typeof Z == 'undefined'){
		var U = new Array(I);
		for (var i = 0; i < I; i++) {
			U[i] = new Array(nsims);
			for(var sim=0; sim<nsims; sim++){
				U[i][sim] = new Array(J);
				for(var j=0; j<J; j++){
					U[i][sim][j] = Math.random();
				}
			}
		}
	}
	var a=precision*Theta;
	var b=precision*(1-Theta);
	var jBeta=jStat.beta;
	var lower = 0;
	var upper = 0;
	var twosided = 0;
	for(var sim=0; sim<nsims; sim++){
		var theta = Array(I);
		for(var i=0; i<I; i++){
			theta[i] = jBeta.sample(a,b);
		}
		var y = Array(I); 
		for(var i=0; i<I; i++){
			y[i] = 0;
			for(var j=0; j<J; j++){
				y[i] += (U[i][sim] < theta[i]);
			}
			y[i] /= J;
		}
		var bounds = jStat.tci(jStat(y).mean(), alpha=.05, y); 
		lower += (bounds[0] < Theta);
		upper += (bounds[1] > Theta);
		twosided += (bounds[0] < Theta) && (bounds[1] > Theta);
	}
	return [lower/nsims, upper/nsims, twosided/nsims];
}

function Power(precision, I, J, nsims, npoints, U){
	var lower=[];
	var upper=[];
	var twosided=[];
	if(typeof U == 'undefined'){
		var U = new Array(I);
		for (var i = 0; i < I; i++) {
			U[i] = new Array(nsims);
			for(var sim=0; sim<nsims; sim++){
				U[i][sim] = new Array(J);
				for(var j=0; j<J; j++){
					U[i][sim][j] = Math.random();
				}
			}
		}
	} else {
		U = U.slice(0,I);
	}	
	for(var i=1; i<npoints; i++){
		var Theta=i/npoints;
		var power=Power0(Theta, precision, I, J, nsims, U);
		lower.push([Theta, power[0]]);
		upper.push([Theta, power[1]]);
		twosided.push([Theta, power[2]]);		
	}
	return [lower,upper,twosided];
}


////print(JSON.stringify(Power0(0.5, 100, 10, 12, nsims=5000)))
//var I = 100;
//var nsims=5000;
//var U = new Array(I);
//for (var i = 0; i < I; i++) {
	//U[i] = new Array(nsims);
	//for(var sim=0; sim<nsims; sim++){
		//U[i][sim] = Math.random();
	//}
//}
		
//~ var pow=Power(100, 10, 12, nsims=500, npoints=3);
//~ print(JSON.stringify(pow))
//print(JSON.stringify(pow[0]))


