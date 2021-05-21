const express = require("express");
const rosebot = require("./rosebot");
const fs = require('fs')
const videoStream = require('./videoStream');

const app = express();
app.use("/", express.static("public"));
const robot = new rosebot.RoseBot();

app.get("/api/motor/go/:leftWheelSpeed/:rightWheelSpeed", (req, res) => {
    const leftWheelSpeed = parseInt(req.params.leftWheelSpeed);
    const rightWheelSpeed = parseInt(req.params.rightWheelSpeed);

    robot.driveSystem.go(leftWheelSpeed, rightWheelSpeed);

    res.json({
        status: "ok",
        leftWheelSpeed: leftWheelSpeed,
        rightWheelSpeed: rightWheelSpeed
    });
});

app.get("/api/motor/stop", (req, res) =>{

    robot.driveSystem.stop();
    // robot.LED.turnOn();
    // console.log("On");
    // rosebot.sleep(3);
    // robot.LED.turnOff();
    // console.log("OFF");
    res.json({
        status: "Stopped"
    })
})

app.get("/api/servo/camera_pw/:pulseWidth", (req, res) => {
    const pulseWidth = parseInt(req.params.pulseWidth);
    robot.cameraServo.setPulseWidth(pulseWidth);
    res.json({
        status: "move camera arm"
    })
})

app.get("/api/servo/gripper_pw/:pulseWidth", (req, res) => {
    const pulseWidth = parseInt(req.params.pulseWidth);
    robot.gripperServo.setPulseWidth(-1*pulseWidth + 3000);
    res.json({
        status: "move griper"
    })
})

app.get("/api/servo/arm_pw/:jointNumber/:pulseWidth", (req, res) => {
    const pulseWidth = parseInt(req.params.pulseWidth);
    const jointNumber = parseInt(req.params.jointNumber);


    robot.armServos.setPulseWidth(jointNumber - 11, pulseWidth);

    res.json({
        status: "move arm"
    })
})

app.get("/api/servo/shortThrow", (req, res) => {
    robot.armServos.shortThrow();
    res.json({
        status: "short throw"
    })
})

app.get("/api/servo/mediumThrow", (req, res) => {
    robot.armServos.mediumThrow();
    res.json({
        status: "medium throw"
    })
})

app.get("/api/servo/longThrow", (req, res) => {
    robot.armServos.longThrow();
    res.json({
        status: "long throw"
    })
})


app.get("/api/servo/throwReset", (req, res) => {
    robot.armServos.resetArm();
    res.json({
        status: "reset throw"
    })
})

app.get("/api/servo/laserReset", (req, res) => {
    robot.armServos.laserReset();
    
    res.json({
        status: "reset to main laser position"
    })
})

app.get("/api/laser/on/:red/:green/:blue", (req, res) => {
    //todo: add robot.servo.LED.on Call
    const red = parseInt(req.params.red);
    const green = parseInt(req.params.green);
    const blue = parseInt(req.params.blue);

    robot.LED.turnOn([red, green, blue]);
    console.log("LED ON");
    res.json({
        status: "laser on"
    })
})

app.get("/api/laser/off", (req, res) => {
    //todo: add robot.servo.LED.off Call
    robot.LED.turnOff();
    console.log("LED OFF");
    res.json({
        status: "laser off"
    })
})


videoStream.acceptConnections(app, {
    width: 640,
    height: 320,
    fps: 16,
    encoding: 'JPEG',
    quality: 7 // lower is faster, less quality
}, 
'/stream.mjpg', true);

app.listen(3000);