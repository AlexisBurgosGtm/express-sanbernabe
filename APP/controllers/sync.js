
async function SyncDocumentos(token,coddoc,correlativo,fecha,anio,mes,dia,codcliente,codven,totalventa,totalcosto,obs,st,jsonp){
    var empnit = GlobalEmpnit;
    var f = new Date(fecha);
    anio = f.getFullYear();
    mes = f.getMonth()+1;
    dia = f.getUTCDate();

        var data =JSON.stringify({
            token:token,
            empnit:empnit,
            coddoc:coddoc,
            correlativo:correlativo,
            anio:anio,
            mes:mes,
            dia:dia,
            fecha:fecha,
            codven:codven,
            codcliente:codcliente,
            totalventa:totalventa,
            totalcosto:totalcosto,
            obs:obs,
            st:st,
            jsondocproductos:jsonp
        });
      
        var peticion = new Request('/api/ventas/documentos', {
            method: 'POST',
            headers: new Headers({
                // Encabezados
               'Content-Type': 'application/json'
            }),
            body: data
          });
    
          await fetch(peticion)
          
          .then(function(res) {
            console.log('Estado: ', res.status);
            if (res.status==200)
            {
                funciones.Aviso('Pedido enviado exitosamente!!');
               
                classDbOp.UpdatePedidoEnviado(correlativo);
                dbSelectDocumentos(document.getElementById('tblDocumentos'),1);
            }
          })
          .catch(
              ()=>{
                funciones.AvisoError('No se logró conectar con el servidor');
              }
          )
    };



