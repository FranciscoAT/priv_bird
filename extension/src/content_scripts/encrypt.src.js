const IBE = require('ibejs');
let ibe = new IBE();
let id = "abc@gmail.com";
let msg = "test";
let enc_msg = ibe.encrypt(id, msg);
console.log(enc_msg);


