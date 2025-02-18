import express, { query } from 'express';
import { getUserById, getUserByUsername, getIdByEmail, createUser, login } from '../database.js';
import { encrypt, compare } from '../helpers/encrypt.js';

const router = express.Router();

router.get('/register', async (req, res) => {
	if (req.session.isLogged != true) {
		req.session.isLogged = false;
		const n = req.query.n;
		res.render('signup', { n });
	} else res.redirect(`/home/${req.session.user}`);
});
router.post('/register', async (req, res) => {
	const email = req.body.email;
	const user = req.body.username;
	const pass = await encrypt(req.body.password);
	console.log(pass);
	if (user && pass) {
		if ((await createUser(user, pass, email)) > -1) {
			console.log('succesfull registration');
			req.session.isLogged = true;
			req.session.user = user;
			res.redirect(`/home/${user}`);
		} else res.redirect('/register?n=-1');
	} else res.redirect('/register?n=-1');
});

router.get('/login', async (req, res) => {
	if (req.session.isLogged != true) {
		req.session.isLogged = false;
		const n = req.query.n;
		res.render('signin', { n });
	} else res.redirect(`/home/${req.session.user}`);
});
router.post('/login', async (req, res) => {
	const email = req.body.email;
	const pass = req.body.password;

	const encrypted = await login(email);

	const check = await compare(pass, encrypted);

	if (email && pass) {
		if (check) {
			req.session.isLogged = true;
			req.session.user = email;
			res.redirect(`/home/${user}`);
		} else res.redirect('/login?n=-1');
	} else res.redirect('/login?n=-1');
});

router.get('/logout', async (req, res) => {
	if (req.session.isLogged == undefined || req.session.isLogged == false) res.redirect('/');
	else if (req.session.isLogged == true) {
		req.session.isLogged = false;
		req.session.user = -1;
		res.redirect('/login');
	} else console.log('error');
});

export default router;
