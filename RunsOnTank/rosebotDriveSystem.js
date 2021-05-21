const gpio = require("pigpio").Gpio;

class Motor{
    constructor(pin1, pin2, pinEnable){
        this.digitalOutput1 = new gpio(pin1, {mode: gpio.OUTPUT});
        this.digitalOutput2 = new gpio(pin2, {mode: gpio.OUTPUT});
        this.pwmOutput = new gpio(pinEnable, {mode: gpio.OUTPUT});
    }


    turnOn(dutyCycle){
        //Assume duty cycle is -100 to 100
        //Scale Duty Cycle
        dutyCycle =Math.round(dutyCycle*255/100);
        console.log("scaled duty cycle = ", dutyCycle);

        if(dutyCycle > 0){
            this.digitalOutput1.digitalWrite(1);
            this.digitalOutput2.digitalWrite(0);
            this.pwmOutput.pwmWrite(dutyCycle);

        }else if(dutyCycle < 0){
            this.digitalOutput1.digitalWrite(0);
            this.digitalOutput2.digitalWrite(1);
            this.pwmOutput.pwmWrite(-dutyCycle);

        }else{
            this.turnOff();
        }
    }

    turnOff(){
        this.digitalOutput1.digitalWrite(0);
        this.digitalOutput2.digitalWrite(0);
        this.pwmOutput.pwmWrite(0);
    }
}


class DriveSystem{
    constructor(){
        const Motor_A_EN = 4;
        const Motor_B_EN = 17;  // No hardware PWM!!!
        const Motor_A_Pin2 = 14;
        const Motor_A_Pin1 = 15;
        const Motor_B_Pin2 = 27;
        const Motor_B_Pin1 = 18;
        this.rightMotor = new Motor(Motor_B_Pin1, Motor_B_Pin2, Motor_B_EN);
        this.leftMotor = new Motor(Motor_A_Pin2, Motor_A_Pin1, Motor_A_EN);
    }

    go(leftSpeed, rightSpeed){
        //-100 to 100
        this.leftMotor.turnOn(leftSpeed);
        this.rightMotor.turnOn(rightSpeed);
    }

    stop(){
        this.leftMotor.turnOff();
        this.rightMotor.turnOff();
    }
}

module.exports.DriveSystem = DriveSystem;


// function msleep(n) {
//     Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
//   }
//   function sleep(n) {
//     msleep(n*1000);
//   }

// //Test code area
// const driveSystem = new DriveSystem();
// driveSystem.go(60, 60);
// sleep(2);
// driveSystem.stop();
// sleep(2);
// driveSystem.go(-60, -60);
// sleep(2);
// driveSystem.stop();
// sleep(2);
// driveSystem.go(-60, 60);
// sleep(2);
// driveSystem.stop();