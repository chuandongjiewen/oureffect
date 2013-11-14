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

var EffectOne = Class.create();
EffectOne.prototype = {
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
			var elem = createBlock({top:i*stripHeight,width:0,height:stripHeight});
			list.push(elem);
			fragment.appendChild(elem);
		}
		container.appendChild(fragment);
		this.doMove(list, 0, {width: cWidth});
	},

	doMove: function(list, curIndex, param){
		var elem = list[curIndex];
		curIndex ++;
		startMove(elem, param, 200);
		var _this = this;
		var timer = setTimeout(function(){
			if (curIndex == _this.stripNum) {
				debug(curIndex);
				clearTimeout(timer);
			}else{
				_this.doMove(list,curIndex, param);
			}
		},100);
	}


}