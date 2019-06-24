export default function sketch (p) {
    const nmobiles = 200
    const mobiles = []
    let noisescale
    let a1, a2, a3, a4, a5, amax
    let bw = true

    window.mic = new p5.AudioIn()

    p.setup = () => {        
        mic.start()
        p.createCanvas(p.windowWidth, p.windowHeight)
        p.background(0)
        p.noFill()
        p.colorMode(p.HSB, 360, 255, 255, 255)
        p.strokeWeight(.1)
        reset()
    }

    p.draw = () => {
        let micLevel = mic.getLevel()
        if (micLevel > 0.2) {
            p.background(0)
            reset()
            // p.strokeWeight(p.random(micLevel))
        }
        for (var i = 0; i < nmobiles; i++) {
            mobiles[i].run()
        }
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        if (props.reset) {
            reset()
            p.setup()
        }
        window.props = props
    }

    p.keyReleased = () => {
        if (p.keyCode == 32) reset()
        if (p.key == 'r' || p.key == 'R') p.setup()
        if (p.key == 'b' || p.key == 'B') bw = !bw
        props.myfunc()
    }

    const reset = () => {
        noisescale = p.random(.01, .91)
        p.noiseDetail(p.int(p.random(1, 5)))
        amax = p.random(25)
        a1 = p.random(1, amax)
        a2 = p.random(1, amax)
        a3 = p.random(1, amax)
        a4 = p.random(1, amax)
        a5 = 150
        for (let i = 0; i < nmobiles; i++) {
            mobiles[i] = new Mobile(i);
        }
    }

    function Mobile(index) {
        this.index = index
        this.velocity = p.createVector(200, 200, 200)
        this.acceleration = p.createVector(200, 200, 200)
        this.position0 = p.createVector(p.random(0, p.width), p.random(0, p.height), p.random(0, p.tan(p.height)))
        this.position = this.position0.copy()
        this.trans = p.random(50, 100)
        this.hu = (p.noise(a1*p.cos(p.PI*this.position.x/p.width), a1*p.sin(p.PI*this.position.y/p.height))*720)%p.random(360)
        this.sat = p.noise(a2*p.sin(p.PI*this.position.x/p.width), a2*p.sin(p.PI*this.position.y/p.height))*255
        this.bri = p.noise(a3*p.cos(p.PI*this.position.x/p.width), a3*p.cos(p.PI*this.position.y/p.height))*255
    }

    Mobile.prototype.run = function() {
        this.update()
        this.display()
    };

    Mobile.prototype.update = function() {
        this.velocity = p.createVector( 1-2*p.noise(a4+a2*p.tan(p.TAU*this.position.x/p.width), 
                                        a4+a2*p.sin(p.TAU*this.position.y/p.height)), 
                                        1-2*p.noise(a2+a3*p.tan(p.TAU*this.position.x/p.width), 
                                        a4+a3*p.tan(p.TAU*this.position.y/p.height)))
        
        this.velocity.mult(a5)
        this.velocity.rotate(p.sin(100)*p.noise(a4+a3*p.sin(p.TAU*this.position.x/p.width)))
        this.position0 = this.position.copy()
        this.position.add(this.velocity)
    }

    Mobile.prototype.display = function() {
        if(bw) {
            p.stroke(255,this.trans)
        } else {
            // p.stroke(0,this.trans)
            p.stroke((p.frameCount*0.8)%360, (p.millis()%360), (p.frameCount)%360, this.trans%255)
        }
        p.strokeWeight(0.4)
        
        if (p.mouseIsPressed) {
            p.line(p.mouseX, this.position.y*this.position0.y, this.position.x, p.mouseY)
        } else {
            p.line(this.position0.x, this.position0.y, this.position.x, this.position.y)
        }
        
        if (this.position.x>p.width || this.position.x < 0 || this.position.y > p.height || this.position.y < 0) {
            this.position0=p.createVector(p.random(0, p.width), p.random(0, p.height),p.random(0, p.height*p.width));
            this.position=this.position0.copy();
        }
    }
    // p.constrain
}
