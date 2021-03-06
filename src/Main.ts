//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class BG extends egret.DisplayObjectContainer {

    private _touchStatus:boolean = false;              
    private _distance:egret.Point = new egret.Point(); 
    private stageW=640;
    private ox=this.x;

    public mouseDown(evt:egret.TouchEvent) {
             this._touchStatus = true;
             this._distance.x = evt.stageX - this.x;
             this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
             this.ox=this.x;
    }

    private mouseMove(evt:egret.TouchEvent) {
            if( this._touchStatus ) {
                 this.x = evt.stageX - this._distance.x;            
            }    
            if( this.ox-this.x < -this.stageW/3 ){
                     egret.Tween.get( this ).to( {x:this.stageW,y:0}, 400, egret.Ease.sineIn )
                     .call( ()=>{ this.parent.addChildAt(this,0);} ).to({x:0,y:0}, 100, egret.Ease.sineIn);
                     this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
                 }
  
                 if( this.ox-this.x >this.stageW/3 ){
                     egret.Tween.get( this ).to( {x:-this.stageW,y:0}, 400, egret.Ease.sineIn )
                     .call( ()=>{ this.parent.addChildAt(this,0);} ).to({x:0,y:0}, 100, egret.Ease.sineIn);           
                     this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
                 }
          
    }

    public mouseUp(evt:egret.TouchEvent) {
            this._touchStatus = false;         
            if(this.x>=-this.stageW/3&&this.x<0) {
                egret.Tween.get( this ).to( {x:0,y:0}, 200, egret.Ease.sineIn )
                 .to( {x:-25,y:0}, 100, egret.Ease.sineIn ).to( {x:0,y:0}, 100, egret.Ease.sineIn );     
            }
            if(this.x<=this.stageW/3&&this.x>0){
                egret.Tween.get( this ).to( {x:0,y:0}, 200, egret.Ease.sineIn )
                 .to( {x:25,y:0}, 100, egret.Ease.sineIn ).to( {x:0,y:0}, 100, egret.Ease.sineIn );
            }

            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    }
}


class Music extends egret.DisplayObjectContainer {
    private _touchStatus:boolean = false;   
    private _pauseTime: number = 0;           
    private stageW=640;
    private xuanzhuan:number=0;
    private _sound: egret.Sound;
    public _nScaleBase=0;
    public isplay=0;
    private _channel: egret.SoundChannel;
    constructor() {
    super();
    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        this.loadSound();
      
    }
    //加载
    private loadSound(): void {
        var sound: egret.Sound = this._sound = new egret.Sound();;
        //sound 加载完成监听
        sound.addEventListener(egret.Event.COMPLETE, function (e: egret.Event) {
            this.init();
        }, this);

        sound.load("resource/assets/大张伟-葫芦娃.mp3");
        
    }
    //播放
    private play():void {
        //sound 播放会返回一个 SoundChannel 对象，暂停、音量等操作请控制此对象
        this._channel = this._sound.play(this._pauseTime, 1);
        this._channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this); 
        this.addEventListener(egret.Event.ENTER_FRAME, this.onTimeUpdate, this);
        this.isplay=1;
    }
    //停止
    private stop():void {
        if (this._channel) {
            this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onComplete, this);
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onTimeUpdate, this);    
            this._channel.stop();
            this._channel = null;
            this.isplay=0;
           
        }
    }
    //播放完成
    private onComplete(e:egret.Event):void {
        this.stop();
    }
    //更新进度
    private onTimeUpdate(e:egret.Event):void {
        var position:number = this._channel ? this._channel.position : 0;   
    }
   
    private init(): void {
        var isplay:boolean=false;
        //play   
        this.touchEnabled = true;                                         //恩
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if(isplay==false){  this.play(); isplay=true;}
           else if(isplay==true){  this.stop();  isplay=false; }
        }, this);
    }
  }


class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;

        var bg1:BG=new BG();
        var b1:egret.Bitmap = this.createBitmapByName("01_jpg");
        this.addChild(bg1);
        
        b1.width=stageW;
        b1.height=stageH;
        bg1.addChild(b1);
        bg1.touchEnabled=true;
        bg1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, bg1.mouseDown, bg1);
        bg1.addEventListener(egret.TouchEvent.TOUCH_END, bg1.mouseUp, bg1); 

        var bg2:BG=new BG();
        var b2:egret.Bitmap = this.createBitmapByName("03_jpg");
        this.addChild(bg2);
        
        b2.width=stageW;
        b2.height=stageH;
        bg2.addChild(b2);
        bg2.touchEnabled=true;
        bg2.addEventListener(egret.TouchEvent.TOUCH_BEGIN, bg2.mouseDown, bg2);
        bg2.addEventListener(egret.TouchEvent.TOUCH_END, bg2.mouseUp, bg2); 

        var Singer:egret.Bitmap= this.createBitmapByName("唱片_png");
        Singer.width=Singer.height=150;
        var Song :Music=new Music(); 
        this.addChild(Song);
        Song.addChild(Singer);
        Song.anchorOffsetX=Singer.width/2;
        Song.anchorOffsetY =Singer.height/2;
        Song.x=530;
        Song.y=125;
        Song.addEventListener( egret.Event.ENTER_FRAME, ( evt:egret.Event )=>{      
            switch (Song.isplay ) {
                case 1:       
                    Song.rotation += 1;
                    break;
                case 0:
                    break;
            }
        }, this );

        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0xE6E6FA, 0.8);
        topMask.graphics.drawRect(0, 0, stageW, 200);
        topMask.graphics.endFill();
        topMask.y = 33;
        bg2.addChild(topMask);
    
        var topMask2 = new egret.Shape();
        topMask2.graphics.beginFill(0xE6E6FA, 0.8);
        topMask2.graphics.drawRect(0, 0, stageW, 200);
        topMask2.graphics.endFill();
        topMask2.y = -100;
        topMask2.alpha=0;
        bg1.addChild(topMask2);

        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0x666666;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "left";
        colorLabel.text = "Liku\n14081225";
        colorLabel.size = 40;
        colorLabel.x = 40;
        colorLabel.y = 60;
        bg2.addChild(colorLabel);

/*
       var topMask2 = new egret.Shape();
        topMask2.graphics.beginFill(0xE6E6FA, 0.8);
        topMask2.graphics.drawRect(280, 400, 300, 500);
        topMask2.graphics.endFill();
 
        bg2.addChild(topMask2);

*/

        var textfield = new egret.TextField(); 
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.LEFT;
        textfield.size = 30;
        textfield.textColor = 0xffffff;
        textfield.x = 40;
        textfield.y = 180;
        bg2.addChild(textfield);
        this.textfield = textfield;

        var An = new egret.TextField(); 
        An.size=30;
        An.textColor=0x666666;
        An.alpha=0;
        An.text="因为是一个自己不夸自己\n就没有人夸自己的人\n所以不管怎么样都要夸自己";
        An.x=20;
        An.y=90;
        bg1.addChild(An);

        topMask2.touchEnabled=true;
        var Quest = new egret.TextField(); 
        Quest.size=50;
        Quest.textColor=0x999999;
        Quest.fontFamily = "SimHei";
        Quest.text="朋友\n你点一下试试";
        Quest.x=20;
        Quest.y=90;
        bg1.addChild(Quest);
        bg1.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{ Fade();},this);

        function Fade() {
            topMask2.touchEnabled=false;
            egret.Tween.get(An).wait(600).to({"alpha":1},600);
            egret.Tween.get(Quest).to({"alpha":0},600);
            egret.Tween.get(topMask2).to({"alpha":0.5},500);
            egret.Tween.get(topMask2).to({y:33},500);
        }
        
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this)
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield = self.textfield;
        var count = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


