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
	initialize: function(param){
		this.stripNum = 10;
		this.callback = function(){};
	},
	doMove: function(list, curIndex, param){
		var elem = list[curIndex];
		curIndex ++;
		flexibleMove(elem, param, 16,function(){});
		// bufferMove(elem, param, 10,function(){});
		// animate(elem, param, 300,function(){});
		var _this = this;
		var timer = setTimeout(function(){
			if (curIndex == _this.stripNum) {
				debug(curIndex);
				_this.callback();
				clearTimeout(timer);
			}else{
				_this.doMove(list,curIndex, param);
			}
		},100);
	},
	test:function(){
		debug('super')
	}
}

var EffectOne = Class.create();
Object.extend(EffectOne.prototype, BaseEffect.prototype);
Object.extend(EffectOne.prototype, {
	initialize: function(param){
		this.stripNum = 10;
		this.callback = function(){};
		this.row = 5;
		this.col = 10;
		this.stripWidth = 0;
		this.stripHeight = 0;
	},
	fadeIn: function(container,callback){
		if(callback !== undefined){
			this.callback = callback;
		}
		var num = this.stripNum;
		var cWidth = parseInt(css(container,"width"));
		var cHeight = parseInt(css(container,"height"));
		var stripWidth = Math.ceil(cWidth/num);
		var fragment = document.createDocumentFragment();
		var list = [];
		for(var i=0; i<num;i++){
			var elem = createBlock({
				opacity:100,
				top: -cHeight,
				left: i*stripWidth,
				width:stripWidth,
				height:cHeight,
				backgroundPosition: (num - i)*stripWidth+' '+(-1*cHeight),
				backgroundImage: 'url(images/1_3.jpg)'
			});
			list.push(elem);
			fragment.appendChild(elem);
		}
		container.appendChild(fragment);
		this.doMove(list, 0, {top: 0});
	},

	fadeOut: function(container){
		var num = this.stripNum;
		var cWidth = parseInt(css(container,"width"));
		var cHeight = parseInt(css(container,"height"));
		var stripHeight = Math.ceil(cHeight/num);
		var fragment = document.createDocumentFragment();
		var list = [];
		for(var i=0; i<num;i++){
			var elem = createBlock({
				opacity:100,
				top:i*stripHeight,
				left: -cWidth,
				width:cWidth,
				height:stripHeight,
				backgroundPosition: (-1*cWidth)+' '+ (num - i)*stripHeight,
				backgroundImage: 'url(images/1_3.jpg)'
			});
			list.push(elem);
			fragment.appendChild(elem);
		}
		container.appendChild(fragment);
		this.doMove(list, 0, {left: 0});
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
		var list = [];
		for(var i=0; i<row; i++){//行
			var tmp = [];
			for(var j=0; j<col; j++){//列
				var elem = createBlock({
					opacity:100,
					top:-j*stripHeight,
					left: -i*stripWidth,
					width:stripWidth,
					height:stripHeight,
					backgroundPosition: (col-i)*stripWidth+' '+ (row - i)*stripHeight,
					backgroundImage: 'url(images/1_3.jpg)'
				});
				tmp.push(elem);
				fragment.appendChild(elem);
			}
			list.push(tmp);
		}
		// debug(list[0][0])
		container.appendChild(fragment);
		// for(var i=0; i<col;i++){
		// 	for(var j=0; j<row;j++){
		// 		debug(list[i][j]);
		// 	}
		// }
		// debug(list[4][5]);
		this.newmove(list,0,0,{left:0,top:0});
	},

	newmove: function(list,rowId,colId,param){
		// debug(rowId+':'+colId)
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
					left: _this.stripWidth*colId,
					top: _this.stripHeight*rowId
				}
				_this.newmove(list,rowId,colId,p)
			}
		},100);
	}


});
