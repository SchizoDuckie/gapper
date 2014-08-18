 KeyboardHandler = new Class({
 	Implements: [Events],

 	direction : null,
 	initialize: function() {

 		$(window).addEvent('keydown', function(event) {
 			console.log("keydown!" , event);
		 	switch(event.key) {
		 		case 'left':
		 		case 'right':
		 		case 'up':
		 		case 'down':
		 		console.log('found!' , event.key);
    		 		this.direction = event.key;
    		 		this.fireEvent('change', [this.direction]);
    		  		event.stop();
		 		break;
		 	}
		}.bind(this));
 	}
 });
