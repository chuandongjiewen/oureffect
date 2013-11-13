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
	
