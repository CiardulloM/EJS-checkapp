document.addEventListener('DOMContentLoaded', function () {
	let btns = document.querySelectorAll('.btn-modal-open');

	btns.forEach((btn) => {
		btn.addEventListener('click', function () {
			let btnId = this.id;
			let modal = document.getElementById(`modal-${btnId}`);
			modal.showModal();
		});
	});

	btns = document.querySelectorAll('.btn-create-modal-open');

	btns.forEach((btn) => {
		btn.addEventListener('click', function () {
			let modal = document.getElementById(`modal-newNote`);
			modal.showModal();
		});
	});
});
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
