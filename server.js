const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./mybotdata.sqlite");

var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");
 
momentDurationFormatSetup(moment);
typeof moment.duration.fn.format === "function";
// true
typeof moment.duration.format === "function";
// true




client.on("ready", () => {
    console.log("BOT LISTO!");

    let SQLCreate = "CREATE TABLE IF NOT EXISTS usuarios (idusuario TEXT, Hora_Entrada TEXT, Hora_Salida TEXT)";

db.run(SQLCreate, function(err) {
    if (err) return console.error(err.message)
})
 });
    var estado=false;
    var prefix2 = config.prefix2;
 client.on("message", (message) => {
    let entrada = new Date();
    if (message.content === prefix2 + `user-info`) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}
    var date = new Date();
    
    

    if(message.content.startsWith("britzy")) {
        message.channel.send({embed: {
            color: 3447003,
            description: "no se llama britzy, le dicen mati uwu"
          }});
         
    }

   if(message.content.startsWith(prefix2 + "policeon")) {
        if (estado) {
            message.channel.send("Ya estas en servicio");
        }else{
            let SQLInsert2 = `DELETE FROM usuarios WHERE idusuario = ${message.author.id}`
        db.run(SQLInsert2, function(err) {
            if (err) return console.error(err.message)
        
        })
        
        estado = true;
        message.channel.send(`Has entrado en servicio ${message.author.username} a las: ` +  entrada.getHours() + ` : ` +  entrada.getMinutes() + ` : ` + entrada.getSeconds());
        message.channel.send(estado);
        let SQLInsert = `INSERT INTO usuarios(idusuario, Hora_Entrada, Hora_Salida) VALUES('${message.author.id}', '${entrada.getHours()}:${entrada.getMinutes()}:${entrada.getSeconds()}', '20:20:20' )`;

        db.run(SQLInsert, function(err) {
            if (err) return console.error(err.message)
            message.channel.send("se agregaron los datos a la BD correctamente");
        })
        }
        
        }


        if(message.content.startsWith(prefix2 + "estadisticas")){
            if (!estado) {
            let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
            db.get(select, (err, filas) => {
              if (err) return console.error(err.message)
              if (!filas) return message.channel.send('Sin resultados.')
            
              let embed = new Discord.MessageEmbed()
                .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL())
                .addField('ID', filas.idusuario, true)
                .addField('Hora de entrada', filas.Hora_Entrada, true)
                .addField('Hora de salida', filas.Hora_Salida, true)
                .setColor("ff7b00")
            
              message.channel.send(embed);
             
            });
           
            }else {
                let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
            db.get(select, (err, filas) => {
              if (err) return console.error(err.message)
              if (!filas) return message.channel.send('Sin resultados.')
            
              let embed = new Discord.MessageEmbed()
                .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL())
                .addField('ID', filas.idusuario, true)
                .addField('Hora de entrada', filas.Hora_Entrada, true)
                .addField('Hora de salida', 'aun no sales de servicio', true)
                .setColor("ff7b00")
            
              message.channel.send(embed);
             
            });
            }
            
           }


   
   if(message.content.startsWith(prefix2 + "policeoff")) {
        if (!estado) {
            message.channel.send(`no puedes salir de servicio  ${message.author.username} si no has entrado a servicio.`);
        }else {
            let salida = new Date();
            estado = false;
            message.channel.send(`Has salido de servicio  ${message.author.username} a las`  +  salida.getHours() + ` : `+  salida.getMinutes() + ` : ` + salida.getSeconds());
            message.channel.send(estado);
            let SQLUpdate =`UPDATE usuarios SET Hora_Salida = '${salida.getHours()}:${salida.getMinutes()}:${salida.getSeconds()}' WHERE idusuario = "${message.author.id}"`
            db.run(SQLUpdate, function(err) {
                if (err) return console.error(err.message)
            })
            let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
            db.get(select, (err, filas) => {
              if (err) return console.error(err.message)
              if (!filas) return message.channel.send('Sin resultados.')
            
              
              message.channel.send(moment.duration(salida - entrada).format("H [Horas],m [Minutos],s [Segundos]"));
               
             
            });

            
            

        }
        
  }

 });
 
 client.login("NzMwNjIzOTEzODcyMDY0NTYz.XwaNdQ.g3N3v-0qGPSSEeqoZ5sPG4e6mb0");
