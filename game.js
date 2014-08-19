
 var Score = new Class({
    Implements: [Options, Events],

    score: 0,
    lives: 3,
    level: 1,
    rectcounter: 0,
    numRects: 0,
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
                this.fireEvent('game:over');
            } else {
                this.fireEvent('life:lost');
                game.bot.setPosition(game.grid.getBotStartPosition());
                game.bot.setTarget(game.grid.getBotStartGridPoint(), Array.random(['left','up']));
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
        this.rectcounter++;
        if(this.rectcounter == this.numRects) {
            this.fireEvent('level:won');
        }
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
 	grid: {
        divisor: 2
    },
    score: null,
 	options: {
 		steps: 10,
 	},
 	bot: null,
 	player: null,
    gameStarted: false,

 	initialize: function(options) {
 		this.setOptions(options,this.options);
 		console.log(" Game class initialized!" );
        this.score = new Score(this);
        this.score.addEvent('game:over', function() {
            $('gameover').setStyle('display','block');
        })

        this.score.addEvent('level:won', function() {
            console.log(" You win!" );
            this.gameStarted = false;
            this.clear();
            this.score.level++;
            this.initLevel(this.score.level);
        }.bind(this));
 	
        this.initLevel(this.score.level);
 		
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

    clear: function() {
        project.activeLayer.clear();
        $('gameDecor').set('html','');
    },

    initLevel: function(level) {
         this.options.grid.divisor = level +1;
        
        this.grid = new Grid(this.options.grid);
        this.createBot();
        this.createPlayer();

        this.score.numRects = Object.keys(this.grid.rects).length;
        this.score.rectcounter = 0;

        this.grid.addEvent('rect:done', function(index, rect) {
            console.log('rect done!');
            this.add(index,rect);
        }.bind(this.score));

        this.gameStarted = true;

    },

    createBot:function() {
        this.bot = new Player({
            steps: 30,
            customType: function() {
                return new Path.Star(new Point(0,0), 5, 0,10);
            } 
        });

        this.bot.addEvent('line:done', function(target) {
            // find a new direction based on the target's points
            var target = this.bot.getTarget();
            var connection = this.grid.connections[target[0]+'x'+target[1]];
            this.bot.setTarget(connection, this.findNewBotDirection(connection, this.bot.direction));
        
        }.bind(this)); 

        this.bot.setPosition(this.grid.getBotStartPosition());
        this.bot.setTarget(this.grid.getBotStartGridPoint(), 'left');
    },

    createPlayer: function() {
        this.player = new Player({
            steps: 30
        });
        this.player.addEvent('line:done', function(target) {
            this.grid.markLineDone(target);
            // find a new direction based on the target's points
            var target = this.player.getTarget();
            var connection = this.grid.connections[target[0]+'x'+target[1]];
            
            this.player.setTarget(connection, this.player.direction);
            
        }.bind(this));

        this.player.setPosition(this.grid.getStartPosition());
        this.player.setTarget(this.grid.getStartGridPoint(), 'down');
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
       return pdx > -10 && pdx < 10  && pdy > -10 && pdy < 10
    },

 	gameStep: function(event) {
        if(!this.gameStarted) return;
        if(this.score.gameover) return;
        if(this.collisionDetect()) {
            this.fireEvent('collision')
        }
        this.bot.moveStep();
    	this.player.moveStep()
       
    },


 });



 