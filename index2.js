const Discord = require('discord.js')
const bot = new Discord.Client()
var fs = require("fs");

bot.on('ready', function () {
  console.log("Je suis connecté !")
})

var dico=new Map() ;
bot.on('message', function (message){
  var now = new Date();
  var annee = now.getFullYear();
  var mois = now.getMonth() + 1;
  var jour = now.getDate();
  var heure = now.getHours();
  var minute = now.getMinutes();
  var seconde = now.getSeconds();
  var present=false;
  if(dico.has(message.member.user.username)){
      var contenu=dico.get(message.member.user.username);
      contenu[0]+=1;
      contenu[1]=jour+"/"+mois+"/"+annee+"/"+heure+":"+minute+":"+seconde;
      dico.set(message.member.user.username,contenu);
    }
  else{
      console.log("hello");
      var tableau=[0,""];
      tableau[0]=1;
      tableau[1]=jour+"/"+mois+"/"+annee+"/"+heure+":"+minute+":"+seconde;
      dico.set(message.member.user.username,tableau);
    }
    var nowBef=new Date(now-1209600033.12);
    console.log(nowBef.toString());
    console.log(present);
    console.log(dico);
    var json=JSON.stringify(dico);
    console.info(json);
  fs.writeFileSync("activité.json","toto", "UTF-8");
  
})

bot.login("NDgwMzMzNjAxMTQxOTQ4NDI3.Dms0qA.WU1GDdnNwFPeTfHzRuRAZ7zEg1k")