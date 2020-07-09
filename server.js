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

    let SQLCreate = "CREATE TABLE IF NOT EXISTS usuarios (idusuario TEXT, Fecha_Entrada TEXT, Fecha_Salida TEXT, Duracion TEXT, estado TEXT)";

db.run(SQLCreate, function(err) {
    if (err) return console.error(err.message)
})
 });
    let entrada = new Date();
    
    var prefix2 = config.prefix2;
    
 client.on("message", (message) => {
    
    if (message.content === prefix2 + `user-info`) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	}

    if (message.content.startsWith(prefix2 +"comandos" )){
        const embed = new Discord.MessageEmbed()
        .setTitle("Comandos.")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(0x00AE86)
        .setDescription("Esta es la lista de comandos a utilizar.")
        .setFooter("Si tienes alguna duda contacta con UnderZero", client.user.avatarURL)
        .setImage(message.author.avatarURL)
        .setThumbnail(message.author.avatarURL)
        .setTimestamp()
        .addField("/registrar",
          "ESte comando se utiliza para registrarte y poder utilizar los comandos, de lo contrario no podras.")
        .addField("/policeon",
          "ESte comando se utiliza para entrar en servicio.")
        .addField("/policeoff", "Este comando se utiliza para salir de servicio")
        
        .addField("/last", "Con este comando puedes ver la tabla donde esta la fecha de entrada y salida, una vez hayas terminado el servicio, podras consultar el tiempo que duraste en servicio.", true);
        
        message.channel.send({embed});
    }


    if(message.content.startsWith("britzy")) {
        message.channel.send({embed: {
            color: 3447003,
            description: "no se llama britzy, le dicen mati uwu"
          }});
         
    }

    if(message.content.startsWith(prefix2 + "registrar")){


        let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
        db.get(select, (err, filas) => {
            if(filas){
                message.channel.send({embed: {
                    color: 3447003,
                    description: "Ya te registraste anteriormente."
                  }});

            }else{
                let SQLInsert = `INSERT INTO usuarios(idusuario, Fecha_Entrada, Fecha_Salida, Duracion, estado) VALUES('${message.author.id}', 'sin registrar', 'sin registrar', 'sin registrar', 'false' )`;

        db.run(SQLInsert, function(err) {
            if (err) return console.error(err.message)
            message.channel.send({embed: {
                color: 3447003,
                description: "haz sido registrado con exito "
              }});
            
        })
            }
            
        });

        
    }



   if(message.content.startsWith(prefix2 + "policeon")) {
    let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
    db.get(select, (err, filas) => {

        if (filas){

        console.log(filas.estado);
        if (filas.estado=="true") {
            message.channel.send({embed: {
                color: 3447003,
                description: "Ya estas en servicio."
              }});
            
        }else if(filas.estado=="false"){
            entrada = moment(new Date());
            let SQLInsert2 = `DELETE FROM usuarios WHERE idusuario = ${message.author.id}`
        db.run(SQLInsert2, function(err) {
            if (err) return console.error(err.message)
        
        })
       
        
        message.channel.send({embed: {
            color: 3447003,
            description: `Has entrado en servicio ${message.author.username}!`
          }});
       
        
        let SQLInsert = `INSERT INTO usuarios(idusuario, Fecha_Entrada, Fecha_Salida, Duracion, estado) VALUES('${message.author.id}', '${entrada}', '', '', 'true' )`;

        db.run(SQLInsert, function(err) {
            if (err) return console.error(err.message)
            
        })
        }
        }else {
        
        message.channel.send({embed: {
            color: 3447003,
            description: `aun no te has registrado ${message.author.username}, por favor usa /registrar`
          }});
    }
    });
        }


        if(message.content.startsWith(prefix2 + "last")){

            let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
            db.get(select, (err, filas) => {
                
                if(!filas){
                    message.channel.send({embed: {
                        color: 3447003,
                        description: `aun no te has registrado ${message.author.username}, por favor usa /registrar`
                      }});
                }else{
                    if (filas.estado=="false") {
            
                        if (err) return console.error(err.message)
                        if (!filas) return message.channel.send('Sin resultados.')
                      
                        let embed = new Discord.MessageEmbed()
                          .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL())
                          .addField('ID', filas.idusuario, true)
                          .addField('Fecha de entrada', filas.Fecha_Entrada, true)
                          .addField('Fecha de salida', filas.Fecha_Salida, true)
                          .addField('Tiempo en servicio', filas.Duracion, true)
                          .setColor("ff7b00")
                      
                        message.channel.send(embed);
                       
                      
                     
                      }
                  
                      else if(filas.estado=="true") {
                          let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
                      db.get(select, (err, filas) => {
                        if (err) return console.error(err.message)
                        if (!filas) return message.channel.send('Sin resultados.')
                      
                        let embed = new Discord.MessageEmbed()
                          .setAuthor('Perfil de ' + message.author.username, message.author.displayAvatarURL())
                          .addField('ID', filas.idusuario, true)
                          .addField('Fecha de entrada', filas.Fecha_Entrada, true)
                          .addField('Hora de salida', 'aun no sales de servicio', true)
                          .addField('Tiempo en servicio', 'aun no sales de servicio', true)
                          .setColor("ff7b00")
                      
                        message.channel.send(embed);
                       
                      });
                      }
                }
            
        });
           }


   
   if(message.content.startsWith(prefix2 + "policeoff")) {
    let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
    db.get(select, (err, filas) => {
        if(filas){if (filas.estado=="false") {
            message.channel.send(`no puedes salir de servicio  ${message.author.username} si no has entrado a servicio.`);
        }else if (filas.estado=="true") {
            let salida = moment(new Date());
            
            message.channel.send({embed: {
                color: 3447003,
                description: `Has salido de servicio  ${message.author.username}, con /last puedes consultar tu ultima duracion de trabajo.`
              }});
           
            var duration = salida.diff(entrada,'seconds');
            var form = moment.duration(duration, "seconds").format("h [horas], mm [minutos], ss [segundos]");
            let SQLUpdate =`UPDATE usuarios SET Fecha_Salida = '${salida}', Duracion ='${form}', estado = "false"  WHERE idusuario = "${message.author.id}"`
            db.run(SQLUpdate, function(err) {
                if (err) return console.error(err.message)
            })
            let select = `SELECT * FROM usuarios WHERE idusuario = ${message.author.id}`;
            db.get(select, (err, filas) => {
              if (err) return console.error(err.message)
              if (!filas) return message.channel.send('Sin resultados.')

            }
            );

            
        }}else{
            message.channel.send({embed: {
                color: 3447003,
                description: `aun no te has registrado ${message.author.username}, por favor usa /registrar`
              }});
           
        }
        
    });
  }

 });
 
 client.login("NzMwNjIzOTEzODcyMDY0NTYz.XwbDVQ.dwZEGUYyCeuCrKhhUVDsVtWKkto");
