/** namespace. */
var rhit = rhit || {};


var red = 1500;
var green = 1500;
var blue = 1500;

rhit.TankController = class {
	constructor() {
		const buttons = document.querySelectorAll(".driveButton");
		const laserButtons = document.querySelectorAll(".laserButton")
		const armButtons = document.querySelectorAll(".armButton")
		const sliderInput = document.querySelector("#baseSpeed");

		const cameraServo = document.querySelector("#servo11");
		const servo12 = document.querySelector("#servo12");
		const servo13 = document.querySelector("#servo13");
		const servo14 = document.querySelector("#servo14");
		const gripperServo = document.querySelector("#servo15");

		for (const button of buttons){

			button.onmousedown = (event) => {
				const leftMultiplier = button.dataset.leftMultiplier;
				const rightMultiplier = button.dataset.rightMultiplier;
				const baseSpeed = sliderInput.value;

				const leftWheelSpeed = baseSpeed*leftMultiplier;
				const rightWheelSpeed = baseSpeed*rightMultiplier;

				this.sendDriveCommand(leftWheelSpeed, rightWheelSpeed);
			}

			button.onmouseup = (event) => {
				this.sendStop();
			}
		}
		

		for (const Lbutton of laserButtons){
			Lbutton.onmousedown = (event) => {
				const data = Lbutton.getAttribute('dataValue');

				red = document.querySelector("#redSlider").value;
				blue = document.querySelector("#blueSlider").value;
				green = document.querySelector("#greenSlider").value;


				console.log(data);
				if (data == "1"){
					fetch(`api/laser/on/${red}/${green}/${blue}`);
					console.log("Laser ON");
				}else if (data == "0"){
					fetch('api/laser/off');
					console.log("Laser OOFFF");
				}else if (data == "2"){
					console.log("Reset arm");
					fetch('api/servo/laserReset')
				}

			}
		}


		for (const button of armButtons){
			button.onmousedown = (event) => {
				const data = button.getAttribute('val');

				if (data == "0"){
					fetch('api/servo/shortThrow');
					console.log("Short");
				}else if (data == "1"){
					fetch('api/servo/mediumThrow');
					console.log("medium");
				}else if (data == "2"){
					console.log("long");
					fetch('api/servo/longThrow')
				}else if (data == "3"){
					console.log("Pickup osition");
					fetch('api/servo/throwReset')
				}

			}
		}

		document.onkeydown = (event) => {
			// console.log(`type: ${event.type} Key: ${event.key}`);
			this.handleKeyPress(event);
		}

		document.onkeyup = (event) => {
			// console.log(`type: ${event.type} Key: ${event.key}`);
			this.handleKeyPress(event);
		}

		document.querySelector("#redSlider").onchange = (event) =>{
			red = event.target.value;
			fetch(`api/laser/on/${red}/${green}/${blue}`);
		}

		document.querySelector("#greenSlider").onchange = (event) =>{
			green = event.target.value;
			fetch(`api/laser/on/${red}/${green}/${blue}`);
		}

		document.querySelector("#blueSlider").onchange = (event) =>{
			blue = event.target.value;
			fetch(`api/laser/on/${red}/${green}/${blue}`);
		}

		//get servo slider changes
		document.querySelector("#servo11").onchange = (event) => {
			console.log("Servo Slider = ", event.target.value);
			fetch(`/api/servo/camera_pw/${event.target.value}`);
		}

		document.querySelector("#servo15").onchange = (event) => {
			console.log("Servo Slider = ", event.target.value);
			fetch(`/api/servo/gripper_pw/${event.target.value}`);
		}

		document.querySelector("#servo12").onchange = (event) => {
			console.log("Arm Slider = ", event.target.value);
			fetch(`/api/servo/arm_pw/12/${event.target.value}`);
		}

		document.querySelector("#servo13").onchange = (event) => {
			console.log("Arm Slider = ", event.target.value);
			fetch(`/api/servo/arm_pw/13/${event.target.value}`);
		}

		document.querySelector("#servo14").onchange = (event) => {
			console.log("Arm Slider = ", event.target.value);
			fetch(`/api/servo/arm_pw/14/${event.target.value}`);
		}

		

			//This works great for mobile
			// button.onclick = (event) => {
			// 	const leftMultiplier = button.dataset.leftMultiplier;
			// 	const rightMultiplier = button.dataset.rightMultiplier;
			// 	const baseSpeed = sliderInput.value;

			// 	const leftWheelSpeed = baseSpeed*leftMultiplier;
			// 	const rightWheelSpeed = baseSpeed*rightMultiplier;

			// 	this.sendDriveCommand(leftWheelSpeed, rightWheelSpeed);

			// }
	}

	sendDriveCommand(leftWheelSpeed, rightWheelSpeed) {
		fetch(`/api/motor/go/${leftWheelSpeed}/${rightWheelSpeed}`);
	}

	sendStop(){
		fetch(`/api/motor/stop`);
	}

	handleKeyPress(event){
		if(event.type == "keydown"){
			
			if(event.key == "ArrowUp"){
				this.sendDriveCommand(100,100);
			}else if(event.key == "ArrowDown"){
				this.sendDriveCommand(-100,-100);
			}else if(event.key == "ArrowLeft"){
				this.sendDriveCommand(-100,100);
			}else if(event.key == "ArrowRight"){
				this.sendDriveCommand(100,-100);
			}
		}else if(event.type == "keyup"){
			this.sendStop();
		}
	}
}

/* Main */
rhit.main = function () {
	console.log("Ready");
	new rhit.TankController();
};

rhit.main();
