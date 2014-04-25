/*
	ImageSwitcher
	Copyright 20140410 by Ada Wang/汪洁文
*/
(function($){
	var number_switcher = 0,
		switchers = [],
		moveStyles = ["blockIn","blockOut","closeIn","circleOutLeft","closeOut","crossIn","crossOut","circleOut"],//
		len = moveStyles.length;
	$.fn.switcher = function(options){
		return $(this).each(function(index,val){
			if ( $(this).data('switcher_number') == undefined ) {
				$(this).data('switcher_number', number_switcher);
				switchers.push(new $.switcher($(this), options));
				++number_switcher;
			}
		})
	};
	$.fn.switcherPlay = function(options,callback){
		var switcherNumber =  $(this).data('switcher_number');
		var obj = switchers[switcherNumber];	
		if(obj) {
			obj.opts = $.extend({}, obj.opts, options || {});
			setTimeout(function(){
				obj.play(obj.opts.loopPlay,callback);		
			},500)
		}
	}
	$.fn.switcherStop = function(){
		var switcherNumber =  $(this).data('switcher_number');
		var obj = switchers[switcherNumber];
		if(obj) {
			obj.opts.loopPlay=false;		
		}
		return this;
	}
	var defaults = {
		'row':4,
		'col':4,
		'speed':40,
		'time':1000,
		'moveType':'bufferMove',//flexibleMove
	}

	$.switcher = function(obj,options) {		
		var _this = this;
		this.obj = obj.find(".switcher");
		this.init(options);	
		setTimeout(function(){//一开始就自己播放
			_this.play(_this.opts.loopPlay);
		},1000);
	};
	$.switcher.fn = $.switcher.prototype = {};	
	$.switcher.fn.extend = $.extend;
	$.switcher.fn.extend({
		init : function(options){
			var _this = this;
			this.playIndex = 0;
			this.imgArray = [];		
			this.timer = null;
			this.stripWidth = 0;
			this.stripHeight = 0; 
			this.playImgUrl = null;
			this.holecon =  this.obj.parent().find(".image .showDiv");
			this.obj.parent().find(".image img").each(function(index, val) {
				_this.imgArray.push($(val).attr("src"));
			});
			this.opts = $.extend({}, defaults, options || {});	
		},
		play: function(loop,callback){
			var _this = this;
			var moveStyle = this.opts.moveStyle;
			this.playIndex ++;
			if(_this.playIndex>=_this.imgArray.length) _this.playIndex = 0;
			this.playImgUrl = this.imgArray[this.playIndex];
			if(this.opts.moveStyle=='random'){
				var num = this.random(0,len);
				moveStyle = moveStyles[num];
				debug('moveStyles:'+moveStyle);
			}
			if(loop==false){
				debug('loop==false');
				this.doplay(moveStyle,callback);///////////////问题在这里~
			}else{
				debug('loop==true');
				if(this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}			
				this.timer = setTimeout(function(){
					_this.doplay(moveStyle,function(){
						if(_this.opts.loopPlay){
							_this.play(true)
						}
					});
				},2000);			
			}
		},
		doplay: function(moveStyle,callback){
			switch(moveStyle){
				case 'blockIn':
					this.opts.row = 1;
					this.opts.col = 6;
					this.opts.opacity = [0,1];
					this.opts.range = 10;
					this.opts.dir = {'x':1,'y':-1};//{-1,1} {1,-1} {-1,-1}
					this.blockIn(callback);
					break;
				case 'blockOut':
					this.opts.row = 4;
					this.opts.col = 4;
					this.opts.range = 10;
					this.opts.opacity = [1,0];
					this.opts.dir = {'x':1,'y':-1};//{-1,1} {1,-1} {-1,-1}
					this.blockOut(callback);
					break;
				case 'closeIn':
					this.opts.row = 6;
					this.opts.col = 6;
					this.opts.opacity = [0,1];
					this.opts.range = -2;
					this.closeIn(callback);
					break;
				case 'closeOut':
					this.opts.row = 2;
					this.opts.col = 6;
					this.opts.opacity = [1,0];
					this.opts.range = 2;
					this.closeOut(callback);		
					break;
				case 'crossIn':
					this.opts.col = 1;
					this.opts.row = 6;
					this.opts.opacity = [0,1];
					this.opts.range = 10;
					this.crossIn(callback);
					break;
				case 'crossOut'://奇数行有问题
					this.opts.col = 6;
					this.opts.row = 6;
					this.opts.opacity = [1,0];
					this.opts.range = 2;
					this.crossOut(callback);
					break;
				case 'circleOut':
					this.opts.opacity = [1,0];
					this.opts.range = 2;//2 is center
					this.circleOut(callback);
					break;
				case 'circleOutLeft':
					this.opts.opacity = [1,0];
					this.opts.range = 5;//2 is center
					this.circleOut(callback);
					break;
				case 'circleOutRight':
					this.opts.opacity = [1,0];
					this.opts.range = 1;//2 is center
					this.circleOut(callback);
					break;
				default:
					this.opts.opacity = [0,1];
					this.opts.range = 2;
					this.opts.dir = {'x':1,'y':-1};//{-1,1} {1,-1} {-1,-1}
					this.blockIn(callback);
					break;
			}
		},
		random: function(min,max){
		    return Math.floor(min+Math.random()*(max-min));
		},
		whole: function(){
			var wholeColor = ['398BA2','9D4112'];
		},
		doMove: function(list,rowId,colId,row,col,initLeft,initTop,callback){
			var _this = this;
			var timer = null;
			if(timer) clearInterval(timer);
			timer = setInterval(function(){
				if (rowId >= row) {
					clearInterval(timer);
				}		
				else{
					var elem = list[rowId][colId];
					var paramMove = {};
					paramMove['left'] = initLeft+colId*_this.stripWidth;
					paramMove['top'] = initTop+rowId*_this.stripHeight;
					paramMove['opacity'] = _this.opts.opacity[1];
					if(_this.opts){//?
						if(typeof(_this.opts['width'])!="undefine") 
							paramMove['width'] =_this.opts['width'];
						else{ paramMove['width'] = _this.stripWidth }
						if(typeof(_this.opts['height'])!="undefine") 
						 paramMove['height'] =_this.opts['height'];
						else{ paramMove['height'] = _this.stripWidth }					
					}
					switch(_this.opts.moveType){
						case 'flexibleMove':
							if(rowId == row-1 & colId == col-1) {
								elem.flexibleMove(paramMove, _this.opts.speed,callback);
							}else{
								elem.flexibleMove(paramMove, _this.opts.speed);
							}
						break;
						default:
							if(rowId ==row-1 & colId == col-1) {
								elem.bufferMove(paramMove, _this.opts.speed,callback);
							}else{
								elem.bufferMove(paramMove, _this.opts.speed);
							}					
					}			
					colId++;
					if(colId==col) {
						rowId ++;
						colId = 0;
					}				
				}
			},200);
		},
		createBlock:function(param){
			param.opacity =  this.opts.opacity[0];
			param.position ="absolute";
			param.display ="inline";
			var div = $('<div> </div>');
			div.addClass('box_clone');
			div.css(param);
			return div;		
		},
		deleteBlock:function(obj){
			var divs = obj.find('div');
			divs.remove();	
		},
		blockIn: function(callback){
			var _this = this;
			var row = _this.opts.row;
			var col = _this.opts.col;
			var fragment = document.createDocumentFragment();
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var stripWidth = this.stripWidth = parseInt(cWidth/col);
			var stripHeight = this.stripHeight = parseInt(cHeight/row);
			var list = [];
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var elem = this.createBlock({
						top: _this.opts.dir.x*stripHeight/_this.opts.range,
						left: _this.opts.dir.y*stripWidth/_this.opts.range,
						width:stripWidth,
						height:stripHeight,
						backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
						backgroundImage: "url("+_this.playImgUrl+")"
					});
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			this.obj.append(fragment);
			this.doMove(list,0,0,row,col,0,0,function(){
				_this.holecon.attr("src",_this.playImgUrl);			
				// _this.deleteBlock(_this.obj);
				if(callback) callback();
			});
			// this.doMove(list,0,0,row,col,0,0);

		},
		blockOut: function(callback){
			var _this = this;
			var row = this.opts.row;
			var col = this.opts.col;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var initLeft =  this.opts.initLeft = _this.opts.dir.x*cWidth/_this.opts.range;
			var initTop =  this.opts.initTop = _this.opts.dir.y*cHeight/_this.opts.range;
			var stripWidth = this.stripWidth = parseInt(cWidth/col);
			var stripHeight = this.stripHeight = parseInt(cHeight/row);
			var imgUrl = this.holecon.attr("src");
			this.holecon.attr("src",_this.playImgUrl);
			var fragment = document.createDocumentFragment();
			var list = [];
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var elem = this.createBlock({
						top: i*stripHeight,
						left:j*stripWidth,
						width:stripWidth,
						height:stripHeight,
						backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
						backgroundImage: "url("+imgUrl+")"
					});
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			this.obj.append(fragment);
			this.doMove(list,0,0,row,col,initLeft,initTop,function(){			
				_this.deleteBlock(_this.obj);
				if(callback) callback();	
			});
		},
		closeIn: function(callback){
			var _this = this;
			var row = _this.opts.row;
			var col = _this.opts.col;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var stripWidth = this.stripWidth = parseInt(cWidth/col);
			var stripHeight = this.stripHeight = parseInt(cHeight/row);
			var fragment = document.createDocumentFragment();	
			var list = [];
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var offset = {};
					offset.width = stripWidth;
					offset.height = stripHeight;
					offset.backgroundPosition = (col-j)*stripWidth+' '+ (row - i)*stripHeight;
					offset.backgroundImage =  "url("+_this.playImgUrl+")";
					if(row%2!=0 & i==Math.floor(row/2)){//中间行
						offset.left = (-1)*(j+1)*stripWidth/this.opts.range;
						offset.top = i*stripHeight/this.opts.range;
					}else if(i<row/2){//上部分
						offset.left = (-1)*stripWidth*(i+1)/this.opts.range
						offset.top =  (-5-j)*(stripHeight)/this.opts.range;				
					}else{
						offset.left = (-1)*stripWidth*(i+1)/this.opts.range;
						offset.top = (j)*stripHeight/(-1)*this.opts.range;	
						//offset.top = (j+5)*stripHeight/(-1)*this.opts.range;						
					}
					var elem = this.createBlock(offset);
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			this.obj.append(fragment);
			if(row%2!=0){
				this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,0,0);
			}
			for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
				if(i==Math.floor(row/2)-1){//最后一次
					this.doMove(list,i,0,i+1,col,0,0);
					this.doMove(list,j-1,0,j,col,0,0,function(){
						_this.holecon.attr("src",_this.playImgUrl);			
						// _this.deleteBlock(_this.obj);
						if(callback) callback();
					});							
				}else{
					this.doMove(list,i,0,i+1,col,0,0);	
					this.doMove(list,j-1,0,j,col,0,0);			
				}
			}
		},
		closeOut: function(callback){
			var _this = this;
			var row = _this.opts.row;
			var col = _this.opts.col;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var initLeft =  parseInt(_this.opts.initLeft =(-1)*cWidth/this.opts.range);
			var initTop =  parseInt(_this.opts.initTop = (-1)*cHeight/this.opts.range);
			var stripWidth = this.stripWidth = parseInt(cWidth/col);
			var stripHeight = this.stripHeight = parseInt(cHeight/row);
			var fragment = document.createDocumentFragment();
			var imgUrl = this.holecon.attr("src");	
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			this.holecon.attr("src",_this.playImgUrl);
			var wholeColor = ['398BA2','9D4112'];
			var list = [];
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var elem = this.createBlock({
						top: i*stripHeight,
						left: j*stripWidth,
						width: stripWidth,
						height: stripHeight,
						backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
						backgroundImage: "url("+imgUrl+")"
					});
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			var _this = this;
			this.obj.append(fragment);
			if(row%2!=0){
				this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,initLeft,initTop);
			}
			for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
				if(i==Math.floor(row/2)-1){//最后一行
					this.doMove(list,i,0,i+1,col,initLeft,initTop);
					this.doMove(list,j-1,0,j,col,initLeft,(-1)*initTop,function(){			
						_this.deleteBlock(_this.obj);
						if(callback) callback();	
					});	
				}else{
					this.doMove(list,i,0,i+1,col,initLeft,initTop);	
					this.doMove(list,j-1,0,j,col,initLeft,(-1)*initTop);			
				}
				
			}
		},
		crossIn: function(callback){
			var _this = this;
			var row = _this.opts.row;
			var col = _this.opts.col;
			var initLeft =  _this.opts.initLeft;
			var initTop =  _this.opts.initTop;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var stripWidth = parseInt(this.stripWidth = parseInt(cWidth/col));
			var stripHeight = parseInt(this.stripHeight = parseInt(cHeight/row));
			var fragment = document.createDocumentFragment();	
			var list = [];
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var offset = {};
					offset.width = stripWidth;
					offset.height = stripHeight;
					offset.backgroundPosition = (col-j)*stripWidth+' '+ (row - i)*stripHeight;
					offset.backgroundImage = "url("+_this.playImgUrl+")";
					if(i%2==0){
						offset.left = (j+1)*stripWidth/this.opts.range;
						offset.top =  (-1)*stripHeight/this.opts.range;				
					}else{
						offset.left = (j+1)*stripWidth/this.opts.range;
						offset.top =  cHeight+stripHeight/this.opts.range;	
						//offset.top =  stripHeight;			
					}
					var elem = this.createBlock(offset);
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			var _this = this;
			this.obj.append(fragment);
			if(row%2!=0){
				this.doMove(list,Math.floor(row/2),0,Math.ceil(row/2),col,0,0);
			}
			for(var i=0,j=row;i<Math.floor(row/2);i++,j--){//几行就开几个定时器
				if(i==Math.floor(row/2)-1){//最后运动完的一行，判断很重要。
					this.doMove(list,j-1,0,j,col,0,0);		
					this.doMove(list,i,0,i+1,col,0,0,function(){
						_this.holecon.attr("src",_this.playImgUrl);			
						// _this.deleteBlock(_this.obj);
						if(callback) callback();
					});
					return;
				}
				else{
					this.doMove(list,i,0,i+1,col,0,0);		
					this.doMove(list,j-1,0,j,col,0,0);		
				}				
			}
		},
		crossOut: function(callback){
			var _this = this;
			var row = _this.opts.row;
			var col = _this.opts.col;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var initLeft = parseInt(_this.opts.initLeft = (-1)*cWidth/this.opts.range);
			var initTop = parseInt(_this.opts.initTop = cHeight/this.opts.range);
			var stripWidth = this.stripWidth = parseInt(cWidth/col);
			var stripHeight = this.stripHeight = parseInt(cHeight/row);
			var fragment = document.createDocumentFragment();
			var imgUrl = this.holecon.attr("src");	
			this.holecon.attr("src",_this.playImgUrl);
			var list = [];
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var tmp = [];
				for(var j=0; j<col; j++){//列
					var elem = this.createBlock({
						top: i*stripHeight,
						left:j*stripWidth,
						width:stripWidth,
						height:stripHeight,
						backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
						backgroundImage: "url("+imgUrl+")"
					});
					tmp.push(elem);
					fragment.appendChild(elem[0]);
				}
				list.push(tmp);
			}
			var _this = this;
			this.obj.append(fragment);
			for(var i=0;i<row;i++){//几行就开几个定时器
				if(i==row-1){//最后一行
					debug(3);
					this.doMove(list,i,0,i+1,col,initLeft,(-1)*initTop,function(){		
						_this.deleteBlock(_this.obj);
						if(callback) callback();	
					});
				}
				if(i%2==0){
					this.doMove(list,i,0,i+1,col,initLeft,initTop);				
				}else{
					this.doMove(list,i,0,i+1,col,initLeft,(-1)*initTop);
				}				
			}
		},
		circleOut: function(callback){
			this.opts.opacity = [1,0];
			var _this = this;
			var cWidth = parseInt(this.obj.css("width"));
			var cHeight = parseInt(this.obj.css("height"));
			var initLeft = parseInt(_this.opts.initLeft = (-1)*cWidth);
			var initTop = parseInt(_this.opts.initTop = (-1)*cHeight);
			var stripWidth = this.stripWidth = cWidth;
			var stripHeight = this.stripHeight = cHeight;
			var imgUrl = this.holecon.attr("src");	
			this.holecon.attr("src",_this.playImgUrl).css('opacity',0);
			var fragment = document.createDocumentFragment();
			var list = [];
			var row = Math.ceil(cWidth/100);
			if(_this.obj.find('div')!=0){
				_this.deleteBlock(_this.obj);
			}
			for(var i=0; i<row; i++){//行
				var newHeight = cWidth - i*100;
				var elem = this.createBlock({
					top: (cHeight-newHeight)/this.opts.range,
					left: (cWidth-newHeight)/this.opts.range,
					width: newHeight,
					height: newHeight,
					' -webkit-transform': ' rotate(20deg)',
					'border-top-left-radius': cWidth,
					'border-top-right-radius': cWidth,
					'border-bottom-right-radius': cWidth,
					'border-bottom-left-radius': cWidth,
					backgroundPosition: (-1)*((cWidth-newHeight)/this.opts.range)+' '+ (-1)*((cHeight-newHeight)/this.opts.range),
					backgroundImage: "url("+imgUrl+")"
				});
				fragment.appendChild(elem[0]);
				list.push(elem);
			}
			var _this = this;
			this.obj.append(fragment);
			this.circleMove(list,0,row,function(){
				_this.holecon.attr("src",_this.playImgUrl);
				_this.deleteBlock(_this.obj);
				if(callback) callback();
			});
			_this.holecon.bufferMove({'opacity':1},200);
		},
		circleMove : function(list,rowId,row,callback){
			var _this = this;
			var timer = timer;
			if(timer) clearInterval(timer);
			timer = setInterval(function(){
				if (rowId >= row) {
					clearInterval(timer);
				}		
				else{
					var elem = list[rowId];
					var paramMove = {};
					paramMove['opacity'] = _this.opts.opacity[1];
					if(rowId == row-1) {		
						elem.bufferMove(paramMove, _this.opts.speed,callback);
					}else{
						elem.bufferMove(paramMove, _this.opts.speed);
					}				
					rowId++;							
				}
			},200);
		}		
	});
})(jQuery);


/*
	ImageSwitcher
	Copyright 20140410 by Ada Wang/汪洁文
*/
function debug(infor){
	console.log(infor);
}
/*
	缓冲运动
	coefficient越大越慢

*/
(function($){
	var bufferMoves = [];
	$.fn.bufferMove = function(oTarget,coefficient,fnCallBack){
		return this.each(function() {
			bufferMoves.push(new $.bufferMove($(this),oTarget,coefficient,fnCallBack));
		});
	};
	$.bufferMove = function(obj,oTarget,coefficient,fnCallBack) {		
		this.obj = obj;
		this.oTarget = oTarget;
		this.coefficient = coefficient;
		this.callback = fnCallBack;
		this.timer = null;
		this.bufferMoving();
	};
	$.bufferMove.fn = $.bufferMove.prototype = {};	
	$.bufferMove.fn.extend = $.extend;
	$.bufferMove.fn.extend({
		/*缓冲运动*/
		bufferMoving : function(){
			var _this = this;
			var iInterval = 10;				
			if(this.timer) clearInterval(_this.timer);
			this.timer = setInterval(function(){
				var oTmp = {};
				for(attr in _this.oTarget){
					oTmp[attr] = parseFloat(_this.obj.css(attr));
					if(attr=="opacity") {
						oTmp[attr] = oTmp[attr]*100;
						_this.oTarget[attr] = _this.oTarget[attr]*100;
					}
					oTmp[attr] = (_this.oTarget[attr]-oTmp[attr])>0? Math.ceil(oTmp[attr]):Math.floor(oTmp[attr]);									
				}
				_this.bufferdoMove(oTmp);
			},iInterval)
		},
		bufferdoMove:function(oTmp)
		{
			var bStop = true;
			var _this = this;
			var oSpeed = {};
			for(attr in oTmp){
				////////////////it is very important!
				if(Math.abs(_this.oTarget[attr]-oTmp[attr])>Math.abs(_this.oTarget[attr]*0.001)){				
					bStop = false;
					debug(5);/////////////////////////////NEED
				}	
				oSpeed[attr] = (_this.oTarget[attr] - oTmp[attr])/_this.coefficient;
				oSpeed[attr] = oSpeed[attr] > 0 ? Math.ceil(oSpeed[attr]):Math.floor(oSpeed[attr]);		
				if(attr=="opacity") {
					oSpeed[attr] = oSpeed[attr]/100;
					oTmp[attr] = oTmp[attr]/100;
					_this.oTarget[attr] = _this.oTarget[attr]/100;
				}			
			}
			if(bStop)
			{
				clearInterval(_this.timer);
				_this.timer=null;		
				_this.obj.css(_this.oTarget);
				if(this.callback) this.callback();
				// if(this.callback)	setTimeout(function(){
				// 	this.callback();
				// },200);
			}
			else
			{	
				for(attr in oSpeed){
					oTmp[attr]+=oSpeed[attr];
				}	
				_this.obj.css(oTmp);
			}
		}
	});
})(jQuery);

/*弹性运动*/
(function($){
	var moveArray = [];
	$.fn.flexibleMove = function(oTarget,coefficient,fnCallBack){
		return this.each(function(i,elem) {
			$(elem).attr('flexibleMove-index',i);
			moveArray.push(new $.flexibleMove($(this),oTarget,coefficient,fnCallBack));
		});
	};
	$.fn.flexibleStop = function(){
		if (moveArray.length==0) return this;
		var index = $(this).attr('flexibleMove-index');
		if (moveArray.length < index+1) {
			return this;
		};
		var obj = moveArray[index];
		if(obj!=null && typeof obj.timer!= "undefined"){			
			moveArray.splice(index,1);
			clearInterval(obj.timer);
		}
		return this;
	}

	$.flexibleMove = function(obj,oTarget,coefficient,fnCallBack) {
		this.obj = obj;
		this.oTarget = oTarget;
		this.coefficient = coefficient;
		this.callback = fnCallBack;
		this.timer = null;
		this.init();
	};
	$.flexibleMove.fn = $.flexibleMove.prototype = {};	
	$.flexibleMove.fn.extend = $.extend;
	$.flexibleMove.fn.extend({
		init : function(){
			this.oSpeed = {};
			var iInterval = 10;
			this.maxSpeed=65;
			var _this = this;
			// if(typeof this.timer=='undefined') this.timer = null;
			if(_this.timer != null) {
				clearInterval(_this.timer)
			};
			for(attr in _this.oTarget){
				this.oSpeed[attr] = 0;
			}
			this.timer = setInterval(function(){
				var oTmp = {};
				for(attr in _this.oTarget){
					oTmp[attr] = parseFloat(_this.obj.css(attr));
					if(attr=="opacity") {
						oTmp[attr] = oTmp[attr]*100;
						_this.oTarget[attr] = _this.oTarget[attr]*100;
					}
					oTmp[attr] = (_this.oTarget[attr]-oTmp[attr])>0? Math.ceil(oTmp[attr]):Math.floor(oTmp[attr]);			
				};	
				_this.bufferdoMove(oTmp);
			},iInterval);
		},
		bufferdoMove:function(oTmp)
		{
			var bStop = true;
			var _this = this;
			var oSpeed = _this.oSpeed;
			for(attr in oTmp){
				//以前这里有问题，一直执行这个，系统一直认为这个大于1，因为oTmp[attr]
				if(Math.abs(_this.oTarget[attr]-oTmp[attr])>Math.abs(_this.oTarget[attr]*0.01)){
					bStop = false;
					debug(6);//////////////NEED!
				}	
				oSpeed[attr]+=(_this.oTarget[attr]-oTmp[attr])/_this.coefficient;
				oSpeed[attr]*=0.8;//不乘以这个的话，运动不会停，速度会在正的最大值和负的最大值间变化			
				if(Math.abs(oSpeed[attr])>_this.maxSpeed)
				{
					oSpeed[attr]=oSpeed[attr]>0?maxSpeed:-maxSpeed;
				}	
				if(attr=="opacity") {
					oSpeed[attr] = oSpeed[attr]/100;
					oTmp[attr] = oTmp[attr]/100;
					_this.oTarget[attr] = _this.oTarget[attr]/100;
				}			
			}
			if(bStop)
			{
				clearInterval(_this.timer);
				_this.timer=null;		
				_this.obj.css(_this.oTarget);
				if(this.callback)	this.callback();
			}
			else
			{
				for(attr in oSpeed){
					oTmp[attr]+=oSpeed[attr];
				}	
				_this.obj.css(oTmp);
			}
		}
	});
})(jQuery);





// function doMove(oTmp,obj, oTarget, oSpeed, iEndTime, fnCallBack)
// {
	//var wholeColor = ['398BA2','9D4112'];
// 	var bStop = false;
// 	var iNow=(new Date()).getTime();
// 	if(iNow>=iEndTime) bStop = true;//过了结束时间
// 	if(bStop)
// 	{
// 		clearInterval(obj.timer);
// 		obj.timer=null;		
// 		css(obj,oTarget);
// 		if(fnCallBack)	fnCallBack();
// 	}
// 	else
// 	{
// 		for(attr in oSpeed){
// 			oTmp[attr]+=oSpeed[attr];
// 		}	
// 		css(obj,oTmp);
// 	}
// }

