/*缓冲运动*/
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
		this.bufferMove();
	};

	$.bufferMove.fn = $.bufferMove.prototype = {};	
	$.bufferMove.fn.extend = $.extend;
	$.bufferMove.fn.extend({
		/*缓冲运动*/
		bufferMove : function(){
			var _this = this;
			var iInterval = 10;
			var oSpeed = {};		
			if(this.timer) clearInterval(_this.timer);
			this.timer=setInterval(function(){
				var oTmp = {};
				for(attr in _this.oTarget){
					oTmp[attr] = parseFloat(_this.obj.css(attr));
					oTmp[attr] = (_this.oTarget[attr]-oTmp[attr])>0? Math.ceil(oTmp[attr]):Math.floor(oTmp[attr]);
					oSpeed[attr] = (_this.oTarget[attr] - oTmp[attr])/_this.coefficient;
					oSpeed[attr] = oSpeed[attr] > 0 ? Math.ceil(oSpeed[attr]):Math.floor(oSpeed[attr]);	
				}
				_this.bufferdoMove(oTmp,oSpeed);
			},iInterval)
		},
		bufferdoMove:function(oTmp, oSpeed)
		{
			var bStop = true;
			var _this = this;
			for(attr in oTmp){
				//以前这里有问题，一直执行这个，系统一直认为这个大于1，因为oTmp[attr]
				if(Math.abs(_this.oTarget[attr]-oTmp[attr])>1 || Math.abs(oSpeed[attr])>1){
					bStop = false;
					console.log(5);
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
	var flexibleMove = [];
	$.fn.flexibleMove = function(oTarget,coefficient,fnCallBack){
		return this.each(function() {
			flexibleMove.push(new $.flexibleMove($(this),oTarget,coefficient,fnCallBack));
		});
	};
	$.flexibleMove = function(obj,oTarget,coefficient,fnCallBack) {
		this.obj = obj;
		this.oTarget = oTarget;
		this.coefficient = coefficient;
		this.callback = fnCallBack;
		this.timer = null;
		this.flexibleMove();
	};

	$.flexibleMove.fn = $.flexibleMove.prototype = {};	
	$.flexibleMove.fn.extend = $.extend;
	$.flexibleMove.fn.extend({
		flexibleMove : function(){
			var iInterval = 10;
			var oSpeed = {};
			var maxSpeed=65;
			var _this = this;
			if(typeof this.timer=='undefined') this.timer = null;
			if(this.timer) clearInterval(this.timer);
			for(attr in _this.oTarget){
				oSpeed[attr] = 0;
			}
			this.timer = setInterval(function(){
				var oTmp = {};
				for(attr in _this.oTarget){
					oTmp[attr] = parseFloat(_this.obj.css(attr));
					oTmp[attr] = (_this.oTarget[attr]-oTmp[attr])>0? Math.ceil(oTmp[attr]):Math.floor(oTmp[attr]);
					oSpeed[attr]+=(_this.oTarget[attr]-oTmp[attr])/_this.coefficient;
					oSpeed[attr]*=0.8;//不乘以这个的话，运动不会停，速度会在正的最大值和负的最大值间变化		
					if(Math.abs(oSpeed[attr])>maxSpeed)
					{
						oSpeed[attr]=oSpeed[attr]>0?maxSpeed:-maxSpeed;
					}				
				};	
				_this.bufferdoMove(oTmp, oSpeed);
			},iInterval);
		},
		bufferdoMove:function(oTmp, oSpeed)
		{
			var bStop = true;
			var _this = this;
			for(attr in oTmp){
				//以前这里有问题，一直执行这个，系统一直认为这个大于1，因为oTmp[attr]
				if(Math.abs(_this.oTarget[attr]-oTmp[attr])>1 || Math.abs(oSpeed[attr])>1){
					bStop = false;
					console.log(5);
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
