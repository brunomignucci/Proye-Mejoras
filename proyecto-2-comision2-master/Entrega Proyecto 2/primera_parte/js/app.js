var esferas = [];
var renderloopid;

var luz1 = new Luz(); //luz puntual
var luz2 = new Luz(); //luz spot
var luz3 = new Luz(); //luz direccional

var timerRotarSobresuEje;
var timerRotacionRespecto;
var timerTecla;

var fpsElem = null;
var avgElem = null;
var frameTimes = [];
var maxFrames = 20;
let totalFPS = 0;
let frameCursor = 0;
let numFrames = 0; 
var lastDrawTime = 0;

var canvas
var gl = null;
var shaderProgram  = null; //Shader program to use.
var shaderProgramCookTorrance = null;
var shaderProgramWard = null;
var shaderProgramOrennayar = null;
var shaderProgramBlinnPhong = null;

//Uniform de matrices
var u_modelMatrix;
var u_viewMatrix;
var	u_projectionMatrix;
var u_modelViewMatrix;
var u_modelViewProjectionMatrix
var	u_normalMatrix;

//Uniform de materiales
var	u_k_ambient;
var	u_k_diffuse;
var u_k_spec;
var	u_exp_spec;
var u_alphaX;
var u_alphaY;
var u_f0;
var u_m;
var u_sigma;

//Uniform de luces
var	u_light_pos1;
var	u_light_intensity1;
var u_spot_direction1;
var u_spot_angle1;
var u_light_attenuation_a1;
var u_light_attenuation_b1;

var	u_light_pos2;
var	u_light_intensity2;
var u_spot_direction2;
var u_spot_angle2;
var u_light_attenuation_a2;
var u_light_attenuation_b2;

var	u_light_pos3;
var	u_light_intensity3;
var u_spot_direction3;
var u_spot_angle3;
var u_light_attenuation_a3;
var u_light_attenuation_b3;

var posLocation;
var normLocation;

var cam = new Camera(); //vamos a controlar la camara desde esta clase

var lampara1 = new ObjetoGrafico(); 
var lampara2 = new ObjetoGrafico(); 
var lampara3 = new ObjetoGrafico();
var plano = new ObjetoGrafico();

var renderMode = 'RENDERMODE_COOK_TORRANCE'; //shader por defecto
var luzEnCamara = "NO";

const DeltaRot=1; //cantidad de grados que rota
let teclaPresionada =false;

/*
	Inicialmente en la pantalla el evento de teclado solo puede capturar
	la tecla L la cual cumple la misma funcion de presionar primero el boton
	cargar y luego el boton renderizar.
	Es decir, ejecuta primero onLoad(), luego renderizar() y se habilitan los demas botones.
*/
function primerosEventos(){

	document.addEventListener('keydown', function (e) {
		switch(e.keyCode)
		{
			case 76 : {onLoad(); renderizar(); habilitarBotones(); break;}
		}

    }, false);
}

function onLoad() {
	
	//Una vez que se ejecuta esta función la cual prepara todo para poder renderizar,
	//el tamaño del canvas ya no puede editarse, por lo tanto la opcion de redimencionar
	//desaparece
	var Tabla_tam_can = document.getElementById('tabla_tam_canvas');
	Tabla_tam_can.style.display="none";

	//obtenemos el canvas donde vamos a dibujar
	canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	fpsElem = document.getElementById('fps');
	avgElem = document.getElementById('avg');

	//Agregamos eventos de teclado y mouse
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	document.addEventListener('keydown', function (e) {
		
		//si es una de las teclas de movimiento uso timer, sino solo presiono una vez
		if( (e.keyCode==37) ||  (e.keyCode==39))
		{
			if (teclaPresionada==false)
			{
				teclaPresionada=true;
				timerTecla = setInterval(function() {Evento_teclado(e);},20);

			}
		}		
		
    }, false);

    document.addEventListener('keyup', function (e) {
    	
    	if((e.keyCode==37) ||  (e.keyCode==39))
    	{
    		teclaPresionada =false;
			clearInterval(timerTecla);
    	}
    	
	}, false);

	iniciar_elementos();
	//seteo el color del canvas
	gl.clearColor(0.18, 0.18, 0.18, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//para que los fragmentos no visibles no tapen a los visibles
	gl.enable(gl.DEPTH_TEST);
	//creo los shader
	shaderProgramCookTorrance = ShaderProgramHelper.create(vertexShaderCookTorrance, fragmentShaderCookTorrance);
	shaderProgramWard = ShaderProgramHelper.create(vertexShaderWard, fragmentShaderWard);
	shaderProgramOrenNayar = ShaderProgramHelper.create(vertexShaderOrenNayar, fragmentShaderOrenNayar);
	shaderProgramBlinnPhong = ShaderProgramHelper.create(vertexShaderBlinnPhong, fragmentShaderBlinnPhong);
	//el boton de renderizar se habilita una vez que estemos listos para renderizar
	let boton_renderizar = document.getElementById('btnrenderizar');
	boton_renderizar.disabled=false;	
	
			
}
function cargarObjetos(){	
	plano.loadOBJ(planojs);		
	lampara1.loadOBJ(lamparajs);	
	lampara2.loadOBJ(linternajs);
	lampara3.loadOBJ(lamparajs);		
	cargarEsferas();
}
function renderizar(){
	if(renderMode == 'RENDERMODE_COOK_TORRANCE')setShaderCookTorrance();
	if(renderMode == 'RENDERMODE_WARD')setShaderWard();
	if(renderMode == 'RENDERMODE_OREN_NAYAR')setShaderOrenNayar();
	if(renderMode == 'RENDERMODE_BLINN_PHONG')setShaderBlinnPhong();
	cargarObjetos();
	renderloopid = requestAnimationFrame(onRender);

}
function onRender(now) {
	now *= 0.001;                            // milisegundos -> segundos
	const timeDelta = now - lastDrawTime;    // tiempo entre este frame y el anterior

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//actualizo posiciones y direcciones, ya que las lamparas y luces estan conectadas
	if(luzEnCamara == 'PUNTUAL'){
		cam.setObjetivo(lampara1);
		cam.setRadius(0);
	}
	luz1.set_light_pos([lampara1.getTransX(),lampara1.getTransY(),lampara1.getTransZ(),1.0]); //para controlar la luz
	
	if(luzEnCamara == 'SPOT'){
		cam.setObjetivo(lampara2);
		cam.setRadius(0);
	}
	luz2.set_light_pos([lampara2.getTransX(),lampara2.getTransY(),lampara2.getTransZ(),1.0]);
	
	let new_spot_direction2 = vec4.create();
	vec4.transformQuat(new_spot_direction2,[0.0,-1.0,0.0,0.0],lampara2.getRotation());
	luz2.set_spot_direction(new_spot_direction2);

	luz3.set_light_pos([lampara3.getTransX(),lampara3.getTransY(),lampara3.getTransZ(),0.0]);


	if(renderMode == 'RENDERMODE_COOK_TORRANCE')renderWithCookTorrance();
	if(renderMode == 'RENDERMODE_WARD')renderWithWard();
	if(renderMode == 'RENDERMODE_OREN_NAYAR')renderWithOrenNayar();
	if(renderMode == 'RENDERMODE_BLINN_PHONG')renderWithBlinnPhong();
	

	// Guardamos el momento en el que se dibujo este frame y solicitamos el proximo
	lastDrawTime = now;
	let fps = 1 / timeDelta
	fpsElem.value = fps.toFixed(1);
	// add the current fps and remove the oldest fps
	totalFPS += fps - (frameTimes[frameCursor] || 0);
	// record the newest fps
	frameTimes[frameCursor++] = fps;	
	// needed so the first N frames, before we have maxFrames, is correct.
	numFrames = Math.max(numFrames, frameCursor);	
	// wrap the cursor
	frameCursor %= maxFrames;  
	const averageFPS = totalFPS / numFrames;
	avgElem.value = averageFPS.toFixed(1);  // update avg display
	renderloopid = requestAnimationFrame(onRender);	
}

function limpiar_timers()
{
	clearInterval(timerOnClick);
	clearInterval(timerOrbitar);
	clearInterval(timerTecla);

}

function habilitarBotones()
{
	document.getElementById('Frente').disabled=false;
	document.getElementById('Trasera').disabled=false;
	document.getElementById('Izquierda').disabled=false;
	document.getElementById('Derecha').disabled=false;
	document.getElementById('btnOrbitar').disabled=false;
	document.getElementById('btnReiniciar').disabled=false;
	
	document.getElementById('b1').disabled=false;
	document.getElementById('b2').disabled=false;
	document.getElementById('b5').disabled=false;
	document.getElementById('b6').disabled=false;
	

	document.getElementById('b9').disabled=false;
	document.getElementById('b10').disabled=false;
	document.getElementById('b11').disabled=false;
	document.getElementById('b12').disabled=false;
	document.getElementById('b13').disabled=false;
	document.getElementById('b14').disabled=false;
	

	
	document.getElementById('selectobj0').disabled=false;
	document.getElementById('selectobj1').disabled=false;
	document.getElementById('selectobj2').disabled=false;

	document.getElementById('sliderf0').disabled=false;
	document.getElementById('sliderm').disabled=false;
	document.getElementById('sliderax').disabled=false;
	document.getElementById('slideray').disabled=false;
	document.getElementById('slidersigma').disabled=false;

	document.getElementById('btnRed').disabled=false;
	document.getElementById('btnGreen').disabled=false;
	document.getElementById('btnBlue').disabled=false;
	document.getElementById('btnSpotAngle').disabled=false;

	
	document.getElementById('btn1').disabled=false;
	document.getElementById('btn2').disabled=false;
	document.getElementById('btn3').disabled=false;
	document.getElementById('btn4').disabled=false;
	document.getElementById('btn5').disabled=false;

	

	document.getElementById('btnCamPhi').disabled=false;
	document.getElementById('btnCamTheta').disabled=false;
	document.getElementById('btnCamRadius').disabled=false;
	document.getElementById('btnFovy').disabled=false;

}
function cargarEsferas(){
	
	let esferaParsedOBJ = OBJParser.parseFile(esferaOBJ);		
  let indicesEsfera = esferaParsedOBJ.indices;
  let positionsEsfera = esferaParsedOBJ.positions;
	let normalesEsfera = esferaParsedOBJ.normals;
	
	let esfera_vertexAttributeInfoArray = [
        new VertexAttributeInfo(positionsEsfera, posLocation, 3),
        new VertexAttributeInfo(normalesEsfera, normLocation, 3)
	];
	
	esfera_vao = VAOHelper.create(indicesEsfera, esfera_vertexAttributeInfoArray);
	let i = 0;
	let j = 0;
	
	for(i = 0; i<4; i++){
		for(j = 0; j<6; j++){
			esferas[i*6+j] = new ObjetoGrafico();
			esferas[i*6+j].setTrans([3*i-4.0,0.0,3*j-6.0]);
			esferas[i*6+j].setParsedOBJ(esferaParsedOBJ);
			esferas[i*6+j].setVao(esfera_vao);

			if(i==0) esferas[i*6+j].setMaterial(material_polishedsilver);
			if(i==1) esferas[i*6+j].setMaterial(material_greenrubber);
			if(i==2) esferas[i*6+j].setMaterial(material_redplastic);
			if(i==3) esferas[i*6+j].setMaterial(material_copper);
		}
	}
	
}

function iniciar_elementos(){//setea algunos valores predefinidos de los objetos para la escena inicial
	
	lampara1.setTrans([3.0,3.0,3.0]);
	lampara1.setMaterial(material_silver);
	luz1.set_light_pos(lampara1.getTrans());
	luz1.set_light_intensity(luz_dia);
	luz1.set_spot_angle(-1.0); //luz puntual
	luz1.set_attenuation_a(0.0);
	luz1.set_attenuation_b(0.01);

	lampara2.setTrans([-3.0,3.0,3.0]);
	lampara2.setMaterial(material_silver);

	luz2.set_light_pos(lampara2.getTrans());
	luz2.set_light_intensity(luz_dia);
	luz2.set_spot_direction([0.0,-1.0,0.0,0.0]);
	luz2.set_spot_angle(Math.cos(glMatrix.toRadian(50)));
	luz2.set_attenuation_a(0.0);
	luz2.set_attenuation_b(0.01);

	lampara3.setTrans([0.0,-1.0,0.0]);
	luz3.set_light_pos(lampara3.getTrans(),0.0); //como w=0, es una direccion
	luz3.set_light_intensity(luz_dia);
	luz3.set_attenuation_a(0.0);
	luz3.set_attenuation_b(0.0);

	plano.setMaterial(material_plano);	
	plano.setScale(2);

	cam.setRadius(20);
	actSliders();
}