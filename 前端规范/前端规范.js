（一）命名

        1. 命名采用camel法进行命名：首字母小写，混合使用大小写字母来构成变量和函数的名字。如:
 
                           showTips=function(el,text,tipsType){}
 
        2. 为了更清晰的表明一个变量的属性，声明变量时可以添加前缀，如：
    
                            var oCard={}    //以“o”开头的变量oCard是一个card类
                            var sHtml={}    //以“s”开头的变量oHtml是一个string类型的变量                        
                            //以及 vCity ，数组类型的city，等等。
 
            如果是jquery对象的话，在声明变量的时候加入$符 ，如：
                            var $this=$(this);//获取当前的dom对象，为了减少dom操作将之赋值给临时变量
             只要是获取的jquery对象，都要加$符来标明它是jquery对象，一个原则是绝不使用同样的jquery选择器超过一次。
      
       3. 命名时采用英文，并采用简单易懂的原则，方便小组其他人员进行查看。
    
（二）编码

        1.整体架构

           为了使得结构清晰，易于查询修改，采用分类对象的方式，现将格式做一下定义，例子如下：
                        var oObject{  //此处为整个页面对象，可以以页面名字命名
                                  variable ：a，    //整个页面的全局变量，只能在本页内使用
                                  variable：’a‘， 
                                  variable：[]， 
                                 //功能函数1
                                  fn1：function(){}，
                                //功能函数2
                                  fn1：function(){ }，
                                //个人习惯，放一些页面的比较琐碎的操作
                                  operator：function(){}  ,
                                //对象中的对象，可以是整个功能模块
                                   oObjectSub :{
                                            fn:funciton(){},
                                            init:function(){
                                                    this.fn();
                                            }
                                    } 
                                //初始化方法,初始化所有的init方法
                                init：function(){
                                    this.fn1();
                                    this.fn2();
                                    this.operator();
                                    this.oObjectSub.init()
                                }
                         }
                    //在页面底端调用该页面的初始化方法即可，结构简明。
$(document).ready(function(){
    oObject.init();
})
       具体的例子可以参看洋葱名片中的minecard.js。
 
        2.编码细节

            （1）绑定事件的时候写成委托的形式，好处是当页面发生重绘时依然可以使用事件，因此采用最底层的on来绑定事件，为了减少绑定操作，尽量使用连字符，比如几个操作是在同一父元素下，则对该父元素进行绑定。如
        $('#element').on('click',funtion(){
                    //内容
         }).on('mouseenter','li',funciton(){
                    //内容
         })
          （2）编码过程中可以进行连写的要尽量连写，这样减少dom的访问，消除无用的查询，而且精简代码。如：
           $('#id1'）.find('li').css('background'，'#fff').end().find('.class1').removeClass('class2').end().hide().remove（）
            id为id1的元素下的li背景设置为白色并找到其下含有class1的元素，并移除这个元素的class2., 随后将id为id1的元素隐藏并将之移除dom。
 
           （3）尽量减少dom元素的操作。
         要尽可能少的操作dom元素，提取经常访问的变量是一个方面，比如很多造成重绘的操作：insert，appendTo等操作，都会进行浏览器重绘。遇到需要插入元素时。可先定义一个变量
               var  sHtml='<div><span class="xx"></span><a href="##"></a></div>';
               然后甚至需要插入元素的html：$('#id').html(sHtml); 
              要尽量避免在循环操作中访问jquery对象。
 
         （4） 异步提交时要防止重复点击
       当用户网速比较慢的时候，当用户向后台post数据后，要加入class，禁止用户重复提交，减少服务器压力。
          (5)    抽取常用的功能和方法，提高代码的复用。
 
        3.良好的注释代码习惯

        （1）页面开头，要添加注释，包括编写人，编写内容，编写时间等。如
                 
/**
* 页面描述
* @author xx(2012-09-21)
* @modifier xx2012-10-22)
* @modifier xx(2012-12)
* @version 2013-04-04(xx)
*/
       （2） 如果自己觉得同事可能看不懂变量的名称后面要加单行注释
       （3） 要对公共函数进行注释，其他的要加单行注释，对参数要加以解释，并简单提示用法如下：
           
    /**
     * 显示提示语
     * @param {object} el          [表单元素]
     * @param {string} text        [提示语]
     * @param {string} tipsType [提示方式]  ok_tip,error_tip;
     */
     showTips=function(el,text,tipsType){
         this.clearTips(el);
         if(text){
            var $tips = $('<span class="' + (tipsType||defaults.tipsType) + '"></span><span class="error_content">'+text+'</span>').insertAfter(el);            
         }else{
             var $tips = $('<span class="' + (tipsType||defaults.tipsType) + '"></span>').insertAfter(el);
         }
        return $tips;
     },
       （4）对别人的代码进行修改时要提前跟他沟通，并在相应修改位置添加修改记录:
                      // $('#id').css('color',#fff); //原有记录
                       $('#id').css('color',#000); //modified by 韩天 2013-11-13