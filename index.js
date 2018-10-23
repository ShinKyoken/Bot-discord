const Discord = require('discord.js')
const bot = new Discord.Client()
/*const yt =require('ytdl-core');
const tokens = '++';
const passes = 1;
const adminId = "171687673071665153"*/
var fs = require("fs");

var tableau= [];

function écritureDansFichier(){
  //Cette fonction permet d'écrire le contenu de la variable tableau dans un fichier Json
  var txt="";
  for (var a=0;a<tableau.length;a++){
    txt=txt+"["+'"'+tableau[a][0]+'"'+","+tableau[a][1]+","+'"'+tableau[a][2]+'"'+tableau[a][3]+'"'+"]"+",\n";
  }
  fs.writeFileSync("activité.json",txt, "UTF-8");
}


bot.on('ready', function () {
  console.log("Je suis connecté !")
  var listeIdMembre=bot.users.keys();
  var taille=bot.users.size;
  console.log(taille);
  var tps=Date.now();
  var cpt=0;
  var nom="";
  while(cpt<taille){
    nom=listeIdMembre.next().value;
    var pres=false;
    while(pres!=true){
      for (var i=0;i<tableau.length;i++){
        if (nom===tableau[i][0] || nom==="1" || nom==="480333601141948427"){
          pres=true;
        }
      }
      if (pres!=true){
        tableau.push([nom,0,tps]);
        pres=true;
      }
    }
    cpt=cpt+1;
    console.log(cpt);
  }
  écritureDansFichier();
})

bot.on("guildMemberAdd",function(member){
  var tps=Date.now();
  tableau.push([member.user.id,0,tps]);
  console.log(tableau);
  var add_embed=new Discord.RichEmbed()
  add_embed.setColor("#40A497")
  add_embed.setTitle("Un nouveau est arrivé !")
  /*add_embed.addField(`${member.user.username} Bienvenue à toi ${member.user.tag} `,"---------------------------")
  add_embed.addField("On te souhaite de bien t'amuser parmis nous :D","--------------------------")
  add_embed.setThumbnail(member.user.displayAvatarURL)*/
  add_embed.setImage(member.user.displayAvatarURL);
  add_embed.setDescription("Dites bonjour à "+ member.user.tag);
  
  member.guild.channels.find("name","raconte-ta-vie").send(add_embed)
  écritureDansFichier();
})

bot.on("guildMemberRemove",function(member){
  var leaveTxt=member.user.tag+" a quitté le serveur";
  member.guild.channels.find("name","sortie").send(leaveTxt);
  for (var d=0;d<tableau.length;d++){
    if (tableau[d][0]===member.user.id){
      tableau.splice(d,1);
    }
  }
  console.log(tableau);
  écritureDansFichier();
})

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel


  if(oldUserChannel === undefined && newUserChannel !== undefined) {
    console.log("tu as rejoint le channel");
     // User Joins a voice channel

  } else if(newUserChannel === undefined){
    console.log("tu as quitté le channel");
    var tps=Date.now();
    console.log(tps);
    var pres=false;
    var vocalUser=oldMember.user.id;
    var i =0;
      while (pres!=true){
        if(tableau[i][0]===vocalUser){
          pres=true;
          tableau[i][2]=tps;
        }
        console.log(pres);
        i++;
      }
    
    // User leaves a voice channel
    écritureDansFichier();
  }

})

bot.on('message', function (message){
  var now = new Date();
  var temps = Date.now();
  var present=false;
  var i = 0;
  if(message.member!=null){
    var membre=message.member.user.id;
    
    if (message.content.startsWith("O'nonActif")){
      let args=message.content.split(' ');
      var argsinut=args.shift();
      var nbJour = args.shift();
      var help_embed=new Discord.RichEmbed();
      var date=new Date();
      help_embed.setColor("#40A497")
      help_embed.setTitle("Voici les personnes inactif selon tes critères :")
        for (var c=0;c<tableau.length;c++){
          if ((date-tableau[c][2])>nbJour*86400000){
            help_embed.addField("-"+bot.users.get(tableau[c][0]).tag);
          }
        }
      message.author.createDM().then(function(channel){
        channel.send(help_embed);
      })
      
    }


    if (message.content.startsWith("O'avertissement")){
      let args=message.content.split(' ');
      var argsinut=args.shift();
      var nbJour = args.shift();
      var date=new Date();
        for (var c=0;c<tableau.length;c++){
          if ((date-tableau[c][2])>nbJour*86400000){
            bot.users.get(tableau[c][0]).createDM().then(function(channel1){
              channel1.send("Nous avons remarqué que tu étais plutôt inactif ces derniers temps. Notre but n'étant pas d'engranger le plus de membred possible nous te demanderons de bien vouloir être un minimum actif pour rester au sein de notre communauté ;)")
            })
          }
        }
    }
    while(present!=true){
      var present=false;
      if(tableau.length>0){
        if(tableau[i][0]===membre){
          var present=true;
          tableau[i][1]+=1;
          tableau[i][2]=temps;
          i=0;
        }
        i+=1;
        if (i===tableau.length && present!=true){
          tableau.push([membre,1,temps]);
          var present=true;
          i=0;
        }
      }
      else{
        tableau.push([membre,1,temps,xp]);
        present=true;
      }
      console.log(present);
  }  
  écritureDansFichier();
} 
})


bot.login("NDgwMzMzNjAxMTQxOTQ4NDI3.Dms0qA.WU1GDdnNwFPeTfHzRuRAZ7zEg1k")
