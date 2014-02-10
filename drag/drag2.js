

(function($) {

    $.fn.dragsort = function(options) {
        var opts = $.extend({}, $.fn.dragsort.defaults, options);//use a object to save the options 
        var lists = [];
        var list = null, lastPos = null;
        //对象共有的变量,list正在被拖动的ul
        this.each(function(index, cont) {
            var newList = {
                draggedItem: null,
                placeHolder: null,
                posList: [],
                dragOffset: {},
                offsetLimit: null,
                container: cont,//每个对象都有变量
                init:function(){
                    $(this.container).attr('data-listidx', index);
                    $(this.container).mousedown(this.grabItem);
                    $(this.container).bind('dragsort-uninit',this.uninit);
                    $(this.container).find(opts.dragSelector).css("cursor","pointer");
                },
                getItems: function() {
                    return $(this.container).find(opts.itemSelector);
                },
                uninit:function(){
                    $(this.container).removeAttr('data-listidx', index);
                    $(this.container).unbind("mousedown");
                    $(this.container).unbind('dragsort-uninit');
                    $(this.container).find(opts.dragSelector).css("cursor","default");                    
                },
                grabItem:function(e){
                    e = e || event;
                    while(!$(e.target).is(opts.dragSelector))  return;
                    var dragHandle = $(e.target);  
                    list = lists[index];//this变了，this没有指向对象了，所以不能用this，只能用list保存对象
                    list.draggedItem = dragHandle.closest(opts.itemSelector);             
                    var trigger = function(){
                        list.dragStart(e);
                        $(document).unbind('mousemove',trigger);//dragstart只执行一次，不会每次移动都一直在执行dragstart
                    }
                    $(document).mousemove(trigger);
                    $(document).mouseup(function(event) {
                        $(document).unbind("mousemove",trigger);
                    });
                    return false;
                },
                dragStart:function(e){//建立pos表，插入placeholder，dragitem赋值，指向移动元素，位置设置，保存原来的style
                    var mt = parseInt(list.draggedItem.css("marginTop"));
                    var ml = parseInt(list.draggedItem.css("marginLeft"));
                    list.dragOffset = list.draggedItem.offset();
                    list.dragOffset.top = list.dragOffset.top - (isNaN(mt) ? 0 : mt) + 1;
                    list.dragOffset.left = list.dragOffset.left - (isNaN(ml) ? 0 : ml) + 1;  
                    list.dragOffset.disY = e.pageY - list.dragOffset.top;
                    list.dragOffset.disX = e.pageX - list.dragOffset.left;
                    list.dragOffset.width = list.draggedItem.outerWidth();
                    list.dragOffset.height = list.draggedItem.outerHeight();
                    var orig = list.draggedItem.attr("style");
                    list.draggedItem.attr("origstyle", orig ? orig : "");
                    list.draggedItem.css({
                        "position":"absolute",
                        "left": list.dragOffset.left+"px",
                        "top": list.dragOffset.top+"px"
                    });
                    list.draggedItem.after(opts.placeHolderItem);   
                    list.placeHolder =  list.draggedItem.next();
                    list.placeHolder.attr("placeholder",true);
                    $(lists).each(function(i, val) { 
                        val.createDropTargets(); val.buildPosition(); 
                    });
                    $(document).bind("mousemove", list.swapItems);
                    $(document).bind("mouseup", list.dropItems);
                },
                setPos:function(x,y){
                    list.draggedItem.css("left",x);
                    list.draggedItem.css("top",y);
                },
                createDropTargets:function(){
                    var ph = $(this.container).find("[placeholder]");//在container找
                    var dt = $(this.container).find("[droptarget]");
                    if (ph.size() > 0 && dt.size() > 0) dt.remove();
                    else if (ph.size() == 0 && dt.size() == 0) {
                        var falseplaceholder = list.placeHolder.removeAttr("placeholder").clone().attr("droptarget", true);
                        $(this.container).append(falseplaceholder);                            
                        list.placeHolder.attr("placeholder", true);//真正的待插入占位符,只能有一个
                    }
                },
                buildPosition:function(){      
                    var _this = this;          
                    this.getItems().not([list.draggedItem[0], list.placeHolder[0]]).each(function(){
                        var offset = $(this).offset();
                        offset.right = offset.left + list.dragOffset.width;
                        offset.bottom = offset.top + list.dragOffset.height;
                        offset.elm = this;
                        _this.posList.push(offset);
                    });
                },
                swapItems:function(e){
                    e = event || e;
                    var currentX = e.pageX-list.dragOffset.disX;
                    var currentY = e.pageY-list.dragOffset.disY
                    list.setPos(currentX,currentY);
                    var findIndex = list.findPos(e.pageX,e.pageY);
                    var nlist = list;
                    //findIndex == -1才会参与循环
                    for (var i = 0; findIndex == -1 && opts.dragBetween && i < lists.length; i++){
                        findIndex = lists[i].findPos(e.pageX, e.pageY);
                        nlist = lists[i];
                    }
                    if(findIndex==-1) return false;

                    var purpose = nlist.posList[findIndex];
                    if (lastPos == null || lastPos.top > list.draggedItem.offset().top || lastPos.left > list.draggedItem.offset().left){
                        $(purpose.elm).before(list.placeHolder);
                    }
                    else{
                        $(purpose.elm).after(list.placeHolder); 
                    }
                    $(lists).each(function(i, l) { l.createDropTargets(); l.buildPosition(); });
                    lastPos = list.draggedItem.offset();   
                    return false;

                },
                findPos:function(x,y){
                    var findIndex = -1;
                    $(this.posList).each(function(index,val){
                        if(x > val.left && x < val.right && y > val.top && y < val.bottom){
                            findIndex = index;
                        }
                    });
                    return findIndex;
                },
                dropItems:function(){
                    var origstyle = list.draggedItem.attr("origstyle");
                    list.draggedItem.removeAttr("origstyle").removeAttr("style").attr("style",origstyle);
                    list.placeHolder.before(list.draggedItem);
                    list.placeHolder.remove();
                    $("[droptarget]").remove();
                    list.draggedItem = null;
                    $(document).unbind("mousemove", list.swapItems);//记得取消绑定
                    $(document).unbind("mouseup", list.dropItem);
                }
            };
            newList.init();
            lists.push(newList);
        });
        return this;
    };
    $.fn.dragsort.defaults = {
        dragSelector: "",
        itemSelector: "",
        dragEnd: function() {},
        dragBetween: false,
        placeholderItem: "",
        scrollContainer: window,
        scrollSpeed: 5
    };
})(jQuery);

function debug(x){
    console.log(x);
}