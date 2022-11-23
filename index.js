const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ]});

const { prefix, token, checker_brl, checker_eur, binlist } = require('./config.json');

const request = require('request');

client.on('ready', () => console.log('Checker => ON'));

client.on('message', async message => {

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(message.channel.type === 'dm') return;
    if (message.content[0] != prefix) return;

    if(command == 'check'){

        if(!args.length) return message.channel.send(`Comando incompleto.`);
        message.channel.send('O BOT está a checkar. Aguarde...');
        
        request(`${api_checker}${args[0]}`, (err, res, body) => {
            if (err) throw err;
            const parsedResponse = JSON.parse(body);
            if (parsedResponse.response == 'Sucesso') return message.channel.send("***__Checker EUR__*** \nEstado: **" + parsedResponse.status + "**\nMais Informações: **" + parsedResponse.cvc_check + "**");
            return message.channel.send('Ocorreu um erro.');
        });
	} else if (command == 'bin'){

        if (!args.length) return message.channel.send(`Comando incompleto.`);
        
        request(`${binlist}${args[0]}`, (err, res, body) => {
            if (err) throw err; 
            const parsedBody = JSON.parse(body);
            const brand = parsedBody.brand;
            const country = parsedBody.country.name;
            const type = parsedBody.type;
            const scheme = parsedBody.scheme;
            message.channel.send(`***__BIN INFO__*** \nTipo: **${brand}**\nPaís: **${country}**\nNivel: **${type}**\nBandeira: **${scheme}**`);
        });
    }
});

// CLEAR
client.on('message', async (message) => {
  if (
    message.content.toLowerCase().startsWith(prefix + 'limpar') ||
    message.content.toLowerCase().startsWith(prefix + 'l') 
  ) {
    if (!message.member.hasPermission('ADMINISTRATOR')) 
      return message.channel.send("Não tens permissões para utilizar este comando."); 
    if (!isNaN(message.content.split(' ')[1])) {
      let amount = 0;
      if (message.content.split(' ')[1] === '1' || message.content.split(' ')[1] === '0') {
        amount = 1;
      } else {
        amount = message.content.split(' ')[1];
        if (amount > 100) {
          amount = 100;
        }
      }
      await message.channel.bulkDelete(amount, true).then((_message) => {
        message.channel.send(`Apaguei ** \`${_message.size}\` ** mensagens :broom:`).then((sent) => { 
          setTimeout(function () {
            sent.delete();
          }, 2500);
        });
      });
    } else {
      message.channel.send('Insere o número de mensagens que desejas apagar').then((sent) => { 
        setTimeout(function () {
          sent.delete();
        }, 2500);
      });
    }
  } 
}); 
// SAY 
client.on('message', message => {
  if (message.content.startsWith(prefix + 'say')) {
      if (message.author.bot) return;
      const SayMessage = message.content.slice(4).trim();
      message.channel.send(SayMessage)  
  }
});

client.login(token);
