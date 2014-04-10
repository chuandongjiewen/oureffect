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
				if(Math.abs(_this.oTarget[attr]-oTmp[attr])>Math.abs(_this.oTarget[attr]*0.02)||oSpeed[attr]<_this.oTarget[attr]*0.02){				
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
					console.log(6);
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
