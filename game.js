
 var Score = new Class({
    Implements: [Options, Events],

    score: 0,
    lives: 3,
    level: 1,
    gameover: false,

    initialize: function(game) {
        this.elements = {
            'score' : $('score'),
            'lives' : $('lives'),
            'level' : $('level')
        };

        game.addEvent('collision', function() {
            this.lives--;
            this.update();
            if(this.lives == 0) {
                this.gameover = true;
                game.fireEvent('game:over');
            } else {
                game.fireEvent('live:lost');
                game.bot.setPosition(game.grid.getBotStartPosition());
                game.bot.setTarget(game.grid.getBotStartGridPoint(), 'left');
                game.player.setPosition(game.grid.getStartPosition());
                game.player.setTarget(game.grid.getStartGridPoint(),'up');
                game.player.direction = 'up';
                game.gameStep();

            }
        }.bind(this));
    },

    add: function(index, rect) {
        console.log('add!' , index,rect);
        this.score += rect.score;
        this.update();
    },

    update: function() {
        for(var i in this.elements) {
            this.elements[i].set('html', this[i]);
        }
    }

 })
 var Game = new Class( {
 	Implements: [Options, Events],
 	grid: null,
    score: null,
 	options: {
 		steps: 10,
 	},
 	bot: null,
 	player: null,

 	initialize: function(options) {
 		this.setOptions(options,this.options);
 		console.log(" Game class initialized!" );
        this.score = new Score(this);
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

        this.grid.addEvent('rect:done', function(index, rect) {
            console.log('rect done!');
            this.add(index,rect);
        }.bind(this.score));


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
    	
        //console.log("Find new direction: ",connection,currentDirection,directions);
    	directions.splice(directions.indexOf(removals[currentDirection]),1);
    	var direction = Array.random(directions);
    	console.log("new bot direction: " ,direction, currentDirection, directions, connection)
    	return direction;
 	},

    collisionDetect: function() {
       var p = this.player.avatar.position;
       var b = this.bot.avatar.position;
       var pdx = p.x > b.x ? parseInt(p.x - b.x) : parseInt(b.x - p.x) ;
       var pdy = p.y > p.y ? parseInt(p.y - b.y) : parseInt(b.y - p.y);
       return pdx > -5 && pdx < 5  && pdy > -5 && pdy < 5
    },

 	gameStep: function(event) {
        if(this.score.gameover) return;
        if(this.collisionDetect()) {
            this.fireEvent('collision')
        }
        this.bot.moveStep();
    	this.player.moveStep()
       
    },


 });



 