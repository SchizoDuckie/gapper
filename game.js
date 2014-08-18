
 var Game = new Class( {
 	Implements: [Options, Events],
 	grid: null,
 	options: {
 		steps: 10,
 	},
 	bot: null,
 	player: null,

 	initialize: function(options) {
 		this.setOptions(options,this.options);
 		console.log(" Game class initialized!" );

 		this.grid = new Grid(options.grid);
 		this.bot = new Player({
 			steps: 30,
            customType: function() {
                return new Path.Star(new Point(0,0), 5, 0,10);
            } 
 		});
 		this.bot.setPosition(this.grid.getBotStartPosition());
 		this.bot.setTarget(this.grid.getBotStartGridPoint(), 'left');

 		this.bot.addEvent('line:done', function(target) {
 			// find a new direction based on the target's points
 			var target = this.bot.getTarget();
 			var connection = this.grid.connections[target[0]+'x'+target[1]];
    		this.bot.setTarget(connection, this.findNewBotDirection(connection, this.bot.direction));
        
 		}.bind(this)); 

 		this.player = new Player({
 			steps: 10
 		});
 		this.player.setPosition(this.grid.getStartPosition());
 		this.player.setTarget(this.grid.getStartGridPoint(), 'down');
		

 		this.player.addEvent('line:done', function(target) {
 			this.grid.markLineDone(target);
 			// find a new direction based on the target's points
 			var target = this.player.getTarget();
 			var connection = this.grid.connections[target[0]+'x'+target[1]];
    		
    		this.player.setTarget(connection, this.player.direction);
    		
 		}.bind(this));

        this.player.addEvent('rect:done', function(rect) {
            debugger;
        });

        this.keyboard = new KeyboardHandler();
        this.keyboard.addEvent('change', function(direction) {
            this.player.nextDirection = direction;
        }.bind(this))


 		view.onFrame = this.gameStep.bind(this)

        $(window).addEvent('resize', function() {
           var canvas = $('myCanvas');
            canvas.style.width = ((document.body.scrollWidth -30) /5 * 4 )+'px';
            canvas.style.height = ((document.body.scrollHeight - 50) / 5 *4 )+ 'px';  
           
        }.bind(this))
 	},

 	findNewBotDirection: function(connection, currentDirection) {

		var directions = Object.keys(connection);
    	//delete directions[directions.indexOf(currentDirection)];
    	// make sure that it doesn't turn in the opposite direction
    	var removals = {
    		left: 'right',
    		right: 'left',
    		up:'down',
    		down:'up'
    	}
    	
    	directions.splice(directions.indexOf(removals[currentDirection]),1);
    	var direction = Array.random(directions);
    	console.log("new bot direction: " , direction, directions)
    	return direction;
    
 	},

 	gameStep: function(event) {
    	
    	this.bot.moveStep();
    	this.player.moveStep()

    },


 });



 