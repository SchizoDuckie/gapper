var Grid = new Class({
 	Implements: [Options, Events],
 	options: {
 		canvasWidth: 800,
 		canvasHeight: 600,
 		startTop: 10,
 		startLeft: 10,
 		divisor: 10
 	},

 	lines: {},
 	rects: {},
 	connections: {},

 	initialize: function(options) {
 		this.setOptions(this.options,options);
 		this.draw();
 	},

 	draw: function() {
	    var top, left;

	    // create a grid
	    for(i=0; i < this.options.divisor; i++) {
	    	left = this.options.startLeft + (Math.round(this.options.canvasWidth / this.options.divisor) * i);
	    	for(var j = 0; j< this.options.divisor; j++) {
	    		top = this.options.startTop + (Math.round(this.options.canvasHeight / this.options.divisor) * j);
	    		this.createRect(this.options.divisor, left, top);
	    	} 
	    	console.log("All connections made: " , this.connections);
	    }
 	},

 	getBotStartGridPoint: function(direction) {
 		var keys = Object.keys(this.connections);
 		return this.connections[keys[keys.length -1]];
 	},


 	getStartGridPoint: function(direction) {
 		return this.connections[this.options.startLeft+'x'+this.options.startTop];
 	},

 	getStartPosition: function() {
 		return { x: this.options.startLeft, y:this.options.startTop};
 	},

 	getBotStartPosition: function() {
 		return { x: this.options.canvasWidth + this.options.startLeft, y: this.options.canvasHeight + this.options.startTop };
 	},	

 	createRect: function(divisor, x, y) {
		var h = Math.round(this.options.canvasHeight / this.options.divisor);
    	var w = Math.round(this.options.canvasWidth / this.options.divisor);

    	this.rects[x+'x'+y] = {
	    	top: this.addLine(x,y, x+w,y),
	    	right: this.addLine(x+w,y, x+w,y+h),
	    	bottom: this.addLine(x+w,y+h,x,y+h),
	    	left: this.addLine(x,y+h, x,y),
            score: 50,
	    	doneLines: [],
	    	done:false,
    	}
 	},

 	addLine: function(fromX, fromY, toX,toY) {
    	var coordinate = [fromX,fromY].join('x');
    	var targetcoordinate = [toX,toY].join('x');
    	var line, lineIndex = [fromX,fromY,toX ,toY].join('x'), lineIndex2 = [toX ,toY,fromX,fromY].join('x');
    	if (!(lineIndex in this.lines) && !(lineIndex2 in this.lines)) {
    		this.lines[lineIndex] = this.lines[lineIndex2] = line = new Path.Line(new Point([fromX,fromY]), new Point([toX,toY]));
    	} else {
    		line = this.lines[lineIndex];
    	}
    	line.strokeColor = "#999";
    	line.strokeWidth = 3;
    	if(!(coordinate in this.connections)) {
    		this.connections[coordinate] = { };
    	}
    	if(!(targetcoordinate in this.connections)) {
    		this.connections[targetcoordinate] = { };
    	}
    	if (toX > fromX && toY == fromY) {
    		this.connections[coordinate].right = [fromX, fromY, toX,toY, line];
    		this.connections[targetcoordinate].left = [toX,toY, fromX, fromY, line];
    	} else if (toX < fromX && toY == fromY) {
    		this.connections[coordinate].left = [fromX, fromY, toX,toY, line];
    		this.connections[targetcoordinate].right = [ toX,toY, fromX, fromY, line];
    	} else if (fromX == toX && fromY < toY) {
    		this.connections[coordinate].down =  [fromX, fromY, toX,toY, line];
    		this.connections[targetcoordinate].up =  [ toX,toY, fromX, fromY, line];
    	} else if (fromX == toX && fromY > toY) {
    		this.connections[coordinate].up = [fromX, fromY, toX,toY, line];
    		this.connections[targetcoordinate].down = [toX,toY, fromX, fromY, line];
    	} else {
    		console.log(" Dunno where to put this: : " , x, y, fromX, fromY, path);
    	}

    	return line;
    },

    markLineDone: function(connection) {
    	console.log(" mark line done!" , connection);
    	var line = connection[4];
		for(var i in this.rects) {
			['top','bottom','left','right'].map(function(direction) {
				//console.log(rects[i][direction])
				if(!this.rects[i].done &&
					(
					   (this.rects[i][direction].getSegments()[0].toString() == line.getSegments()[0].toString() &&
					 	 this.rects[i][direction].getSegments()[1].toString() == line.getSegments()[1].toString())
					 	|| 
						(this.rects[i][direction].getSegments()[1].toString() == line.getSegments()[0].toString() &&
					 	 this.rects[i][direction].getSegments()[0].toString() == line.getSegments()[1].toString()) 
					)  && this.rects[i].doneLines.indexOf(direction) == -1) {
						this.rects[i].doneLines.push(direction);

					if(this.rects[i].doneLines.length == 4) {

						this.markRectDone(i);
					}
				}
			}, this)
		}
		line.strokeColor = "#F0F";
    },

    getLowerPoint:function(rect) {
    	var s = rect.getSegments();
		return s[0].point.y < s[1].point.y ? s[0].point : s[1].point
    },

    getHigherPoint:function(rect) {
    	var s = rect.getSegments();
		return s[0].point.y > s[1].point.y ? s[0].point : s[1].point
    },

    markRectDone: function(index) {
    	this.rects[index].done = true;
		var p = new Shape.Rectangle(this.getLowerPoint(this.rects[index].left), 
									this.getHigherPoint(this.rects[index].right));
		p.fillColor = '#abcdef';
		p.strokeColor ='blue';
		p.sendToBack();
        this.fireEvent('rect:done', [index,this.rects[index]]);
    }


 });
