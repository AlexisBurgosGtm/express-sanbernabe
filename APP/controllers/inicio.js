// inicializa indexDb
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!window.indexedDB) {
      window.alert("Lo siento pero su Teléfono no soporta el guardado de Datos");
    }
// Ventas
let toggler = document.getElementById('btnToggler');
let btnDashboard = document.getElementById('btnDashboard');
let btnPrecios = document.getElementById('btnPrecios');
let btnClientes = document.getElementById('btnClientes');
let btnVentas = document.getElementById('btnVentas');
let btnTools = document.getElementById('btnTools');
let btnConfig = document.getElementById('btnConfig');
let btnSync = document.getElementById('btnSync');
let btnChat = document.getElementById('btnChat');
let btnCenso = document.getElementById('btnCenso');
let btnCalcularMargenMen = document.getElementById('btnCalcularMargenMen');

let btnSalir = document.getElementById('btnSalir');

let btnVentas2;
let btnPrecios2;
let btnClientes2;

// Dashboard
btnDashboard.addEventListener('click',()=>{
    funciones.loadView('./views/viewInicio.html')
    .then(()=>{
        //CargarDatosVendedor(GlobalUser);
        //getVentasDiaVendedor('salescontainer');
        GlobalSelectedForm = 'viewInicio';
        GlobalBool = true;
    })
    .catch(error => 
        funciones.showNotification('bottom','right','No se pudo cargar la vista')
    );
    toggler.click();
})

// Precios
btnPrecios.addEventListener('click',()=>{
    funciones.loadView('./views/viewPrecios.html')
            .then(loadPrecios)
            GlobalSelectedForm = 'viewPrecios';
            GlobalBool = true;
    toggler.click();
})

// Clientes
btnClientes.addEventListener('click',()=>{
    funciones.loadView('./views/viewClientes.html')
            .then(cargarListaClientes)
            GlobalSelectedForm = 'viewClientes';
            GlobalBool = true;
    toggler.click();
})

// Ventas
btnVentas.addEventListener('click',()=>{
   
    funciones.loadView('./views/viewVentas.html')
    .then(()=>{
        dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
        //GlobalBool = true;
    });
    toggler.click();
   
})

btnCenso.addEventListener('click',()=>{
    funciones.loadView('./views/viewCenso.html')
        .then(()=>{
            classCenso.CargarFuncionesCenso();
            classCenso.SelectCensoAll(GlobalEmpnit,GlobalCodven,document.getElementById('tblCenso'));
        });    
    
    toggler.click();
});

// Tools
btnTools.addEventListener('click',()=>{
    funciones.loadView('./views/viewTools.html')
            .then(()=>{
                CargarBotonesTools();
                GlobalSelectedForm = 'viewTools';
                GlobalBool = true;
            });
            
    toggler.click();
})

// Configuraciones
btnConfig.addEventListener('click',()=>{
    funciones.loadView('./views/viewConfig.html')
        .then(()=>{
            CargarBotonesConfig();
            GlobalSelectedForm = 'viewConfig';
            GlobalBool = true;
        });
    toggler.click();
})

// Sync
/*
btnSync.addEventListener('click',()=>{
    funciones.loadView('./views/viewSync.html')
          
    toggler.click();
})*/

// Chat
btnChat.addEventListener('click',()=>{
    funciones.loadView('./views/viewChat.html')
            .then(()=>{
               //CargarFuncionesChat();
            });
    toggler.click();
})


// Asigna valores a la vista de inicio
async function CargarDatosVendedor(usuario){
    var txtNombreUsuario = document.getElementById('txtNombreUsuario');
    txtNombreUsuario.innerHTML = usuario;
}



/* ********************************
// CONTROLA EL MENU PRINCIPAL
******************************** */
async function ControllerMenu(TipoApp){
    SetMainMenu;
    
    switch (TipoApp) {
        case 'LOGIN':
            btnDashboard.style="visibility:hidden";
            btnPrecios.style="visibility:hidden";
            btnClientes.style="visibility:hidden";
            btnVentas.style="visibility:hidden";
            btnTools.style="visibility:hidden";
            btnConfig.style="visibility:hidden";
            btnCenso.style="visibility:hidden";
            //btnSync.style="visibility:hidden";
            btnCalcularMargenMen.style="visibility:hidden";
            btnChat.style="visibility:hidden";
            
            btnSalir.style="visibility:hidden";
            break;
    
        case 'SALES':
            btnDashboard.style="visibility:visible";
            btnPrecios.style="visibility:visible";
            btnClientes.style="visibility:visible";
            btnVentas.style="visibility:visible";
            btnTools.style="visibility:visible";
            btnConfig.style="visibility:visible";
            btnCenso.style="visibility:visible";
            //btnSync.style="visibility:visible";
            btnCalcularMargenMen.style="visibility:visible";
            btnChat.style="visibility:visible";
            
            btnSalir.style="visibility:visible";
            break;
    
        case 'DELIVERY':
            btnDashboard.style="visibility:hidden";
            btnPrecios.style="visibility:hidden";
            btnClientes.style="visibility:hidden";
            btnVentas.style="visibility:hidden";
            btnTools.style="visibility:hidden";
            btnConfig.style="visibility:hidden";
            btnCenso.style="visibility:hidden";
            //btnSync.style="visibility:hidden";
            btnCalcularMargenMen.style="visibility:hidden";
            btnChat.style="visibility:hidden";
            
            btnSalir.style="visibility:visible";
            break;
    
        default:
            break;
    }
    
    }
       
    
    async function SetMainMenu(){
        let generalnavbar = document.getElementById('navbar-general');
        let btnVentas = document.createElement('li');
        let btnVentasLink = document.createElement('a');
        let btnVentasI = document.createElement('i');

        btnVentasLink.href = "#"
        btnVentasLink.id = "btnVentas"
        btnVentasI.className = "now-ui-icons design_app"
        btnVentasLink.appendChild(btnVentasI)
        btnVentas.appendChild(btnVentasLink)

        generalnavbar.appendChild(btnVentas);

/*
        <li>
        <a href="#" id="btnDashboard">
            <i class="now-ui-icons design_app"></i>
            <p>Inicio</p>
        </a>
    </li>
*/
    }

    /* ********************************
    // CONTROLA EL MENU PRINCIPAL
    ******************************** */


function StartRecognition(){
    try {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            //recognition.lang = 'en-US';
            recognition.lang = 'es-ES';

            recognition.continuous = true;
            recognition.start();

            recognition.onresult = function(event) {


                for (var i = event.resultIndex; i < event.results.length; ++i) {

                    if(event.results[i].isFinal){

                        if (event.results[i][0].transcript.trim() == 'ventas') {
                            //remoteControl.play()
                            btnVentas.click();
                        } 
                        if (event.results[i][0].transcript.trim() == 'precios') {
                            //remoteControl.stop()
                            btnPrecios.click();
                        } 
                        if (event.results[i][0].transcript.trim() == 'inicio') {
                            //remoteControl.mute()
                            btnDashboard.click();
                        } 
                        if (event.results[i][0].transcript.trim() == '¿Cuál es mi Usuario?') {
                            //remoteControl.unmute()
                            funciones.hablar('Tu usuario es ' + GlobalUser);
                        } 
                        
                        console.info(`You said : ${event.results[i][0].transcript}`)

                    }
                    
                }
            
            }
    } catch (error) {
        
    }
}




let Navegar = {
    inicio:()=>{
        funciones.loadView('./views/viewVentas.html')
        .then(()=>{
            dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
        });
    },
    pedido:()=>{
        
    }
};

funciones.instalationHandlers('btnInstalar');