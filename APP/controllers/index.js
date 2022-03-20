let nav;
let user;
let cmbEmpnit;
let btnConfigTokenInicial;


async function fcnLogin(){
    GlobalTipoApp = 'SALES'; //document.getElementById('cmbAplicacion').value;
    cmbEmpnit = document.getElementById('cmbEmpresas');
    user = document.getElementById('txtUser');
    let pass = document.getElementById('txtPass');
    nav = document.getElementById('navbar-general');

    if(!user.value){
        funciones.AvisoError('Escriba su nombre de usuario');
    };
    if(!pass.value){
        funciones.AvisoError('Escriba su Contraseña');
    };
        
    if(GlobalTipoApp=='SALES'){
        try {
            const response = await fetch(`/api/usuarios/login?token=${GlobalToken}`)
            const json = await response.json();
    
            json.recordset.map(ComprobarVendedor).join('\n');
       
        } catch (error) {
          console.log(error);
        }
    };

    if(GlobalTipoApp=='DELIVERY'){
        try {
            const response = await fetch(`/api/reparto/usuarios/login?token=${GlobalToken}`)
            const json = await response.json();
    
            json.recordset.map(ComprobarRepartidor).join('\n');
       
        } catch (error) {
          console.log(error);
        }
    };
    


};

async function ComprobarVendedor(usuario) {
    if (usuario.NOMVEN==txtUser.value){
        if (usuario.CLAVE==txtPass.value){
            if (usuario.EMPNIT==cmbEmpnit.value){

                                  
            GlobalUser = user.value;
            GlobalCoddoc = usuario.CODDOC;
            GlobalCodven = usuario.CODVEN;
            GlobalEmpnit = usuario.EMPNIT;

            funciones.Aviso('Bienvenido ' + GlobalUser);

            funciones.loadView('./views/viewVentas.html')
                .then(()=>{
                    ControllerMenu('SALES');
                    dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
                });

            /*
            funciones.loadView('./views/viewInicio.html')
               .then(()=>{
                    //CargarDatosVendedor(GlobalUser);
                })
                .then(()=>{
                    getVentasDiaVendedor('salescontainer');
                });
                */
            
            //nav.style="visibility:visible";
            };
        };
    };     
};


async function ComprobarRepartidor(usuario) {
    if (usuario.DESREP==txtUser.value){
        if (usuario.CLAVE==txtPass.value){
            if (usuario.EMPNIT==cmbEmpnit.value){

                                  
            GlobalUser = user.value;
            //GlobalCoddoc = usuario.CODDOC;
            GlobalCodrep = usuario.CODREP;
            GlobalEmpnit = usuario.EMPNIT;

            funciones.Aviso('Bienvenido ' + GlobalUser);

            funciones.loadView('./views/viewEnvios.html')
                .then(()=>{
                    ControllerMenu('DELIVERY');
                    classEnvios.CargarDatosRepartidor();
                    classEnvios.CargarEnviosPendientes('tblEnviosPendientes');
                    //dbSelectDocumentos(document.getElementById('tblDocumentos'));

                });
            
            //nav.style="visibility:visible";
            };
        };
    };     
};


