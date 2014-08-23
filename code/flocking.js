var env;

var graphics = {
	bird_width_px: 9,
	bird_height_px: 9,
	bg_color: '#EEE',
	frame:{ interval:0,	per_second:10, number:0 },
	is_running:false,
	session_length:600,
	interval_id:0,
	color_codes : ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF']
};

function Environment(w, h, p){
	
	/******* Setting up the environment ********/
	this.width=w;
	this.height=h;
	this.visible_area=30;
	this.min_seperation=10;
	this.population = p;
	this.max_align = 5;
	this.max_cohere = 3;
	this.max_seperate = 1.5;
	
	this.birds =  new Array();
	var ran_x, ran_y; 
	
	for(var i=0; i < p; i++){
		ran_x = Math.floor(Math.random() * w);
		ran_y = Math.floor(Math.random() * h);
		
		this.birds[i]=new Bird(ran_x, ran_y, i);
	}
}

function Bird(loc_x, loc_y, id){
	this.id = id;
	this.location = {x: loc_x, y: loc_y};
	this.next_location = {x: 0, y: 0};
	this.speed = 5;
	this.heading = Math.floor(Math.random() * 360);
	this.color = generateColor();
	this.local_flockmates = new Array();
	this.nearest_bird = { dist: -1, id:-1};
}

Bird.prototype.find_flockmates = function(){
    // find nearby flockmates by checking their locations
	
	this.local_flockmates = new Array();
	
	var dist_x, dist_y, dist;
	for(var i=0; i < env.population; i++){
		dist_x = Math.abs(env.birds[i].location.x - this.location.x);
		dist_y = Math.abs(env.birds[i].location.y - this.location.y);
		dist = Math.sqrt(dist_x*dist_x + dist_y*dist_y);
		if(dist < env.visible_area && this.id != env.birds[i].id){
			this.local_flockmates.push(env.birds[i]);
		}
	}
};

Bird.prototype.find_nearest_bird = function(){
	
	var dist, x_dist, y_dist, cur_bird;
	
	this.nearest_bird.dist = -1;
	this.nearest_bird.id = -1;
	
	for(var i=0; i < this.local_flockmates.length; i++){
		cur_bird = this.local_flockmates[i];
		
		x_dist = Math.abs(cur_bird.location.x-this.location.x);
		y_dist = Math.abs(cur_bird.location.y-this.location.y);
		dist = Math.sqrt( x_dist*x_dist + y_dist*y_dist );
		
		if( this.nearest_bird.dist == -1 ||  this.nearest_bird.dist > dist ){
			 this.nearest_bird.dist = dist;
			 this.nearest_bird.id = cur_bird.id;
		}
	}
};

Bird.prototype.calculate_next_position = function(){
    this.find_flockmates();
    this.find_nearest_bird();
    
    if(this.nearest_bird.dist!=-1 && this.nearest_bird.dist < env.min_seperation ){
    	this.seperate();
    }
    else{
    	this.align();
    	this.cohere();
    }
    
    this.next_location.x = Math.floor(this.location.x + this.speed * Math.sin(this.heading*Math.PI/180));
    this.next_location.y = Math.floor(this.location.y - this.speed * Math.cos(this.heading*Math.PI/180));
    
    if(this.next_location.x < 0){
    	this.next_location.x += env.width;
    }
    else{
    	this.next_location.x = this.next_location.x % env.width;
    }
    
    if(this.next_location.y < 0){
    	this.next_location.y += env.height;
    }
    else{
    	this.next_location.y = this.next_location.y % env.height;
    }
};

Bird.prototype.move_to_next_position = function(){
	this.location.x = this.next_location.x;
	this.location.y = this.next_location.y;
};

Bird.prototype.seperate = function(){
	if(env.birds[this.nearest_bird.id].heading > this.heading){
		this.heading = this.heading - env.max_seperate;
	}
	else {
		this.heading = this.heading + env.max_seperate;
	}
	this.heading = this.heading  % 360;  
};

Bird.prototype.cohere = function(){
    var avg_x = 0, avg_y=0, angle, vec_target_x, vec_target_y;
    
    if(this.local_flockmates.length!=0){
	    
	    for(var i=0; i < this.local_flockmates.length; i++){
	    	avg_x+=this.local_flockmates[i].location.x;
	    	avg_y+=this.local_flockmates[i].location.y;
		}
	    avg_x = Math.floor( avg_x /  this.local_flockmates.length);
	    avg_y = Math.floor( avg_y /  this.local_flockmates.length);
	    
	    vec_target_x = avg_x - this.location.x;
	    vec_target_y = avg_y - this.location.y;
	    
	    cos_alpha = vec_target_y / (Math.sqrt(vec_target_x*vec_target_x + vec_target_y*vec_target_y));
	    angle = Math.floor(Math.acos(cos_alpha)*180 / Math.PI);
	    
	    if(vec_target_x < 0){
	    	angle +=180;
	    }
	    
	    if(Math.abs(angle-this.heading) <= env.max_cohere){
			this.heading=angle;
		}else if(angle > this.heading){
			this.heading +=env.max_cohere;
		}
		else{
			this.heading -= env.max_cohere;
		}

		this.heading = this.heading % 360;
	}
};

Bird.prototype.align = function(){
	var avg_heading=0;
	
	if(this.local_flockmates.length!=0){
		for(var i=0; i < this.local_flockmates.length; i++){
			avg_heading+=this.local_flockmates[i].heading;
		}
		avg_heading = Math.floor(avg_heading/this.local_flockmates.length);
		
		if(Math.abs(avg_heading-this.heading) <= env.max_align){
			this.heading=avg_heading;
		}else if(avg_heading > this.heading){
			this.heading +=env.max_align;
		}
		else{
			this.heading -= env.max_align;
		}
		
		this.heading = this.heading % 360;
	}
};

Bird.prototype.steer_to = function(angle){
	
	
	
};

$(document).ready(function () {
	
	changeButtonState('#btnRunSimulation', false);
	$('#btnInitSimulation').bind('click', function() {
		changeButtonState('#btnRunSimulation', true);
		firstRun();
	});
	
	$('#btnRunSimulation').bind('click', function() {
		
		if( graphics.is_running == false){
			$('#btnRunSimulation').val("Stop");
			graphics.is_running = true;
			graphics.interval_id = setInterval(drawFrame, graphics.frame.interval );
		}
		else{
			$('#btnRunSimulation').val("Run");
			graphics.is_running = false;
		}
	});
/*
	$('#animSpeed').bind('change', function() {
		if(graphics.is_running){
		clearInterval(graphics.interval_id );
		graphics.frame.interval = 1000/parseInt($(this).attr('value'));
		graphics.interval_id = setInterval(drawFrame,graphics.frame.interval);
		}
	});
*/
});
function generateColor(){
	var color = '#';
	color+= graphics.color_codes[Math.floor(Math.random()*graphics.color_codes.length)];
	color+= graphics.color_codes[Math.floor(Math.random()*graphics.color_codes.length)];
	color+= graphics.color_codes[Math.floor(Math.random()*graphics.color_codes.length)];
	return color;
}

function drawTriangle(ctx, side, cx, cy, degree){
    var h = side * (Math.sqrt(3)/2);    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(degree/180*Math.PI);
 
    ctx.beginPath();
        
        ctx.moveTo(0, -h / 2);
        ctx.lineTo( -side / 2, h / 2);
    	ctx.lineTo( 0, h / 8);
        ctx.lineTo(side / 2, h / 2);
        ctx.lineTo(0, -h / 2);
        
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.translate(-cx, -cy);
    ctx.restore();    
}

function firstRun(){
	graphics.frame.number = 0;
	initializeAnimationParameters();
	drawCellsOnCanvas();
}

function initializeAnimationParameters(){
	
	env = new Environment(parseInt($('#cellWidth').val()), parseInt($('#cellHeigt').val()), parseInt($('#population').val()));
	env.visible_area = $('#visionRange').val();
	env.min_seperation = $('#minSeperation').val();
	
	$('#flockingVisualizer').attr("width", env.width + "px");
	$('#flockingVisualizer').attr("height", env.height + "px");


	//graphics.frame.interval = 1000/parseInt($('#animSpeed').attr('value'));
}

function drawFrame(){
	calculateNewPositions();
	drawCellsOnCanvas();
	graphics.frame.number++;
	
	if(graphics.is_running ==false || graphics.frame.number / graphics.frame.per_second > graphics.session_length){
		clearInterval(graphics.interval_id);
		$('#btnRunSimulation').val("Run");
		changeButtonState('#btnRunSimulation', false);
		graphics.is_running = false;
	}
}

function drawCellsOnCanvas(){

	var c=document.getElementById("flockingVisualizer");
	var ctx=c.getContext("2d");
	
	ctx.fillStyle=graphics.bg_color;
	ctx.fillRect(0,0, env.width, env.height);
	
	for(var i = 0; i < env.population; i++ ){		
		
		ctx.fillStyle = env.birds[i].color;
		drawTriangle(ctx, graphics.bird_width_px, env.birds[i].location.x, env.birds[i].location.y, env.birds[i].heading);
	}
}


function calculateNewPositions(){
	for(var i = 0; i < env.population; i++ ){		
		env.birds[i].calculate_next_position();
	}
	for(var i = 0; i < env.population; i++ ){		
		env.birds[i].move_to_next_position();
	}
}

function changeButtonState(buttonId, enabled){
	if(enabled == false){
		$(buttonId).attr('disabled', 'disabled');
		$(buttonId).removeClass("buttonEnabled");
		$(buttonId).addClass("buttonDisabled");
	}
	else{
		$(buttonId).removeAttr('disabled');
		$(buttonId).removeClass("buttonDisabled");
		$(buttonId).addClass("buttonEnabled");
	}
}