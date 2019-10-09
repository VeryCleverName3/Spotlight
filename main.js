//Canvas stuff
var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");
c.height = window.innerWidth / 2;
c.width = window.innerWidth;
var s = c.width;

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
                ctx.fillStyle = "blue";
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
                ctx.fillStyle = "red";
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

//debug ----------------------------------------------------------------------------------------------------------
onmousemove = function(e){
        if(keyDown[32]){
                p1.x = e.clientX;
                p1.y = e.clientY;
        }
}
var light0 = new LightSource(s / 8, s / 4);
var light1 = new LightSource(7 * s / 8, s / 4);
var light2 = new LightSource(7 * s / 8, s / 8);
var plat1 = new PlatformNormal(s / 8, s / 4, s / 8, s / 16);
//end of debug zone ---------------------------------------------------------------------------------------------

//Timing control for update function
setInterval(update, 1000/60);

//Update function, called 60 times a second, most stuff is called here
function update(){
        ctx.clearRect(0, 0, s, s);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, s / 2, s);
        drawLights();
        p1.draw();
        p2.draw();
        plat1.draw();
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
                        ctx.fillStyle = "white";
                } else {
                        ctx.fillStyle = "black";
                }
                for(var i = 0; i < lights.length; i++){
                        if(lights[i].type != this.type){
                                if(inShadow(this, lights[i])){
                                        if(this.type == 0){
                                                ctx.fillStyle = "black";
                                        } else {
                                                ctx.fillStyle = "white";
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
                                ctx.fillStyle = "black";
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
                                ctx.fillStyle = "black";
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
                                ctx.fillStyle = "white";
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
                                ctx.fillStyle = "white";
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
                if(this.type == 0) shadowColorChange({x: this.centerX(), y: this.centerY(), type: this.type}, "white", "black");
                if(this.type == 1) shadowColorChange({x: this.centerX(), y: this.centerY(), type: this.type}, "black", "white");
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

function colliding(a, b){
        return ( (a.bottom() > b.top() && a.bottom() < b.bottom() && ((a.right() > b.left() && a.right() < b.right())||(a.left() < b.right() && a.left() > b.left()))) || /*Next*/(a.top() < b.bottom() && a.top() > b.top() && ((a.right() > b.left() && a.right() < b.right())||(a.left() < b.right() && a.left() > b.left()))) || /*Next*/(a.right() > b.left() && a.right() < b.right() && ((a.bottom() > b.top() && a.bottom() < b.bottom()) || (a.top() < b.bottom() && a.top() > b.top()))) || /*Next*/(a.left() < b.right() && a.left() > b.left() && ((a.bottom() > b.top() && a.bottom() < b.bottom()) || (a.top() < b.bottom() && a.top() > b.top()))) );
}

//Changes the color to given first or second color based on if shadow. First color is out of shadow, second is in shadow
function shadowColorChange(obj, color1, color2){
        ctx.fillStyle = color1;
        for(var i = 0; i < lights.length; i++){
                if(obj.type != lights[i].type){
                        if(inShadow(obj, lights[i])){
                                ctx.fillStyle = color2;
                        }
                }
        }
}

//A is a player, B is a platform, returns side of platform player is on
function collisionSide(a, b){
        var angle = angleBetween(b.centerX(),  b.centerY(), a.x, a.centerY());
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
        var gravity = 0.00015 * s;
        p1.velocityY += gravity;
        p1.velocityY += gravity;
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
        if(keyDown[87]){
                p1.velocityY = -0.0075 * s;
        }


        p1.y += p1.velocityY;
}
