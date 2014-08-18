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
 		this.target = target;
 		if(direction && direction in target) {
 			this.setDirection(direction);
 		}
 	},

 	getTarget: function() {
 		return this.target[this.direction];
 	},

 	setPosition: function(pos) {
 		this.avatar.position.x = pos.x;
 		this.avatar.position.y = pos.y;
 	},

 	setDirection: function(direction) {
 		console.log("Settingg direction" , direction);
        if(Object.keys(this.target).indexOf(direction) == -1) {
            console.log(" Impossible direction change:" , direction)
            if(this.nextDirection) {
                var d = this.nextDirection;
                this.nextDirection = null;
                return this.setDirection(d);
            } else {
                return;
            }
        }
 		this.direction = direction;
 		var t = this.target[direction];

 		this.target[this.direction][0] = (t[0] > this.avatar.position.x) ? t[0] : t[2]; // determine from/to direction. Swap when needed.
    	this.target[this.direction][1] = (t[1] > this.avatar.position.y) ? t[1] : t[3];

        this.directionX = (this.target[this.direction][0] - this.avatar.position.x)/this.options.steps;
        this.directionY = (this.target[this.direction][1] - this.avatar.position.y)/this.options.steps;
    },


 	moveStep: function() {
 		if (!this.target || !(this.direction in this.target)) {
 			//console.log(' Do not move!' , this.target, this.direction);
 			if(this.nextDirection) {
	 			this.setDirection(this.nextDirection);
		    	this.nextDirection = false;
	    	}
            return;
 			
 		}
 		if(!(this.direction in this.target)) {
            return;
 		}
        var dx = this.directionX, dy = this.directionY, ax = Math.floor(this.avatar.position.x), ay = Math.floor(this.avatar.position.y), tx = Math.floor(this.target[this.direction][0]), ty = Math.floor(this.target[this.direction][1]);

        if ((dx > 0 && ax >= tx) || (dx < 0 && ax <= tx) || (dy > 0 && ay >= ty) || (dy < 0 && ay <= ty)) {

            this.avatar.position.x = this.target[this.direction][0];
            this.avatar.position.y = this.target[this.direction][1];
            
        	this.fireEvent('line:done', [this.getTarget()]);
        	
 			if(this.nextDirection) {
	 			this.setDirection(this.nextDirection);
		    	this.nextDirection = false;
	    	}
            return;
        	
        } else {
            //console.log(" No match: ", dx, dy, ax, ay, tx, ty);
        }

        // do the movement
        //this.avatar.rotate(2);
        this.avatar.position.x += this.directionX;
        this.avatar.position.y += this.directionY;
    }

 });