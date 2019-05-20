var sel = lampara1; //objeto seleccionado
var selLight = luz1; //luz seleccionada
var Orbitando=false;

//funciones que reaccionan a los botones/sliders del panel
function onSliderRotationX(slider) {	
	sel.setAngleX(parseFloat(slider.value));
}

function onSliderRotationZ(slider) {
	sel.setAngleZ(parseFloat(slider.value));	
}

function onSliderRed(slider) {
	selLight.set_light_intensity([parseFloat(slider.value),selLight.get_light_intensity()[1],selLight.get_light_intensity()[2]]);
}

function onSliderGreen(slider) {	
	selLight.set_light_intensity([selLight.get_light_intensity()[0],parseFloat(slider.value),selLight.get_light_intensity()[2]]);
}

function onSliderBlue(slider) {
	selLight.set_light_intensity([selLight.get_light_intensity()[0],selLight.get_light_intensity()[1],parseFloat(slider.value)]);
}

function onSliderTranslationX(slider) {
	sel.setTransX(parseFloat(slider.value));	
}

function onSliderTranslationY(slider) {	
	sel.setTransY(parseFloat(slider.value));
}

function onSliderTranslationZ(slider) {	
	sel.setTransZ(parseFloat(slider.value));	
}

function onSliderCamPhi(slider) {
	cam.setPhi(parseFloat(slider.value));	
}

function onSliderCamTheta(slider) {
	cam.setTheta(parseFloat(slider.value));
}

function onSliderCamRadius(slider) {
	cam.setRadius(parseFloat(slider.value));
}

function onSliderFovy(slider) {
	cam.setFovy(parseFloat(slider.value));
}

function canvas_size(slider)
{
	let canvas = document.getElementById('webglCanvas');
	canvas.width = parseFloat(slider.value);
	canvas.height = parseFloat(slider.value);
	document.getElementById('size').value = parseFloat(slider.value);
}

//Funciones de drag en el canvas
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;
mouseDown = function(e) {
	drag = true;
	old_x = e.pageX, old_y = e.pageY;	
	e.preventDefault();
	return false;
}
mouseUp = function(e) {
	drag = false;
	e.preventDefault();
	return false;
}
mouseMove = function(e) {
	if (!drag) return false;//si el click no esta apretado no hago nada
    dX = (e.pageX-old_x)*2*Math.PI/canvas.width;//calculo cuanto se movio el puntero en x y en y
	dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
	old_x = e.pageX, old_y = e.pageY;
    cam.incTheta(-50*dX);//modifico los angulos de la camara en un numero basado en el movimiento del puntero
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').value;
    cam.incPhi(50*dY);
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').value;
	
	e.preventDefault();
}

//Animacion orbitar
var timerOrbitar;
function orbitar(){

	if (Orbitando==false)
	{
		Orbitando=true;
		let delta = 1;//cantidad de grados que recorro en cada iteracion

		let start = Date.now();
		timerOrbitar = setInterval(function() {
		//document.getElementById('btnOrbitar').disabled = true;//deshabilito el boton mientras dura la animacion
		let timePassed = Date.now() - start;
		if (timePassed >= 20000) {
			clearInterval(timerOrbitar); // termino a los 20 segundos
			//document.getElementById('btnOrbitar').disabled = false; //reactivo el boton
			return;
		}
		let phi = cam.getPhi();
		cam.setPhi(0);
		cam.incTheta(delta);
		document.getElementById('btnCamTheta').value = cam.getTheta();
		document.getElementById('amountTheta').value = cam.getTheta();
		cam.setPhi(phi);
		
		}, 20);
	}
	else
	{
		Orbitando=false;
		clearInterval(timerOrbitar);
	}
	
}

//resetea la escena
function reset(){//reseteo los botones y la escena
	limpiar_timers();
	document.getElementById('btnOrbitar').disabled = false;
	cam = new Camera(); 
	lampara1 = new ObjetoGrafico(); 
	lampara2 = new ObjetoGrafico();
	lampara3 = new ObjetoGrafico();
	iniciar_elementos();
	sel = lampara1;
	document.getElementById('btnCamPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('btnCamTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('btnCamRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('btnFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('amountPhi').value = document.getElementById('btnCamPhi').defaultValue;
	document.getElementById('amountTheta').value = document.getElementById('btnCamTheta').defaultValue;
	document.getElementById('amountRadius').value = document.getElementById('btnCamRadius').defaultValue;
	document.getElementById('amountFovy').value = document.getElementById('btnFovy').defaultValue;
	document.getElementById('selectobj0').value = "Lampara1";
	let i;
	for (i = 1; i <= 5; i++) { 
		document.getElementById('btn'+i).value = document.getElementById('btn'+i).defaultValue;
		document.getElementById('amount'+i).value = document.getElementById('btn'+i).defaultValue;
	}
	actSliders();
	renderizar();
	
}

function CamFront(){
	cam = new Camera();
	cam.setTheta(90);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(20);	
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();	
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

function CamTrasera(){
	cam = new Camera();
	cam.setTheta(270);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(20);
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

function CamLeft(){
	cam = new Camera();
	cam.setTheta(0);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(20);	
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}
function CamRight(){
	cam = new Camera();
	cam.setTheta(180);
	cam.setPhi(45);
	cam.setFovy(50);
	cam.setRadius(20);
	document.getElementById('btnCamTheta').value = cam.getTheta();
	document.getElementById('amountTheta').value = cam.getTheta();
	document.getElementById('btnCamPhi').value = cam.getPhi();
	document.getElementById('amountPhi').value = cam.getPhi();
	document.getElementById('btnCamRadius').value = cam.getRadius();
	document.getElementById('amountRadius').value = cam.getRadius();
	
}

/*
	se ejecuta cuando el select que selecciona taza o cafetera cambia.
*/


function actSliders(){
	if(document.getElementById('selectobj0').value == 'Lampara1'){
		sel = lampara1;
		selLight = luz1;	
	}
	if(document.getElementById('selectobj0').value == 'Lampara2'){
		sel = lampara2;		
		selLight = luz2;	
	}
	if(document.getElementById('selectobj0').value == 'Lampara3'){
		sel = lampara3;		
		selLight = luz3;	
	}
	let i;
	for (i = 1; i <= 5; i++) { 
		switch (i) {
			case 1:
				document.getElementById('btn'+i).value = sel.getAngleX();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 2:
				document.getElementById('btn'+i).value = sel.getAngleZ();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 3:
				document.getElementById('btn'+i).value = sel.getTransX();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 4:
				document.getElementById('btn'+i).value = sel.getTransY();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			case 5:
				document.getElementById('btn'+i).value = sel.getTransZ();
				document.getElementById('amount'+i).value = document.getElementById('btn'+i).value;
				break;
			default:
		}
	}
	document.getElementById('btnRed').value = selLight.get_light_intensity()[0];
	document.getElementById('btnGreen').value = selLight.get_light_intensity()[1];
	document.getElementById('btnBlue').value = selLight.get_light_intensity()[2];
	
	
	
}
function apuntar(){
	let punto = [0,0,0];
	punto[0] = parseFloat(document.getElementById("mirarX").value);
	punto[1] = parseFloat(document.getElementById("mirarY").value);
	punto[2] = parseFloat(document.getElementById("mirarZ").value);
	sel.apuntarA(punto);
	
}
var timerOnClick;

function onClickRotX(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleX(delta);
		document.getElementById("btn1").value = sel.getAngleX();
		document.getElementById("amount1").value = document.getElementById("btn1").value;
		
	},20)	
}

function onClickRotY(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleY(delta);
		document.getElementById("btn2").value = sel.getAngleY();
		document.getElementById("amount2").value = document.getElementById("btn2").value;
		
	},20)	
}

function onClickRotZ(delta){
	timerOnClick = setInterval(function(){
		sel.sumarAngleZ(delta);
		document.getElementById("btn3").value = sel.getAngleZ();
		document.getElementById("amount3").value = document.getElementById("btn3").value;
		
	},20)	
}

function onClickScale(delta){
	timerOnClick = setInterval(function(){
		let oldvalue = sel.getScale();
		sel.setScale(sel.getScale()+delta);
		if(lampara1.collision(lampara2)){
			sel.setScale(oldvalue);
		}
		document.getElementById("btn4").value = sel.getScale();
		document.getElementById("amount4").value = document.getElementById("btn4").value;
		
	},20)	
}

function onClickTransXPos(){
	timerOnClick = setInterval("MoverEnXPos(sel)",20)	
}

function onClickTransXNeg(){
	timerOnClick = setInterval("MoverEnXNeg(sel)",20)	
}

function onClickTransYPos(){
	timerOnClick = setInterval("MoverEnYPos(sel)",20)	
}

function onClickTransYNeg(){
	timerOnClick = setInterval("MoverEnYNeg(sel)",20)	
}

function onClickTransZPos(){
	timerOnClick = setInterval("MoverEnZPos(sel)",20)	
}

function onClickTransZNeg(){
	timerOnClick = setInterval("MoverEnZNeg(sel)",20)	
}

function offClick(){
	clearInterval(timerOnClick);
}
function focoTaza(){
	cam.setObjetivo(lampara1);
	
}
function focoCafetera(){
	cam.setObjetivo(lampara2);
	
}
function focoCentro(){
	cam.setObjetivo(new ObjetoGrafico());
	
}

function reiniciar_opciones()
{
	 document.getElementById('selectobj1').value="No";
	 document.getElementById('selectobj3').value="No";
	 document.getElementById('selectobj4').value="No";
	 limpiar_timers();
}
function cambiarTipoLuz(){
	let tipo = document.getElementById('selectobj1').value;
	let nuevoTipoLuz;
	switch (tipo) {
		case 'luz_dia':
			nuevoTipoLuz = luz_dia;
			break;
		case 'luz_nublado':
			nuevoTipoLuz = luz_nublado;
			break;
		case 'luz_vela':
			nuevoTipoLuz = luz_vela;
			break;
		case 'luz_tungs100':
			nuevoTipoLuz = luz_tungs100;
			break;
		case 'luz_halogen':
			nuevoTipoLuz = luz_halogen;
			break;
			case 'luz_negra':
			nuevoTipoLuz = luz_negra;
			break;
		default:
	}
	selLight.set_light_intensity(nuevoTipoLuz);
	actSliders();
}

function onSliderKa(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_k_ambient(value);
	}
	
}

function onSliderKd(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_k_diffuse(value);
	}
	
}

function onSliderKs(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_k_spec(value);
	}
	
}

function onSliderF0(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_f0(value);
	}
	
}

function onSliderM(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_m(value);
	}
	
}

function onSliderAx(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_alpha_x(value);
	}
	
}

function onSliderAy(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_alpha_y(value);
	}
	
}

function onSliderSigma(slider) {	
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let value = parseFloat(slider.value);

	let i = fila;
	let j = 0;	

	for(j = 0; j<6; j++){			
		esferas[i*6+j].getMaterial().set_sigma(value);
	}	
}

function selectLuzEnCam(){
	luzEnCamara = document.getElementById('selectobj3').value;
}
function onSliderSpotAngle(slider){
	luz2.set_spot_angle(Math.cos(glMatrix.toRadian(parseFloat(slider.value))));
}
function actSlidersEsferas(){
	let fila = parseFloat(document.getElementById('selectobj2').value);
	let material = esferas[fila*6].getMaterial();

	document.getElementById('sliderf0').value = material.get_f0();
	document.getElementById('sliderm').value = material.get_m();
	document.getElementById('sliderax').value = material.get_alpha_x();
	document.getElementById('slideray').value = material.get_alpha_y();
	document.getElementById('slidersigma').value = material.get_sigma();
}