// JavaScript Document
var lineForm = function(initData){
	this.target=$(initData.target);
	this.w=initData.w;
	this.h=initData.h;
	this.xoffset=60;
	this.title=initData.title;
	this.color=initData.color;
	this.id="lineFrom_"+(new Date().getTime());
	this.init();
	}
lineForm.prototype.init=function(){
	var that=this;
	if($("#"+that.id).length){
		$("#"+that.id).empty();
		}else{
			that.target.append('<div id="'+that.id+'" class="lineForm_frame"></div>');
		}
	$("#"+that.id).css({
		width:that.w,
		height:that.h
	});
	$("#"+that.id).append('<div class="lineForm_title">'+that.title+'</div>'+
	'<div class="lineForm_shortLine" style="color:'+that.color+'"></div>'+
	'<div class="lineForm_round" style="color:'+that.color+'"></div>'+
	'<div class="lineForm_shortLine" style="color:'+that.color+'"></div>'+
	'<div class="clear"></div>'+
	'<canvas class="lineForm_draw" width="'+(that.w-20)+'" height="'+(that.h-32)+'"></canvas>');
	that.canvas = that.target.find(".lineForm_draw")[0];
	that.stage = new createjs.Stage(that.canvas);
}
lineForm.prototype.set=function(setData){
	var that=this;
	that.stage.removeAllChildren();
	/*竖线*/
    var redLine = new createjs.Shape();
        redLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("#000");
        redLine.graphics.moveTo(that.xoffset,20);
        redLine.graphics.lineTo(that.xoffset,that.h-60);
        redLine.name = "redLine";
        that.stage.addChild(redLine);
     /*横线*/
    var redLine2 = new createjs.Shape();
        redLine2.graphics.setStrokeStyle(1, "round", "round").beginStroke("#000");
        redLine2.graphics.moveTo(that.xoffset,that.h-60);
        redLine2.graphics.lineTo(that.w-20-that.xoffset,that.h-60);
        redLine2.name = "redLine2";
        that.stage.addChild(redLine2);
    var ymax=setData.max;
    var ymin=setData.min;
    var vmax=0;
    var vmin=0;
    	var dataArry=_.sortBy(setData.data,function(point){
    		return moment(point.time,"YYYY-MM-DD hh:mm").format('x');
    	});
    var xmax=moment(_.last(dataArry).time,"YYYY-MM-DD hh:mm").format('x');
    var xmin=moment(dataArry[0].time,"YYYY-MM-DD hh:mm").format('x');
    var preX=(that.w-20-that.xoffset-that.xoffset)/(xmax-xmin);
    	/*x轴*/
    	$.each(dataArry,function(i,n){
    		if(n.value>ymax){
    			ymax=n.value;
    		}
    		if(n.value<ymin){
    			ymin=n.value;
    		}
    		if(!vmax){
    			vmax=n.value
    		}else if(n.value>vmax){
    			vmax=n.value
    		}
    		if(!vmin){
    			vmin=n.value
    		}else if(n.value<vmin){
    			vmin=n.value
    		}
    		var iwidth=(moment(n.time,"YYYY-MM-DD hh:mm").format('x')-xmin)*preX;
    		var xshortline = new createjs.Shape();
	        xshortline.graphics.setStrokeStyle(1, "round", "round").beginStroke("#000");
	        xshortline.graphics.moveTo(that.xoffset+iwidth,that.h-60);
	        xshortline.graphics.lineTo(that.xoffset+iwidth,that.h-50);
	        xshortline.name = "xshortline"+n.time;
	        that.stage.addChild(xshortline);
	        var xText =  new createjs.Text(n.time,"10px Arial","#000");
            xText.textAlign = "center";
            xText.y = that.h-50 ;
            xText.x = that.xoffset+iwidth;
            that.stage.addChild(xText);
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
    	preY=(that.h-80)/(ymax-ymin);
    	for (var i=ymin;i<=ymax;i+=step){
    		var iheight=(i-ymin)*preY;
    		var preLine = new createjs.Shape();
        preLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("#ddd");
        preLine.graphics.moveTo(that.xoffset,that.h-60-iheight);
        preLine.graphics.lineTo(that.w-20-that.xoffset,that.h-60-iheight);
        preLine.name = "preLine"+i;
        that.stage.addChild(preLine);
        var yText =  new createjs.Text(i,"10px Arial","#000");
            yText.textAlign = "right";
            yText.y = that.h-60-iheight-5 ;
            yText.x = that.xoffset-10;
        that.stage.addChild(yText);
        var yshortline = new createjs.Shape();
        yshortline.graphics.setStrokeStyle(1, "round", "round").beginStroke("#000");
        yshortline.graphics.moveTo(that.xoffset-10,that.h-60-iheight);
        yshortline.graphics.lineTo(that.xoffset,that.h-60-iheight);
        yshortline.name = "yshortline"+i;
        that.stage.addChild(yshortline);
    	}
    	/*绿线*/
    	var minheight=(setData.min-ymin)*preY;
    		var minLine = new createjs.Shape();
    	minLine.graphics.setStrokeDash([7,3]);
        minLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("green");
        minLine.graphics.moveTo(that.xoffset,that.h-60-minheight);
       	minLine.graphics.lineTo(that.w-20-that.xoffset,that.h-60-minheight);
        minLine.name = "minLine";
        that.stage.addChild(minLine);
        var maxheight=(setData.max-ymin)*preY;
    		var maxLine = new createjs.Shape();
    	maxLine.graphics.setStrokeDash([7,3]);
        maxLine.graphics.setStrokeStyle(1, "round", "round").beginStroke("green");
        maxLine.graphics.moveTo(that.xoffset,that.h-60-maxheight);
       	maxLine.graphics.lineTo(that.w-20-that.xoffset,that.h-60-maxheight);
        maxLine.name = "maxLine";
        that.stage.addChild(maxLine);
        /*红线*/
        var minColor="blue";
        if(vmin<setData.min){
        	minColor="red";
        }
        var minDataheight=(vmin-ymin)*preY;
    		var minDataLine = new createjs.Shape();
    	minDataLine.graphics.setStrokeDash([7,3]);
        minDataLine.graphics.setStrokeStyle(1, "round", "round").beginStroke(minColor);
        minDataLine.graphics.moveTo(that.xoffset,that.h-60-minDataheight);
       	minDataLine.graphics.lineTo(that.w-20-that.xoffset,that.h-60-minDataheight);
        minDataLine.name = "minDataLine";
        that.stage.addChild(minDataLine);
        var maxColor="blue";
        if(vmax>setData.max){
        	maxColor="red";
        }
        var maxDataheight=(vmax-ymin)*preY;
    		var maxDataLine = new createjs.Shape();
    	maxDataLine.graphics.setStrokeDash([7,3]);
        maxDataLine.graphics.setStrokeStyle(1, "round", "round").beginStroke(maxColor);
        maxDataLine.graphics.moveTo(that.xoffset,that.h-60-maxDataheight);
       	maxDataLine.graphics.lineTo(that.w-20-that.xoffset,that.h-60-maxDataheight);
        maxDataLine.name = "maxDataLine";
        that.stage.addChild(maxDataLine);

    	var dataline = new createjs.Shape();
        dataline.graphics.setStrokeStyle(1, "round", "round").beginStroke(that.color);
        dataline.name = "dataline";
        
    	$.each(dataArry,function(i,n){
    		var iheight=(n.value-ymin)*preY;
    		var iwidth=(moment(n.time,"YYYY-MM-DD hh:mm").format('x')-xmin)*preX;
    		var point = new createjs.Shape();
		var g = point.graphics;

		//Head
		g.setStrokeStyle(1, 'round', 'round');
		g.beginStroke(that.color);
		g.drawCircle(that.xoffset+iwidth, that.h-60-iheight, 10);
		        that.stage.addChild(point);
		if(!i){dataline.graphics.moveTo(that.xoffset+iwidth,that.h-60-iheight);}else{
			dataline.graphics.lineTo(that.xoffset+iwidth,that.h-60-iheight);
		}
    	})
    	that.stage.addChild(dataline);
    	/*横轴*/
		that.stage.update();
	}