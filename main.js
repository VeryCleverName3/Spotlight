/*
This file is where most of the game's core functions are handled. These include timing, physics, light mechanics, and player movements
*/

//Canvas stuff
var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
c.height = window.innerWidth / 2;
c.width = window.innerWidth;
var s = c.width;

//Colors for the game
var color1 = "black";
var color2 = "white";

//Array of LightSources
var lights = [];

//Array of platforms
var platforms = [];

//Player declaration and initializations
var p1 = {
        x: s / 4,
        y: s / 2,
        size: 0.025 * s,
        draw: function(){
                ctx.fillStyle = color1;
                ctx.fillRect(this.x - (this.size / 2), this.y -this. size, this.size, this.size);
        },
        top: function(){
                return this.y - this.size;
        },
        bottom: function(){
                return this.y;
        },
        left: function(){
                return this.x - (this.size / 2);
        },
        right: function(){
                return this.x + (this.size / 2);
        },
        centerY: function(){
                return this.y - (this.size / 2);
        },
        velocityY: 0
}
var p2 = {
        x: 3 * s / 4,
        y: s / 2,
        size: 0.025 * s,
        draw: function(){
                ctx.fillStyle = color2;
                ctx.fillRect(this.x - (this.size / 2), this.y -this. size, this.size, this.size);
        },
        top: function(){
                return this.y - this.size;
        },
        bottom: function(){
                return this.y;
        },
        left: function(){
                return this.x - (this.size / 2);
        },
        right: function(){
                return this.x + (this.size / 2);
        },
        centerY: function(){
                return this.y - (this.size / 2);
        },
        velocityY: 0
}

//Event listeners for keyboard input
var keyDown = [];

onkeydown = function(e){
        keyDown[e.which] = true;
}

onkeyup = function(e){
        keyDown[e.which] = false;
}

//debug zone ----------------------------------------------------------------------------------------------------
onmousemove = function(e){
        if(keyDown[32]){
                p1.x = e.clientX;
                p1.y = e.clientY;
        }
}
var light0 = new LightSource(s / 8, s / 2 - (p1.size / 2));
var light1 = new LightSource(7 * s / 8, s / 2 - (p1.size / 2));
//end of debug zone ---------------------------------------------------------------------------------------------

var ground = new PlatformNormal(0, s / 2, s, s / 2);

//Timing control for update function
setInterval(update, 1000/60);

//Update function, called 60 times a second, most stuff is called here
function update(){
        ctx.clearRect(0, 0, s, s);
        ctx.fillStyle = color1;
        ctx.fillRect(0, 0, s / 2, s / 2);
        ctx.fillStyle = color2;
        ctx.fillRect(s / 2, 0, s / 2, s / 2);
        drawLights();
        p1.draw();
        p2.draw();
        move();
}

//Constructor for light source
function LightSource(x, y){
        lights[lights.length] = this;
        this.x = x;
        this.y = y;

        //slopes of shadow lines
        this.m1 = 0;
        this.m2 = 0;

        //type 0 means on the left side, 1 means the right side
        this.type = 0;
        if(x > s / 2){
                this.type = 1;
        }

        //draws the bulbs of the lights based on if in shadows or not
        this.drawBulb = function(){
                if(this.type == 0){
                        ctx.fillStyle = color2;
                } else {
                        ctx.fillStyle = color1;
                }
                for(var i = 0; i < lights.length; i++){
                        if(lights[i].type != this.type){
                                if(inShadow(this, lights[i])){
                                        if(this.type == 0){
                                                ctx.fillStyle = color1;
                                        } else {
                                                ctx.fillStyle = color2;
                                        }
                                }
                        }
                }
                ctx.beginPath();
                ctx.arc(this.x, this.y, s * 0.01, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
        }

        this.draw = function(){

                //Line drawing time!
                if(this.type == 0){
                        /*
                                | o       | light source- o
                                |      P  |  player- p
                        */
                        //s / 2, (m * ((s / 2)-this.x)) + this.y

                        if(p1.y > this.y && p1.x - (p1.size / 2) >= this.x){
                                var m = (p1.y - this.y) / ((p1.x - (p1.size / 2)) - this.x); //slope between bottom left corner and lightsource
                                this.m1 = m;
                                ctx.beginPath();
                                ctx.moveTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                m = ((p1.y - p1.size) - this.y) / ((p1.x + (p1.size / 2)) - this.x);
                                this.m2 = m;
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.lineTo(s, (m * ((s)-this.x)) + this.y);
                                m = (p1.y - this.y) / ((p1.x - (p1.size / 2)) - this.x);
                                ctx.lineTo(s, (m * ((s)-this.x)) + this.y);
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.fillStyle = color1;
                                ctx.fill();
                                ctx.closePath();
                        }
                        /*
                                |      P  | light source- o
                                | o       |  player- p
                        */
                        if(p1.y <= this.y && p1.x - (p1.size / 2) >= this.x){
                                var m = ((p1.y - p1.size) - this.y) / ((p1.x - (p1.size / 2)) - this.x);
                                this.m1 = m;
                                ctx.beginPath();
                                ctx.moveTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                m = (p1.y - this.y) / ((p1.x + (p1.size / 2)) - this.x);
                                this.m2 = m;
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.lineTo(s, (m * ((s)-this.x)) + this.y);
                                m = m = ((p1.y - p1.size) - this.y) / ((p1.x - (p1.size / 2)) - this.x);
                                ctx.lineTo(s, (m * ((s)-this.x)) + this.y);
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.fillStyle = color1;
                                ctx.fill();
                                ctx.closePath();
                        }
                }

                if(this.type == 1){
                        /*
                        mirrored
                                | o       | light source- o
                                |      P  |  player- p
                        */
                        //s / 2, (m * ((s / 2)-this.x)) + this.y

                        if(p2.y < this.y && p2.x + (p2.size / 2) <= this.x){
                                var m = (p2.y - this.y) / ((p2.x - (p2.size / 2)) - this.x); //slope between bottom left corner and lightsource
                                this.m1 = m;
                                ctx.beginPath();
                                ctx.moveTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                m = ((p2.y - p1.size) - this.y) / ((p2.x + (p2.size / 2)) - this.x);
                                this.m2 = m;
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.lineTo(0, (m * ((0)-this.x)) + this.y);
                                m = (p2.y - this.y) / ((p2.x - (p2.size / 2)) - this.x);
                                ctx.lineTo(0, (m * ((0)-this.x)) + this.y);
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.fillStyle = color2;
                                ctx.fill();
                                ctx.closePath();
                        }
                        /*
                        mirrored
                                |      P  | light source- o
                                | o       |  player- p
                        */
                        if(p2.y >= this.y && p2.x + (p2.size / 2) <= this.x){
                                var m = ((p2.y - p2.size) - this.y) / ((p2.x - (p2.size / 2)) - this.x);
                                this.m1 = m;
                                ctx.beginPath();
                                ctx.moveTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                m = (p2.y - this.y) / ((p2.x + (p2.size / 2)) - this.x);
                                this.m2 = m;
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.lineTo(0, (m * ((0)-this.x)) + this.y);
                                m = ((p2.y - p2.size) - this.y) / ((p2.x - (p2.size / 2)) - this.x);
                                ctx.lineTo(0, (m * ((0)-this.x)) + this.y);
                                ctx.lineTo(s / 2, (m * ((s / 2)-this.x)) + this.y);
                                ctx.fillStyle = color2;
                                ctx.fill();
                                ctx.closePath();
                        }
                }
        }
}

//Returns if given object p' x and y are in path of the light
function inShadow(p, light){
        var bottom = max((light.m1 * ((p.x)-light.x)) + light.y, (light.m2 * ((p.x)-light.x)) + light.y);
        var top = min((light.m1 * ((p.x)-light.x)) + light.y, (light.m2 * ((p.x)-light.x)) + light.y);
        if(p.y <= bottom && p.y >= top){
                return true;
        }
        return false;
}

//Returns the max of two numbers
function max(n1, n2){
        if(n1 > n2) return n1;
        return n2;
}

//Returns the min of two numbers
function min(n1, n2){
        if(n1 < n2) return n1;
        return n2;
}

//draws Lights
function drawLights(){
        for(var i = 0; i < lights.length; i++){
                lights[i].draw();
        }
        for(var i = 0; i < lights.length; i++){
                lights[i].drawBulb();
        }
}

//Constructor for platforms that are always visible
function PlatformNormal (x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        platforms[platforms.length] = this;

        this.type = 0;
        if(this.x > s / 2) this.type = 1;

        this.top = function(){
                return this.y;
        }
        this.bottom = function(){
                return this.y + this.h;
        }
        this.left = function(){
                return this.x;
        }
        this.right = function(){
                return this.x + this.w;
        }
        this.centerX = function(){
                return this.x + (w / 2);
        }
        this.centerY = function(){
                return this.y + (h / 2);
        }
        this.topRightAngle = function(){
                return angleBetween(this.centerX(), this.centerY(), this.right(), this.top());
        }
        this.topLeftAngle = function(){
                return angleBetween(this.centerX(), this.centerY(), this.left(), this.top());
        }
        this.bottomLeftAngle = function(){
                return angleBetween(this.centerX(), this.centerY(), this.left(), this.bottom());
        }
        this.bottomRightAngle = function(){
                return angleBetween(this.centerX(), this.centerY(), this.right(), this.bottom());
        }

        this.draw = function(){
                if(this.type == 0) shadowColorChange({x: this.centerX(), y: this.centerY(), type: this.type}, color2, color1);
                if(this.type == 1) shadowColorChange({x: this.centerX(), y: this.centerY(), type: this.type}, color1, color2);
                ctx.fillRect(x, y, w, h);
        }
}

//returns angle between two points
function angleBetween(x1, y1, x2, y2){
        var a = Math.atan2((y1 - y2),(x1-x2)) * 180 / Math.PI;
        while(a < 0){
                a += 360;
        }
        return a;
}

//returns if two objects are colliding
function colliding(a, b){
        return ( (a.bottom() >= b.top() && a.bottom() <= b.bottom() && ((a.right() >= b.left() && a.right() <= b.right())||(a.left() <= b.right() && a.left() >= b.left()))) || /*Next*/(a.top() <= b.bottom() && a.top() >= b.top() && ((a.right() >= b.left() && a.right() <= b.right())||(a.left() <= b.right() && a.left() >= b.left()))) || /*Next*/(a.right() >= b.left() && a.right() <= b.right() && ((a.bottom() >= b.top() && a.bottom() <= b.bottom()) || (a.top() <= b.bottom() && a.top() >= b.top()))) || /*Next*/(a.left() <= b.right() && a.left() >= b.left() && ((a.bottom() >= b.top() && a.bottom() <= b.bottom()) || (a.top() <= b.bottom() && a.top() >= b.top()))) );
}

//returns if two objects are intersecting
function collidingBad(a, b){
        return ( (a.bottom() > b.top() && a.bottom() < b.bottom() && ((a.right() > b.left() && a.right() < b.right())||(a.left() < b.right() && a.left() > b.left()))) || /*Next*/(a.top() < b.bottom() && a.top() > b.top() && ((a.right() > b.left() && a.right() < b.right())||(a.left() < b.right() && a.left() > b.left()))) || /*Next*/(a.right() > b.left() && a.right() < b.right() && ((a.bottom() > b.top() && a.bottom() < b.bottom()) || (a.top() < b.bottom() && a.top() > b.top()))) || /*Next*/(a.left() < b.right() && a.left() > b.left() && ((a.bottom() > b.top() && a.bottom() < b.bottom()) || (a.top() < b.bottom() && a.top() > b.top()))) );
}

//Changes the color to given first or second color based on if shadow. First color is out of shadow, second is in shadow
function shadowColorChange(obj, c1, c2){
        ctx.fillStyle = c1;
        for(var i = 0; i < lights.length; i++){
                if(obj.type != lights[i].type){
                        if(inShadow(obj, lights[i])){
                                ctx.fillStyle = c2;
                        }
                }
        }
}

//A is a player, B is a platform, returns side of platform player is on
function collisionSide(a, b){
        var angle = angleBetween(b.centerX(), b.centerY(), a.x, a.centerY());
        if((angle <= b.topLeftAngle() && angle >= 0) || (angle >= b.bottomLeftAngle() && angle <= 360)){
                return "left";
        } else if(angle <= b.bottomLeftAngle() && angle >= b.bottomRightAngle()){
                return "bottom";
        } else if(angle <= b.bottomRightAngle() && angle >= b.topRightAngle()){
                return "right";
        } else {
                return "top";
        }
}

//Moves players
function move(){
        var speed = 0.005 * s;
        var gravity = 0.0003 * s;
        p1.velocityY += gravity;
        p2.velocityY += gravity;
        if(keyDown[65]){
                p1.x -= speed;
        }
        if(keyDown[68]){
                p1.x += speed;
        }
        if(keyDown[37]){
                p2.x -= speed;
        }
        if(keyDown[39]){
                p2.x += speed;
        }

        //P1 vertical movement
        if(keyDown[87] && collidingWithPlatform(p1)){
                if(collisionSide(p1, collidingWithPlatform(p1)) == "top"){
                        p1.velocityY = -0.0075 * s;
                }
        }

        p1.y += p1.velocityY;

        if(collidingWithPlatformBad(p1)){
                var collidePlat = collidingWithPlatform(p1);
                switch(collisionSide(p1, collidePlat)){
                        case "left":
                                p1.x = collidePlat.left() - (p1.size / 2);
                                break;
                        case "right":
                                p1.x = collidePlat.right() + (p1.size / 2);
                                break;
                        case "top":
                                p1.y = collidePlat.top();
                                p1.velocityY = 0;
                                break;
                        case "bottom":
                                p1.y = collidePlat.bottom() + p1.size;
                                p1.velocityY = 0;
                                break;
                }
        }

        if(p1.x > (s / 2) - (p1.size / 2)){
                p1.x = (s / 2) - (p1.size / 2);
        }

        //P2 vertical movement
        if(keyDown[38] && collidingWithPlatform(p2)){
                if(collisionSide(p2, collidingWithPlatform(p2)) == "top"){
                        p2.velocityY = -0.0075 * s;
                }
        }

        p2.y += p2.velocityY;

        if(collidingWithPlatformBad(p2)){
                var collidePlat = collidingWithPlatform(p2);
                switch(collisionSide(p2, collidePlat)){
                        case "left":
                                p2.x = collidePlat.left() - (p2.size / 2);
                                break;
                        case "right":
                                p2.x = collidePlat.right() + (p2.size / 2);
                                break;
                        case "top":
                                p2.y = collidePlat.top();
                                p2.velocityY = 0;
                                break;
                        case "bottom":
                                p2.y = collidePlat.bottom() + p2.size;
                                p2.velocityY = 0;
                                break;
                }
        }

        if(p2.x < (s / 2) + (p2.size / 2)){
                p2.x = (s / 2) + (p2.size / 2);
        }
}

//Returns platform colliding with p argument, if any
function collidingWithPlatform(p){
        for(var i = 0; i < platforms.length; i++){
                if(colliding(p, platforms[i])){
                        return platforms[i];
                }
        }
        return false;
}

//same as above, but intersection
function collidingWithPlatformBad(p){
        for(var i = 0; i < platforms.length; i++){
                if(collidingBad(p, platforms[i])){
                        return platforms[i];
                }
        }
        return false;
}

//draws platforms
function drawPlatforms(){
        for(var i = 0; i < platforms.length; i++){
                platforms[i].draw();
        }
}
