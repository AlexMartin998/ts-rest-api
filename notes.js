/**
 * Auth:
	- User Model
	- Helper Generate JWT
	  - Secret or private Key
		- Establece el payload
	- Middleware Passport
	  - Secret or private Key
		- Uso ese payload
		  - Viene un  uid  verificar q exista. In db and state: true
		- Agregarlo al  setupMiddlewares()
		  - Establecer las rutas NO portegidas
			  - protectWithJWT()  <-  Para APIS en las q NO se envia front y NO notFoundMiddleware
				  - No podria tener un   notFoundMiddleware  xq passport arrojaria  Unauthorized  directamente ya que la ruta (erronea) tb requeriria el token.
				- Con esto ya NO hace nada el  app.use(notFoundMiddleware);
					xq passport no lo deja llegar ya q no viene un token valido. Deberia enviar el token para ver el   notfound
						- O habilitar esas no protegidas, q si no tienen route en el server, pues da el not found. NO hacer, inprouctivo.
			- Tambien podria crear un Middleware que se utilice en Todas las Routes protegidas, like:  ts-node > api-fazt > check-jwt.middlerare.ts
					export default passport.authenticate('jwt', { session: false });
				- We can’t find the page you’re looking for
	- Routes
	  - signup
		- signin


	
		
 * // Auth with Google
		- Generamos el API key de Google
		- En el Front configuramos todo
		  - Desde el Front enviamos el  id_token  al back en el Body - POST
		- Validar Token de Google en nuestro Back: Actualizado a Google Identity
		  - npm install google-auth-library --save
			  - verifyIdToken()		
				- Creamos el  googleVerify()  <-  Helper
				  - Envia la data que necesitamos en el controller para crear un nuevo usuario
					- Este user sera creado por nuestro back
					- Debe tener lo que pide neustro Schema del User Model
		- Crear el User en nuestro  controller
			- Con el decode enviado por el helper verificamos:
			  - NO Existe el email/user:
				  - Creamos el user
					  - Generamos una random Pass xq usamos un hook en el User  .pre()
						- Enviar por email el pass provisional ??
						- Si tiene la posibilidad de cambiar el pass y hacer login normal
				- Existe el email/user
			- En ambos casos vamos a generar un JWT nosotros mismo
			- Y eso le enviamos como responsoe. Como en el  Login

		
		- Crearlo como en FH  <-  Cierta explicacion de las  !==
		  - Como nosotros generamos el token en nuestro back con nuestro secretkey
			  - Solo hay que aplicar la logica de:
				  - !user  <-	 Creamos el user
					- user exist	<-	Generamos el Token
					  - Con esto passport ya se encarga del resto xq nosotros generamos el token
						  - Asi nosotros tenemos todo el control y se nos facilito las cosas
						-  /auth/google  <-  Libre de passport en  setupMiddlewares()
				- Dado que usamos un hook  .pre()  en el User model, todas las passwords van a ser hasheadas. Por tanto debemos generar una ramdon pass para cada user que use el   Google Sign In.
				  - Esta seria una pass provicional, con la q pueden hacer login
					- OPT: Si   google:true   hacer algo <- No login? <- W con google:true q viene
					- Con FH esto No es necesario xq el crea un methos en lugar de usar un hook
					  - X eso el no la hashea en el Google Sign In, con lo cual, todo lo q manden hamas va a coincidar con lo q arroje el  comparePass ya que al hashear la pass q llegue nunca va a ser igual al this.pass ya que esta NO sera un hash
						- Compararia un hash con la pass manual q se guardo en la DB
		- Al gun dia crearlo con: passport-google-oauth20
		  - Asi se puede hacer  redirect('path/route/url') if not authenticated


	============================================================================
  // RESUELTO: 
		- El Helmet al final  <-  Enviar form de login
		- Passport comprobar   user && user.state
		- Controllers: TS
		  - Sin type del return f(x) ni en los args de la fs:
				const getUsers: RequestHandler = async (req, res) => {}
		- 
	============================================================================

	--- Proceso MAS Detallado:
	- Google Vanilla :v  <-  Sin Passport Google Strategy
	  - Primero Generaramos la API Key y API Secret de Google
			- Google Identity: https://developers.google.com/identity/gsi/web/guides/overview
			- Vamos aqui: > Setup:
				https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
				- Luego a "Google APIs console": <- Debemos tener una cuenta
					- Create new project > Name > Crear
						- Selecionamos ese project > "> Pantall de consentimiento"
							- Interno: Solo para la organizacino
							- Externo: Para todos los q tiene cuenta de Google
						> Seleccionamos "Externo" > Crear > Llenamos el formulario d lo q le va a aparecer al que quira hacer sign in en nuestra app con su google account.
						> Guardar y continuar Hasta el final, luego puede editar el resto > "Volver al Panel" >  
						"> Credenciales" > Crear credenciales > "Crear ID de cliente OAuth" > 
							- Name > Origenes autorizados de JS: 
								- Devel: http://localhost   &   http://localhost:PORT
								- Production: dominio.tls  en el q va a estar deplegado el project
								> Guardar/Crear
						- Nos da 1 ID Client (visible para el user) y un Secret cliente (back)
					- Creamos la Variable de Entorno con ese ID Client  <-  .env & Heroku

		- Usuario de Google - Frontend
			- Vamos al HTML q tenemos en la carpeta   public/   y colocamos lo q necesitamos
				--- Display the Sign In With Google button: https://developers.google.com/identity/gsi/web/guides/display-button
					- Copiamos el codigo y lo pegamos en nuestro HTML.
					- Eliminamos el data-atribute:   data-login_uri  xq asi vamos a tener mas control desde nuestro back.
				--- Handle credential responses with JavaScript functions: https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
					- copiamos y pegamos:  	 data-callback="handleCredentialResponse" en vez de  data-login_uri
					- Luego la f(x) y la dejamos como un f(x) normal.
						- El   response.credential   ya es el Google token o ID token
							- Con esto vamos a crar un  user  en nuestro back.  <-  Nuestro propio  token  and User
					- Note: You cannot set both the   data-login_uri   attribute and the   data-callback attribute.
			- Con esto ya tenemos el ID Token de Google, y con ese ID vamos a crear un User en nuestro back.

		- Ruta para manejar autenticacion de Google
			- Creamos el POST reques en el auth.routes.js
				- el path va a ser:  /social/google
				- El   controller:   googleSignIn
			- Desde el front envio el  id_token  con un  fetch  con method  'POST'  xq asi esta configurado el back (route).
				- Ese  id_token  lo envio desde el front xq lo recupero de la f(x) de google: 
					const body = { id_token: response.credential };
						- Lo envio en formato JSON 
		
		- Validar Token de Google - Backend: Actualizado a Google Identity
			--- Verify the Google ID token on your server side:
				- npm install google-auth-library --save
						- verifyIdToken()
				- Copiamos todo el codigo para Node en un helper en nuestro vscode
					- El modulo se llama:  google-verify.js
					- Requiere de nuestro GOOGLE_CLIENT_ID del  .env
					- Destructuring de lo q necesitamos del payload de google.
							const { name, picture, email } = ticket.getPayload();
					- Retornamos un Object con lo que necesitemos y la key q esta en nuestro User Schema <- DB - mongoose.
				- Lo q retorno el helper lo recibimos en el googleSignIn del controller personalizado. 
				
		- Crear un usuario personalizado con las credenciales de Google
			- Estamos haciendo el Sig-in: En donde puden pasar 2 cosas:
				- 1. El usuario no esta registrado (no lo tenemos en DB)
					- Con lo cual, lo registramos y hace login (adquiere un JWT firmado x nuestro back) /AU. Tal cual nuestro proceso manual en el back, solo q ahora con un solo click y con google :v
				- 2. Existe en nuestra DB, pero el state: false
					- NO lo dejamos hacer login/AU 
			- Si se disparaba el catch al intentar el  .save()   
				POST http://localhost:3300/api/auth/google 400 (Bad Request)
				es xq No se esta enviando un role "valido", no envio nada, pero toma como empty string y mi back valida como uno q no esta en los roles validos.
					- SOLUCION: 
						- 1. En el data incluir el role q quiero
						- 2. En el user model dejar un role por default

		- Logout - Google Identity
			- Podriamos cerrar sesion borrando las cookies :v
			- Lo que si debemos hacer es: En el HTML <- Desde el Front
				- Cuando estamos autenticados con Google tenemos acceso a: google.accounst
					-  console.log(google.accounts.id);
						- Y en el id tenemos acceso al disableAutoSelect() q siempre debemos ejecutarlo.
						- revoke(email, cb)
							- email lo obtenemos del   localStorage <- resp.user.mail     q es lo q configure q devuelva el back al hacer Sign In con la f(x) googleSignIn del auth cotroller.
					- Luego eliminamos el email del localStorage y recargamos la pagina. 




 * Users: Test driving development (TDD)
	- 1ro los tests
	- Luego la logica/code para ir cumpliendo los tests
	- 



 * Category: 
  - Al eliminar 1 User este se debe eliminar junto con Todos sus Categories, Products, etc.
	  - En el  User Controller  eliminar manualmente, con busquedas en cada document
	- Si eL User reactiva la cuenta (t liminado), cambia el state de nuevo
	  - Solo de los q se volvieron false al eliminar la cuenta
		- Esto esta bien pensado????
  - Tests



 * Products:
  - PROBLEMA: 2 Users NO pueden tener el mismo producto
	- Tratar de crear un Arr de Productos en el Category Model.
	  - Trabajar con los methods respectivos


 * 
 * 


	// TODO: TS Project
		- Crear una sola carpeta para las   Interface
		  - Interface general para todos los values de las request
				- name, email, password, etc.  	<- Body
				- id														<- Params
				- page, etc.										<- query 	
		-  .env  en  Dependencies ??
		- Route publica con axios para consultar sin token
		- isValidRole en el Auth
		- Sign UP:
		  - If state: false ?? Desbloquear (admin) 
				- If t<30 ingresar normalmente ???
		- Log In: Enviar token como Cookie:
		  -  res.cookie('jwt', token); // add cookie here
		- Eliminar user (state)
		  - En 30 dias se elimina fisicamente
		- 



	// COMPLETADO: Corregir Skeleton
	  + bcyptjs en los Types  <- @types/bcrypt
		+ Instalar passport passport-jwt
		+ Orden de los Middlewares
			- Helmep al final para q no de errores con Google Sign In
			  app.use(cors());
				app.use(express.json());
				app.use(express.urlencoded({ extended: false }));
				app.use(express.static(path.join(__dirname, './../public')));
				app.use(compression()).use(helmet());
		- 





		
	// WORK FLOW
		- TDD: Test-Driven Developmen  <-  JEST
			✔	- Auth
			✔	- Google Sign In
					- Enviar por email el pass provisional ?? <- login normal
			✔	- Users
			✔	- Categories
			✔	- Products
			✔	- Search
			✔ - Upload
			?	- Pokemon team
					- Axios <- PokeAPI
					- Promise.all(resPokeApi.map())  <- Mas rapido. Simulteaneo/Paralelo
			✔	- Cache
				  - Probar como Fazt web - Necesito instalar redis - docker?
				  - Instalamos el plugin - Config Middleware < Routes
				- Docs - Swagger




 * 
 * Commits:
	* 1de583b (HEAD -> step2) [TRY] 1.0 google sign in

	* 32c8ff2 (master) [ADD]: static content (public/) added
	* ea7218d [FIX] auth types fixed
	* 2ee97de [ADD]: auth test suite added
	* d9bcec4 [ADD]: initial project structure


 * 
 */

/**
 * Capitalize name
	const capitalizeName = (name) => {
		const names = name.split(' ');
		const namesUpper = [];
		
		for (const n of names) {
			// namesUpper.push(n[0].toUpperCase() + n.slice(1));
			namesUpper.push(n.replace(n[0], n[0].toUpperCase()));
		}

		return namesUpper.join(' ');
	}

 * s
 */

/* 
================================================


================================================
*/
/** Setup
 * ESLint & Error Lens   <-   Plugins VSCode
	- Inicar ESLint
	  JS: ./node_modules/.bin/eslint --init
			- To check syntax, find problems, and enforce code style
			- CommonJS (require/exports)
			? Framework?  <- only Node = none of these
			? Does your project use TypeScript? 
			- Node
			- Answer questions about your style
			  - JavaScript > Tabs > Single ('') > Unix > Yes - Semicolons (;) > 

		- Se crea el   .eslintrc
			- Podemos editarlo: 


	  TS: ./node_modules/.bin/tslint --init
			- Crea el  tslint.json
				- Agregamos la rule  "no-console": false  para q no marque los errores en consola
		


 * Babel:
  - Instalar dependencias
		npm i -D @babel/cli @babel/core @babel/node @babel/plugin-transform-runtime @babel/preset-env ncp nodemon rimraf
			- @babel/		<-	Pa transpilar codigo con babel
			- ncp				<-	Como No usamos webpack debemos copiar con  ncp  las carpetas al  dist/
			- rimraf: Eliminar dist/ si existe

			--- mocha: Testing
			--- chai: Funciones pal testing. Dentro del  it()
			--- chai-http: Peticiones http
			--- @babel/register: Test con Mocha y ES6

			--- jest: Testing
			--- mockingoose: Mokin de los tests


		npm i express cors dotenv express-validator bcryptjs mongoose jsonwebtoken helmet memory-cache morgan compression
			--- passport				<-	Authentication. Se maneja con Strategies
			--- passport-jwt		<-	Authentication with JWT Strategy
			--- google-auth-library: Authentication with Google

			--- express-fileupload: Cargar archivos <- Mas flexible, codeamos casi todo. FH
			--- multer: Cargar archivos	<-	Modulo mas utilizado

			--- cloudinary: Cargar imgs a Cloudinary
			--- uuid: Generar ID unicos.

			- jsonwebtoken: Generar los tokens
			- cors: Peticiones desde el exterior a nuestra API
			- helmet: Seguridad
			- bcryptjs: encriptar las contrasenas
			- compression: Comprimir peticiones HTTP
			- morgan: HTTP request logger middleware for node.js
			- memory-cache: cache						<-	Biblia de Node
			- swagger: Documentar la API		<-	Biblia de Node

			--- mongoose-autopopulate: Populate directo, sin hacerlo cada controller q lo necesite
			  - Si todos los   getAll()  van a necesitar el populate, usar este plugin
				- No en todos los proyectos es recomedable?

			--- node-cache: Simple and fast NodeJS internal caching  <- Probar en lugar de memory-cache
			--- redis: DB q se guarda en la RAM. 
			  - Se responde desde la RAM en lugar de consultar archivos por HTTP o leerlos en el server SSD
				- Guarga en memoria Cache
				- Instalar  redis  en la PC  <-  Docker pa windows


		// ===============================================
		> Handlebars: Views: Modificar algo
			npm i express cors connect-flash bcryptjs express-handlebars express-session method-override mongoose passport passport-local
				connect-flash			<-	Enviar mensajes entre las vistas. E.g.: Ya estas registrado, Pass incorrecta.
				express-session		<-	Mantener conectado al usuario. Permite guardar datos en la memoria del server, tb es posible guardar en la DB, pero aqui veremos esto q es basico
				method-override		<-	Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
				passport					<-	Autenticar un user. Podemos utilizar cualquier metodo de autenticacion: Google, JWT, etc. Aqui sera local.  Actualizar a JWT




	- Configurar Babel
	  - Creamos el   .babelrc
				{
					"presets": ["@babel/preset-env"],		<- Transpilar codigo
					"plugins": ["@babel/plugin-transform-runtime"]  <- Async, probar en Webpack
				}

		- En el   package.json
		  - Creamos los scripts
						"scripts": {
							"dev": "nodemon ./src --exec babel-node",
							"build": "babel src -d dist && ncp src/views dist/views && ncp src/public dist/public",
							"start": "node ./dist"
						},
				- dev:  	Nodemon debe ejecutarse con babel-node
				- build:	ncp para las carpetas q no tengan  .js	



 * Flujo: Cuando ya se tiene las rutas basicas del CRUD, Primero testing luego implemeting
  - Auth:
	  - Sign Up
		- Log In
		- Authentication: Validar el JWT
		  - Generar el JWT
			- Validar el JWT:  is it authenticated?
				- Passport wit JWT Strategy: Ya hace todo
				  - app.use(protectWithJWT); 	<-	Asi express le pasa req, res y next
				- Todo manual: Validar el JWT e insertarlo en la  req.user
		- Test del Auth
		  - Testing
			  - Jest:  
						"test-jest": "NODE_OPTIONS=--experimental-vm-modules jest ./tests/*.spec.js"
				- Mocha:  
						"test": "mocha --require @babel/register ./tests/*.test.js",
	- Inicia el TDD: 1ro test luego implementacion
	  - 




 *
  // TODO: Refactoring
	  - Unificar todos los  check()  a la f(x) setupMiddleware ???
		- Enviar el Model para tener en general las operaciones Crud ???
		  - Inyeccion de dependencias ??
			- Tener solo un repository, sin services ni demas ??



	


  * Commits validos:  +     ||     Ya implementados:  ++

		+ 4c705ee (HEAD -> master) [ADD]: test to remove pokemon
		+ 0a947de (origin/master) [ADD]: addPokemonToTeam() - Promise.all() added
		+ 59813d4 [ADD]: team controller
		+ 38e3e3a [ADD]: auth test suite added
		++ 180f1b7 [ADD]: testing with jest added
		+ 90e7e5f (HEAD -> master, origin/master) [ADD]: auth test
		-- cdadfee (HEAD -> master, origin/master) [ADD]: auth test
		-- 5f5dcc3 (HEAD -> master, origin/master) [ADD]: auth test
		++ 11dc2d8 (HEAD -> master, origin/master) [ADD]: script test with mocha and ES6
		-- 319a458 (HEAD -> master) [ - ]: No cuenta
		+ b5a64a4 (HEAD -> master) [ADD]: Authentication with Passport - JWT Strategy
		+ fa62875 (origin/master) [ADD]: User Model added
		++ 83fe746 [ADD]: .env, MongoDB, setupMiddlewares() added
		-- e5b48ea [ADD]: .env, MongoDB, setupMiddlewares() added
		++ 30536ba [ADD]: Initial project structure
	
	
	
	
	
	
	
	
	
		

 */
