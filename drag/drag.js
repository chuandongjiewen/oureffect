

(function($) {

    $.fn.dragsort = function(options) {
        var opts = $.extend({}, $.fn.dragsort.defaults, options);
        var lists = [];
        var list = null, lastPos = null;

        this.each(function(i, cont) {
            var newList = {
                draggedItem: null,
                placeHolder: null,
                posList: {},
                dragOffset: {},
                offsetLimit: null,
                container: cont,

                init: function() {//this:newlist
                    $(this.container).attr('data-listidx', i);
                    $(this.container).mousedown(this.grabItem);//this：newlist
                    // $(this.container).mousedown(function(){this.grabItem});错误，this变成$(this.container),那个ul
                    $(this.container).bind('dragsort-uninit',this.uninit);
                    $(this.container).find(opts.dragSelector).css("cursor","pointer");
                },

                uninit: function() {
                    $(this.container).removeAttr('data-listidx');
                    $(this.container).mousedown(null);
                    $(this.container).unbind('dragsort-uninit');
                    $(this.container).find(opts.dragSelector).css("cursor","default");
                },

                getItems: function() {
                    return $(this.container).find(opts.itemSelector);
                },

                grabItem: function(e) {//this:ul
                    list = lists[$(this).attr("data-listidx")];
                    var dragHandle = e.target;                  
                    while(!$(dragHandle).is(opts.dragSelector)) return;
                    var _this = this;
                    list.dragStart.call(_this, e);//里面的this是ul
                    //list.dragStart();//里面的this是object:list
                    $(document).mousemove(function(event) {
                        list.swapItems();
                    });
                    $(document).mouseup(function(){
                        $(document).unbind("mousemove");
                        $(document).unbind("mouseup");
                        list.dropItem();
                    });
                    e.preventDefault();
                },

                dragStart: function(e) {
                    list = lists[$(this).attr("data-listidx")];      
                    e = e||event;
                    list.draggedItem = $(e.target).closest(opts.itemSelector);//li
                    var mt = parseInt(list.draggedItem.css("marginTop"));
                    var ml = parseInt(list.draggedItem.css("marginLeft"));
                    list.dragOffset = list.draggedItem.offset();
                    list.dragOffset.top = list.dragOffset.top - (isNaN(mt) ? 0 : mt) + 1;
                    list.dragOffset.left = list.dragOffset.left - (isNaN(ml) ? 0 : ml) + 1;
                    list.dragOffset.mouseY = e.pageY ;
                    list.dragOffset.mouseX = e.pageX ;
                    var orig = list.draggedItem.attr("style");
                    list.draggedItem.attr("origstyle", orig ? orig : "");
                    list.draggedItem.css({
                        "position":"absolute",
                        "left": list.dragOffset.left+"px",
                        "top": list.dragOffset.top+"px"
                    });
                    list.draggedItem.after(opts.placeHolderItem);//?
                    // if(list.draggedItem==null){
                    //     list.placeHolder = list.container.append(opts.placeHolderItem);
                    //     debug(1);
                    // }
                    list.placeHolder = list.draggedItem.next().css({
                        height: list.draggedItem.height(), 
                        width: list.draggedItem.width()
                    }).attr("placerholder",true);
                   
                    // debug(list.placeHolder);
                    // list.placeHolder.css({
                    //     height: list.draggedItem.height(), 
                    //     width: list.draggedItem.width()
                    // });
                    // list.placeHolder.attr("placerholder",true);
                    $(lists).each(function() { 
                        this.createDropTargets();
                        this.buildPositionTable(); 
                    });
                },

                //set position of draggedItem
                setPos: function(x, y) {
                    this.draggedItem.css({
                        left:x+"px",
                        top:y+"px"
                    });
                },              
                findPos: function(x, y) {
                    for (var i = 0; i < this.posList.length; i++) {
                        if (this.posList[i].left < x && this.posList[i].right > x && this.posList[i].top < y && this.posList[i].bottom > y)
                            return i;
                    }
                    return -1;
                },
                //build a table recording all the positions of the moveable list items
                buildPositionTable: function() {
                    var posList = [];
                    var _this = this;
                    var tmp = $('.placeHolder');
                    debug(this.getItems().not(tmp));
                    debug(1);
                    this.getItems().not(list.draggedItem[0]).not(tmp).each(function(i,ele){
                        var pos = $(this).offset();
                        pos.right = pos.left + $(this).outerWidth();
                        pos.bottom = pos.top + $(this).outerHeight();
                        posList.push(pos);
                    });
                    debug(2);
                    this.posList = posList;
                },

                dropItem: function() {  
                    list.placeHolder.after(list.draggedItem);
                    list.draggedItem.removeAttr('style');
                    var origstyle = list.draggedItem.attr("origstyle");
                    list.draggedItem.attr("style",origstyle);
                    list.placeHolder.remove(); 
                    $("[droptarget], .dragSortItem").remove();                      
                },

                swapItems: function(e) {
                    var lastPos = null,
                        nlist = list,//?
                        swapIndex = -1,
                        e = e||event;
                    if (list.dragOffset != null){
                        list.dragOffset.moveLeft = e.pageX - list.dragOffset.mouseX + list.dragOffset.left;
                        list.dragOffset.moveTop = e.pageY - list.dragOffset.mouseY + list.dragOffset.top ;
                        list.setPos(list.dragOffset.moveLeft,list.dragOffset.moveTop);
                    }
                   
                    swapIndex = list.findPos(e.pageX,e.pageY);
                    //遍历，只要swapIndex ！==-1 ，马上不找了。
                    for (var i = 0; swapIndex == -1 && opts.dragBetween && i < lists.length; i++){
                        swapIndex = lists[i].findPos(e.pageX, e.pageY);
                        nlist = lists[i];
                    }
                    //找了两个表，它还是等于-1，没救了
                    if(swapIndex == "-1") return false;
                    // $(this.getItems).eq(swapIndex).after(_this.placeHolder);
                    var target = $(nlist.container).find(opts.itemSelector).eq(swapIndex);
                    if(lastPos == null ||lastPos.left<target.left || lastPos.top<target.top){
                        target.before(list.placeHolder);
                    }
                    else{
                        target.after(list.placeHolder);
                    }
                    $(lists).each(function(i,l){
                        l.createDropTargets();
                        l.buildPositionTable();
                    });
                    lastPos = list.draggedItem.offset();              
                },
                createDropTargets: function() {
                    if (!opts.dragBetween)
                        return;
                    $(lists).each(function() {
                        var ph = $(this.container).find("[placeholder]");
                        var dt = $(this.container).find("[droptarget]");
                        if (ph.size() > 0 && dt.size() > 0)
                            dt.remove();//droptarget和placeholder不能共存
                        else if (ph.size() == 0 && dt.size() == 0) {
                            $(this.container).append(list.placeHolder.removeAttr("placeholder").clone().attr("droptarget", true));                            
                            list.placeHolder.attr("placeholder", true);
                        }
                    });
                }
            };

            newList.init();
            lists.push(newList);
        });

        return this;
    };
    $.fn.dragsort.defaults = {
        dragSelector: "",
        dragSelectorExclude: "input, textarea",
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