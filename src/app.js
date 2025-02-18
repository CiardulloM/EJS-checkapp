//import
import express, { query } from 'express';
import engine from 'ejs-mate';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';

//import routes
import home from './routes/home.js';
import users from './routes/users.js';

//app settings
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'helpers')));

//express-session configuration
app.use(
	session({
		secret: '1234',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//static routes
app.get('/scripts/notes.js', (req, res) => {
	res.type('application/javascript');
	res.sendFile(path.join(__dirname, 'scripts', 'notes.js'));
});
app.get('/scripts/home.js', (req, res) => {
	res.type('application/javascript');
	res.sendFile(path.join(__dirname, 'scripts', 'home.js'));
});

//routes
app.get('/', async (req, res) => {
	res.render('index');
});
app.use(users);

app.use((req, res, next) => {
	if (req.session.isLogged == true) next();
	else res.redirect('/login');
});

app.use(home);

//conection
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('something broke');
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
