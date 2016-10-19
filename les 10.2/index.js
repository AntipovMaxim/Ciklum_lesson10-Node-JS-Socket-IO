var TelegramBot = require('node-telegram-bot-api');
var token = '296135412:AAEiR8S928mlCDce1dWLnSwNquv9OkpKaYA';
var bot = new TelegramBot(token, {polling: true});
var math = require('mathjs');


bot.onText(/^\/c (.+)$/, function (msg, match) {

  bot.sendMessage(msg.chat.id, calculate(match[1]));

});


function calculate (data) {
    
    try {

   	var input;

	input = data.replace(/\s+/g, '');
    input = input.replace('**', '^');

    var result = math.eval(input);

    
    if(isFinite(result)){
    
     return `Result is ${result}`;
    
    }else{
     
     return 'division by zero is not allowed'
    }

  } catch(e) {

    return `Is not a valid expression. Follow the following instructions:the expression have to starts with '/c', next is mathematical symbols such as +, -, **, *, /, (,). Example: /c 1+1`;

  }
 
}

