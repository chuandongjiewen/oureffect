function addLoadEvent(func)
{
	var oldonload=window.onload;
	if(typeof window.onload!='function')
	{
		window.onload=func;
	}
	else
	{
		window.onload=function()
		{
			oldonload();
			func();
		}
	}
}

/*根据类名获得对象*/

function getElementsByClassName(searchClass, node,tag){  //在node节点里面的tag标签找class,写的时候记得加引号
	if(document.getElementsByClassName){return  document.getElementsByClassName(searchClass)}
	else{        
		node = node || document;        
		tag = tag || "*";        
		var classes = searchClass.split(" "),        
		elements = (tag === "*" && node.all)? node.all : node.getElementsByTagName(tag),        
		patterns = [],         
		returnElements = [],        
		current,         
		match;        
		var i = classes.length;       
		while(--i >= 0){patterns.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)"));}        
		var j = elements.length;       
		while(--j >= 0){             
			current = elements[j];           
			match = false;            
			for(var k=0, kl=patterns.length; k<kl; k++){                
				match = patterns[k].test(current.className);                
				if (!match)  break;           
			} 
			if (match)  returnElements.push(current);        
		}        
		return returnElements;   
	} 
}
/*获取第一个子节点的函数，兼容FF*/
function getFirstChild(obj){
	var firstDIV;
	for (i=0; i<obj.childNodes.length; i++){
		if (obj.childNodes[i].nodeType==1){
			firstDIV=obj.childNodes[i];
			return firstDIV;
		}
		else 
			continue;
	}
}
/*判断是否有className的函数，调用例子为：o.className=o.addClass(o,"normal");*/
function hasClass(element, className) {  
	var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');     
	return element.className.match(reg); 
} 
/*动态删除className的函数，调用例子为：removeClass(document.getElementById("test"), "test") */
function removeClass(element, className) {     
	if (hasClass(element, className)){ 
		var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');         
		element.className = element.className.replace(reg,' ');     
	} 
} 
function getNextElement(node)
{
    if (node.nodeType == 1) return node;
    if (node.nextSibling) return getNextElement(node.nextSibling);
    return null;
}

/*能获取任何属性*/
function getStyle(obj,attr){
	//IE
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	//其他
	else{
		return getComputedStyle(obj,false)[attr];
	} 
}

/*改变元素透明度、位置、大小,target是个json*/
function css(elem,target){
	for(attr in target){
		if(attr=='opacity') {
			elem.style['opacity'] = target[attr];
			elem.style.filter = 'alpha(opacity=' + target[attr]*100 + ')'; 
		}
		else{
			elem.style[attr] = target[attr];
		}
	}
}

/*缓冲运动框架*/
function startMove(obj,target,iTime,fnCallBack){

	var iInterval=45;
	var iEndTime=(new Date()).getTime()+iTime;
	var iTimes=Math.ceil(iTime/iInterval);
	var oSpeed={};

	if(typeof obj.timer=='undefined') obj.timer=null;
	if(obj.timer) clearTimeout(obj.timer);

	for(attr in target){
		oSpeed[attr] = (target[attr] - obj.style[attr])/iTimeS;
	}

	obj.timer=setInterval
	(
		function ()
		{
			doMove(obj, oParams, oSpeed, iEndTime, fnCallBack);
		}, iInterval
	);
}

function doMove(obj, oTarget, oSpeed, iEndTime, fnCallBack)
{
	var iNow=(new Date()).getTime();
	
	if(iNow>=iEndTime)//过了结束时间
	{
		clearInterval(obj.timer);
		obj.timer=null;
		
		for(key in oTarget)
		{
			obj[key]=oTarget[key];
//			alert('set '+key+'='+oTarget[key]);
			switch(key)
			{
				case 'alpha':
					obj.style.opacity=oTarget[key]/100;
					obj.style.filter="alpha(opacity:"+oTarget[key]+")";
					break;
				case 'zIndex':
					obj.style.zIndex=oTarget[key];
					break;
				case 'width':
				case 'height':
					obj.getElementsByTagName('img')[0].style[key]=oTarget[key]+'px';
					break;
				default:
					obj.style[key]=oTarget[key]+'px';
					break;
			}
		}
		
		if(fnCallBackEnd)
		{
			fnCallBackEnd();
		}
	}
	else
	{
		for(key in oTarget)
		{
			obj[key]+=oSpeed[key];
			
			switch(key)
			{
				case 'alpha':
					obj.style.opacity=obj[key]/100;
					obj.style.filter="alpha(opacity:"+obj[key]+")";
					break;
				case 'zIndex':
					//obj.style.zIndex=obj[key];
					obj.style.zIndex=oTarget[key];
					break;
				case 'width':
				case 'height':
					obj.getElementsByTagName('img')[0].style[key]=obj[key]+'px';
					break;
				default:
					obj.style[key]=obj[key]+'px';
					break;
			}
		}
	}
}

