import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
//import bscrypt from 'bscrypt'

const pool = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'chat',
	})
	.promise();

// USERS TABLE FUNCTIONS

export async function getIdByEmail(email) {
	const [res] = await pool.query(`SELECT id FROM users WHERE email = ?`, [email]);
	return res[0].id;
}

export async function getUserByUsername(email) {
	const [res] = await pool.query(`SELECT email FROM users WHERE email = ?`, [email]);
	if (res.length <= 0) return -1;
	else return 1;
}

export async function getUserById(id) {
	const [res] = await pool.query(`SELECT email FROM users WHERE id = ?`, [id]);
	return res[0].user;
}

export async function login(email) {
	const [res] = await pool.query(`SELECT password FROM users WHERE email = ?`, [email]);
	return res[0].password;
}

export async function createUser(user, password, email) {
	const a = await getUserByUsername(user);
	if (a == -1) {
		const [res] = await pool.query(
			`
            INSERT INTO users (username, password, email)
            VALUES (?,?,?)
        `,
			[user, password, email]
		);
		return res.insertId;
	} else return -1;
}

// NOTES TABLE FUNCTIONS

export async function getNoteFromUser(user, noteId) {
	const id = await getIdByUsername(user);
	const [res] = await pool.query('SELECT * FROM notes WHERE created_by = ? and id = ?', [id, noteId]);
	return res;
}

export async function getNotesFromUser(user) {
	const id = await getIdByUsername(user);
	const [res] = await pool.query(`SELECT * FROM notes WHERE created_by = ?`, [id]);
	return res;
}

export async function createNote(user, title, description, deleted) {
	const [res] = await pool.query(
		`
        INSERT INTO notes (title, description, created_by, deleted)
        VALUES (?, ?, ?, ?)`,
		[title, description, user, deleted]
	);
	return res.insertId;
}

export async function deleteNoteFromUser(user, noteId) {
	const id = user;
	const [res] = await pool.query(`DELETE FROM notes WHERE id = ? AND created_by = ?`, [noteId, id]);
	return res.affectedRows;
}

export async function updateNoteFromUser(user, noteId, newTitle, newDescription) {
	const id = user;
	const [res] = await pool.query(
		`
        UPDATE notes 
        SET title = ?, description = ? 
        WHERE id = ? AND created_by = ?`,
		[newTitle, newDescription, noteId, id]
	);
	return res.affectedRows;
}

export async function updateDeletedStatus(user, noteId, status) {
	const id = user;
	const [res] = await pool.query(
		`
        UPDATE notes 
        SET deleted = ?
        WHERE id = ? AND created_by = ?`,
		[status, noteId, id]
	);
	return res.affectedRows;
}
