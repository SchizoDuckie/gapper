 var Player = new Class({
 	Implements: [Options, Events],
 	avatar: null,
 	target: null,
 	direction: 'right',
 	nextDirection: false,
 	directionX: 1,
 	directionY: 0,

 	options: {
 		steps: 5,
        color: '#00F',
        strokeWidth: 4
 	},


 	initialize: function(options) {
 		this.setOptions(this.options,options);
	    this.avatar = this.options.customType ? this.options.customType() : new Path.Circle(0,100,4);
	    this.avatar.strokeColor = this.options.color;
	    this.avatar.strokeWidth = this.options.strokeWidth;
 	},

 	setTarget: function(target, direction) {
 		console.log(" Set player target gridpoint " , direction, target);
 		this.target = target;
 		if(direction && direction in target) {
 			this.setDirection(direction);
 		}
 	},

 	getTarget: function() {
 		return this.target[this.direction];
 	},

 	setPosition: function(pos) {
 		console.log(" Set player positoin: " , pos);
 		this.avatar.position.x = pos.x;
 		this.avatar.position.y = pos.y;
 	},

 	setDirection: function(direction) {
 		console.log("Settingg direction" , direction);
        if(!(direction in this.target)) {
            console.log(" Impossible direction change:" , direction)
            if(this.nextDirection) {
                var d = this.nextDirection;
                this.nextDirection = null;
                return this.setDirection(d);
            }
            return;
        }
 		this.direction = direction;
 		var t = this.target[direction];

 		this.target[this.direction][0] = (t[0] > this.avatar.position.x) ? t[0] : t[2]; // determine from/to direction. Swap when needed.
    	this.target[this.direction][1] = (t[1] > this.avatar.position.y) ? t[1] : t[3];

        this.directionX = (this.target[this.direction][0] - this.avatar.position.x)/this.options.steps;
        this.directionY = (this.target[this.direction][1] - this.avatar.position.y)/this.options.steps;
        console.log("Direction set: ", this.options.steps, this.avatar.position.x,this.avatar.position.y, this.directionX, this.directionY, this.target[this.direction]);
 	},


 	moveStep: function() {
 		if (!this.target || !(this.direction in this.target)) {
 			console.log(' Do not move!' , this.target, this.direction);
 			if(this.nextDirection) {
	 			this.setDirection(this.nextDirection);
		    	this.nextDirection = false;
	    	}
 			
 		}
 		if(!(this.direction in this.target)) {
            console.log(" No direction ", this.direction, ' in ', this.target);
 			return;
 		}
        var dx = this.directionX, dy = this.directionY, ax = this.avatar.position.x, ay = this.avatar.position.y, tx = this.target[this.direction][0], ty = this.target[this.direction][1];

        if (
            ((dx == 0 && dy < 0 && ay <= ty) ||
            (dx == 0 && dy > 0 && ay >= ty) ||
            (dx <= 0 && dy == 0 && ay <= ty) ||
            (dx >= 0 && dy == 0 && ay >= ty) ) && (
            (dy == 0 && dx < 0 && ax <= tx) ||
            (dy == 0 && dx > 0 && ax >= tx) ||
            (dy <= 0 && dx == 0 && ax <= tx) ||
            (dy >= 0 && dx == 0 && ax >= tx))) {

           console.log(" Find a new target!" , this.target);
            this.avatar.position.x = this.target[this.direction][0];
            this.avatar.position.y = this.target[this.direction][1];
            
        	this.fireEvent('line:done', [this.getTarget()]);
        	
 			if(this.nextDirection) {
	 			this.setDirection(this.nextDirection);
		    	this.nextDirection = false;
	    	}
            return;
        	
        } else {
            /*console.log(" No match: ", 
                this.avatar.position.x,
                this.target[this.direction][0], 
                this.directionX,
                this.avatar.position.y,
                this.target[this.direction][1], 
                this.directionY
                ); */
        }

        // do the movement

        this.avatar.position.x += this.directionX;
        this.avatar.position.y += this.directionY;
    }

 });