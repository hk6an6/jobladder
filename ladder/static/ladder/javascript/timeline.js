//setup class inheritance
Function.prototype.inheritsFrom = function( superClass ){
	this.prototype = new superClass;
	this.prototype.constructor = this;
	this.prototype.parent = superClass.prototype; // use this.parent.methodName.call(this[, arg]*) to call a method from the superclass
}
var timeline = new function( ){
	this.canvas = document.getElementById( 'history-canvas' );
	this.context = this.canvas.getContext( '2d' );
	this.position_area = 20;
	this.occupiedFillStyle = 'blue';
	this.vacantFillStyle = '#990033';
	this.positions = [
		[ 10, 10 ]
		, [ 200, 10 ]
		, [ 350, 10 ]
		, [ 500, 10 ]
		, [ 650, 10 ]
	];
	this.paths = [];
	
	//x-browser event helper
	function addEvent(node, name, func, supressDefault) {
		if(node.addEventListener){
			node.addEventListener(name, func, supressDefault);
		}else if(node.attachEvent) {
			node.attachEvent(name, func);
		}
	}

	//defines a physical entity
	this.PhysicalEntity = function(){
		//entity's mass center coordinates
		this.x = 0;
		this.y = 0;
		//entity dimensions
		this.width = 0;
		this.height = 0;
		this.moving = false;
	}
	//update entity status
	this.PhysicalEntity.prototype.update = function(){
		if(DEBUG) console.log('updating: ' + this.constructor.name + '[width:' + this.width + ' height:' + this.height + '] at <' + this.x + ',' + this.y + '>');
	};
	//translates drawing context so that the space-box alloted for the entity's dimensions is centered on the entity's center of mass
	this.PhysicalEntity.prototype.paint = function(context){
		context.save();
		context.translate( this.x - Math.floor(this.width/2), this.y - Math.floor(this.height/2) );
		this.draw(context);
		context.restore();
	};
	//draws the entity on screen
	this.PhysicalEntity.prototype.draw = function(context){
		if(DEBUG) console.log('drawing: ' + this.constructor.name + '[width:' + this.width + ' height:' + this.height + '] at <' + this.x + ',' + this.y + '>');
	};
	this.PhysicalEntity.prototype.updateBounds = function( ){
		if( this.moving ){
			this._left  =(this.x - this.width/2);
			this._right =(this.x + this.width/2);
			this._top   =(this.y - this.height/2);
			this._bottom=(this.y + this.height/2);
		}
	}
	//returns true if the other entity collides with this one
	this.PhysicalEntity.prototype.hits = function( anotherPhysicalEntity ){
		this.updateBounds( );
		anotherPhysicalEntity.updateBounds( );
		if ( 
				( this._left >= anotherPhysicalEntity._left && this._left <= anotherPhysicalEntity._right ) 
				|| ( this._right >= anotherPhysicalEntity._left && this._right <= anotherPhysicalEntity._right ) 
			){
				return (
					( this._top >= anotherPhysicalEntity._top && this._top <= anotherPhysicalEntity._bottom )
					|| ( this._bottom >= anotherPhysicalEntity._top && this._bottom <= anotherPhysicalEntity._bottom )
				);
		}
		return false;
	};
	this.particles = [];
	this.mouseMarker = new this.PhysicalEntity( );
	this.boundingRect = null;
	this.mouseMarker.height = 10;
	this.mouseMarker.width = 10;
	this.mouseMarker.x = -20;
	this.mouseMarker.y = -20;
	this.mouseMarker.moving = true;
	this.spotlight = -1;
	this.mouseMarker.paint = function( context ){
		if( DEBUG ){
			context.save( );
			context.translate( this.x - Math.floor( this.width / 2 ), this.y - Math.floor( this.height / 2 ) );
			context.fillStyle = 'black';
			context.fillRect( 0, 0, this.width, this.height );
			context.restore( );
		}
	}
	this.mouseMarker.handleEvent = function( event ){
		timeline.boundingRect = timeline.canvas.getBoundingClientRect();
		timeline.mouseMarker.x = event.clientX - timeline.boundingRect.left;
		timeline.mouseMarker.y = event.clientY - timeline.boundingRect.top;
	}
	this.checkForPointerCollisions = function( ){
		var formerSpotlight = timeline.spotlight;
		timeline.spotlight = ( -1 );
		for( var i = 0; i < timeline.particles.length; i++ ){
			timeline.particles[ i ].highlighted = ( timeline.mouseMarker.hits( timeline.particles[ i ] ) );
			if( timeline.particles[ i ].highlighted ){
				timeline.spotlight = i;
			}
		}
		timeline.updateSpotlight( formerSpotlight );
	}
	this.updateSpotlight = function( formerSpotlight ){
		if( timeline.spotlight != formerSpotlight ){
			if( formerSpotlight >=0 && formerSpotlight < 5 ){
				if( timeline.particles[ formerSpotlight ].summary ){
					timeline.particles[ formerSpotlight ].summary.css( 'display', 'none' );
				}
			}
			if( timeline.spotlight >= 0 && timeline.spotlight < 5 ){
				if( timeline.particles[ timeline.spotlight ].summary ){
					timeline.particles[ timeline.spotlight ].summary.css( 'display', 'block' );
				}
			}
		}
	}
	/*
	register mouse over, move and out events on the timeline canvas
	*/
	this.registerMouseEvents = function( ){
		timeline.canvas.addEventListener( 'mouseover', function( event ){
			timeline.mouseMarker.handleEvent( event );
		}, false );
		timeline.canvas.addEventListener( 'mousemove', function( event ){
			timeline.mouseMarker.handleEvent( event );
		}, false );
		timeline.canvas.addEventListener( 'mouseout', function( event ){
			timeline.mouseMarker.handleEvent( event );
		}, false );
	};
	/*
	this turns the 'timeline.positions' integer matrix into a timeline.position array
	*/
	this.initializePositions = function( ){
		for( var i = 0; i < timeline.positions.length; i++ ){
			timeline.positions[ i ] = new timeline.position( timeline.positions[ i ][ 0 ], timeline.positions[ i ][ 1 ] );
			timeline.particles.push( timeline.positions[ i ] );
		}
		for( var i = 0; i < timeline.positions.length - 1; i++ ){
			timeline.paths[ i ] = new timeline.path( timeline.positions[ i ], timeline.positions[ i + 1 ] );
			timeline.particles.push( timeline.paths[ timeline.paths.length - 1 ] );
		}
		for( var i = 0; i < timeline.particles.length; i++ ){
			timeline.particles[ i ].moving = !timeline.particles[ i ].moving;
			timeline.particles[ i ].updateBounds( );
			timeline.particles[ i ].moving = !timeline.particles[ i ].moving;
		}
		this.registerMouseEvents( );
	};
	/*
	draw all history
	*/
	this.paint = function( context ){
		context.clearRect( 0, 0, timeline.canvas.width, timeline.canvas.height );
		for( var i = 0; i < timeline.positions.length; i++ ){
			timeline.positions[ i ].paint( context );
		}
		for( var i = 0; i < timeline.paths.length; i++ ){
			timeline.paths[ i ].paint( context );
		}
		timeline.mouseMarker.paint( context );
	};
	/*
	defines a path between 2 positions history
	*/
	this.path = function( startPosition, endPosition ){
		this.startPosition = startPosition;
		this.endPosition = endPosition;
	};
	this.path.inheritsFrom( this.PhysicalEntity );
	Object.defineProperty( this.path.prototype, 'x', { get: function(){ return Math.floor( ( this.getFX() - this.getIX() ) / 2 ) + this.getIX() }, set: function(value){}, enumerable: true, configurable: false } );
	Object.defineProperty( this.path.prototype, 'y', { get: function(){ return Math.floor( ( this.getFY() - this.getIY() ) / 2 ) + this.getIY() }, set: function(value){}, enumerable: true, configurable: false } );
	Object.defineProperty( this.path.prototype, 'width', { get: function(){ return this.getFX() - this.getIX() }, set: function(value){}, enumerable: true, configurable: false } );
	Object.defineProperty( this.path.prototype, 'height', { get: function(){ return 5 }, set: function(value){}, enumerable: true, configurable: false } );
	/*
	changes initial data for a path
	*/
	this.path.prototype.init = function ( startPosition, endPosition ){
		this.startPosition = startPosition;
		this.endPosition = endPosition;
	}
	/*
	calculates path starting x-coordinate
	*/
	this.path.prototype.getIX = function( ){
		return this.startPosition.centerX + this.startPosition.radius + 5;
	};
	/*
	calculates path ending x-coordinate
	*/
	this.path.prototype.getFX = function( ){
		return this.endPosition.centerX - this.endPosition.radius - 5;
	};
	/*
	calculates path starting y-coordinate
	*/
	this.path.prototype.getIY = function( ){
		return this.startPosition.centerY;
	};
	/*
	calculates path ending y-coordinate
	*/
	this.path.prototype.getFY = function( ){
		return this.endPosition.centerY;
	};
	/*
	draws a path on screen
	*/
	this.path.prototype.paint = function( context ){
		context.save( );
		context.strokeStyle = this.endPosition.occupied ? this.endPosition.occupiedFillStyle : this.endPosition.vacantFillStyle;
		context.fillStyle = this.endPosition.occupied ? this.endPosition.occupiedFillStyle : this.endPosition.vacantFillStyle;
		context.beginPath( );
		context.moveTo( this.getIX( ), this.getIY( ) );
		context.lineTo( this.getFX( ), this.getFY( ) );
		context.lineWidth = 2;
		context.stroke( );
		context.restore( );
	};
	/*
	defines a position in history
	*/
	this.position = function( x, y ){
		this.centerX = x;
		this.centerY = y;
		this.radius = Math.floor( timeline.position_area/2 );
		this.occupied = false;
		this.position_area = timeline.position_area;
		this.vacantFillStyle = timeline.vacantFillStyle;
		this.occupiedFillStyle = timeline.occupiedFillStyle;
	};
	this.position.inheritsFrom( this.PhysicalEntity );
	Object.defineProperty( this.position.prototype, 'x', { get: function(){ return this.centerX; }, set: function(value){ this.centerX = value; }, enumerable: true, configurable: false } );
	Object.defineProperty( this.position.prototype, 'y', { get: function(){ return this.centerY; }, set: function(value){ this.centerY = value; }, enumerable: true, configurable: false } );
	Object.defineProperty( this.position.prototype, 'width', { get: function(){ return 2 * this.radius; }, set: function(value){}, enumerable: true, configurable: false } );
	Object.defineProperty( this.position.prototype, 'height', { get: function(){ return 2 * this.radius }, set: function(value){}, enumerable: true, configurable: false } );
	/*
	makes a start path within the position area. The size is relative to the area occupied by the current timeline.position object
	*/
	this.position.prototype.makeStarPath = function( context ){
		context.beginPath( );
		context.moveTo( this.radius, 0 );
		context.lineTo( this.radius + ( this.radius/4 ), this.radius/2 );
		context.lineTo( this.radius*2, this.radius/2 );
		context.lineTo( this.radius + ( this.radius/2 ), this.radius );
		context.lineTo( this.radius*10/6, this.radius*7/4 );
		context.lineTo( this.radius, this.radius*5/4 );
		context.lineTo( this.radius*2/6, this.radius*7/4 );
		context.lineTo( this.radius/2, this.radius );
		context.lineTo( 0, this.radius/2 );
		context.lineTo( this.radius*3/4, this.radius/2 );
		context.lineTo( this.radius, 0 );
	};
	/*
	paints a positio in history
	*/
	this.position.prototype.paint = function ( context ){
		context.save( );
		context.translate( this.centerX - this.position_area/2, this.centerY - this.position_area/2 );
		if( !this.occupied ){
			context.beginPath( );
			context.arc( this.radius, this.radius, this.radius - 10, 0, 2 * Math.PI, false );
			context.fillStyle = this.vacantFillStyle;
			context.fill( );
			context.beginPath( );
			context.arc( this.radius, this.radius, this.radius - 5, 0, 2 * Math.PI, false );
			context.lineWidth = 5;
			context.strokeStyle = this.vacantFillStyle;
			context.stroke( );
		}else{
			var original_radius = this.radius;
			this.radius -= 20;
			context.save( );
			context.translate( 20, 20 );
			this.makeStarPath( context );
			context.fillStyle = this.occupiedFillStyle;
			context.fill( );
			context.restore( );
			this.radius = original_radius - 5;
			context.save( );
			context.translate( 5, 5 );
			this.makeStarPath( context );
			context.lineWidth = 4;
			context.strokeStyle = this.occupiedFillStyle;
			context.stroke( );
			context.restore( );
			this.radius = original_radius;
		}
		context.restore( );
	};
}