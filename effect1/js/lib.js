function debug(info){
	console.log(info);
}

var Class = {
	create: function(){
		return function(){
			this.initialize.apply(this, arguments);
		}
	}
}
Object.extend = function(destination, source) {   
	for (var property in source) {   
		destination[property] = source[property];   
	}   
	return destination;   
}  

var BaseEffect = Class.create();
BaseEffect.prototype = {
	initialize: function(){
		//this.stripNum = 10;
		this.callback = function(){};
	},
	newmove: function(list,rowId,colId,param){
		var elem = list[rowId][colId];
		bufferMove(elem,param,10,function(){});
		colId ++;
		if(colId >= this.col){
			colId = 0;
			rowId ++;
		}
		var _this = this;
		var timer = setTimeout(function(){
			if (rowId >= _this.row) {
				_this.callback();
				clearTimeout(timer);
			}else{
				var p = {
					left:param['left'] + _this.stripWidth*colId,
					top:param['top'] + _this.stripHeight*rowId
				}
				_this.newmove(list,rowId,colId,p)
			}
		},100);
	},
	doMove: function(list,rowId,colId,param,fnCallback){
		var _this = this;
		if(typeof this.timer=='undefined') this.timer = null;
		if(this.timer) clearInterval(this.timer);
		this.timer = setInterval(function(){
			if (rowId >= _this.row) {
				_this.callback();
				clearInterval(_this.timer);
				if(fnCallback) fnCallback();
			}
			else{
				var elem = list[rowId][colId];
				var paramMove = {};
				paramMove['left'] = param['left'] +_this.stripWidth*colId;
				paramMove['top'] = param['top'] +_this.stripHeight*rowId;
				flexibleMove(elem, paramMove, 16,function(){});
				colId++;
				if(colId==_this.col) {
					rowId ++;
					colId = 0;
				}				
			}
		},100);
	},
	test:function(){
		debug('super')
	},
	createBlock:function(param,imgUrl){
		var parent = document.createElement('div');
		parent.className = 'box_clone';
		css(parent, param);
		return parent;		
	}
}

var EffectOne = Class.create();
Object.extend(EffectOne.prototype, BaseEffect.prototype);
Object.extend(EffectOne.prototype, {
	initialize: function(param){
		this.stripNum = 10;
		this.callback = function(){};
		this.row = 5;
		this.col = 5;
		this.stripWidth = 0;
		this.stripHeight = 0;
	},
	getDir: function(){
		//x对应left,y对应top;
		var arr = [
			{x:-1,y:-0},
			{x:0,y:-1},
			{x:-1,y:-1}
		];
		var num = (Math.random()*2);
		var index = (num > 1.5) ? Math.ceil(num) : Math.floor(num);
		var dir = arr[index];
		return dir;
	},
	test: function(container){
		var row = this.row,
			col = this.col;
		var cWidth = parseInt(css(container,"width")),
			cHeight = parseInt(css(container,"height"));
		var stripWidth = Math.ceil(cWidth/col);
			stripHeight = Math.ceil(cHeight/row);
		this.stripWidth = stripWidth;
		this.stripHeight = stripHeight;
		var fragment = document.createDocumentFragment();
		var dir = this.getDir();
		var list = [];
		for(var i=0; i<row; i++){//行
			var tmp = [];
			for(var j=0; j<col; j++){//列
				var elem = this.createBlock({
					opacity:100,
					top: (dir.y)*(i+1)*stripHeight,
					left: (dir.x)*(j+1)*stripWidth,
					width:stripWidth,
					height:stripHeight,
					backgroundPosition: (col-j)*stripWidth+' '+ (row - i)*stripHeight,
					backgroundImage: 'url(images/1_3.jpg)'
				});
				tmp.push(elem);
				fragment.appendChild(elem);
			}
			list.push(tmp);
		}
		var _this = this;
		container.appendChild(fragment);
		this.doMove(list,0,0,{left:0,top:0},function(){
			//_this.doMove(list,0,0,{left:900,top:900});
		});
	}
});
