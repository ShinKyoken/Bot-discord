const Discord = require('discord.js')
const bot = new Discord.Client()
var fs = require("fs");

var tableau= [];
var avert=[];
var emojis = [];
var newArrivant=[];
lastSave=Date.now();

function écritureDansFichier(){
  //Cette fonction permet d'écrire le contenu de la variable tableau dans un fichier Json
  save=Date.now();
  if(save>=lastSave+10){
    var txt="";
    for (var a=0;a<tableau.length;a++){
      txt=txt+"["+'"'+tableau[a][0]+'"'+","+tableau[a][1]+","+'"'+tableau[a][2]+'"'+","+tableau[a][3]+','+tableau[a][4]+"]"+",\n";
    }
    fs.writeFileSync("activité.json",txt, "UTF-8");
    lastSave=save;
  }
}


bot.on('ready', function () {
  //Fonction qui s'active au moment où le bot se lance. Tout les membres du serveur sont entré dans le fichier "activité.json" avec leur valeur de base ([id,nbMessage,tpsLastActivité,xp,tpsLastActivité]).
  console.log("Je suis connecté !")
  var listeIdMembre=bot.users.keys();
  var taille=bot.users.size;
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
        tableau.push([nom,0,tps,0,0]);
        pres=true;
      }
    }
    cpt=cpt+1;
  }
  écritureDansFichier();
})

bot.on("messageReactionAdd", (reaction,user) =>{
  if(reaction.message.channel.id==="485598244542611456"){
    if(emojis.length>0){
      for(var i=0;i<emojis.length;i++){
        if (emojis[i][0]===reaction.emoji.name){
          reaction.message.guild.members.get(user.id).addRole(emojis[i][1]);
          } 
        }
      }
    }
  })

bot.on("messageReactionRemove",(reaction,user)=>{
  if(reaction.message.channel.id==="485598244542611456"){
    if(emojis.length>0){
      for(var i=0;i<emojis.length;i++){
        if (emojis[i][0]===reaction.emoji.name){
          reaction.message.guild.members.get(user.id).removeRole(emojis[i][1]);
          } 
        }
      }
    }
  })
 

bot.on("guildMemberAdd", async member=>{
  //Fonction qui s'active lorsqu'un nouveau membre arrive sur le serveur. On lui assigne des rôle et on l'inscrit dans la base d'activité.
  var tps=Date.now();
  var roleJeux=member.guild.roles.find("name","♦▬▬▬▬▬ 𝙻𝙴𝚂 𝙹𝙴𝚄𝚇 ▬▬▬▬▬♦");
  var roleGrades=member.guild.roles.find("name","♦▬▬▬▬▬ 𝙻𝙴𝚂 𝙶𝚁𝙰𝙳𝙴𝚂 ▬▬▬▬♦");
  member.addRole(roleJeux);
  member.addRole(roleGrades);
  tableau.push([member.user.id,0,tps,0,0]);
  var add_embed=new Discord.RichEmbed()
  add_embed.setColor('#6495ED');
  add_embed.setTitle("Un nouveau est arrivé !");
  add_embed.setThumbnail(member.user.displayAvatarURL);
  add_embed.setDescription("Dites bonjour à "+ member.user.tag);
  
  member.guild.channels.find("name","raconte-ta-vie").send(add_embed)
  écritureDansFichier();
})

bot.on("guildMemberRemove",function(member){
  //Fonction qui s'active lorsqu'un membre quitte le serveur. Il est supprimé de la base activité et avertissement.
  var leaveTxt=member.user.tag+" a quitté le serveur";
  member.guild.channels.find("name","sortie").send(leaveTxt);
  for (var d=0;d<tableau.length;d++){
    if (tableau[d][0]===member.user.id){
      tableau.splice(d,1);
    }
  }
  for (var i=0;i<avert.length;i++){
    avert.splice(i,1);
  }
  écritureDansFichier();
})

bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel


  if(oldUserChannel === undefined && newUserChannel !== undefined) {
     // User Joins a voice channel

  } else if(newUserChannel === undefined){
    var tps=Date.now();
    var pres=false;
    var vocalUser=oldMember.user.id;
    var i =0;
      while (pres!=true){
        if(tableau[i][0]===vocalUser){
          pres=true;
          tableau[i][2]=tps;
        }
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
  var xp=0;
  if(message.member!=null){
    var membre=message.member.user.id;
    
    if (message.content.startsWith("O'help")){
      var help_embed=new Discord.RichEmbed();
      help_embed.setColor("#40A497")
      help_embed.setTitle("Voici les commandes du bot O'shishin :");
      help_embed.addField("-O'role [un emoji] [une mention de role]","permet de lier un emoji à un role");
      help_embed.addField("-O'nonActif [nb] :"," Montre la liste des inactifs depuis nb jours.");
      help_embed.addField("-O'warning [nb] :"," Envois un msg d'avertissement aux inactifs depuis nb jours.");
      help_embed.addField("-O'avertissement [mention du membre] :"," Le membre à un avertissement pour son comportement.")
      help_embed.addField("-O'delAvert [mention du membre] :"," Supprime un membre avertis de la base de donnée.");
      help_embed.addField("-O'showAvert :"," Montre la liste des membres avertis.");
      help_embed.addField("-O'xp :"," Permet de connaitre notre total d'xp.")
      message.author.createDM().then(function(channel2){
        channel2.send(help_embed);
      })  
    }

    if (message.content.startsWith("O'role")){
      var present=false;
      var déjàPassé=0;
      var err=0;
      let args=message.content.split(' ');
      var argsinut=args.shift();
      var Emoji = args.shift();
      var role=message.mentions.roles;
      role=Array.from(role);
      if (role[0]===undefined){
        if(message.member.hasPermission("MANAGE_ROLES")){
        message.author.createDM().then(function(channelErr){
          channelErr.send("Il y a une erreur dans cette commande, veuillez vous referer au O'help .");
        })
        err=1;
      }
    }
  
      if(message.member.hasPermission("MANAGE_ROLES") && err===0){
        role=role[0][1];
        if(emojis.length>0){
            for (var i=0; i<emojis.length;i++ && present!=true){
              if ((role===emojis[i][1] || Emoji===emojis[i][0]) && déjàPassé===0 ){
                present=true;
                message.author.createDM().then(function(channel){
                  channel.send("Le rôle ou l'émoji sont déjà utilisé :(");
                })  
              }
              if(i===emojis.length-1 && present===false){
                present=true;
                déjàPassé=1;

                emojis.push([Emoji,role]);
                message.author.createDM().then(function(channel3){
                  channel3.send("Vous avez accordé le rôle "+role.id+" à l'emoji "+Emoji);
                })  
              }
            }
          }
        else{
          emojis.push([Emoji,role]);
          message.author.createDM().then(function(channel2){
            channel2.send("Vous avez accordé le rôle "+role.id+" à l'emoji "+Emoji);
          })  
        }
      }
      else{
        if(!message.member.hasPermission("MANAGE_ROLES")){
        message.author.createDM().then(function(channel3){
          channel3.send("Vous n'avez pas les permissions pour utiliser cette commande");
        })  
      }
    }
  }

    /*if((message.content.startsWith("O'addRole"))){
      let args=message.content.split(' ');
      console.log(args);
      for(var i=1;i<args.length;i++){
        for(var a=0;a<emojis.length;a++){
          if (emojis[a][0]===args[i]){
            message.member.addRole(emojis[a][1]);
          }
        }
      }
      message.delete();
    }*/

    if (message.content.startsWith("O'nonActif")){
      if(message.member.hasPermission("ADMINISTRATOR")){
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
      else{
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande.");
        })
      }
      
    }

    if (message.content.startsWith("O'avertissement")){
      var err=0;
      var membre=message.mentions.users;
      var membre=Array.from(membre);
      if(membre[0]===undefined && message.member.hasPermission("ADMINISTRATOR")){
        message.author.createDM().then(function(channelErr){
          channelErr.send("Il y a une erreur dans cette commande, veuillez vous referer au O'help .");
        })
        err=1;
      }
      if(message.member.hasPermission("ADMINISTRATOR") && err===0){
        membre=membre[0][1];
        membre=membre.id;
        var pres=false;
        if(avert.length>0){
          for (var i=0;i<avert.length;i++){
            if (avert[i][0]===membre && pres!=true){
              pres=true;
              avert[i][1]+=1;
              nb=avert[i][1];
              message.author.createDM().then(function(channel2){
                channel2.send("Ce membre a maintenant "+nb+" avertissement.");
              })  
            }
            if (i===avert.length-1 && pres===false){
              pres=true;
              avert.push([membre,1]);
              message.author.createDM().then(function(channel2){
                channel2.send("Vous avez avertis "+bot.users.get(membre).tag);
              })  
            }
          }

        }
        else{
          avert.push([membre,1]);
          message.author.createDM().then(function(channel2){
            channel2.send("Vous avez avertis "+bot.users.get(membre).tag);
          })  
        }
      }
      else{
        if(!message.member.hasPermission("ADMINISTRATOR")){
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande");
        })  
      }
    }
    }

    if (message.content.startsWith("O'delAvert")){
      var membre=message.mentions.users;
      var err=0;
      var membre=Array.from(membre);
      if(membre[0]===undefined && message.member.hasPermission("ADMINISTRATOR")){
        err=1;
        message.author.createDM().then(function(channelErr){
          channelErr.send("Il y a une erreur dans cette commande, veuillez vous referer au O'help .");
        })  
      }
      if(message.member.hasPermission("ADMINISTRATOR") && err===0){
        membre=membre[0][1];
        membre=membre.id;
        if(avert.length>0){
          for (var i=0;i<avert.length;i++){
            if (avert[i][0]===membre){
              avert.splice(i,1);
            }
          }
        }
        else{
          message.author.createDM().then(function(channel2){
            channel2.send("Ce membre n'est pas dans la liste des membres avertis.");
          })  
        }
      }
      else{
        if(!message.member.hasPermission("ADMINISTRATOR")){
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande.");
        })  
      }
    }
    }

    if (message.content.startsWith("O'showAvert")){
      if(message.member.hasPermission("ADMINISTRATOR")){
        var help_embed=new Discord.RichEmbed();
        help_embed.setColor("#40A497")
        help_embed.setTitle("Voici les personnes qui sont la cible d'avertissement :")
          for (var c=0;c<avert.length;c++){
              nb=avert[c][1];
              help_embed.addField("-"+bot.users.get(avert[c][0]).tag+" a "+nb+" avertissements.");
            }
        message.author.createDM().then(function(channel){
          channel.send(help_embed);
        })
      }
      else{
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande.");
      })
      }
    } 

    if (message.content.startsWith("O'warning")){
      if(message.member.hasPermission("ADMINISTRATOR")){
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
      else{
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande.");
      })
    }
  }

    /*if (message.content.startsWith("O'purge")){
      if(message.member.hasPermission("ADMINISTRATOR")){

      }
      else{
        message.author.createDM().then(function(channelErr){
          channelErr.send("Vous n'avez pas les permissions pour utiliser cette commande.");
      })
      }
    }*/
      

    if(message.content.startsWith("O'xp")){
      for (var d=0;d<tableau.length;d++){
        if (tableau[d][0]===message.member.user.id){
          var x=tableau[d][3];
          bot.users.get(tableau[d][0]).createDM().then(function(channel){
            channel.send("Tu as actuellement "+x+" xp. Continue comme ça et tu atteindras rapidement le prochain niveau !")
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
          dateXp=tableau[i][4];
          if (temps>=dateXp+30000){
            tableau[i][3]+=1;
            if(tableau[i][3]===1){
              //niveau 0
              var roleMembre=message.guild.roles.find("name","membre");
              message.member.addRole(roleMembre);
            }
            if(tableau[i][3]===100){
              //niveau 1
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 1 ${message.member}`);
            }
            if(tableau[i][3]===300){
              //niveau 2
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 2 ${message.member}`);
            }
            if(tableau[i][3]===700){
              //niveau 3
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 3 ${message.member}`);
            }
            if(tableau[i][3]===1500){
              //niveau 4
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 4 ${message.member}`);
            }
            if(tableau[i][3]===3000){
              //niveau 5
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 5 ${message.member}`);
            }
            if(tableau[i][3]===5000){
              //niveau 6
              message.guild.channels.get("485598979900440598").send(`Bravo, tu as atteint le niveau 6 ${message.member}`);
            }
        tableau[i][4]=temps;
      }
  }
  i+=1;
  if (i===tableau.length && present!=true){
    tableau.push([membre,1,temps,0,0]);
    var present=true;
    i=0;
  }
} 
  else{
  tableau.push([membre,1,temps,xp]);
  present=true;
}
}  
  écritureDansFichier();
}
  })

bot.login("NDgwMzMzNjAxMTQxOTQ4NDI3.Dms0qA.WU1GDdnNwFPeTfHzRuRAZ7zEg1k")
