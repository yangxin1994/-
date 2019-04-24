$(function () {
    var cityLength=$('.level-data-li').length;
    $('.level-data-list').css('width', $('.level-data-li').width()*cityLength+50*(cityLength-1)+100+'px');
     /* 仿滚动条 */
     $(".center-bottom").mCustomScrollbar({
        //scrollButtons:{ enable:true } ,
        axis: "x"           //"x","y",值为字符串，分别对应横纵向滚动
     });
    /* 外环的旋转*/
    var rollPanel1 = new RollPanel('#out-rotate-item-main');/*参数一：需要旋转的元素选择器 */
    /* 内环的旋转*/
    var rollPanel2 = new RollPanel('#in-rotate-item-main');/*参数一：需要旋转的元素选择器 */

    /* 左边曲线  */
    draw('canvas', 10);//draw(elementId,需要展示的曲线条数)
    /* 左边曲线上所有的光点的方法对象  */
    var lightLoopLeft = new LightLoop('#lignt-box', 10, "converage");//converage 往集中方向

    /* 右边曲线  */
    draw('canvas2', 9);
    /* 右边曲线上所有的光点的方法对象  */
    var lightLoopRight = new LightLoop('#lignt-box-right', 9, 'converage');

    var status = 'converage';
    $("body").on('click', '.data-collection', function () {
        $(this).siblings('.tab-li').removeClass('active');
        $(this).addClass('active');
        lightLoopLeft.setType('converage');
        lightLoopRight.setType('converage');
        $(".down-icon").removeClass('up-side-down');
            $(".up-icon").removeClass('up-side-down');
    })
    $("body").on('click', '.data-serve', function () {
        $(this).siblings('.tab-li').removeClass('active');
        $(this).addClass('active');
        lightLoopLeft.setType("spread");
        lightLoopRight.setType('spread');
        $(".down-icon").addClass('up-side-down');
        $(".up-icon").addClass('up-side-down');
    })

    //数据汇聚和数据服务的循环切换 使用setTimeout()模拟setInterval()，才能准确在间隔时间内执行方法
    var i = 0;
    var timer = setTimeout(function () {
        leftRightAlter();

        timer = setTimeout(arguments.callee, loopTime);
    }, loopTime)
    //当前的状态:数据汇聚对应的'converage'；数据服务对应的'service'；
    var status = 'converage';
    //统一循环控制集中和扩散的时间
    var loopTime = 30000;
    var animateTime = 29500;

    function leftRightAlter() {
        //数据汇聚和数据服务的方法
        if (parseInt(i % 2) === parseInt(0)) {
            //此处展示数据汇聚的内容

            //光点向右移动
            $('.rotate-radio').animate({ width: '100%' }, animateTime);
            $('.light').animate({ left: '100%' }, animateTime, function () {
                //状态转变到数据服务
                spreadTranslate()//整体向外扩散
                status = 'service';
            });
        } else if (parseInt(i % 2) === parseInt(1)) {
            //此处展示数据服务的内容

            //光点向左移动
            $('.rotate-radio').animate({ width: '0' }, animateTime);
            $('.light').animate({ left: '0' }, animateTime, function () {
                //状态转变到数据汇聚
                collectTranslate();  //整体向中心集中
                status = 'converage';
            });
        }
        i++;
    }

    //循环播放数据
    CenterValueLoop();//虚拟展示              

    //整体向中心集中
    function collectTranslate() {
        //console.log(1);
        if (status != 'converage') {
            $(".down-icon").removeClass('up-side-down');
            $(".up-icon").removeClass('up-side-down');
            lightLoopLeft.setType("converage");//converage 往集中方向
            lightLoopRight.setType('converage');
        }
    }

    //整体向外扩散
    function spreadTranslate() {
        if (status != 'service') {
            $(".down-icon").addClass('up-side-down');
            $(".up-icon").addClass('up-side-down');
            lightLoopLeft.setType("spread");//converage 往扩散方向
            lightLoopRight.setType('spread');
        }
    }

    // $("#left-point").hover(function() {
    //     // $(this).stop(true)
    //     $('.rotate-radio').stop(true).animate({ width: '0%' }, 500);     //如果在此时触发了光标的移出事件
    //     //                                           //直接跳过后面的动画队列
    //     $('.light').stop(true).animate({ left: '0' }, 500);
    //     clearTimeout(timer);
    // },function(){
    //     timer = setTimeout(function () {
    //         leftRightAlter();
    //         timer = setTimeout(arguments.callee, loopTime);
    //     }, loopTime)
    // }).trigger("mouseleave");

    // $("#right-point").hover(function() {
    //     $('.rotate-radio').stop(true).animate({ width: '100%' }, 500);//如果在此时触发了光标的移出事件
    //     $('.light').stop(true).animate({ left: '100%' }, 500);//直接跳过后面的动画队列
    // });
    // $("body").on('click', '#left-point', function () {
    //     clearTimeout(timer);
    //     //整体向中心集中
    //     status = 'converage';
    //     i=0;
    //     timer = setTimeout(function () {
    //         leftRightAlter();

    //         timer = setTimeout(arguments.callee, loopTime);
    //     }, loopTime)
    // })

    // $('body').on('click', '#right-point', function () {
    //     // //整体向外扩散
    //     status = 'service';
    //     i=1;
    // })
})

