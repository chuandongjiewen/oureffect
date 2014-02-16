function debug(info){
	console.log(info);
}

(function($){
	var number_skitter = 0,
		skitters = [];
	$.fn.skitter = function(holecon,options,callback){
		return $(this).each(function(index,val){
			if ( $(this).data('skitter_number') == undefined ) {
				$(this).data('skitter_number', number_skitter);
				skitters.push(new $.skitter(this, holecon, options, callback));
				++number_skitter;
			}
		})
	};

	var defaults = {
		"left0" : 0,
		"top0" : 0,
		'opacity':[0,100],
		'dir':{'x':1,'y':-1},
		callback : function(){}	
	}

	$.skitter = function(holecon, obj, options, callback) {
		this.obj = obj;
		this.holecon = holecon;
		this.callback = callback;
		this.timer = null;
		this.opts = $.extend({}, defaults, options || {});
		this.init();
		this.fadeIn();
	};

	$.skitter.fn = $.skitter.prototype = {};	
	$.skitter.fn.extend = $.extend;
	$.skitter.fn.extend({
		init : function(){
			debug("init");
		},
		doMove: function(list,rowId,colId,stripWidth,stripHeight,callback){
			var _this = this;
			if(this.timer) clearInterval(_this.timer);
			this.timer = setInterval(function(){
				if (rowId >= _this.opts.row) {
					clearInterval(_this.timer);
				}		
				else{
					var elem = list[rowId][colId];
					var paramMove = {};
					paramMove['left'] = _this.opts.left+colId*stripWidth;
					paramMove['top'] = _this.opts.top+rowId*stripHeight;
					paramMove['opacity'] = _this.opts.opacity[1];
					if(_this.opts){//?
						if(typeof(_this.opts['width'])!="undefine") 
							paramMove['width'] =_this.opts['width'];
						else{ paramMove['width'] = stripWidth }
						if(typeof(_this.opts['height'])!="undefine") 
						 paramMove['height'] =_this.opts['height'];
						else{ paramMove['height'] = stripWidth }					
					}
					switch(_this.opts.moveType){
						case 'flexibleMove':
							if(rowId == _this.opts.row-1 & colId == _this.opts.col-1) {
								elem.flexibleMove(paramMove, _this.opts.speed,callback);
							}else{
								elem.flexibleMove(paramMove, _this.opts.speed);
							}
						break;
						default:
							if(rowId == _this.opts.row-1 & colId == _this.opts.col-1) {
								bufferMove(elem, paramMove, _this.opts.speed,callback);
							}else{
								bufferMove(elem, paramMove, _this.opts.speed);
							}					
					}			
					colId++;
					if(colId==_this.opts.col) {
						rowId ++;
						colId = 0;
					}				
				}
			},200);
		},
		createBlock:function(param){
			var div = $('<div> </div>');
			div.addClass('box_clone');
			div.css(param);
			return div;		
		},
		deleteBlock:function(divs){
			var len = divs.length;
			for(var i=0;i<len;i++){
				this.removeChild(divs[0]);
			}		
		},
		fadeIn: function(){
			var _this = this;
			var fragment = jQuery.buildFragment();
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var stripWidth = Math.ceil(cWidth/_this.opts.col);
			var stripHeight = Math.ceil(cHeight/_this.opts.row);
			var list = [];
			for(var i=0; i<_this.opts.row; i++){//行
				var tmp = [];
				for(var j=0; j<_this.opts.col; j++){//列
					var elem = this.createBlock({
						opacity:_this.opts.opacity[0],
						top: _this.opts.dir.x*(i+1)*stripHeight,
						left: (-1)*(j+1)*stripWidth,
						width:stripWidth,
						height:stripHeight,
						backgroundPosition: (_this.opts.col-j)*stripWidth+' '+ (_this.opts.row - i)*stripHeight,
						backgroundImage: _this.opts.imgUrl
					});
					// tmp.push(elem);
					// debug(tmp);
					fragment.appendChild(elem);
				}

				list.push(elem);
			}
			debug(list);
			this.obj.append(fragment);
			// this.doMove(list,0,0,stripWidth,stripHeight,function(){
			// 	_this.holecon.src = param['imgUrl'];
			// 	var divs = _this.obj.find('div');
			// 	_this.obj.deleteBlock(divs);
			// 	if(callback) callback();
			// });
		},
		fadeOut: function(){
			var _this = this;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var stripWidth = Math.ceil(cWidth/this.col);
			var stripHeight = Math.ceil(cHeight/this.row);
			this.holecon.src = this.opts.imgUrl;
			var fragment = document.createDocumentFragment();
			var list = [];
			for(var i=0; i<this.opts.row; i++){//行
				var tmp = [];
				for(var j=0; j<this.opts.col; j++){//列
					var elem = this.createBlock({
						opacity:this.opts.opacity[0],
						top: i*stripHeight,
						left:j*stripWidth,
						width:stripWidth,
						height:stripHeight,
						backgroundPosition: (_this.opts.col-j)*stripWidth+' '+ (_this.opts.row - i)*stripHeight,
						backgroundImage: this.opts.imgUrl
					});
					tmp.push(elem);
					fragment.appendChild(elem);
				}
				list.push(tmp);
			}
			container.appendChild(fragment);
			// this.doMove(list,0,0,stripWidth,stripHeight,function(){
			// 	_this.holecon.src = param['imgUrl'];
			// 	var divs = _this.obj.find('div');
			// 	_this.obj.deleteBlock(divs);
			// 	if(callback) callback();
			// });
		}
	});
})(jQuery);

// var BaseEffect = Class.create();
// BaseEffect.prototype = {
// 	initialize: function(init){
// 		this.callback = function(){};
// 		this.row = init['row'];
// 		this.col = init['col'];
// 		this.moveType = init['moveType'];
// 		this.speed = init['speed'];
// 		this.stripWidth = 0;
// 		this.stripHeight = 0;
// 		this.left0 = 0;
// 		this.top0 = 0;
// 	},
// 	doMove: function(list,rowId,colId,row,col,left,top,callback){
// 		var _this = this;
// 		var timer = null;
// 		if(timer) clearInterval(timer);

// 		timer = setInterval(function(){
// 			if (rowId >= row) {
// 				clearInterval(timer);
// 			}		
// 			else{
// 				var elem = list[rowId][colId];
// 				var paramMove = {};
// 				paramMove['left'] = left+colId*_this.stripWidth;
// 				paramMove['top'] = top+rowId*_this.stripHeight;
// 				paramMove['opacity'] = _this.opacity[1];
// 				if(_this.param){
// 					if(typeof(_this.param['width'])!="undefine") 
// 						paramMove['width'] =_this.param['width'];
// 					else{ paramMove['width'] = _this.stripWidth }
// 					if(typeof(_this.param['height'])!="undefine") 
// 					 paramMove['height'] =_this.param['height'];
// 					else{ paramMove['height'] = _this.stripWidth }					
// 				}

// 				switch(_this.moveType){
// 					case 'flexibleMove':
// 						if(rowId == row-1 & colId == col-1) {
// 							flexibleMove(elem, paramMove, _this.speed,callback);
// 						}else{
// 							flexibleMove(elem, paramMove, _this.speed);
// 						}
// 					break;
// 					default:
// 						if(rowId == row-1 & colId == col-1) {
// 							bufferMove(elem, paramMove, _this.speed,callback);
// 						}else{
// 							bufferMove(elem, paramMove, _this.speed);
// 						}					
// 				}			
// 				colId++;
// 				if(colId==col) {
// 					rowId ++;
// 					colId = 0;
// 				}				
// 			}
// 		},200);
// 	},
// 	createBlock:function(param){
// 		var parent = document.createElement('div');
// 		parent.className = 'box_clone';
// 		css(parent, param);
// 		return parent;		
// 	},
// 	deleteBlock:function(container,divs){
// 		var len = divs.length;
// 		for(var i=0;i<len;i++){
// 			container.removeChild(divs[0]);
// 		}		
// 	}
// }

// var EffectOne = Class.create();
// Object.extend(EffectOne.prototype, BaseEffect.prototype);
// Object.extend(EffectOne.prototype, {
// 	fadeIn: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			left0 = param['left0'],
// 			top0 = param['top0'],
// 			imgUrl = 'url("'+param['imgUrl']+'")',
// 			opacity = param['opacity'],
// 			dir =  param['dir'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.left0 = left0;
// 		this.top0 = top0;
// 		this.opacity = opacity;
// 		this.container = container;
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var elem = this.createBlock({
// 					opacity:opacity[0],
// 					top: dir.x*(i+1)*stripHeight,
// 					left: (-1)*(j+1)*stripWidth,
// 					width:stripWidth,
// 					height:stripHeight,
// 					backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
// 					backgroundImage: imgUrl
// 				});

// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		this.doMove(list,0,0,row,col,_this.left0,_this.top0,function(){
// 			holecon.src = param['imgUrl'];
// 			var divs = _this.container.getElementsByTagName('div');
// 			_this.deleteBlock(_this.container,divs);
// 			if(callback) callback();
// 		});
// 	},
// 	fadeOut: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			imgUrl = 'url("'+holecon.getAttribute('src',2)+'")',
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.container = container;
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.opacity = opacity;
// 		holecon.src = param['imgUrl'];
// 		this.param = param;
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var elem = this.createBlock({
// 					opacity:opacity[0],
// 					top: i*stripHeight,
// 					left:j*stripWidth,
// 					width:stripWidth,
// 					height:stripHeight,
// 					backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
// 					backgroundImage: imgUrl
// 				});
// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		this.doMove(list,0,0,row,col,_this.left0,_this.top0);
// 	}
// });

// var EffectTwo = Class.create();
// Object.extend(EffectTwo.prototype,BaseEffect.prototype);
// Object.extend(EffectTwo.prototype, {
// 	fadeIn: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			left0 = param['left0'],
// 			top0 = param['top0'],
// 			imgUrl = 'url("'+param['imgUrl']+'")',
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.left0 = left0;
// 		this.top0 = top0;
// 		this.opacity = opacity;
// 		this.container = container;
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var offset = {};
// 				offset.opacity = opacity[0];
// 				offset.width = stripWidth;
// 				offset.height = stripHeight;
// 				offset.backgroundPosition = (col-j)*stripWidth+' '+ (row - i)*stripHeight;
// 				offset.backgroundImage = imgUrl;
// 				if(row%2!=0 & i==Math.floor(row/2)){
// 					offset.left = (j+1)*stripWidth;
// 					offset.top = i*stripHeight;
// 				}else if(i<row/2){
// 					offset.left = stripWidth+i*50;
// 					offset.top =  (-1)*(stripHeight+j*50);				
// 				}else{
// 					offset.left = stripWidth+i*50;
// 					offset.top =  (stripHeight+j*50);						
// 				}
// 				var elem = this.createBlock(offset);
// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		if(row%2!=0){
// 			this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,this.left0,0);
// 		}
// 		for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
// 			if(i==Math.floor(row/2)-1){//最后一行	
// 				this.doMove(list,i,0,i+1,col,_this.left0,_this.top0,function(){
// 					holecon.src = param['imgUrl'];
// 					var divs = _this.container.getElementsByTagName('div');
// 					_this.deleteBlock(_this.container,divs);
// 					if(callback) callback();	
// 				});
// 			}else{
// 				this.doMove(list,i,0,i+1,col,_this.left0,_this.top0);				
// 			}
// 			this.doMove(list,j-1,0,j,col,_this.left0,(-1)*this.top0);
// 		}
// 	},
// 	fadeOut: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			imgUrl = 'url("'+holecon.getAttribute('src',2)+'")',
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.container = container;
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.left0 =  param['left0'];
// 		this.top0 = param['top0'];
// 		this.opacity = opacity;
// 		holecon.src = param['imgUrl'];
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var elem = this.createBlock({
// 					opacity:opacity[0],
// 					top: i*stripHeight,
// 					left:j*stripWidth,
// 					width:stripWidth,
// 					height:stripHeight,
// 					backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
// 					backgroundImage: imgUrl
// 				});
// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		if(row%2!=0){
// 			this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,this.left0,0);
// 		}
// 		for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
// 			if(i==Math.floor(row/2)-1){//最后一行
// 				this.doMove(list,i,0,i+1,col,this.left0,this.top0,function(){			var divs = _this.container.getElementsByTagName('div');
// 					_this.deleteBlock(_this.container,divs);
// 					if(callback) callback();	
// 				});
// 			}else{
// 				this.doMove(list,i,0,i+1,col,this.left0,this.top0);				
// 			}
// 			this.doMove(list,j-1,0,j,col,this.left0,(-1)*this.top0);
// 		}
// 	}
// });

// var EffectThree = Class.create();
// Object.extend(EffectThree.prototype,BaseEffect.prototype);
// Object.extend(EffectThree.prototype, {
// 	fadeIn: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			left0 = param['left0'],
// 			top0 = param['top0'],
// 			imgUrl = 'url("'+param['imgUrl']+'")',
// 			dir = param['dir'],
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.left0 = left0;
// 		this.top0 = top0;
// 		this.opacity = opacity;
// 		this.container = container;
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var offset = {};
// 				offset.opacity = opacity[0];
// 				offset.width = stripWidth;
// 				offset.height = stripHeight;
// 				offset.backgroundPosition = (col-j)*stripWidth+' '+ (row - i)*stripHeight;
// 				offset.backgroundImage = imgUrl;
// 				if(i%2==0){
// 					offset.left = (j+1)*stripWidth;
// 					offset.top =  (-1)*stripHeight;				
// 				}else{
// 					offset.left = (j+1)*stripWidth;
// 					offset.top =  cHeight+stripHeight;	
// 					//offset.top =  stripHeight;			
// 				}
// 				var elem = this.createBlock(offset);
// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		if(row%2!=0){
// 			this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,this.left0,0);
// 		}
// 		for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
// 			if(i==Math.floor(row/2)-1){//最后运动完的一行，判断很重要。	
// 				this.doMove(list,i,0,i+1,col,_this.left0,_this.top0,function(){
// 					holecon.src = param['imgUrl'];
// 					var divs = _this.container.getElementsByTagName('div');
// 					_this.deleteBlock(_this.container,divs);
// 					if(callback) callback();	
// 				});

// 			}
// 			else{
// 				this.doMove(list,i,0,i+1,col,_this.left0,_this.top0);				
// 			}
// 			this.doMove(list,j-1,0,j,col,_this.left0,(-1)*this.top0);
// 		}
// 	},
// 	fadeOut: function(container,holecon,param,callback){
// 		var row = this.row,
// 			col = this.col,
// 			imgUrl = 'url("'+holecon.getAttribute('src',2)+'")',
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = Math.ceil(cWidth/col),
// 			stripHeight = Math.ceil(cHeight/row);
// 		this.container = container;
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.left0 =  param['left0'];
// 		this.top0 = param['top0'];
// 		this.opacity = opacity;
// 		holecon.src = param['imgUrl'];
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		for(var i=0; i<row; i++){//行
// 			var tmp = [];
// 			for(var j=0; j<col; j++){//列
// 				var elem = this.createBlock({
// 					opacity:opacity[0],
// 					top: i*stripHeight,
// 					left:j*stripWidth,
// 					width:stripWidth,
// 					height:stripHeight,
// 					backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
// 					backgroundImage: imgUrl
// 				});
// 				tmp.push(elem);
// 				fragment.appendChild(elem);
// 			}
// 			list.push(tmp);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		for(var i=0;i<row;i++){//几行就开几个定时器
// 			if(i==row){//最后一行
// 				this.doMove(list,i,0,i+1,col,this.left0,this.top0);
// 			}else if(i%2==0){
// 				this.doMove(list,i,0,i+1,col,this.left0,this.top0);				
// 			}else{
// 				this.doMove(list,i,0,i+1,col,this.left0,(-1)*this.top0);
// 			}
			
// 		}
// 	}		
// });

// var EffectFour = Class.create();
// Object.extend(EffectFour.prototype,BaseEffect.prototype);
// Object.extend(EffectFour.prototype, {
// 	initialize: function(init){
// 		this.callback = function(){};
// 		this.moveType = init['moveType'];
// 		this.speed = init['speed'];
// 		this.stripWidth = 0;
// 		this.stripHeight = 0;
// 		this.left0 = 0;
// 		this.top0 = 0;
// 	},
// 	doMove: function(list,rowId,row,callback){
// 		var _this = this;
// 		var timer = null;
// 		if(timer) clearInterval(timer);
// 		timer = setInterval(function(){
// 			if (rowId >= row) {
// 				clearInterval(timer);
// 			}		
// 			else{
// 				var elem = list[rowId];
// 				var paramMove = {};
// 				paramMove['opacity'] = _this.opacity[1];
// 				if(rowId == row-1) {			
// 					bufferMove(elem, paramMove, _this.speed,callback);
// 				}else{
// 					bufferMove(elem, paramMove, _this.speed);
// 				}				
// 				rowId++;							
// 			}
// 		},200);
// 	},
// 	fadeOut: function(container,holecon,param,callback){
// 		var imgUrl = 'url("'+holecon.getAttribute('src',2)+'")',
// 			opacity = param['opacity'];
// 		var cWidth = parseInt(css(container,"width")),
// 			cHeight = parseInt(css(container,"height"));
// 		var stripWidth = cWidth,
// 			stripHeight = stripHeight;
// 		this.container = container;
// 		this.stripWidth = stripWidth;
// 		this.stripHeight = stripHeight;
// 		this.opacity = opacity;	
// 		css(holecon,{'opacity':0});
// 		holecon.src = param['imgUrl'];
// 		var fragment = document.createDocumentFragment();
// 		var list = [];
// 		var row = Math.ceil(cWidth/100);
// 		for(var i=0; i<row; i++){//行
// 			var newHeight = cWidth - i*100;
// 			var elem = this.createBlock({
// 				opacity: opacity[0],
// 				top: (cHeight-newHeight)/2,
// 				left: (cWidth-newHeight)/2,
// 				width: newHeight,
// 				height: newHeight,
// 				' -webkit-transform': ' rotate(20deg)',
// 				'border-top-left-radius': cWidth,
// 				'border-top-right-radius': cWidth,
// 				'border-bottom-right-radius': cWidth,
// 				'border-bottom-left-radius': cWidth,
// 				backgroundPosition: (-1)*((cWidth-newHeight)/2)+' '+ (-1)*((cHeight-newHeight)/2),
// 				backgroundImage: imgUrl
// 			});
// 			fragment.appendChild(elem);
// 			list.push(elem);
// 		}
// 		var _this = this;
// 		container.appendChild(fragment);
// 		this.doMove(list,0,row,function(){
// 			holecon.src = param['imgUrl'];
// 			var divs = _this.container.getElementsByTagName('div');
// 			_this.deleteBlock(_this.container,divs);
// 			if(callback) callback();
// 		});
// 		bufferMove(holecon,{'opacity':100},200,function(){
// 			holecon.src = param['imgUrl'];
// 			var divs = _this.container.getElementsByTagName('div');
// 			_this.deleteBlock(_this.container,divs);
// 			if(callback) callback();
// 		});
// 	}		
// });
