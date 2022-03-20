var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var execute = require('./connection');


const PORT = process.env.PORT || 3600;

app.use(bodyParser.json());

app.use(express.static('APP'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
  //console.log("/" + req.method);
  next();
});

app.get("/",function(req,res){
	res.sendFile(path + 'index.html');
}); 


// OBTIENE TODAS LAS EMPRESAS
app.get("/api/empresas/all", async(req,res)=>{

	let token = req.query.token;
	
	let qry = `SELECT EMPNIT,EMPNOMBRE FROM EMPRESAS WHERE TOKEN='${token}' ORDER BY EMPNOMBRE`
	
	execute.Query(res,qry);

});

//OBTIENE LAS VENTAS POR DIA Y VENDEDOR
app.get("/api/ventas/dia", async(req,res)=>{
	
	let token = req.query.token;
	let qry = `SELECT ANIO,MES,DIA,CODVEN,NOMVEN,VENTA,EMPNIT FROM VENTAS_DIA_VENDEDOR WHERE TOKEN='${token}';`;

	execute.Query(res,qry);

});

//OBTIENE LA LISTA DE PRODUCTOS Y PRECIOS CON EXISTENCIA
app.get("/api/productos/all", async(req,res)=>{

	let token = req.query.token
	
	let qry =  `SELECT CODPROD,DESPROD,DESMARCA,CODMEDIDA,EQUIVALE,COSTO,PRECIO,concat('Q',PRECIO) as QPRECIO, EXISTENCIA, EMPNIT
	 FROM PRECIOS WHERE TOKEN='${token}';`
	execute.Query(res,qry);
			
});

//OBTIENE LA LISTA DE PRODUCTOS CON EXISTENCIA ÚNICA
app.get("/api/productos/inventario", async(req,res)=>{

	let token = req.query.token

	let qry = `SELECT CODPROD, DESPROD, EXISTENCIA, LASTUPDATE
		 FROM PRECIOS GROUP BY TOKEN, EMPNIT, CODPROD, DESPROD, EXISTENCIA, LASTUPDATE HAVING (TOKEN = '${token}');`
				
	execute.Query(res,qry);

});


// OBTIENE TODOS LOS CLIENTES DE LA TABLA
app.get("/api/clientes/all", async(req,res)=>{

	let token = req.query.token;

	let qry = `SELECT CLIENTES.CODCLIENTE, CLIENTES.NIT, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE, MUNICIPIOS.DESMUNICIPIO, DEPARTAMENTOS.DESDEPARTAMENTO, CLIENTES.TELEFONOS, CLIENTES.SALDO, CLIENTES.EMPNIT
									FROM CLIENTES LEFT OUTER JOIN DEPARTAMENTOS ON CLIENTES.CODDEPTO = DEPARTAMENTOS.CODDEPARTAMENTO LEFT OUTER JOIN
								 				MUNICIPIOS ON CLIENTES.CODMUNICIPIO = MUNICIPIOS.CODMUNICIPIO
									WHERE (CLIENTES.TOKEN='${token}')`
	
	execute.Query(res,qry);

});

//OBTIENE LA LISTA DE REPARTIDORES
app.get("/api/reparto/repartidores/all", async(req,res)=>{
	
	let token = req.query.token
	let qry = `SELECT EMPNIT,CODREP,NITREP,DESREP,DIRREP,TELREP,CONTACTO,TELCONTACTO,EMAIL,WHATSAPP,CLAVE
	 FROM REPARTIDORES WHERE TOKEN='${token}';`
	execute.Query(res,qry);

});

app.get("/api/reparto/usuarios/login", async(req,res)=>{

	let token = req.query.token;
	
	let qry = `SELECT EMPNIT,CODREP,DESREP,CLAVE FROM REPARTIDORES WHERE TOKEN='${token}';`

	execute.Query(res,qry);

});

app.get("/api/reparto/enviospendientes", async(req,res)=>{

	let token = req.query.token;

	let qry = `SELECT WEB_DOCUMENTOS.EMPNIT, WEB_DOCUMENTOS.CODDOC, WEB_DOCUMENTOS.CORRELATIVO, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE,CLIENTES.TELEFONOS,WEB_DOCUMENTOS.TOTALVENTA, concat('Q',WEB_DOCUMENTOS.TOTALVENTA) as QPRECIO, WEB_DOCUMENTOS.CODREP, 
				REPARTIDORES.DESREP, WEB_DOCUMENTOS.ENTREGADO FROM WEB_DOCUMENTOS LEFT OUTER JOIN
				REPARTIDORES ON WEB_DOCUMENTOS.CODREP = REPARTIDORES.CODREP AND WEB_DOCUMENTOS.EMPNIT = REPARTIDORES.EMPNIT AND 
				WEB_DOCUMENTOS.TOKEN = REPARTIDORES.TOKEN LEFT OUTER JOIN
				CLIENTES ON WEB_DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE AND WEB_DOCUMENTOS.EMPNIT = CLIENTES.EMPNIT AND WEB_DOCUMENTOS.TOKEN = CLIENTES.TOKEN
				WHERE (WEB_DOCUMENTOS.ENTREGADO = 'NO') AND (WEB_DOCUMENTOS.TOKEN='${token}');`
	
	execute.Query(res,qry);

});

app.get("/api/reparto/enviosentregados", async(req,res)=>{
	
	let token = req.query.token
	let qry = `SELECT WEB_DOCUMENTOS.EMPNIT, WEB_DOCUMENTOS.CODDOC, WEB_DOCUMENTOS.CORRELATIVO, CLIENTES.NOMCLIENTE, CLIENTES.DIRCLIENTE,CLIENTES.TELEFONOS,WEB_DOCUMENTOS.TOTALVENTA, concat('Q',WEB_DOCUMENTOS.TOTALVENTA) as QPRECIO, WEB_DOCUMENTOS.CODREP, 
												REPARTIDORES.DESREP, WEB_DOCUMENTOS.ENTREGADO FROM WEB_DOCUMENTOS LEFT OUTER JOIN
												REPARTIDORES ON WEB_DOCUMENTOS.CODREP = REPARTIDORES.CODREP AND WEB_DOCUMENTOS.EMPNIT = REPARTIDORES.EMPNIT AND 
												WEB_DOCUMENTOS.TOKEN = REPARTIDORES.TOKEN LEFT OUTER JOIN
												CLIENTES ON WEB_DOCUMENTOS.CODCLIENTE = CLIENTES.CODCLIENTE AND WEB_DOCUMENTOS.EMPNIT = CLIENTES.EMPNIT AND WEB_DOCUMENTOS.TOKEN = CLIENTES.TOKEN
												WHERE (WEB_DOCUMENTOS.ENTREGADO = 'SI') AND (WEB_DOCUMENTOS.TOKEN='${token}')`
	execute.Query(res,qry);

});

app.post("/api/reparto/marcarenviado", async(req,res)=>{
	
	let token = req.body.token;
	let empnit = req.body.empnit;
	let coddoc = req.body.coddoc;
	let correlativo = Number(req.body.correlativo);

	let sqlQry = `UPDATE WEB_DOCUMENTOS SET ENTREGADO='SI'
		 WHERE TOKEN='${token}' AND EMPNIT='${empnit}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}`
	
	execute.Query(res,sqlQry);
	
});

app.post("/api/reparto/marcarnoenviado", async(req,res)=>{
	
	let token = req.body.token;
	let empnit = req.body.empnit;
	let coddoc = req.body.coddoc;
	let correlativo = Number(req.body.correlativo);

	let sqlQry = `UPDATE WEB_DOCUMENTOS SET ENTREGADO='NO' 
				WHERE TOKEN='${token}' AND EMPNIT='${empnit}' AND CODDOC='${coddoc}' AND CORRELATIVO=${correlativo}`

	execute.Query(res,sqlQry);

});

// OBTIENE LA LISTA DE VENDEDORES
app.get("/api/usuarios/login", async(req,res)=>{
	
	let token = req.query.token;
	
	 let qry = `SELECT CODVEN, NOMVEN, CLAVE, CODDOC,EMPNIT FROM VENDEDORES WHERE TOKEN='${token}';`
		
	 execute.Query(res,qry);

});


app.post("/api/ventas/documentos", async(req,res)=>{

	let _empnit = req.body.empnit;
	let _coddoc = req.body.coddoc;
	let _correlativo = req.body.correlativo;
	let _codcliente = req.body.codcliente;
	let _totalventa = req.body.totalventa;
	let _totalcosto = req.body.totalcosto;
	let _token = req.body.token;
	let _anio =  req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	let _codven = req.body.codven;
	let _fecha = req.body.fecha;  //new Date(_anio,_mes,_dia);
	let _obs = req.body.obs;
	let _st = req.body.st;
	
	let _jsondocproductos = JSON.parse(req.body.jsondocproductos);
	
	let qrydocprod = '';
	_jsondocproductos.map((p)=>{
        qrydocprod += `INSERT INTO WEB_DOCPRODUCTOS (token,empnit,anio,mes,dia,coddoc,correlativo,codprod,desprod,codmedida,equivale,cantidad,totalunidades,costo,precio,totalcosto,totalprecio) 
		values ('${_token}','${_empnit}',${_anio},${_mes},${_dia},'${_coddoc}',${_correlativo},'${p.codprod}','${p.desprod}','${p.codmedida}',${p.equivale},${p.cantidad},${Number(p.equivale)*Number(p.cantidad)},${p.costo},${p.precio},${p.totalcosto},${p.subtotal});`;
    });
		

	let qry = `
		INSERT INTO WEB_DOCUMENTOS 
					(empnit,token,coddoc,correlativo,anio,mes,dia,fecha,codven,codcliente,totalventa,totalcosto,obs,codst,entregado) 
			VALUES ('${_empnit}','${_token}','${_coddoc}',${_correlativo},${_anio},${_mes},${_dia},'${_fecha}',${_codven},
					${_codcliente},${_totalventa},${_totalcosto},'${_obs}',${_st},'NO');
	`
	
	console.log(qry + qrydocprod);
	
	execute.Query(res, qry + qrydocprod);

});


// INSERTA DATOS EN LA TABLA DOCUMENTOS DEL SERVER
//app.get("/api/ventas/documentos", async(req,res)=>{
app.post("/api/ventas/documentos_OLD", async(req,res)=>{

	const sql = require('mssql')
	let _empnit = req.body.empnit;
	let _coddoc = req.body.coddoc;
	let _correlativo = req.body.correlativo;
	let _codcliente = req.body.codcliente;
	let _totalventa = req.body.totalventa;
	let _totalcosto = req.body.totalcosto;
	let _token = req.body.token;
	let _anio =  req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	let _codven = req.body.codven;
	let _fecha = new Date(_anio,_mes,_dia);
	let _obs = req.body.obs;
	let _st = req.body.st;
		
	console.log('Llegó la solicitud ' + 'coddoc:' + _coddoc + ' correlativo: ' + _correlativo + ' cliente: ' + _codcliente + ' total: ' + _totalventa);

	let sqlQry = 'insert into web_documentos (empnit,token,coddoc,correlativo,anio,mes,dia,fecha,codven,codcliente,totalventa,totalcosto,obs,codst,entregado) values (@empnit,@token,@coddoc,@correlativo,@anio,@mes,@dia,@fecha,@codven,@codcliente,@totalventa,@totalcosto,@obs,@codst,@entregado)'

		//const pool = await sql.connect(sqlString)
		const pool1 = await new sql.ConnectionPool(config, err => {
			// ... error checks
					 
			// Query
			 pool1.request() // or: new sql.Request(pool1)
			 .input('empnit', sql.VarChar(50), _empnit)
			 .input('token', sql.VarChar(255), _token)
			 .input('coddoc', sql.VarChar(50), _coddoc)
			 .input('correlativo', sql.Float, _correlativo)
			 .input('anio', sql.Int, _anio)
			 .input('mes', sql.Int, _mes)
			 .input('dia', sql.Int, _dia)
			 .input('fecha', sql.Date, _fecha)
			 .input('codven', sql.Int, _codven)
			 .input('codcliente', sql.Int, _codcliente)
			 .input('totalventa', sql.Float, _totalventa)
			 .input('totalcosto', sql.Float, _totalcosto)
			 .input('obs', sql.VarChar(255), _obs)
			 .input('codst', sql.Int, _st)
			 .input('entregado', sql.VarChar(2), 'NO')
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Ingreso exitoso')
				}
			});
			//sql.close()
			//pool1.release();
		 
		})
		 
		pool1.on('error', err => {
			// ... error handler
		})
});

// INSERTA DATOS EN LA TABLA DOCPRODUCTOS DEL SERVER
app.post("/api/ventas/docproductos_OLD", async(req,res)=>{

	const sql = require('mssql')
	let _token = req.body.token;
	let _empnit = req.body.empnit;

	let _anio =  req.body.anio;
	let _mes = req.body.mes;
	let _dia = req.body.dia;
	
	let _coddoc = req.body.coddoc;
	let _correlativo = req.body.correlativo;
	let _codprod = req.body.codprod;
	let _desprod = req.body.desprod;
	let _codmedida = req.body.codmedida;
	let _equivale = req.body.equivale;
	let _cantidad = req.body.cantidad;
	let _costo = req.body.costo;
	let _precio = req.body.precio;
	let _totalcosto = req.body.totalcosto;
	let _totalprecio = req.body.totalprecio;
	
	console.log('peticion de insert en docprodutos: ' + _desprod)
	
		const pool2 = await new sql.ConnectionPool(config, err => {
			 var sqlQry = 'insert into web_docproductos (token,empnit,anio,mes,dia,coddoc,correlativo,codprod,desprod,codmedida,equivale,cantidad,costo,precio,totalcosto,totalprecio) values (@token,@empnit,@anio,@mes,@dia,@coddoc,@correlativo,@codprod,@desprod,@codmedida,@equivale,@cantidad,@costo,@precio,@totalcosto,@totalprecio)'
			 pool2.request() // or: new sql.Request(pool1)
			 .input('token', sql.VarChar(255), _token)
			 .input('empnit', sql.VarChar(50), _empnit)
			 .input('anio', sql.Int, _anio)
			 .input('mes', sql.Int, _mes)
			 .input('dia', sql.Int, _dia)
			 .input('coddoc', sql.VarChar(50), _coddoc)
			 .input('correlativo', sql.Float, _correlativo)
			 .input('codprod', sql.VarChar(100), _codprod)
			 .input('desprod', sql.VarChar(250), _desprod)
			 .input('codmedida', sql.VarChar(50), _codmedida)
			 .input('equivale', sql.Int, _equivale )
			 .input('cantidad', sql.Int, _cantidad)
			 .input('costo', sql.Float, _costo)
			 .input('precio', sql.Float, _precio)
			 .input('totalcosto', sql.Float, _totalcosto)
			 .input('totalprecio', sql.Float, _totalprecio)
			 .query(sqlQry, (err, result) => {
				if (result.rowsAffected){
					res.send('Ingreso exitoso docproductos... ' + _desprod)
				}
			});
			//sql.close()
			//pool1.release();
		 
		})
		 
		pool2.on('error', err => {
			// ... error handler
		})
});


app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "/views/404.html");
});


app.listen(PORT, function () {
  console.log('Servidor iniciado en el puerto ' + String(PORT));
});

