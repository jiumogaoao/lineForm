// JavaScript Document
var lineForm = function(initData){
	this.target=$(initData.target);
	this.w=initData.w;
	this.h=initData.h;
    this.bottom=this.h-100;
	this.xoffset=60;
	this.subTitle=initData.subTitle;
	this.title=initData.title;
	this.color=initData.color;
	this.id="lineFrom_"+(new Date().getTime());
	this.unitName=initData.unitName;
	this.init();
	this.callback=function(){};
	}
lineForm.prototype.init=function(){
	var that=this;
	if($("#"+that.id).length){
		$("#"+that.id).empty();
		}else{
			that.target.append('<div id="'+that.id+'" class="lineForm_frame" style="width:'+that.w+'px;height:'+(that.h+10)+'px"></div>');
		}
	$("#"+that.id).append('<div class="lineForm_title">'+that.title+'('+that.unitName+')</div>'+
	'<div class="lineForm_rightFrame">'+
	'<div class="clear"></div>'+
	'</div>'+
	'<div class="clear"></div>'+
	'<canvas class="lineForm_draw"></canvas>');
	that.target.find("#"+that.id+" .lineForm_draw")[0].width=that.w-20;
	that.target.find("#"+that.id+" .lineForm_draw")[0].height=that.h-35;
	that.canvas = that.target.find("#"+that.id+" .lineForm_draw")[0];
	that.stage = new createjs.Stage(that.canvas);
	function handleClick(e){
		that.callback((e.stageX-that.xoffset)/that.preX+that.xmin);
		}
    that.select=function(time){
        if(!time){
            that.resultLine.x=that.xoffset;
        }else{
            that.resultLine.x=that.xoffset+(Number(moment(time,"YYYY-MM-DD HH:mm").format("x"))-that.xmin)*that.preX;
        }
        that.stage.update();
    }
	that.stage.addEventListener("click", handleClick, true)
}
lineForm.prototype.set=function(setData){
	var that=this;
	that.stage.removeAllChildren();
	var bg=new createjs.Shape();
	bg.graphics.beginFill("#fff").drawRect(0, 0, that.w-20, that.h-32);
	that.stage.addChild(bg);
	/*竖线*/
    var redLine = new createjs.Shape();
        redLine.graphics.setStrokeStyle(2, "round", "round").beginStroke("#000");
        redLine.graphics.moveTo(that.xoffset,20);
        redLine.graphics.lineTo(that.xoffset,that.bottom);
        redLine.graphics.endStroke();
        redLine.name = "redLine";
        that.stage.addChild(redLine);
    that.resultLine = new createjs.Shape();
    that.resultLine.graphics.setStrokeDash([6,4]);
    that.resultLine.graphics.setStrokeStyle(2, "round", "round").beginStroke("#000");
    that.resultLine.graphics.moveTo(0,0);
    that.resultLine.graphics.lineTo(0,that.bottom-20);
    that.resultLine.graphics.endStroke();
    that.resultLine.name = "resultLineLine";
    that.resultLine.x=that.xoffset;
    that.resultLine.y=20;
        that.stage.addChild(that.resultLine);
     /*横线*/
    var redLine2 = new createjs.Shape();
        redLine2.graphics.setStrokeStyle(2, "round", "round").beginStroke("#000");
        redLine2.graphics.moveTo(that.xoffset,that.bottom);
        redLine2.graphics.lineTo(that.w-20-that.xoffset,that.bottom);
        redLine2.graphics.endStroke();
        redLine2.name = "redLine2";
        that.stage.addChild(redLine2);
    var ymax=setData.max;
    var ymin=setData.min;
    var vmax=0;
    var vmin=0;
    	var dataArry=_.sortBy(setData.data,function(point){
    		return Number(moment(point.time,"YYYY-MM-DD HH:mm").format('x'));
    	});
    var xmax=Number(moment(_.last(dataArry).time,"YYYY-MM-DD HH:mm").format('x'));
    that.xmin=Number(moment(dataArry[0].time,"YYYY-MM-DD HH:mm").format('x'));
    that.preX=(that.w-20-that.xoffset-that.xoffset)/(xmax-that.xmin);
    	/*x轴*/
    	$.each(dataArry,function(i,n){
    		if(n.value>ymax){
    			ymax=n.value;
    		}
    		if(n.value<ymin){
    			ymin=n.value;
    		}
    		if(!vmax){
    			vmax=n
    		}else if(n.value>vmax.value){
    			vmax=n
    		}
    		if(!vmin){
    			vmin=n
    		}else if(n.value<vmin.value){
    			vmin=n
    		}
    		var iwidth=(Number(moment(n.time,"YYYY-MM-DD HH:mm").format('x'))-that.xmin)*that.preX;
            if(i==0||i==dataArry.length-1){
              var xshortline = new createjs.Shape();
            xshortline.graphics.setStrokeStyle(1, "round", "round").beginStroke("#000");
            xshortline.graphics.moveTo(that.xoffset+iwidth,that.bottom);
            xshortline.graphics.lineTo(that.xoffset+iwidth,that.bottom+10);
            xshortline.graphics.endStroke();
            xshortline.name = "xshortline"+n.time;
            that.stage.addChild(xshortline);
            var xText =  new createjs.Text(n.time.replace(" ","\n"),"22px Arial","#000");
            xText.textAlign = "center";
            xText.y = that.bottom+10 ;
            xText.x = that.xoffset+iwidth;
            that.stage.addChild(xText);  
            }
    	});
    	/*y轴*/
    	var totalY=ymax-ymin;
    	var step=0;
    	if(totalY<=10){
    		step=1;
    	}else if(totalY<=100){
    		step=10;
    	}else if(totalY<=1000){
    		step=100;
    	}else if(totalY<=10000){
    		step=1000;
    	}else{
    		step=10000;
    	}
    	ymax=step-(ymax%step)+ymax;
    	ymin=ymin-(ymin%step);
    	preY=(that.bottom-20)/(ymax-ymin);
    	for (var i=ymin;i<=ymax;i+=step){
    		var iheight=(i-ymin)*preY;
    	}
    	/*绿线*/
    	var minheight=(setData.min-ymin)*preY;
    		var minLine = new createjs.Shape();
    	minLine.graphics.setStrokeDash([7,3]);
        minLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("green");
        minLine.graphics.moveTo(that.xoffset,that.bottom-minheight);
       	minLine.graphics.lineTo(that.w-20-that.xoffset,that.bottom-minheight);
       	minLine.graphics.endStroke();
        minLine.name = "minLine";
        that.stage.addChild(minLine);
        var minDeg = new createjs.Shape();
		minDeg.graphics.beginFill("green");
		minDeg.graphics.moveTo(0,0);
		minDeg.graphics.lineTo(15,5);
		minDeg.graphics.lineTo(0,10);
		minDeg.graphics.lineTo(4,5);
		minDeg.graphics.lineTo(0,0);
		minDeg.graphics.endStroke();
		minDeg.x=that.w-20-that.xoffset-15;
		minDeg.y=that.bottom-minheight-5;
		that.stage.addChild(minDeg);
        var minSafeText =  new createjs.Text(setData.min,"20px Arial","green");
            minSafeText.textAlign = "right";
            minSafeText.y = that.bottom-minheight-10;
            minSafeText.x = that.xoffset-10;
        that.stage.addChild(minSafeText);
        var maxheight=(setData.max-ymin)*preY;
    		var maxLine = new createjs.Shape();
    	maxLine.graphics.setStrokeDash([7,3]);
        maxLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("green");
        maxLine.graphics.moveTo(that.xoffset,that.bottom-maxheight);
       	maxLine.graphics.lineTo(that.w-20-that.xoffset,that.bottom-maxheight);
       	maxLine.graphics.endStroke();
        maxLine.name = "maxLine";
        that.stage.addChild(maxLine);
        var maxDeg = new createjs.Shape();
		maxDeg.graphics.beginFill("green");
		maxDeg.graphics.moveTo(0,0);
		maxDeg.graphics.lineTo(15,5);
		maxDeg.graphics.lineTo(0,10);
		maxDeg.graphics.lineTo(4,5);
		maxDeg.graphics.lineTo(0,0);
		maxDeg.graphics.endStroke();
		maxDeg.x=that.w-20-that.xoffset-15;
		maxDeg.y=that.bottom-maxheight-5;
		that.stage.addChild(maxDeg);
        var maxSafeText =  new createjs.Text(setData.max,"20px Arial","green");
            maxSafeText.textAlign = "right";
            maxSafeText.y = that.bottom-maxheight-10;
            maxSafeText.x = that.xoffset-10;
        that.stage.addChild(maxSafeText);
		/*最大值*/
		var maxDataheight=(vmax.value-ymin)*preY;
		var maxwidth=(Number(moment(vmax.time,"YYYY-MM-DD HH:mm").format('x'))-that.xmin)*that.preX;
		var maxDataLine = new createjs.Shape();
		maxDataLine.graphics.beginFill(that.color);
		maxDataLine.graphics.moveTo(0,0).curveTo(20, -30, 40, 0);
		maxDataLine.graphics.lineTo(40, 10);
		maxDataLine.graphics.curveTo(20, 60, 0, 10);
		maxDataLine.graphics.lineTo(0, 10);
		maxDataLine.x=that.xoffset+maxwidth-20;
		maxDataLine.y=that.bottom-maxDataheight-45;
		that.stage.addChild(maxDataLine);
		var maxText =  new createjs.Text(vmax.value,"20px Arial","#fff");
            maxText.textAlign = "center";
            maxText.y = that.bottom-maxDataheight-47;
            maxText.x = that.xoffset+maxwidth;
        that.stage.addChild(maxText);
		/*最小值*/
		var minDataheight=(vmin.value-ymin)*preY;
		var minwidth=(Number(moment(vmin.time,"YYYY-MM-DD HH:mm").format('x'))-that.xmin)*that.preX;
		var minDataLine = new createjs.Shape();
		minDataLine.graphics.beginFill(that.color);
		minDataLine.graphics.moveTo(0,0).curveTo(20, -30, 40, 0);
        minDataLine.graphics.lineTo(40, 10);
        minDataLine.graphics.curveTo(20, 60, 0, 10);
        minDataLine.graphics.lineTo(0, 10);
        minDataLine.rotation=180;
		minDataLine.x=that.xoffset+minwidth+20;
		minDataLine.y=that.bottom-minDataheight+44;
		that.stage.addChild(minDataLine);
		var minText =  new createjs.Text(vmin.value,"20px Arial","#fff");
            minText.textAlign = "center";
            minText.y = that.bottom-minDataheight+28;
            minText.x = that.xoffset+minwidth-1;
        that.stage.addChild(minText);

    	var dataline = new createjs.Shape();
        dataline.graphics.setStrokeStyle(1, "round", "round").beginStroke(that.color);
        dataline.name = "dataline";
        
    	$.each(dataArry,function(i,n){
    		var iheight=(n.value-ymin)*preY;
    		var iwidth=(Number(moment(n.time,"YYYY-MM-DD HH:mm").format('x'))-that.xmin)*that.preX;
    		var point = new createjs.Shape();
		var g = point.graphics;

		//Head
		g.setStrokeStyle(2, 'round', 'round');
		g.beginStroke(that.color);
		g.drawCircle(that.xoffset+iwidth, that.bottom-iheight, 10);
		        that.stage.addChild(point);
		if(!i){dataline.graphics.moveTo(that.xoffset+iwidth,that.bottom-iheight);}else{
			dataline.graphics.lineTo(that.xoffset+iwidth,that.bottom-iheight);
		}
    	})
    	that.stage.addChild(dataline);
    	/*横轴*/
		that.stage.update();
	}