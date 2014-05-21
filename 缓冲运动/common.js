/**
 * 多物体运动框架
 */
function getStyle(obj,attr){//能获取任何属性
	//IE
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	//其他
	else{
		return getComputedStyle(obj,false)[attr];
	} 
}
function setStyle(obj,attr,value){
	//设置px为单位的属性值，其他的要自己写
	if(attr=='opacity'){
		obj.style.filter='alpha(opacity:'+value+')';
		obj.style['opacity']=value/100;
	}
	else{
		obj.style[attr] = value+'px';
	} 
}
function startMove(obj,json,callback){
	clearInterval(obj.Timer);//防止多次onmouseover开启多个定时器
	obj.Timer = setInterval(function(){//每个obj分配一个定时器
		var bStop = true;//假设可以结束
		for(attr in json){
			//取当前属性值
			var iCur = 0;	//当前属性值
			if(attr=='opacity'){	
				iCur = getStyle(obj,attr)*100;
				iCur = (json[attr]-iCur)>0? Math.ceil(iCur):Math.floor(iCur);
			}
			else{
				iCur = parseInt(getStyle(obj,attr));
			}
			//算速度
			var iSpeed = (json[attr]-iCur)/8;//缓冲运动函数，8:缩放系数
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed):Math.floor(iSpeed);	
			//检测停止
			if(iCur != json[attr]){//若改为判断if(iCur == json[attr]) 则只要其中一个属性到达，就会关闭定时器
				//现在是只要其中一个属性未达到目标值，则不能停止关闭定时器
				bStop = false; 	
				setStyle(obj,attr,iSpeed+iCur)		
			}
		}
		if(bStop){
			clearInterval(obj.Timer);
			if(callback) callback();
		}
	},30);
}