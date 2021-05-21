const rosebotDriveSystem = require("./rosebotDriveSystem");
const rosebotServo = require("./rosebotServos");

class RoseBot{
    constructor(){
        //Motors
        this.driveSystem = new rosebotDriveSystem.DriveSystem();


        //Servos
        this.initializeServos();

        //sensors

        //camera
    }

    async initializeServos(){
      const pca9685Driver = await rosebotServo.createPca9685Driver();
      this.armServos = new rosebotServo.ArmServos(pca9685Driver);
      this.gripperServo = new rosebotServo.GripperServo(pca9685Driver);
      this.cameraServo = new rosebotServo.CameraServo(pca9685Driver);
      this.LED = new rosebotServo.RGBLED(pca9685Driver);
    }

}

function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
  }
  function sleep(n) {
    msleep(n*1000);
  }

module.exports = {
    RoseBot,
    sleep,
    msleep
}