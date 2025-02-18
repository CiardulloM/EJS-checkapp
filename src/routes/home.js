import express, { query } from 'express';
import path from 'path';
import __dirname from '../app.js';
import {
	getUserById,
	getUserByUsername,
	getIdByEmail,
	createUser,
	login,
	getNoteFromUser,
	getNotesFromUser,
	createNote,
	updateDeletedStatus,
	updateNoteFromUser,
	deleteNoteFromUser,
} from '../database.js';

const router = express.Router();
const local = express.Router();

//routes
router.get('/home/:user', async (req, res) => {
	const user = req.session.user;
	const notes = await getNotesFromUser(user);
	res.render('home', { notes, user });
});

router.get('/home/:user/trash', async (req, res) => {
	const user = req.session.user;
	const notes = await getNotesFromUser(user);
	res.render('trash', { notes });
});

router.get('/home/:user/createNote', async (req, res) => {
	const user = req.session.user;
	res.render('newnote', { user });
});

///AJAX

router.get('/home/:user/getNotes', async (req, res) => {
	const user = req.session.user;
	const notes = await getNotesFromUser(user);
	res.json(notes);
});

router.post('/updateNote/:title/:description/:id/:user', async (req, res) => {
	const newTitle = req.params.title;
	const newDescription = req.params.description;
	const noteId = req.params.id;
	const user = req.params.user;
	if (await updateNoteFromUser(user, noteId, newTitle, newDescription)) {
		res.status(200).json({ message: 'Nota actualizada correctamente', status: 1 });
	} else res.status(404).json({ message: 'Nota actualizada correctamente', status: -1 });
});

router.post('/home/:user/createNote/:title/:description', async (req, res) => {
	const title = req.params.title;
	const description = req.params.description;
	let created_by = req.session.user;
	if (isNaN(created_by)) {
		created_by = await getIdByUsername(created_by);
	}
	const deleted = 0;
	if ((await createNote(created_by, title, description, deleted)) > -1) {
		res.status(200).json({ message: 'nota creada correctamente', status: 1 });
	} else res.status(404).json({ message: 'err', status: -1 });
});

router.delete('/updateDeleteStatus/:user/:id/:status', async (req, res) => {
	let user = req.session.user;
	if (isNaN(user)) {
		user = await getIdByUsername(user);
	}
	const noteId = req.params.id;
	const status = parseInt(req.params.status);
	if (await updateDeletedStatus(user, noteId, status))
		res.status(200).json({ message: 'Estado actualizado correctamente', status: 1 });
	else res.status(404).json({ message: 'Error al actualizar el estado', status: -1 });
});

router.delete('/deleteNote/:user/:id', async (req, res) => {
	const user = parseInt(req.params.user);
	const noteId = req.params.id;
	if (await deleteNoteFromUser(user, noteId))
		res.status(200).json({ message: 'The note has been deleted successfully', status: 1 });
	else res.status(404).json({ message: 'Error when tring to delete the note', status: -1 });
});

export default router;
