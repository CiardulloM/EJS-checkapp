//import response from 'express';

//create new note
async function CreateNewNote(user) {
	const inputTitle = document.querySelector(`#modal-newNote [name="title"]`);
	const inputDescription = document.querySelector(`#modal-newNote [name="description"]`);

	const title = inputTitle.value;
	const description = inputDescription.value;

	console.log(user);
	if (confirmation()) {
		await fetch(`http://localhost:3000/home/${user}/createNote/${title}/${description}`, {
			method: 'POST',
		})
			.then((response) => response.json())
			.then((data) => console.log(data));
		console.log(title, description, user);
		AddNote(title, description, user);
	}
}

async function getNotes(user) {
	let ans;
	await fetch(`http://localhost:3000/home/${user}/getNotes`)
		.then((response) => response.json())
		.then((data) => (ans = data));

	return ans;
}

/////CHANGE DELETE STATUS
async function changeDeleteStatus(user, noteId, status, articleId) {
	await fetch(`http://localhost:3000/updateDeleteStatus/${user}/${noteId}/${status}`, { method: 'DELETE' })
		.then((response) => response.json())
		.then((data) => console.log(data));

	deleteArticle(articleId);
}
////DELETE
async function deleteNote(user, noteId, articleId) {
	if (confirmation()) {
		await fetch(`http://localhost:3000/deleteNote/${user}/${noteId}`, {
			method: 'DELETE',
		})
			.then((response) => response.json())
			.then((data) => console.log(data));

		deleteArticle(articleId);
	}
}
///UPDATE
async function updateNoteContent(user, noteId, articleId) {
	const inputTitle = document.querySelector(`#modal-${articleId} [name="title"]`);
	const inputDescription = document.querySelector(`#modal-${articleId} [name="description"]`);

	const title = inputTitle.value;
	const description = inputDescription.value;

	if (confirmation()) {
		await fetch(`http://localhost:3000/updateNote/${title}/${description}/${noteId}/${user}`, { method: 'POST' })
			.then((response) => response.json())
			.then((data) => console.log(data));

		replaceNote(articleId, title, description);
	}
}

//functions
function deleteArticle(id) {
	const article = document.getElementById(id);
	if (article) article.remove();
	else return -1;
}

function confirmation() {
	const isConfirmed = window.confirm('Are You Sure?');
	if (isConfirmed) return 1;
	else return -1;
}

function replaceNote(noteId, newTitle, newDescription) {
	const note = document.getElementById(`${noteId}`);
	const replaceTitle = document.getElementById(`title-${noteId}`);
	const replaceDescription = document.getElementById(`description-${noteId}`);

	const titleConteiner = document.createElement('div');
	titleConteiner.classList.add('title-container');

	const newspan = document.createElement('span');
	newspan.classList.add('note-title');
	newspan.id = `title-${noteId}`;
	newspan.innerHTML = newTitle;
	titleConteiner.appendChild(newspan);

	const description = document.createElement('h3');
	description.id = `description-${noteId}`;
	description.innerHTML = newDescription;
	description.classList.add('note-description');

	note.replaceChild(titleConteiner, replaceTitle);
	note.replaceChild(description, replaceDescription);
}

var prestatus = 0;
async function CreateNote(user, status) {
	const subtitle = document.getElementById('subtitle');
	const notes = await getNotes(user);
	const section = document.getElementById('conteiner');
	if (status == 1 && prestatus != 1) {
		subtitle.innerHTML = 'Notes';
		prestatus = 1;
		section.innerHTML = '';
		for (let i = 0; i < notes.length; i++) {
			if (!notes[i].deleted) {
				const newArticle = document.createElement('article');
				newArticle.classList.add('note');
				newArticle.id = `${i}`;

				const titleConteiner = document.createElement('div');
				titleConteiner.classList.add('title-container');

				const newspan = document.createElement('span');
				newspan.classList.add('note-title');
				newspan.id = `title-${i}`;
				newspan.innerHTML = notes[i].title;
				titleConteiner.appendChild(newspan);
				newArticle.appendChild(titleConteiner);

				const newH3 = document.createElement('h3');
				newH3.classList.add('note-description');
				newH3.id = `description-${i}`;
				newH3.innerHTML = notes[i].description;
				newArticle.appendChild(newH3);

				const deleteButton = document.createElement('button');
				deleteButton.classList.add('delete-button');
				deleteButton.id = `${i}`;
				deleteButton.onclick = function () {
					changeDeleteStatus(notes[i].created_by, notes[i].id, 1, i);
				};
				const deleteIcon = document.createElement('i');
				deleteIcon.classList.add('fa-solid');
				deleteIcon.classList.add('fa-trash');
				deleteButton.appendChild(deleteIcon);
				newArticle.appendChild(deleteButton);

				const btnModalOpen = document.createElement('button');
				btnModalOpen.classList.add('btn-modal-open');
				btnModalOpen.id = `${i}`;
				const editIcon = document.createElement('i');
				editIcon.classList.add('fa-solid');
				editIcon.classList.add('fa-pen');
				btnModalOpen.appendChild(editIcon);
				newArticle.appendChild(btnModalOpen);

				const dialog = document.createElement('dialog');
				dialog.classList.add('modal-open');
				dialog.id = `modal-${i}`;

				const dialogH2 = document.createElement('h2');
				dialogH2.innerHTML = `Edit: ${notes[i].title}`;
				dialogH2.classList.add('title-model');
				dialog.appendChild(dialogH2);

				const dialogForm = document.createElement('form');
				dialogForm.setAttribute('method', 'dialog');

				const form = document.createElement('form');
				form.classList.add('edit-form');

				const titleInput = document.createElement('input');
				titleInput.classList.add('dialog-title-input');
				titleInput.setAttribute('type', 'text');
				titleInput.setAttribute('name', 'title');
				titleInput.setAttribute('placeholder', 'insert new title');
				form.appendChild(titleInput);

				const descriptionInput = document.createElement('input');
				descriptionInput.classList.add('dialog-description-input');
				descriptionInput.setAttribute('type', 'text');
				descriptionInput.setAttribute('name', 'description');
				descriptionInput.setAttribute('placeholder', 'insert new description');
				form.appendChild(descriptionInput);

				const dialogSubmit = document.createElement('button');
				dialogSubmit.classList.add('dialog-submit-btn');
				dialogSubmit.onclick = function () {
					updateNoteContent(notes[i].created_by, notes[i].id, i);
				};
				dialogSubmit.innerHTML = 'Save';
				form.appendChild(dialogSubmit);

				dialogForm.appendChild(form);
				dialog.appendChild(dialogForm);
				newArticle.appendChild(dialog);
				section.appendChild(newArticle);
			}
		}
	} else if (status == -1 && prestatus != -1) {
		subtitle.innerHTML = 'Deleted Notes';
		prestatus = -1;
		section.innerHTML = '';
		console.log(notes);
		for (let i = 0; i < notes.length; i++) {
			if (notes[i].deleted) {
				const newArticle = document.createElement('article');
				newArticle.classList.add('note');
				newArticle.id = `${i}`;

				const titleConteiner = document.createElement('div');
				titleConteiner.classList.add('title-container');

				const newspan = document.createElement('span');
				newspan.classList.add('note-title');
				newspan.id = `title-${i}`;
				newspan.innerHTML = notes[i].title;
				titleConteiner.appendChild(newspan);
				newArticle.appendChild(titleConteiner);

				const newH3 = document.createElement('h3');
				newH3.classList.add('note-description');
				newH3.id = `description-${i}`;
				newH3.innerHTML = notes[i].description;
				newArticle.appendChild(newH3);

				const recoveryButton = document.createElement('button');
				recoveryButton.classList.add('recovery-button');
				recoveryButton.id = `${i}`;
				recoveryButton.onclick = function () {
					changeDeleteStatus(notes[i].created_by, notes[i].id, 0, i);
				};
				const recoveryIcon = document.createElement('i');
				recoveryIcon.classList.add('fa-solid');
				recoveryIcon.classList.add('fa-retweet');
				recoveryButton.appendChild(recoveryIcon);
				newArticle.appendChild(recoveryButton);

				const deleteButton = document.createElement('button');
				deleteButton.classList.add('delete-button');
				deleteButton.id = `${i}`;
				deleteButton.onclick = function () {
					deleteNote(notes[i].created_by, notes[i].id, i);
				};
				const deleteIcon = document.createElement('i');
				deleteIcon.classList.add('fa-solid');
				deleteIcon.classList.add('fa-trash');
				deleteButton.appendChild(deleteIcon);
				newArticle.appendChild(deleteButton);

				section.appendChild(newArticle);
			}
		}
	}
	SelectBtns();
}
function SelectBtns() {
	const btns = document.querySelectorAll('.btn-modal-open');
	if (btns) {
		btns.forEach((btn) => {
			btn.addEventListener('click', function () {
				const btnId = this.id;
				const modal = document.getElementById(`modal-${btnId}`);
				modal.showModal();
			});
		});
	}
}

function AddNote(title, description, user) {
	const id = Date.now();
	const section = document.getElementById('conteiner');
	const newArticle = document.createElement('article');
	newArticle.classList.add('note');
	newArticle.id = `${id}`;

	const titleConteiner = document.createElement('div');
	titleConteiner.classList.add('title-container');

	const newspan = document.createElement('span');
	newspan.classList.add('note-title');
	newspan.id = `title-${id}`;
	newspan.innerHTML = title;
	titleConteiner.appendChild(newspan);
	newArticle.appendChild(titleConteiner);

	const newH3 = document.createElement('h3');
	newH3.classList.add('note-description');
	newH3.id = `description-${id}`;
	newH3.innerHTML = description;
	newArticle.appendChild(newH3);

	const deleteButton = document.createElement('button');
	deleteButton.classList.add('delete-button');
	deleteButton.id = `${id}`;
	deleteButton.onclick = function () {
		changeDeleteStatus(user, id, 1, id);
	};
	const deleteIcon = document.createElement('i');
	deleteIcon.classList.add('fa-solid');
	deleteIcon.classList.add('fa-trash');
	deleteButton.appendChild(deleteIcon);
	newArticle.appendChild(deleteButton);

	const btnModalOpen = document.createElement('button');
	btnModalOpen.classList.add('btn-modal-open');
	btnModalOpen.id = `${id}`;
	const editIcon = document.createElement('i');
	editIcon.classList.add('fa-solid');
	editIcon.classList.add('fa-pen');
	btnModalOpen.appendChild(editIcon);
	newArticle.appendChild(btnModalOpen);

	const dialog = document.createElement('dialog');
	dialog.classList.add('modal-open');
	dialog.id = `modal-${id}`;

	const dialogH2 = document.createElement('h2');
	dialogH2.innerHTML = `Edit: ${title}`;
	dialogH2.classList.add('title-model');
	dialog.appendChild(dialogH2);

	const dialogForm = document.createElement('form');
	dialogForm.setAttribute('method', 'dialog');

	const form = document.createElement('form');
	form.classList.add('edit-form');

	const titleInput = document.createElement('input');
	titleInput.classList.add('dialog-title-input');
	titleInput.setAttribute('type', 'text');
	titleInput.setAttribute('name', 'title');
	titleInput.setAttribute('placeholder', 'insert new title');
	form.appendChild(titleInput);

	const descriptionInput = document.createElement('input');
	descriptionInput.classList.add('dialog-description-input');
	descriptionInput.setAttribute('type', 'text');
	descriptionInput.setAttribute('name', 'description');
	descriptionInput.setAttribute('placeholder', 'insert new description');
	form.appendChild(descriptionInput);

	const dialogSubmit = document.createElement('button');
	dialogSubmit.classList.add('dialog-submit-btn');
	dialogSubmit.onclick = function () {
		updateNoteContent(user, id, id);
	};
	dialogSubmit.innerHTML = 'Save';
	form.appendChild(dialogSubmit);

	dialogForm.appendChild(form);
	dialog.appendChild(dialogForm);
	newArticle.appendChild(dialog);
	section.appendChild(newArticle);
	getnewbtns();
}

function getnewbtns() {
	var newBtns = document.querySelectorAll('.btn-modal-open');
	newBtns.forEach((btn) => {
		btn.addEventListener('click', function () {
			let btnId = this.id;
			let modal = document.getElementById(`modal-${btnId}`);
			console.log(btnId);
			modal.showModal();
		});
	});
}
