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
	},
	doMove: function(list, curIndex, param){
		var elem = list[curIndex];
		curIndex ++;
		startMove(elem, param, 500);
		var _this = this;
		var timer = setTimeout(function(){
			if (curIndex == _this.stripNum) {
				debug(curIndex);
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
	},
	
	fadeIn: function(container){
		var num = this.stripNum;
		var cWidth = parseInt(css(container,"width"));
		var cHeight = parseInt(css(container,"height"));
		var stripWidth = Math.ceil(cWidth/num);
		var fragment = document.createDocumentFragment();
		var list = [];
		for(var i=0; i<num;i++){
			var elem = createBlock({left:i*stripWidth,height:0});
			list.push(elem);
			fragment.appendChild(elem);
		}
		container.appendChild(fragment);
		this.doMove(list, 0, {height: cHeight});
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
		// var imgList = getElementsByClassName('strip_img');
		this.doMove(list, 0, {left: 0});
		// this.doMove(imgList, 0, {left: 0});
	},
	test: function(){
		debug('EffectOne')
	}


});
