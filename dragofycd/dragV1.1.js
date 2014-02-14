(function($){

	$.fn.dragsort = function(options){
		// debug(options);
		var debug = function(str){
			isOpendebug = true;
			if (isOpendebug) {
				console.log(str);
			};
		}

		if (options == 'destory') {
			$(this.selector).trigger('dragsort-uninit');
			return;
		};

		var opts = $.extend({},$.fn.dragsort.defaults,options);
		var lists = []; //大的container
		var list = null, lastPos = null;//上一个时刻的位置

		this.each(function(i,cont){//cont为容器
			var newList = {
				draggedItem: null,
				placeHolderItem: null,
				pos: null, //保存每个元素现在的位置
				offset: null, //鼠标在拖动元素上的offset
				offfsetLimit: null, //可拖动区域边界
				container: cont,

				init: function(){
					var tagName = $(this.container).children().size() == 0 ? "li" : $(this.container).children(":first").get(0).tagName.toLowerCase();
					if (opts.itemSelector == "") {
						opts.itemSelector = tagName;
					}
					if (opts.dragSelector == '') {
						opts.dragSelector = tagName;
					}
					if (opts.placeHolderTemplate == ""){
						opts.placeHolderTemplate = "<" + tagName + ">&nbsp;</" + tagName + ">";
					}
					//给容器绑定事件
					$(this.container).attr('data-listidx',i).mousedown(this.grabItem).bind('dragsort-uninit', this.uninit);
					this.styleDragHandlers(true);
				},

				uninit: function(){
					var curIndex = $(this).attr('data-listidx');
					var list = lists[curIndex];
					$(list).unbind('mousedown',list.grabItem).unbind('dragsort-uninit');
					list.styleDragHandlers(false);
				},

				getItems: function(){
					//获得可以拖拽的子部件
					return $(this.container).children(opts.itemSelector);
				},
				//设置可拖动区域的鼠标样式
				styleDragHandlers: function(cursor){
					this.getItems().map(function(){
						return $(this).is(opts.dragSelector) ? this : $(this).find(opts.dragSelector).get();
					}).css('cursor',cursor ? 'pointer' : '');
				},
				//mousedown的回调函数
				grabItem: function(e){
					debug('grabItem')
					//非左键单击,单击非可选区域,非可移动元素,则返回
					if (e.which != 1 || $(e.target).is(opts.dragSelectorExclude) || $(e.target).closest(opts.dragSelectorExclude).size() > 0 || $(e.target).closest(opts.itemSelector).size() == 0){
						return;
					}

					e.preventDefault();

					//改变cursor
					var dragHander = e.target;
					while(!$(dragHander).is(opts.dragSelector)){
						if (dragHander == this) return ;
						dragHander = dragHander.parentNode;
					}
					//保存拖动之前的cursor
					$(dragHander).attr('data-cursor',$(dragHander).css('cursor'));
					$(dragHander).css('cursor','move');

					var list = lists[$(this).attr('data-listidx')];
					var item = this;
					var trigger = function(){
						list.dragStart.call(item, e);
						//执行完一次需要解绑mousemove,防止多次绑定
						$(list.container).unbind('mousemove',trigger);
					}
					$(list.container).mousemove(trigger).mouseup(function(){
						$(list.container).unbind('mousemove',trigger);
						$(dragHander).css('cursor',$(dragHander).attr('data-cursor'));
					});


				},

				dragStart: function(e){
					debug('dragStart')
					if (list != null && list.draggedItem != null) {
						list.dropItem();
					}

					list = lists[$(this).attr('data-listidx')];
					list.draggedItem = $(e.target).closest(opts.itemSelector);
					list.draggedItem.attr('data-origpos', $(this).attr('data-listidx') + '-' + list.getItems().index(list.draggedItem));

					//计算鼠标相对于draggedItem上的offset
					var mt = parseInt(list.draggedItem.css('marginTop'));
					var ml = parseInt(list.draggedItem.css('marginLeft'));
					list.offset = list.draggedItem.offset();
					list.offset.top = e.pageY - list.offset.top + (isNaN(mt) ? 0 : mt) - 1;
					list.offset.left = e.pageX - list.offset.left + (isNaN(ml) ? 0 : ml) - 1;

					//限制拖动区域
					if(!opts.dragBetween){
						var containerHeight = 0;
						if ($(list.container).outerHeight() == 0) {
							//如果没有设置container高度，则动态按照draggedItem和containner的宽度比例计算
							containerHeight = Math.max(1, Math.round(0.5 + list.getItems().size() * list.draggedItem.outerWidth() / $(list.container).outerWidth())) * list.draggedItem.outerHeight();
						}else{
							containerHeight = $(list.container).outerHeight();
						}
						list.offfsetLimit = $(list.container).offset();
						list.offfsetLimit.right = list.offfsetLimit.left + $(list.container).outerWidth() - list.draggedItem.outerWidth();
						list.offfsetLimit.bottom = list.offfsetLimit.top + containerHeight - list.draggedItem.outerHeight();
					}

					var h = list.draggedItem.height();
					var w = list.draggedItem.width();
					list.draggedItem.after(opts.placeHolderTemplate);
					list.placeHolderItem = list.draggedItem.next().css({height:h,width:w}).attr('data-placeholder',true);

					var origStyle = list.draggedItem.attr('style');
					list.draggedItem.attr('data-origstyle', origStyle ? origStyle : '');
					list.draggedItem.css({position:'absolute',opacity: 0.8, 'z-index':9999, height:h,width:w });

					$(lists).each(function(i,l){
						l.createDropTagets();
						l.buildPositionTable();
					});
					list.setPos(e,e.pageX, e.pageY);
					$(document).bind('mousemove',list.swapItems);
					$(document).bind('mouseup',list.dropItem);
				},

				setPos: function(e,x,y){
					//的到container内部的相对offset
					var top = y - this.offset.top;
					var left = x - this.offset.left;

					if(!opts.dragBetween){
						top = Math.min(this.offfsetLimit.bottom,Math.max(top, this.offfsetLimit.top));
						left = Math.min(this.offfsetLimit.right, Math.max(left, this.offfsetLimit.left));
					}

					//将top和left调整为将对于container,而不是window
					this.draggedItem.parents().each(function(){
						if($(this).css('position') != 'static' && (!$.browser.mozilla || $(this).css('display') != 'table')){
							var offset = $(this).offset();
							top -= offset.top;
							left -= offset.left;
							return false;
						}
					});

					this.draggedItem.css({top:top,left:left});
					
					//拖动时的回调函数
					var phlist = null;
					$(lists).each(function(i,elem){
						var ph = $(this.container).find('[data-placeholder]');
						if (ph.size() > 0 ) {
							phlist = elem;
							return;
						};
					});
					opts.onDragging(e,this.draggedItem,{top:top,left:left},list.container,phlist.container);
				},

				buildPositionTable: function(){
					var pos = [];
					this.getItems().not([list.draggedItem[0],list.placeHolderItem[0]]).each(function(i){
						var loc = $(this).offset();
						loc.right = loc.left + $(this).outerWidth();
						loc.bottom = loc.top + $(this).outerHeight();
						loc.elem = this;
						pos[i] = loc;
					});
					this.pos = pos;
				},

				swapItems: function(e){
					if (list.draggedItem == null) return false;
					// debug(list.draggedItem.offset())
					list.setPos(e,e.pageX, e.pageY);
					var ei = list.findPos(e.pageX, e.pageY);
					var nlist = list;
					//如果在第一个container没找到，并且具有多个container的情况下
					for (var i = 0; ei == -1 && opts.dragBetween && i < lists.length; i++) {
						ei = lists[i].findPos(e.pageX, e.pageY);
	  					nlist = lists[i];
					}

					if (ei == -1) return false;

					var children = function(){
						return $(nlist).children().not(nlist.draggedItem);
					};
					var fixed = children().not(opts.itemSelector).each(function(i){
						this.idx = children().index(this);
					});

					//交换目标elem和placehoder的位置
					//若draggedItem在lastPos左上角，则before
					if (lastPos == null || lastPos.top > list.draggedItem.offset().top || lastPos.left > list.draggedItem.offset().left) {
						$(nlist.pos[ei].elem).after(list.placeHolderItem);
					}else{
						$(nlist.pos[ei].elem).before(list.placeHolderItem);
					}

					//交换其它元素的位置
					fixed.each(function(){
						var elem = children().eq(this.idx).get(0);
						if (this != elem && children().index(this) < this.idx) {
							$(this).insertAfter(elem);
						}else{
							$(this).insertBefore(elem);
						}
					});

					$(lists).each(function(i,l){
						l.createDropTagets();
						l.buildPositionTable();
					});
					lastPos = list.draggedItem.offset();
					// debug(lastPos);
					return false;
				},

				findPos: function(x,y){
					for(var i=0; i<this.pos.length; i++){
						if (this.pos[i].left < x && this.pos[i].right > x
							&& this.pos[i].top < y && this.pos[i].bottom > y) {
							return i;
						}
					}
					return -1;
				},
				//当联动拖动的时候，在另一个container里面创建droptarget
				createDropTagets: function(){
					if (!opts.draggedItem) return;
					$(lists).each(function(){
						var placeholder = $(this.container).find('[data-placeholder]');
						var droptarget = $(this.container).find('[data-droptarget');
						if (placeholder.size() > 0 && droptarget.size() >0) {
							droptarget.remove();
						}else if(placeholder.size() == 0 && droptarget.size() == 0){
							var dt = list.placeHolderItem.removeAttr('data-placeholder').clone();
							dt.attr('data-droptarget');
							$(this.container).append(dt);

							list.placeHolderItem.attr('data-placeholder',true);
						}
					});
				},

				dropItem: function(){
					if (list.draggedItem == null) return;
					var origStyle = list.draggedItem.attr('data-origstyle');
					var ptop = list.placeHolderItem.offset().top;
					var pleft = list.placeHolderItem.offset().left;
				
					//mouseup的缓冲运动
					$(list.draggedItem).animate({left:pleft,top:ptop},'fast',function(){
						list.draggedItem.attr('style',origStyle);
						if (origStyle == '') {
							list.draggedItem.removeAttr('style');
						}
						list.draggedItem.removeAttr('data-origstyle');
						list.styleDragHandlers(true);
						//将draggedItem插入到placeHolderItem前面
						list.placeHolderItem.before(list.draggedItem);
						list.placeHolderItem.remove();

						$('[data-droptarget], .dragSortItem').remove();
						var curContainerId = $(lists).index(list);
						var curItemId = list.getItems().index(list.draggedItem);

						//调用回调函数
						if (list.draggedItem.attr('data-origpos') != curContainerId+'-'+curItemId) {
							opts.onDragEnd(list.draggedItem, list.container);
						}
						list.draggedItem.removeAttr('data-origpos');
						list.draggedItem = null;
						$(document).unbind('mousemove', list.swapItems);
						$(document).unbind('mouseup', list.dropItem);
					});
					
					return false;
				}

			}//end of newList


			newList.init();
			lists.push(newList);
		});

		return this;//返回jquery对象
	}

	$.fn.dragsort.defaults = {
		itemSelector: "",
		dragSelector: "",
		dragSelectorExclude: "input, textarea",
		/**
		 *elem正在拖动的元素
		 *container为dragElem属于的容器
		 */
		onDragEnd: function(elem, container) { },
		/**
		 *event为事件，elem正在拖动的元素
		 *offset为相对container的位置
		 *sourceContainer为dragElem属于的容器
		 *targetContainer为placeHolder属于的容器
		 */
		onDragging: function(event, elem, offset, sourceContainer,targetlistContainer) { },
		dragBetween: false,
		placeHolderTemplate: "",
	};

})(jQuery)