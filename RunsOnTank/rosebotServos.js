var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
const Gpio = require('pigpio').Gpio;

const SERVO_PIN_CAMERA_TILT = 11;
const SERVO_PIN_ARM_JOINT_1 = 12;
const SERVO_PIN_ARM_JOINT_2 = 13;
const SERVO_PIN_ARM_JOINT_3 = 14;
const SERVO_PIN_GRIPPER = 15;

function createPca9685Driver() {
    return new Promise((resolve, reject) => {
        var options = {
            i2c: i2cBus.openSync(1),
            address: 0x40,
            frequency: 50,
            debug: false
        };
        console.time("Initialized the Pca9685Driver");
        const servoDriver = new Pca9685Driver(options, (err) => {
            // Asynchronous callback that takes some time.
            if (err) {
                console.error("Error initializing PCA9685");
                process.exit(-1);
                reject(err);
            }
            console.timeEnd("Initialized the Pca9685Driver");
            resolve(servoDriver);
        });
    });
}

class ArmServos {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(jointNumber, pulseWidth) {
        // Assumes the joint number is 1, 2, or 3
        if (jointNumber == 1) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, pulseWidth);
        } else if (jointNumber == 2) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_2, pulseWidth);
        } else if (jointNumber == 3) {
            this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_3, pulseWidth);
        } else {
            console.log("Invalid arm joint number. ", jointNumber);
        }
    }
    setPulseWidths(pulseWidths) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, pulseWidths[0]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_2, pulseWidths[1]);
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_3, pulseWidths[2]);
    }


    resetArm(){
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, 2500);
    }

    shortThrow(){
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, 2000)

    }

    mediumThrow(){
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, 1500)
    }

    longThrow(){
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, 1000 );
    }

    laserReset(){
        this.pca9685Driver.setPulseLength(SERVO_PIN_ARM_JOINT_1, 500);
        this.pca9685Driver.setPulseLength(SERVO_PIN_GRIPPER, 1500);
    }
}

class GripperServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        console.log("Move gripper to ", pulseWidth);
        this.pca9685Driver.setPulseLength(SERVO_PIN_GRIPPER, pulseWidth);
    }
}

class CameraServo {
    constructor(pca9685Driver) {
        this.pca9685Driver = pca9685Driver;
    }
    setPulseWidth(pulseWidth) {
        this.pca9685Driver.setPulseLength(SERVO_PIN_CAMERA_TILT, pulseWidth);
    }
}

class RGBLED{
    constructor(pca9685Driver){
        // this.led = new Gpio(9, {mode: Gpio.OUTPUT});
        this.led = pca9685Driver;
    }

    turnOn(pulseWidths){
        // this.led.digitalWrite(1);
        this.led.setPulseLength(0, pulseWidths[0]);
        this.led.setPulseLength(1, pulseWidths[1]);
        this.led.setPulseLength(2, pulseWidths[2]);
    }

    turnOff(){
        // this.led.digitalWrite(0);
        this.led.setPulseLength(0, 0);
        this.led.setPulseLength(1, 0);
        this.led.setPulseLength(2, 0);

    }
}

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }
  function sleep(n) {
    msleep(n*1000);
  }

module.exports = {
    createPca9685Driver,
    ArmServos,
    GripperServo,
    CameraServo,
    RGBLED
}