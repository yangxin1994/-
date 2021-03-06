$(function () {
   
    //自动水平滚动和左右按钮的水平滚动
    autoScrollFun(".center-bottom",5);
    //tooltip的弹窗控制
    toggleTooltip();
   
    /* 外环的旋转*/
    var rollPanel1 = new RollPanel('#out-rotate-item-main');/*参数一：需要旋转的元素选择器 */
    /* 内环的旋转*/
    var rollPanel2 = new RollPanel('#in-rotate-item-main');/*参数一：需要旋转的元素选择器 */

    /* 左边曲线  */
    var leftData=[{type:'气象数据',status:'normal'},{type:'水文水利',status:'normal'},{type:'土地利用',status:'warn'},{type:'遥感数据',status:'normal'},{type:'工商数据',status:'normal'},{type:'税务数据',status:'normal'},{type:'规划',status:'normal'},{type:'能源',status:'normal'},{type:'农业',status:'normal'},{type:'农业',status:'normal'}];
    draw('canvas','.quadratic-curve-box-left', leftData);//draw(elementId,曲线组件/光点的最大容器,需要展示的曲线条数,数据状态数组)
    /* 左边曲线上所有的光点的方法对象  */
    var lightLoopLeft = new LightLoop('#lignt-box', leftData, "converage");//converage 往集中方向

    /* 右边曲线  */
    var rightData=[{type:'气象数据',status:'warn'},{type:'水文水利',status:'normal'},{type:'土地利用',status:'no-update'},{type:'遥感数据',status:'normal'},{type:'工商数据',status:'normal'},{type:'税务数据',status:'normal'},{type:'规划',status:'normal'},{type:'能源',status:'normal'},{type:'农业',status:'normal'}];
    draw('canvas2', '.quadratic-curve-box-right',rightData);
    /* 右边曲线上所有的光点的方法对象  */
    var lightLoopRight = new LightLoop('#lignt-box-right', rightData, 'converage');
   
    //数据汇聚和数据服务的循环切换 使用setTimeout()模拟setInterval()，才能准确在间隔时间内执行方法
    var i = 0;
    var timer = setTimeout(function () {
        leftRightAlter();
        timer = setTimeout(arguments.callee, loopTime);
    }, loopTime)
    //当前的状态:数据汇聚对应的'converage'；数据服务对应的'service'；
    var status = 'converage';
    //统一循环控制集中和扩散的时间
    var loopTime = 30000;//30000
    var leftRightTimer=null;
    var leftRightGapTime=loopTime/1584*17;
    leftRightTimer=setInterval(function(){
        arrowTran('converage');
    },leftRightGapTime); 


    function leftRightAlter() {
        //数据汇聚和数据服务的方法
        if (parseInt(i % 2) === parseInt(0)) {
            //此处展示数据汇聚的内容
            spreadTranslate() //整体样式向外扩散 
        } else if (parseInt(i % 2) === parseInt(1)) {
            //此处展示数据服务的内容
            collectTranslate(); //整体样式向外集中
        }
        i++;
    }

    //循环播放中间球体数据
    CenterValueLoop();//虚拟展示              

    //整体向中心集中
    function collectTranslate() {
        if (status != 'service') {
            status = 'service';
           
            clearInterval(leftRightTimer);
            //删除所有的箭头
            $('span').remove('.arrow-icon');
            $('.arrow-box').addClass('rotate');
            $('.arrow-mask').addClass('rotate');
            tranLeft=1580;
            leftRightTimer=setInterval(function(){
                //arrowTran('service');
                arrowTran();
            },leftRightGapTime);
            $(".down-icon").addClass('up-side-down');
            $(".up-icon").addClass('up-side-down');
            lightLoopLeft.setType("spread");//converage 往扩散方向
            lightLoopRight.setType('spread'); 
        }
       
    }

    //整体向外扩散
    function spreadTranslate() {
        if (status != 'converage') {
            status = 'converage'; 
            clearInterval(leftRightTimer);
            $('span').remove('.arrow-icon');
            //box对称旋转180度
            $('.arrow-box').removeClass('rotate');
            $('.arrow-mask').removeClass('rotate');
            tranLeft=-1580;
            leftRightTimer=setInterval(function(){
                //arrowTran('converage');
                arrowTran();
            },leftRightGapTime);  
            $(".down-icon").removeClass('up-side-down');
            $(".up-icon").removeClass('up-side-down');
            lightLoopLeft.setType("converage");//converage 往集中方向
            lightLoopRight.setType('converage'); 
        }
    }
    
   
})

 //点击按钮-- 数据汇聚
 $("body").on('click', '.data-collection', function () {
    $(this).siblings('.tab-li').removeClass('active');
    $(this).addClass('active');
    lightLoopLeft.setType('converage');
    lightLoopRight.setType('converage');
    $(".down-icon").removeClass('up-side-down');
    $(".up-icon").removeClass('up-side-down');
})

//点击按钮-- 数据服务
$("body").on('click', '.data-serve', function () {
    $(this).siblings('.tab-li').removeClass('active');
    $(this).addClass('active');
    lightLoopLeft.setType("spread");
    lightLoopRight.setType('spread');
    $(".down-icon").addClass('up-side-down');
    $(".up-icon").addClass('up-side-down');
})




//toggleTooltip
function toggleTooltip(){
    $(document).mouseup(function (e) {
		var _con = $('.tooltip '); // 设置目标区域 
		if (!_con.is(e.target) && _con.has(e.target).length === 0) {
			// Mark 1 some code... // 功能代码
			$('.tooltip').removeClass('show');
		}
    });
    
    //点击光点icon
    $("body").on('click', '.lignt-box-left .line-icon.warn', function () {
        var type=  $(this).attr('data-type');
        $('.tooltip').removeClass('right-tooltip');
        $('.tooltip').addClass('left-tooltip');
        $('.tooltip').addClass('show');
    })

     //点击光点icon
     $("body").on('click', '.lignt-box-right .line-icon.warn', function () {
        var type=  $(this).attr('data-type');
        $('.tooltip').removeClass('left-tooltip');
        $('.tooltip').addClass('right-tooltip');
        $('.tooltip').addClass('show');
    })
}

/**
 * 水平移动的基本方法  
 * @param {string} type  converage 或service
 */
var tranLeft=-1580;
function arrowTran(type) {
    $('.arrow-box').append('<span class="arrow-icon"></span>');
    if(type==='converage'){
        tranLeft+=17;
        $('.arrow-mask').css('left',tranLeft+'px');
    }else{
        tranLeft-=17;
        $('.arrow-mask').css('left',tranLeft-17+'px');
    } 
   
}

