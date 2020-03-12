var fs = require('fs');
var readlineSync = require('readline-sync');
const {table} = require('table');
const {createStream} = require('table');
const {getBorderCharacters} = require('table');

var dataContact = []; // this is place hold data for file 'data.json'\
let data, output, config, showChooseTable;
showChooseTable = [
	['0. Show all the contact'],
	['1. Add contact'],
	['2. Alter contact'],
	['3. Delete contact'],
	['4. Find contact'],
	['5. Save & exit']
];

config = {
	border: getBorderCharacters('ramac')
};

output = table(showChooseTable, config);


function showChoose() {
	// console.log('0. Show all the contact');
	// console.log('1. Add contact');
	// console.log('2. Alter contact');
	// console.log('3. Delete contact');
	// console.log('4. Find contact');
	// console.log('5. Save & exit');

	console.log(output);

	var choose = readlineSync.question('\nWhich do you choose ?\n > ');
	switch(choose){
		case '0':
			showContact();
			showChoose();
			break;

		case '1':
			addContact();
			showChoose();
			break;

		case '2':
			alterContact();
			showChoose();
			break;

		case '3':
			deleteContact();
			showChoose()
			break;

		case '4':
			var listContacts = findContact();
			for(var listContact of listContacts){
				console.log(listContact.name, listContact.phone);
			}
			showChoose();
			break;

		case '5':
			saveContact(dataContact);
			break;

		default:
			console.log('Wrong ??');
			showChoose();
			break;
	}
}

function main(){
	
	var data = fs.readFileSync('./data.json', {encoding: 'utf8'});
	dataContact = JSON.parse(data);
	showChoose();

}
main();

// function hien thi thong tin nguoi dung
function showContact() {
	for(var contact of dataContact)
		console.log(contact.name, contact.phone);
}

// function them nguoi dung
function addContact() {
	var anwser1 = readlineSync.question('What\'s your name ? > ');
	var anwser2 = readlineSync.question('What\'s your phone number ? > ');
	var contact = {
		name: anwser1,
		phone: anwser2
	};
	dataContact.push(contact);
}

// function luu gia tri moi vao file
function saveContact(dataContact) {
	// chuyen doi tu object sang string
	var stringData = JSON.stringify(dataContact);
	fs.writeFileSync('./data.json', stringData, {encoding: 'utf8'});
}

// function tim so dien thoai
function findNumber(anwser2) {
	// trả về các giá trị có thỏa mãn điều kiện bên dưới
	return dataContact.filter(function(element){
		// trả về vị trí của property phone của người dùng trong file
		return element.phone.toLowerCase().indexOf(anwser2.toLowerCase()) !== -1;
	});
}

// function tim ten
function findName(anwser1) {
	// trả về các giá trị có property name thỏa mãn điều kiện bên dưới
	return dataContact.filter(function (element) {
		return element.name === anwser1 || element.name.toLowerCase() === anwser1.toLowerCase();
	})
}

//mang chứa dữ liệu đã được tìm kiếm
var listFindContact;
// function tìm kiếm
function findContact() {
	listFindContact = [];
	console.log('1. Choose following with character');
	console.log('2. Choose following with number\n');
	var anwser = readlineSync.question('Which do you choose ?\n > ');
	switch(anwser){
		case '1':
			var anwser1 = readlineSync.question('What\'s its name ? > ');
			var infoNames = findName(anwser1);
			for(var infoName of infoNames){
				listFindContact.push(infoName);
			}
			return listFindContact;
			break;

		case '2':
			var anwser2 = readlineSync.question('What\'s its phone number ? > ');
			var infos = findNumber(anwser2);
			for(var info of infos){
				listFindContact.push(info);
			}
			return listFindContact;
			break;
	}
}

//Tim dia chi cua bien truyen vao tren dataContact
function findIndex(phone) {
	for(var contact of dataContact){
		if(contact.phone === phone[0].phone){
			return dataContact.indexOf(contact);
		}
	}
}

// function thay đổi thông tin người dùng
function alterContact() {
	//hien thi cac gia tri can thay doi, dua vao tim kiem cua user
	var listContacts = findContact();
	for(var listContact of listContacts){
		console.log(listContact.name, listContact.phone);
	}

	var anwser = readlineSync.question("\nChoose a phone to alter: > ");
	var indexAlter = findIndex(findNumber(anwser));

	console.log("1. If you want to alter name");
	console.log("2. If you want to alter phone");
	console.log("3. Alter all infomation of that");
	var anwser1 = readlineSync.question("What do you choose ? > ");
	switch(anwser1){
		case '1':
			var anwser1 = readlineSync.question("Name: ");
			dataContact[indexAlter].name = anwser1;
			break;
		case '2':
			var anwser2 = readlineSync.question("phone: ");
			dataContact[indexAlter].phone = anwser2;
			break;
		case '3':
			var anwser1 = readlineSync.question('What\'s your name that you change ? > ');
			var anwser2 = readlineSync.question('What\'s your phone number that you change ? > ');
			var contact = {
				name: anwser1,
				phone: anwser2
			};
			dataContact.splice(indexAlter, 1, contact);
			break;
	}
}

// function xóa thông tin người dùng
function deleteContact(contactDelete) {

	//hien thi cac gia tri can thay doi, dua vao tim kiem cua user
	var listContacts = findContact();
	for(var listContact of listContacts){
		console.log(listContact.name, listContact.phone);
	}

	var anwser = readlineSync.question("\nChoose a phone to delete: > ");

	// findNumber() se tra ve contact muon tim trong dataContact
	// fingIndex() se tra ve vi tri cua contact hien ben trong dataContact
	// --> findIndex(findNumber()) giup tim vi tri cua gia tri chua ben trong dataContact

	var indexDelete = findIndex(findNumber(anwser));
	dataContact.splice(indexDelete,1);
}

