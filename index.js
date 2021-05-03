// Initialization/global variables

const Discord = require("discord.js")
const ms = require("ms")
const mongoose = require("mongoose")
const moment = require("moment")
var AWS = require('aws-sdk');
const mineflayer = require("mineflayer")
var tpsPlugin = require("mineflayer-tps")(mineflayer)
const randomstring = require("randomstring")
const config = require("./config")
const axios = require('axios')
const request = require("request")
const { help, typeOf, i} = require("mathjs")
const fs = require("fs")
const util = require("util")
const textToSpeech = require('@google-cloud/text-to-speech');
const clientt = new textToSpeech.TextToSpeechClient();
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]})
const cooldowns = new Set()
var exec = require('child_process').exec;
var used = 0;
client.aliases = new Discord.Collection()
client.commands = new Discord.Collection()
var bot = mineflayer.createBot(config.settings)
bot.loadPlugin(tpsPlugin)
bot.serverchat = []
bot.sudo = []
bot.sudoon = false;
bot.ftopon = false;
bot.ftop = {
    names:[],
    ftop:[],
    ptop:[]
}
bot.chatAddPattern(/^\[\[(?:[^ ]*)] ([^ ]*) (?:[^]*| )-> me\] (.*)$/, "dm", "archon dm") 
bot.chatAddPattern(/^\[(?:[^ ]*)] \(([^ ]*) ➥ me\) (.*)$/, "dm", "archon dm")

bot.chatAddPattern(/^(?:[*+-]{0,3}|[^ ]*)(?: |)(?:[ ]{0,1})([^ ]*): (.*)$/, "fcf", "archon fcf")
bot.chatAddPattern(/\[!] WE ARE GETTING RAIDED \[!]/, "raid", "archon raid alerts")
const vec3 = require('vec3')

var staff = [
    "Codester511",
    "IniquityRy",
    "OperatedBYT",
    "Notched",
    "Idiopathic",
    "Artitus",
    "Dabify",
    "Qiyn",
    "MatrixEh",
    "Oliviaax",
    "Jushua",
    "mqny",
    "xNestle",
    "Solce",
    "Dyzl",
    "IShootMilk",
    "Sexq",
    "Breeezies",
    "Swirlys",
    "Decipty",
    "HandBuilt",
    "MoistMeth",
    "Preenix",
    "SanctusNugis",
    "Scorp1qn_",
    "FirstWallScout",
    "__Lego__"
]
let v = []
const { inspect } = require("util");
const { Stream } = require("stream");
var data;

var Polly = new AWS.Polly({
    region: 'us-east-1',
    accessKeyId: 'AKIAV6TFB5FYLVNOJV7N',
    secretAccessKey: '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'
});

var onlineindex = 0;
var offlineindex = 0;
//Mongo Schemas


const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    ign: {
        type: String,
        required: false
    },
    wallchecks: {
        type: Number,
        required: true
    },
    bufferchecks:{
        type: Number,
        required: true
    },
    rpostchecks:{
        type: Number,
        required: true
    },
    verifycode:{
        type: String,
        required: true
    },
    verified:{
        type: Number,
        required: true
    },
    lastwallcheck:{
        type: Number,
        required: false
    },
    lastrpostcheck:{
        type: Number,
        required: false
    },
    lastbuffercheck:{
        type: Number,
        required: false
    },
    ttsVoice:{
        type: String,
        required: false,
        default: "Matthew"
    }
}, { timestamps: true});
const User = mongoose.model("User", userSchema)

const permSchema = new mongoose.Schema({
    commandName:{
        type: String,
        required: true
    },
    roles:{
        type: Array,
        required: true,
        default: []
    },
    users:{
        type: Array,
        required: true,
        default: []
    },
    permissions:{
        type: Array, 
        required: true,
        default: []
    }
})
const Perm = mongoose.model("Perm", permSchema)

const guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    prefix: {
        type: String, 
        required: true,
        default: "."
    },
    embedColor:{
        type: String,
        required: true,
        default: "#36393E"
    },
    commandCooldown:{
        type: Number, 
        required: true,
        default: 1
    },
    wallChannel: {
        type: String,
        required: false,
        default: "walls"
    },
    bufferChannel:{
        type: String,
        required: false,
        default: "buffers"
    },
    rpostChannel:{
        type: String,
        required: false,
        default: "rpost"
    },
    serverchatChannel:{
        type: String,
        required: false,
        default: "serverchat"
    },
    rpostCooldown:{
        type: Number, 
        required: true,
        default: 15
    },
    wallCooldown:{
        type: Number, 
        required: true,
        default: 60
    },
    bufferCooldown:{
        type: Number, 
        required: true,
        default: 120
    },
    rpostAlert:{
        type: Number, 
        required: true,
        default: 600
    },
    wallAlert:{
        type: Number, 
        required: true,
        default: 120
    },
    bufferAlert:{
        type: Number, 
        required: true,
        default: 1200
    },
    alertRole:{
        type: String,
        required: true,
        default: "none"
    },
    serverchat:{
        type: Boolean,
        required: true,
        default: false
    },
    walls:{
        type: Boolean, 
        required:true,
        default: false
    },
    buffers:{
        type: Boolean,
        required: true,
        default: false
    },
    rpost:{
        type: Boolean,
        required: true,
        default: false
    },
    grace: {
        type: Boolean,
        required: true,
        default: true
    },
    wallCommand:{
        type: String,
        required: true,
        default: "walls"
    },
    bufferCommand:{
        type: String,
        required: true,
        default: "buffers"
    },
    rpostCommand:{
        type: String,
        required: true,
        default: "rpost"
    }

})
const Guild = mongoose.model("Guild", guildSchema)

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then((lol) => {
    console.log("✔️  Connected to Mongo DB")
}).catch((err) => {
    console.log("❌ Error connecting to Mongo DB")
    console.log(err)
})

var params = {
    OutputFormat: "mp3", 
    SampleRate: "24000", 
    TextType: "text", 
    VoiceId: "Matthew"
   };

// Global Functions


function getUUID(ign){
    let promise = new Promise(function(resolve, reject) {
        axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(res => {
            if(res.data){
                resolve(res.data)
            }
            else{
                resolve(false)
            }
        })
    })
    return promise;
}
var result = function(command, cb){
    var child = exec(command, function(err, stdout, stderr){
        if(err != null){
            return cb(new Error(err), null);
        }else if(typeof(stderr) != "string"){
            return cb(new Error(stderr), null);
        }else{
            return cb(null, stdout);
        }
    });
}

function tts(text, voice) {
    // The text to synthesize
    let n = [];
    let s = [];
    let voicez = []
    let lan = []
    let promise = new Promise(function(resolve, reject) {
    Polly.describeVoices(function(err, data){
        if(err) console.log(err)
        else{
                data.Voices.forEach(v=>{
                //console.log(v.SupportedEngines)
                if(v.SupportedEngines.indexOf("neural")!== -1){
                    n.push(v.Name)
                }
                if(v.SupportedEngines.indexOf("standard") !== -1){
                    s.push(v.name)
                }
                voicez.push(v)
                })   
                
                    params.Text = text;
                    params.VoiceId = voice;
                    params.Engine = n.indexOf(voice) !== -1 ? "neural" : "standard"
                    // Construct the request
                    Polly.synthesizeSpeech(params, function(err, data){
                        if (err){
                            resolve(false)
                            console.log(err)
                        } 
                        else{
                            resolve(data)
                        }
                    })
                
       

        }
    })
})
return promise;
    



  

  }

function errorHandler(guild, channel, author, error){
    let embed = new Discord.MessageEmbed()
    .setColor(guild.embedColor)
    .setDescription(`${guild.errorEmoji} ${error}`)
    .setTimestamp()
    channel.send(embed)
}

function createUser(userid, name){
    let promise = new Promise(function(resolve, reject) {
    let code = randomstring.generate({
        length: 10,
        charset: "alphabetic"
    })
    if(name !== "not set"){
        let user = new User({
            discordId: userid,
            ign: name,
            wallchecks: 0,
            bufferchecks: 0,
            rpostchecks: 0,
            verifycode: code,
            verified: true,
            lastwallcheck: 100,
            lastbuffercheck: 100,
            lastrpostcheck: 100
        })
        
        user.save().then((result) => {
           resolve(true)
        }).catch((err) => resolve(false))
        
    }
    else{
        let user = new User({
            discordId: userid,
            ign: "not set",
            wallchecks: 0,
            bufferchecks: 0,
            rpostchecks: 0,
            verifycode: code,
            verified: false,
            lastwallcheck: 100,
            lastbuffercheck: 100,
            lastrpostcheck: 100
        })
        
        user.save().then((result) => {
            resolve({
                c: code,
                discord: userid
            })
         }).catch((err) => resolve(false))
    }
})
return promise
}

function deleteUserByDiscord(user){
    let promise = new Promise(function(resolve, reject) {
    User.deleteMany({
        discordId: user
    }).then((lol) => {
        resolve(true)
    }).catch((err) => {
        reject(false)
    })
})
return promise
}

function deleteUserByIGN(user){
    let promise = new Promise(function(resolve, reject) {
    User.deleteMany({
        ign:user
    }).then((lol) => {
       resolve(true);
    }).catch((err) => {
        reject(false);
    })
    })
    return promise
}

function getUserByDiscord(user){
    let promise = new Promise(function(resolve, reject) {
        User.findOne({discordId: user}).then((res) => {
            
            //console.log(res)
            if(Array.isArray(res) && res.length === 0 || res === null || res === undefined){
                resolve(false)
                //console.log("no user")
            }
            else
            {
                //console.log("user")
                resolve(res)
            }
        }).catch((err) => console.log("error lol"))
    });
    return promise;

}

function getUserByCode(user){
    let promise = new Promise(function(resolve, reject) {
        User.findOne({verifycode: user}).then((res) => {
            
            //console.log(res)
            if(Array.isArray(res) && res.length === 0 || res === null || res === undefined){
                resolve(false)
                //console.log("no user")
            }
            else
            {
                //console.log("user")
                resolve(res)
            }
        }).catch((err) => console.log("error lol"))
    });
    return promise;

}

function getUserByIGN(user){
    
    let promise = new Promise(function(resolve, reject) {
        User.findOne({ign: user}).then((res) => {
            //console.log(res)
            //console.log(res)
            if(Array.isArray(res) && res.length === 0 || res === null || res === undefined){
                resolve(false)
                //console.log("no user")
            }
            else
            {
                //console.log("user")
                resolve(res)
            }
        }).catch((err) => console.log("error lol"))
    });
    return promise;
}

function getUsers(){
    let promise = new Promise(function(resolve, reject) {
        User.find().then((res) => {
            if(Array.isArray(res) && res.length === 0){
                resolve(false)
            }
            else{
               resolve(res)
            }
        })
    })
    return promise
}

function getPerms(){
    let promise = new Promise(function(resolve, reject) {
        Perm.find().then((res) => {
            if(Array.isArray(res) && res.length === 0){
                reject(false)
            }
            else{
               resolve(res)
            }
        })
    })
    return promise;
}

async function getGuild(g){
    let promise = new Promise(function(resolve, reject) {
        Guild.findOne({guildId: g}).then((res) => {
            if(Array.isArray(res) && res.length === 0 || res == null || res == undefined){
                resolve(false)
            }
            else
            {
                
                resolve(res)
            }
        }).catch((err) => console.log(err))
    });
    return promise;
    
}

function createGuild(id){
    let promise = new Promise(function(resolve, reject) {
    let guild = new Guild({
        guildId: id
    })
    
    guild.save().then((result) => {
        resolve(true)
    }).catch((err) => reject(false))
})
return promise
}

async function getPerm(cmdname){
    let promise = new Promise(function(resolve, reject) {
        Perm.findOne({commandName: cmdname}).then((res) => {
            if(Array.isArray(res) && res.length === 0 || res == undefined || res.length == 0){
                resolve(false)
        }
        else{
            resolve(res)
        }
        }).catch((err) => {
            resolve(false)
        })
    })
    return promise

}

function createPerm(cmdname){
    let promise = new Promise(function(resolve, reject) {
        const perm = new Perm({
            commandName: cmdname, 
            roles: [],
            users: [],
            permissions: ["SEND_MESSAGES"]
        })
        perm.save().then((a) => { resolve(true)}).catch((err) => reject(false))
    }).catch((err) => resolve(false))
    return promise

}

function addPermRole(cmdname, role){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $push: {
                roles: role.id
            }
        }, {  safe: true, upsert: true}  ).then(a =>  { resolve(true)}).catch((err) => resolve(false))
    })
    return promise;

}

function addPermUser(cmdname, user){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $push: {
                users: user.id
            }
        }, {  safe: true, upsert: true}  ).then(a =>  {resolve(true)}).catch((err) => reject(false))
    })

}

function addPermPermission(cmdname, permission){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $push: {
                perms: permission
            }
        }, {  safe: true, upsert: true}  ).then(a =>  {resolve(true)}).catch((err) => {
            reject(false)
        })
    })

}

function delPermRole(cmdname, role){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $pull: {
                roles: role.id
            }
        }, {  safe: true, upsert: true}  ).then(a =>  {resolve(true)}).catch((err) => {reject(false)})
    })
    return promise;
}

function delPermUser(cmdname, user){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $pull: {
                users: user.id
            }
        }, {  safe: true, upsert: true}  ).then(a =>  {resolve(true)}).catch((err) => reject(false))
    })
    return promise;

}

function delPermPermission(cmdname, permission){
    let promise = new Promise(function(resolve, reject) {
        Perm.updateOne({ commandName: cmdname }, {
            $pull: {
                perms: permission
            }
        }, {  safe: true, upsert: true}  ).then(a =>  {resolve(true)}).catch((err) => reject(false))
    })
    return promise

}

async function checkPerms(cmdname, message){
    let promise = new Promise(function(resolve,reject){
        getPerm(cmdname).then((cmd) => {
            if(cmd === null){
                createPerm(cmdname).then(res=>{
                    checkPerms(cmdname, message)
                })
            }
            else{
                let final = []
                if(cmd.roles.length !== 0){
                    cmd.roles.forEach(r=>{
                        if(message.member.roles.cache.has(r)){
                            final.push("cmd")
                        }
                    })
                }
        
                if(cmd.users.length !== 0){
                    cmd.users.forEach(u=>{
                        if(message.author.id === u){
                            final.push("cmd")
                        }
                    })
                }
        
                if(cmd.permissions.length !== 0){
                    cmd.permissions.forEach(p=>{
                        if(message.member.hasPermission(p)){
                            final.push("cmd")
                        }
                    })
                }
                if(final.length !== 0){
                    resolve(true)
                }
                else{
                    resolve(false)
                }
            }
    })
    })
    return promise;


}

function noPerms(g, cmdname, message){
    let embed = new Discord.MessageEmbed()
    .setDescription(`:warning: You don't have permission to execute the \`${cmdname}\` command.`)
    .setColor(g.embedColor)
    .setTimestamp()
    message.channel.send(embed)
}

function miscError(g, message, content){
    let embed = new Discord.MessageEmbed()
    .setDescription(content)
    .setColor(g.embedColor)
    .setTimestamp()
    message.channel.send(embed)
}


// commands array


//events/emitters
bot.on('login', async () => {
    setTimeout(() => {
        bot.chat(config.hubcommand)
    }, 1000)
    setInterval(async () => {
        if(bot.serverchat.length !== 0){
            let guild = await getGuild(config.mainGuild)
                if(guild === false){
                    console.log("Couldn't find guild :(")
                }
                else{
                    let g = client.guilds.cache.get(config.mainGuild)
                    if(g){
                        let channel = g.channels.cache.find(c => c.name === guild.serverchatChannel)
                        if(guild.serverchat == true && channel){
                            channel.send(`\`\`\`${bot.serverchat.join("\n")}\`\`\``)
                            bot.serverchat = []
                        }
                    }

                }

        }
    }, 5000)
    let now = new Date()    
    let time = Math.round(now.getTime() / 1000)
    let walls = []
    let buffers = []
    let rpost = []
    setInterval(async () => {
        let guild = await getGuild(config.mainGuild)
        getUsers().then((res) => {
            if(res == false || res == []){
                return;
            }
            else{
                console.log(time-Math.max(rpost))
                console.log(rpost)
                res.forEach((u) => {
                    if(u.lastwallcheck) walls.push(u.lastwallcheck)
                    if(u.lastbuffercheck) buffers.push(u.buffercheck)
                    if(u.lastrpostcheck) rpost.push(u.rpostcheck)
                })
                if((time-Math.max(...walls)) % guild.wallAlert == 0 && guild.walls === true){
                    let c = client.channels.cache.get(guild.wallChannel)
                    bot.chat(`/ff Walls have not been checked in ${ms((time-Math.max(...walls))*1000, { long: true })}! Check now and type ${guild.prefix}${guild.wallCommand}`)
                    if(c){
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setDescription(`:warning: Walls have been unchecked for ${ms((time-Math.max(...walls))*1000, { long: true })}! Check now by typing ${guild.prefix}${guild.wallCommand}`)
                        c.send(embed)
                    }
                }
                if((time-Math.max(...buffers)) % guild.bufferAlert == 0 && guild.buffers === true){
                    let c = client.channels.cache.get(guild.bufferChannel)
                    bot.chat(`/ff Buffers have not been checked in ${ms((time-Math.max(walls))*1000, { long: true })}! Check now and type ${guild.prefix}${guild.bufferCommand}`)
                    if(c){
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setDescription(`:warning: Buffers have been unchecked for ${ms((time-Math.max(...buffers))*1000, { long: true })}! Check now by typing ${guild.prefix}${guild.bufferCommand}`)
                        c.send(embed)
                    }
                }
                if((time-Math.max(rpost)) % guild.rpostAlert == 0 && guild.rpost === true){
                    console.log("lol")
                    let c = client.channels.cache.get(guild.rpostChannel)
                    bot.chat(`/ff RPost walls have not been checked in ${ms((time-Math.max(rpost))*1000, { long: true })}! Check now and type ${guild.prefix}${guild.rpostCommand}`)
                    if(c){
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setDescription(`:warning: RPost walls have been unchecked for ${ms((time-Math.max(rpost))*1000, { long: true })}! Check now by typing ${guild.prefix}${guild.rpostCommand}`)
                        c.send(embed)
                    }
                }
            }
        })
    }, 1000)
})

bot.on('end', () => {
    process.exit(0)
})

bot.on('fcf', (user,content) => {
    //console.log("xd")
    let now = new Date()  
    let time = Math.round(now.getTime() / 1000)
    getGuild(config.mainGuild).then((guild) => {
        //console.log(user)
        getUserByIGN(user).then((person) => {
            //console.log(person)
            //      console.log(person)
            if (content.indexOf(guild.prefix) != 0) return;
            if(person === false) return console.log("false");
            let args = content.slice(1).trim().split(/ +/g)
            //console.log(args)
            let commandName = args.shift().toLowerCase()
            //console.log(commandName)
           //console.log(commandName)
            switch(commandName){
                case guild.wallCommand:
                    if(guild.walls === true && guild.grace === false){
                        if(time-guild.wallCooldown > person.lastwallcheck){
                            let db = []
                            getUsers().then((r) => {
                                r.forEach(user => {
                                    db.push(user.lastwallcheck)
                                })
                            })
                            request(`https://api.mojang.com/users/profiles/minecraft/${person.ign}`, {
                                json: true
                            }, (err, res, uuid) => {
                                if (err) {
                                    return console.log(err);
                                }   
                                    let g = client.guilds.cache.get(config.mainGuild)
                                    let channel = g.channels.cache.find(c => c.name.toLowerCase().includes(guild.wallChannel.toLowerCase()))
                                    if(channel){
                                                let embed = new Discord.MessageEmbed()
                                                .setTitle(`Wall Check`)
                                                .addField(`Check Time`, `${ms((time-Math.max(...db))*1000, { long: true })}`)
                                                .addField(`Total Checks`, `${person.wallchecks+1}`)
                                                .addField(`Discord`, `${client.users.cache.get(person.discordId).tag} (${person.discordId})`)
                                                .addField(`IGN`, person.ign)
                                                .setColor(guild.embedColor)
                                                .setTimestamp()
                                                embed.setThumbnail(`https://crafatar.com/avatars/${uuid.id}.png`, true)
    
                                                channel.send(embed)   
                                    }
                                    person.wallchecks++
                                    bot.chat(`/ff ${person.ign} checked walls! Time since last check: ${ms((time-Math.max(...db))*1000, { long: true })}! Total Checks: ${person.wallchecks}`)
                                    person.lastwallcheck = time
                                    person.save()
                                    return;
                            });
                        }
                        else{
                            bot.chat(`/ff You are on cooldown for ${Math.abs((person.lastwallcheck+guild.wallCooldown)-time)} seconds`)
                        }
                    }
                    break;
                case guild.bufferCommand:
                    if(guild.buffers === true && guild.grace === false){
                        if(time-guild.bufferCooldown > person.lastbuffercheck){
                            let db = []
                            getUsers().then((r) => {
                                r.forEach(user => {
                                    db.push(user.lastbuffercheck)
                                })
                            })
                            request(`https://api.mojang.com/users/profiles/minecraft/${person.ign}`, {
                                json: true
                            }, (err, res, uuid) => {
                                if (err) {
                                    return console.log(err);
                                }   
                                    let g = client.guilds.cache.get(config.mainGuild)
                                    let channel = g.channels.cache.find(c => c.name.toLowerCase().includes(guild.bufferChannel.toLowerCase()))
                                    if(channel){
                                                let embed = new Discord.MessageEmbed()
                                                .setTitle(`Buffer Check`)
                                                .addField(`Check Time`, `${ms((time-Math.max(...db))*1000, { long: true })}`)
                                                .addField(`Total Checks`, `${person.bufferchecks+1}`)
                                                .addField(`Discord`, `${client.users.cache.get(person.discordId).tag} (${person.discordId})`)
                                                .addField(`IGN`, person.ign)
                                                .setColor(guild.embedColor)
                                                .setTimestamp()
                                                embed.setThumbnail(`https://crafatar.com/avatars/${uuid.id}.png`, true)
    
                                                channel.send(embed)   
                                    }
                                    person.bufferchecks++
                                    bot.chat(`/ff ${person.ign} checked buffers! Time since last check: ${ms((time-Math.max(...db))*1000, { long: true })}! Total Checks: ${person.bufferchecks}`)
                                    person.lastwallcheck = time
                                    person.save()
                                    return;
                            });
                        }
                        else{
                            bot.chat(`/ff You are on cooldown for ${Math.abs((person.lastbuffercheck+guild.bufferCooldown)-time)} seconds`)
                        }
                    }
                    break;
                case guild.rpostCommand:
                    if(guild.rpost === true && guild.grace === false){
                        if(time-guild.rpostCooldown > person.lastrpostcheck){
                            let db = []
                            getUsers().then((r) => {
                                r.forEach(user => {
                                    db.push(user.lastrpostcheck)
                                })
                            })
                            request(`https://api.mojang.com/users/profiles/minecraft/${person.ign}`, {
                                json: true
                            }, (err, res, uuid) => {
                                if (err) {
                                    return console.log(err);
                                }   
                                    let g = client.guilds.cache.get(config.mainGuild)
                                    let channel = g.channels.cache.find(c => c.name.toLowerCase().includes(guild.wallChannel.toLowerCase()))
                                    if(channel){
                                                let embed = new Discord.MessageEmbed()
                                                .setTitle(`Raiding Outpost Check`)
                                                .addField(`Check Time`, `${ms((time-Math.max(...db))*1000, { long: true })}`)
                                                .addField(`Total Checks`, `${person.rpostchecks+1}`)
                                                .addField(`Discord`, `${client.users.cache.get(person.discordId).tag} (${person.discordId})`)
                                                .addField(`IGN`, person.ign)
                                                .setColor(guild.embedColor)
                                                .setTimestamp()
                                                embed.setThumbnail(`https://crafatar.com/avatars/${uuid.id}.png`, true)
    
                                                channel.send(embed)   
                                    }
                                    person.rpostchecks++
                                    bot.chat(`/ff ${person.ign} checked RPost walls! Time since last check: ${ms((time-Math.max(...db))*1000, { long: true })}! Total Checks: ${person.rpostchecks}`)
                                    person.lastwallcheck = time
                                    person.save()
                                    return;
                            });
                        }
                        else{
                            bot.chat(`/ff You are on cooldown for ${Math.abs((person.lastrpostcheck+guild.rpostCooldown)-time)} seconds`)
                        }
                    }
                    break;
                case "tts":
                    let g = client.guilds.cache.get(config.guildID);
                    let u = person.discordId;
                    let member  = g.member(u)
                    if(!member.voice.channel){
                        bot.chat("/ff [X] You aren't in a voice channel")
                    }
                    else if(g.me.voice.channel && member.voice.channel.id !== g.me.voice.channel.id){
                        bot.chat("/ff [X] You aren't in the same voice channel as I am")
                    }
                    else if(member.hasPermission("SEND_MESSAGES") && used == 0){
                        const broadcast = client.voice.createBroadcast()
                        
                        var c = client.channels.cache.get(member.voice.channelID)
                        c.join().then(connection=>{
                            //console.log(args)
                            console.log(person)
                            tts(args.join(" "), person.ttsVoice).then((res) => {
                                bot.chat(`/ff Playing ${args.join(" ")}`)
                                //console.log(args)
                                //console.log(args.join(" "))
                                var bufferStream = new Stream.PassThrough()
                                bufferStream.end(res.AudioStream);
                                broadcast.play(bufferStream);
                                connection.play(broadcast, {volume:2})
                            })
                        })

                    }
                    else{
                        return bot.chat("/ff [X] Another broadcast is playing");
                    }
                    break;
                case "v":
                    bot.chat(`/ff [!] Vanish disabled on ${config.settings.host}! Please refer to the help manual.`)
                    /*
                    for(let i=0;i<=staff.length;i++){
                        setTimeout(() => {
                            bot.tabComplete(`/f f  ${staff[i]}`,function(matches){
                                return;
                            },false,false).then(res=>{
                                if(res.length !== 0){
                                    v.push(res[0])
                                }
                            })
                            
                            if(i==staff.length){
                                //console.log("xd")
                                bot.chat(`/ff Vanish(${v.length}): ${v.length !== 0 ? v.join(", ") : "No staff online"}`)
                                v=[]
                            }
                        }, i*500)
                    }
                    */
                    break;
                case "tp":
                    bot.chat(`/tpa ${person.ign}`)
                    break;
                case "whois":
                    bot.chat(`/ff ${person.ign} - Walls: ${person.wallchecks}, Buffers: ${person.bufferchecks}, RPostChecks: ${person.rpostchecks}`)
                    break;
                case "fire":
                    const button = bot.findBlock({point: bot.entity.position, matching: 77, maxDistance: 5});
                    if (button)
                      bot.activateBlock(button);
                    var outputvec = vec3(button.position.x, button.position.y, button.position.z);
                     bot.chat(`/ff ${person.ign}, I hit the button at ${outputvec}`)
                     break;
                case "flick":
                    let levers = bot.findBlock({
                        point: bot.entity.position,
                        matching: 69,
                        maxDistance: 5
                       })
                       //console.log(levers)
                       bot.activateBlock(levers)
                       var leverpos = vec3(levers.position.x, levers.position.y, levers.position.z)
                       bot.chat(`/ff ${person.ign}, I flicked the lever at ${leverpos} to the ${levers.metadata == 6 ? "On Position" : "Off Position"}`)
                    break;
                case "help":
                    if(!args[0]){
                        bot.chat(`/ff Avaliable Commands: ${guild.rpostCommand}, ${guild.wallCommand}, ${guild.bufferCommand}, tts, v, flick, fire, whois, tp, tts`)
                    }
                    break;
                case "settings":
                    let gz = client.guilds.cache.get(config.guildID);
                    let uz = person.discordId;
                    let memberz  = gz.member(uz)
                    
                    if(!memberz.hasPermission("ADMINISTRATOR")) return bot.chat(`/ff [!] You don't have permission to run this command`)
                    getGuild(config.guildID).then((res) => {
                        if(!args[0]){
                            let mapped = []
                            Object.keys(res._doc).forEach(k=> {
                                mapped.push(`${k}:${res._doc[k]}`)
                            })
                            bot.chat(`/ff ${mapped.join(", ")}`)
                        }
                        else if(Object.keys(res._doc).indexOf(args[0]) !== -1){
                            //message.channel.send(`*saving* ${msgargs[1]}`)
                            //console.log(typeOf(res._doc[args[0]]))
                            if(typeOf(res._doc[args[0]]) == "number"){
                                res._doc[args[0]] = Number(args.slice(1).join(" "))
                            }
                            else if(typeOf(res._doc[args[0]]) == "boolean"){
                                if(args[1] == "true" || args[1] == "1"){
                                    res._doc[args[0]] = true
                                }
                                else if(args[1] == "false" || args[1] == 0){
                                    res._doc[args[0]] = false
                                }
                                else{
                                    bot.chat(`/ff [!] Invalid Key provided`)
                                    return;
                                }
                            }
                            else{
                                res._doc[args[0]] = args.slice(1).join(" ")
                            }
                            
                
                            Guild.updateOne({ guildId: config.guildID }, 
                                res._doc
                            ).then((xd) => {})
                

                            bot.chat(`/ff (!) Saved ${args.slice(1).join(" ")} as a new value for ${args[0]}`)

                            return;
                        }
                        else{
                            bot.chat(`/ff [!] Invalid key ${args[0]} provided`)
                        }
                    }).catch((err) => {console.log(err)})
                    break;
                case "penis":
                    let random = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
                    if(!args[0]){
                        bot.chat(`/ff (!) Your penis is ${random} inches long`)
                    }
                    else{
                        bot.chat(`/ff (!) ${args[0]}'s pensis is ${random} inches long`)
                    }
                    break;
                case "dick":
                        let random2 = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
                        if(!args[0]){
                            bot.chat(`/ff (!) Your dick is ${random2} inches long`)
                        }
                        else{
                            bot.chat(`/ff (!) ${args[0]}'s dick is ${random2} inches long`)
                        }
                        break;  
                
                    
    
            }
        })
    })

})

bot.on('raid', async () => {
    let guild = await getGuild(config.mainGuild)
    let g = client.guilds.cache.get(config.mainGuild)
    let embed = new Discord.MessageEmbed()
    .setColor(guild.embedColor)
    .setTimestamp()
    .setDescription(`:warning: We are getting raided`)
    let c = g.channels.cache.find(c => c.name === "raid-alerts")
        c.send(embed)
        c.send("@everyone")
    
})

bot.on('entitySpawn', async (entity) => {
    if(entity.mobType === "Creeper"){
        bot.chat(`/ff [!] Creeper detected at X: ${entity.position.x} Y: ${entity.position.y} Z: ${entity.position.z}`)
    }
})
bot.on('message', async (message) => {
    bot.serverchat.push(message.toString())
    if(message.toString().includes("[!] WE ARE BEING RAIDED [!]")){
        let guild = await getGuild(config.mainGuild)
        let g = client.guilds.cache.get(config.mainGuild)
        let embed = new Discord.MessageEmbed()
        .setColor(guild.embedColor)
        .setTimestamp()
        .setDescription(`:warning: We are getting raided`)
        g.channels.cache.find(c => c.name === "raid-alerts")
            c.send(embed)
            c.send("@everyone")
        
    }
    if(bot.sudoon === true){
        bot.sudo.push(message.toString())
    }
    if(/^#([0-9]*) - ([^ ]*) - ([^ ]*)/.test(message.toString()) && bot.ftopon === true){
        let lol = message.toString().split(" - ")
        bot.ftop.names.push(`**${lol[0]} ${lol[1]}**`)
        bot.ftop.ftop.push(`**${message.json.hoverEvent.value.split("\n")[1].split("§b")[1]}**`)
        bot.ftop.ptop.push(`**${message.json.hoverEvent.value.split("\n")[2].split("§b")[1]}**`)
    }
})

bot.on('dm', async (user, content) => {
    //console.log(user)
    let res = await getUserByCode(content)
        //console.log(res)
        if(res === false) return;
        //console.log(res)
        if(content === res.verifycode && res.verified == false){
            res.verified = true;
            res.ign = user;
            res.save().then((z) => {
                bot.chat(`/r You are now verified to the bot!`)
            })
        }
    
})

client.on('ready', async function() {
    console.log(`✔️  Logged in as ${client.user.tag}`)
    console.log(`✔️  Watching ${client.users.cache.size} users in ${client.guilds.cache.size} guild${client.guilds.cache.size > 1 ? "s" : ""}`)
    client.user.setActivity(config.botActivity, {
        type: 'WATCHING'
    })
    getGuild(config.mainGuild).then((guild) => {
        if(guild === false || guild === null){
            createGuild(config.mainGuild)
        }
    })
});
let commands = ["help", "eval", "exec", "av", "whitelist", "flist", "tts", "ftop", "steal", "sudo", "fwho", "wtop", "btop", "settings", "members", "dm", "perm", "setign", "update", "restart", "stats", "setstats", "runcmd"]
client.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let guild = await getGuild(message.guild.id)
    if(message.channel.name == guild.serverchatChannel){
        bot.chat(message.content.toString())
    }
    if(guild == false){
        createGuild(message.guild.id).then(res => guild = res)
    }
    //console.log(guild)
    if(message.content.indexOf(guild.prefix) != 0) return;
    let args = message.content.slice(1).trim().split(/ +/g)
    let commandName = args.shift().toLowerCase()
    if(commands.indexOf(commandName) !== -1){
        let perms = await getPerm(commandName)
        if(perms == false){
            await createPerm(commandName)
        }
        else{
            let z = await checkPerms(commandName, message)
            if(z === false) return noPerms(guild, commandName, message)
        }
    }
    if(commandName === "help"){
        let lol = []
        commands.forEach(c=>lol.push(`\`${c}\``))
        let embed = new Discord.MessageEmbed()
        .setTitle("Help Menu")
        .setColor(guild.embedColor)
        .setDescription(`**Prefix:** ${guild.prefix}\n${lol.join(", ")}`)
        .setTimestamp()
        message.channel.send(embed)
    }
    if(commandName === "eval"){
        const code = args.join(" ")
        try{
            const result = await eval(code)
            let output = result
            if(typeof result !== 'string'){
                output = inspect(result)
            }
            message.channel.send(`\`\`\`${output}\`\`\``)
        }
        catch(err) {
            message.channel.send(`:warning: ${err}`)
        }
    }
    if(commandName === "exec"){
        message.channel.send(`:ok_hand: Executing code...`).then((msg) => {msg.delete({timeout: 5000})})

        exec(args.join(" "), (error, stdout) => {
            let response = (error || stdout)
            message.channel.send(response, {code: 'asciidoc', split: "\n"}).catch((err) => {
                message.channel.send(`\`\`\`${err}\`\`\``)
            })
        })
    }
    if(commandName === "av"){
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").replace("\n", "").toLowerCase()) || message.author
    if (!user) {
        let embed = new Discord.MessageEmbed().setDescription(':warning: Invalid User')
        message.channel.send(embed)
        return;
    }
    
    if(!user.user){
        const avatarEmbed = new Discord.MessageEmbed().setAuthor(`${user.username}'s Avatar`).setImage(user.displayAvatarURL({
            dynamic: true,
            size: 1024
        }))
        .setColor(guild.embedColor)
        .setTimestamp()
        message.channel.send(avatarEmbed);
    }
    else{
        const avatarEmbed = new Discord.MessageEmbed().setAuthor(`${user.user.username}'s Avatar`).setImage(user.user.displayAvatarURL({
            dynamic: true,
            size: 1024
        }))
        .setColor(guild.embedColor)
        .setTimestamp()
        message.channel.send(avatarEmbed);
    }

    }
    if(commandName === "whitelist"){
        if(!args[0]){
            getUserByDiscord(message.author.id).then((user) => {
                            //console.log(user)
            if(user !== false) return miscError(guild, message, ":warning: You are already whitelisted")
            createUser(message.author.id, "not set").then((res) => {
                let embed = new Discord.MessageEmbed()
                .setColor(guild.embedColor)
                .setTimestamp()
                .setDescription(":ok_hand: Check your DMs for a verification code")
                message.channel.send(embed).then((msg) => {
                        let dembed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setFooter(config.settings.host)
                        .setTitle("__WHITELIST__")
                        .addField("Server", bot._client.socket._host, true)
                        .addField("Code", res.c, true)
                        .addField("Bot Username", bot.username, true)
                        .addField("Example", `/msg ${bot.username} ${res.c}`)
                        message.author.send(dembed).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setColor(guild.embedColor)
                            .setTimestamp()
                            .setFooter(config.settings.host)
                            .setDescription(":warning: Couldn't message you, please enable Direct Messages")
                            msg.edit(embed)
                            deleteUserByDiscord(message.author.id)
                        })

                })


                
                //console.log(res)
            })
            })

        }
        else if(args[0] === "list"){
            getUsers().then((result) => {
                if(result == false){
                    return miscError(guild, message, `:warning: There are no whitelisted users`)
                }
                let whitelisted = []
                let description = []
                let field2 = []
                result.forEach(user => {
                    whitelisted.push({
                        "id": user.discordId,
                        "ign": user.ign
                    })
                    if (whitelisted.length === result.length) {
                        whitelisted.forEach(person => {
                            field2.push(`**${person.ign}**`)
                            if(client.users.cache.get(person.id)){
                                description.push(`**${client.users.cache.get(person.id)} (ID: ${person.id})**`)
                            }
                            else{
                                description.push(`**Unknown User (ID: ${person.id})**`)
                            }
                        })
                    }
                })
                const generateEmbed = start => {
                    var n = description.slice(start, start + 10)
                    var n2 = field2.slice(start,start + 10)
                    var embed = new Discord.MessageEmbed()
                        .setTimestamp()
                        .setTitle(`Whitelisted Users`)
                    if(n.length > 0 && n2.length >0){
                        embed.addField("**Discord**", n.join("\n"), true)
                        embed.setColor(guild.embedColor)
                        embed.addField("**IGN**", n2.join("\n"), true)
                        embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                    }
                    else{
                        embed.setDescription(":warning: No whitelisted users")
                    }
        
                    return embed
                }
        
                const author = message.author
                message.channel.send(generateEmbed(0)).then(message2 => {
                    if (description.length <= 10) return
                    message2.react('◀️')
                    message2.react('▶️')
                    const collector = message2.createReactionCollector(
                        (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                            time: 180000
                        }
                    )
        
                    let currentIndex = 0
                    collector.on('collect', async (reaction, user) => {
                        reaction.users.remove(message.author.id)
                        if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                            currentIndex = currentIndex - 10
                        }
                        if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                            currentIndex = currentIndex + 10
                        }
        
                        message2.edit(generateEmbed(currentIndex))
        
                    })
                })
            })
        }
        else if(args[0] === "remove"){
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").replace("\n", "").toLowerCase())
            if(!user){
                deleteUserByIGN(args[1]).then((res) => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(guild.embedColor)
                    .setDescription(`:ok_hand: Removed all users with the ign \`${args[1]}\` from the whitelist`)
                    .setTimestamp()
                    message.channel.send(embed)
                    return;
                })
            }
            else{
                deleteUserByDiscord(user.id).then((res) => {
                    let embed = new Discord.MessageEmbed()
                    .setColor(guild.embedColor)
                    .setDescription(`:ok_hand: Removed ${user} from the whitelist`)
                    .setTimestamp()
                    message.channel.send(embed)
                })
            }
        }
    }
    if(commandName === "flist"){
        bot.chat("/f list")
        bot.sudoon = true
    setTimeout(()=> {
        if(bot.sudo.length !== 0){
            let embed = new Discord.MessageEmbed()
            .setDescription(`\`\`\`${bot.sudo.join("\n")}\`\`\``)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
            .setTimestamp()
            .setColor(guild.embedColor)
        message.channel.send(embed)
        bot.sudo = []
        bot.sudoon = false
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(":warning: Unable to get /f list information, try again")
            .setTimestamp()
            .setColor(guild.embedColor)
            message.channel.send(embed)
            bot.sudoon = false
            bot.sudo = []
        }

    }, 750)

    }
    if(commandName === "sudo"){
        let sudocommand = args.join(" ");

    bot.chat(`${sudocommand}`)
    bot.sudoon = true

    setTimeout(()=> {
        if(bot.sudo.length !== 0){
            let embed = new Discord.MessageEmbed()
            .setTitle("Sudo")
            .setDescription(`\`\`\`${bot.sudo.join("\n")}\`\`\``)
            .setFooter(`${config.settings.host}`)
            .setColor(guild.embedColor)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
            .setTimestamp();
        message.channel.send(embed)
        bot.sudoon = false
        bot.sudo = []
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(":warning: Unable to get sudo information, try again")
            .setTimestamp()
            .setColor(guild.embedColor)
            message.channel.send(embed)
            bot.sudoon = false
            bot.sudo = []
        }

    }, 750)

    }
    if(commandName === "runcmd"){
        let sudocommand = args.join(" ");

    bot.chat(`/${sudocommand}`)
    bot.sudoon = true

    setTimeout(()=> {
        if(bot.sudo.length !== 0){
            let embed = new Discord.MessageEmbed()
            .setTitle("Runcmd")
            .setDescription(`\`\`\`${bot.sudo.join("\n")}\`\`\``)
            .setFooter(`${config.settings.host}`)
            .setColor(guild.embedColor)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
            .setTimestamp();
        message.channel.send(embed)
        bot.sudoon = false
        bot.sudo = []
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(":warning: Unable to get sudo information, try again")
            .setTimestamp()
            .setColor(guild.embedColor)
            message.channel.send(embed)
            bot.sudoon = false
            bot.sudo = []
        }

    }, 750)

    }
    if(commandName === "ftop"){
        bot.chat(`/f top`)
    bot.sudoon = true

    setTimeout(()=> {
        if(bot.sudo.length !== 0){
            let embed = new Discord.MessageEmbed()
            .setTitle("Faction Top")
            .setDescription(`\`\`\`${bot.sudo.join('\n')}\`\`\``)
            .setColor(guild.embedColor)
            .setFooter(`${config.settings.host}`)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
            .setTimestamp();
        message.channel.send(embed)
        bot.sudoon = false
        bot.sudo = []
        }
        else{
            let embed = new Discord.MessageEmbed()
            .setDescription(":warning: Unable to get sudo information, try again")
            .setColor(guild.embedColor)
            .setTimestamp()
            message.channel.send(embed)
            bot.sudoon = false
            bot.sudo = []
        }

    }, 750)
    }
    if(commandName === "fwho"){
        if(!args[0]){
            bot.chat("/f who")
            bot.sudoon = true
            setTimeout(()=> {
                if(bot.sudo.length !== 0){
                    /*
                    console.log(bot.sudo)
                    bot.sudo.forEach(q=>{
                        
                        if(q.includes("Members Offline")){
                            offlineindex = bot.sudo.indexOf(q)
                        }
                        if(q.includes("Members Online")){
                            onlineindex = bot.sudo.indexOf(q)
                        }
                    })
                    console.log(offlineindex)
                    console.log(onlineindex)
                    let out = []
                    for(let i = onlineindex+1;i<offlineindex;i++){
                        bot.sudo[onlineindex+1].split(" | ").forEach(s=>{
                            out.push(s.replace(/g, "").replace(/\+/g, ""))
                        })
                        bot.sudo.splice(i,1)
                    }
                    bot.sudo[onlineindex] = out.join("\n")
                    console.log(out)
                    */
                    let description = bot.sudo.join("\n")
                    const split = description.match(/[\s\S]{1,2000}/g);
            
                    for (let i = 0; i < split.length; i++) {
                        let desc = split[i].split("*").join("⋆").split("_").join("-")
                        let embed = new Discord.MessageEmbed()
                          .setDescription(desc)
                          .setTitle(`Faction Who`)
                          .setFooter(`${config.settings.host}`)
                    .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
                    .setTimestamp()
                    .setColor(guild.embedColor)
                        message.channel.send(embed) // Async context needed to use 'await.'
                          .catch(console.error);  
                      }
                      bot.sudo = []
                      bot.sudoon = false
                }
                else{
                    let embed = new Discord.MessageEmbed()
                    .setDescription(":warning: Unable to get /f who information, try again")
                    .setTimestamp()
                    .setColor(guild.embedColor)
                    message.channel.send(embed)
                    bot.sudo = []
                    bot.sudoon = false
                }
        
            }, 500)
        }
        else{
                bot.chat(`/f who ${args[0]}`)
                bot.sudoon = true
                setTimeout(()=> {
                    if(bot.sudo.length !== 0){
                        let description = bot.sudo.join("\n")
                        const split = description.match(/[\s\S]{1,2048}/g);
                
                        for (let i = 0; i < split.length; i++) {
                            let desc = split[i].split("*").join("⋆").split("_").join("-")
                            let embed = new Discord.MessageEmbed()
                              .setDescription(desc)
                              .setTitle(`${args[0]}`)
                              .setColor(guild.embedColor)
                              .setFooter(`${config.settings.host}`)
                        .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic : true}))
                        .setTimestamp();
                            message.channel.send(embed) // Async context needed to use 'await.'
                              .catch(console.error);  
                          }
                          bot.sudo = []
                          bot.sudoon = false
                    }
                    else{
                        let embed = new Discord.MessageEmbed()
                        .setDescription(":warning: Unable to get /f who information, try again")
                        .setTimestamp()
                        .setColor(guild.embedColor)
                        message.channel.send(embed)
                        bot.sudo = []
                        bot.sudoon = false
                    }
            
                }, 500)
        }
    }
    if(commandName === "wtop"){
        let whitelisted = []
        let description = []
        let field2 = []
        getUsers().then((result) => {
            result.forEach(user => {
                whitelisted.push({
                    "id": user.discordId,
                    "ign": user.ign,
                    "checks": user.wallchecks
                })
                if (whitelisted.length === result.length) {
                    let sorted = whitelisted.slice().sort((a, b) => b.checks - a.checks)
                    sorted.forEach(person => {
                        field2.push(`**${person.checks}**`)
                        if(client.users.cache.get(person.id)){
                            description.push(`**${client.users.cache.get(person.id)} (${person.ign})**`)
                        }
                        else{
                            description.push(`**Unknown User (ID: ${person.id})**`)
                        }
                    })
                }
            })
            const generateEmbed = start => {
                var n = description.slice(start, start + 10)
                var n2 = field2.slice(start,start + 10)
                var embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(`Top wall checks`)
                    .setColor(guild.embedColor)
                if(n.length > 0 && n2.length >0){
                    embed.addField("**Discord**", n.join("\n"), true)
                    embed.addField("**Checks**", n2.join("\n"), true)
                    embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                }
                else{
                    embed.setDescription(":warning: No whitelisted users")
                }
    
                return embed
            }
    
            const author = message.author
            message.channel.send(generateEmbed(0)).then(message2 => {
                if (description.length <= 10) return
                message2.react('◀️')
                message2.react('▶️')
                const collector = message2.createReactionCollector(
                    (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                        time: 180000
                    }
                )
    
                let currentIndex = 0
                collector.on('collect', async (reaction, user) => {
                    reaction.users.remove(message.author.id)
                    if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                        currentIndex = currentIndex - 10
                    }
                    if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                        currentIndex = currentIndex + 10
                    }
    
                    message2.edit(generateEmbed(currentIndex))
    
                })
            })
        })
    }
    if(commandName === "btop"){
        let whitelisted = []
        let description = []
        let field2 = []
        getUsers().then((result) => {
            result.forEach(user => {
                whitelisted.push({
                    "id": user.discordId,
                    "ign": user.ign,
                    "checks": user.bufferchecks
                })
                if (whitelisted.length === result.length) {
                    let sorted = whitelisted.slice().sort((a, b) => b.checks - a.checks)
                    sorted.forEach(person => {
                        field2.push(`**${person.checks}**`)
                        if(client.users.cache.get(person.id)){
                            description.push(`**${client.users.cache.get(person.id)} (${person.ign})**`)
                        }
                        else{
                            description.push(`**Unknown User (ID: ${person.id})**`)
                        }
                    })
                }
            })
            const generateEmbed = start => {
                var n = description.slice(start, start + 10)
                var n2 = field2.slice(start,start + 10)
                var embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(`Top Buffer checks`)
                    .setColor(guild.embedColor)
                if(n.length > 0 && n2.length >0){
                    embed.addField("**Discord**", n.join("\n"), true)
                    embed.addField("**Checks**", n2.join("\n"), true)
                    embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                }
                else{
                    embed.setDescription(":warning: No whitelisted users")
                }
    
                return embed
            }
    
            const author = message.author
            message.channel.send(generateEmbed(0)).then(message2 => {
                if (description.length <= 10) return
                message2.react('◀️')
                message2.react('▶️')
                const collector = message2.createReactionCollector(
                    (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                        time: 180000
                    }
                )
    
                let currentIndex = 0
                collector.on('collect', async (reaction, user) => {
                    reaction.users.remove(message.author.id)
                    if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                        currentIndex = currentIndex - 10
                    }
                    if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                        currentIndex = currentIndex + 10
                    }
    
                    message2.edit(generateEmbed(currentIndex))
    
                })
            })
        })
    }
    if(commandName === "rtop"){
        let whitelisted = []
        let description = []
        let field2 = []
        getUsers().then((result) => {
            result.forEach(user => {
                whitelisted.push({
                    "id": user.discordId,
                    "ign": user.ign,
                    "checks": user.rpostchecks
                })
                if (whitelisted.length === result.length) {
                    let sorted = whitelisted.slice().sort((a, b) => b.checks - a.checks)
                    sorted.forEach(person => {
                        field2.push(`**${person.checks}**`)
                        if(client.users.cache.get(person.id)){
                            description.push(`**${client.users.cache.get(person.id)} (${person.ign})**`)
                        }
                        else{
                            description.push(`**Unknown User (ID: ${person.id})**`)
                        }
                    })
                }
            })
            const generateEmbed = start => {
                var n = description.slice(start, start + 10)
                var n2 = field2.slice(start,start + 10)
                var embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(`Top RPost checks`)
                    .setColor(guild.embedColor)
                if(n.length > 0 && n2.length >0){
                    embed.addField("**Discord**", n.join("\n"), true)
                    embed.addField("**Checks**", n2.join("\n"), true)
                    embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                }
                else{
                    embed.setDescription(":warning: No whitelisted users")
                }
    
                return embed
            }
    
            const author = message.author
            message.channel.send(generateEmbed(0)).then(message2 => {
                if (description.length <= 10) return
                message2.react('◀️')
                message2.react('▶️')
                const collector = message2.createReactionCollector(
                    (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                        time: 180000
                    }
                )
    
                let currentIndex = 0
                collector.on('collect', async (reaction, user) => {
                    reaction.users.remove(message.author.id)
                    if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                        currentIndex = currentIndex - 10
                    }
                    if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                        currentIndex = currentIndex + 10
                    }
    
                    message2.edit(generateEmbed(currentIndex))
    
                })
            })
        })
    }
    if(commandName === "settings"){
        getGuild(message.guild.id).then((res) => {
            if(!args[0]){
                let mapped = []
                Object.keys(res._doc).forEach(k=> {
                    mapped.push(`${k} : ${res._doc[k]}`)
                })
                let embed = new Discord.MessageEmbed()
                .setTitle(`Settings for ${message.guild.name}`)
                .setDescription(`\`\`\`${mapped.join("\n")}\`\`\``)
                .setTimestamp()
                .setColor(guild.embedColor)
                message.channel.send(embed)
            }
            else if(Object.keys(res._doc).indexOf(args[0]) !== -1){
                //message.channel.send(`*saving* ${msgargs[1]}`)
                //console.log(typeOf(res._doc[args[0]]))
                if(typeOf(res._doc[args[0]]) == "number"){
                    res._doc[args[0]] = Number(args.slice(1).join(" "))
                }
                else if(typeOf(res._doc[args[0]]) == "boolean"){
                    if(args[1] == "true" || args[1] == "1"){
                        res._doc[args[0]] = true
                    }
                    else if(args[1] == "false" || args[1] == 0){
                        res._doc[args[0]] = false
                    }
                    else{
                        let embed = new Discord.MessageEmbed()
                        .setDescription(`:warning: Invalid key ${args[0]} provided`)
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        message.channel.send(embed)
                        return;
                    }
                }
                else{
                    res._doc[args[0]] = args.slice(1).join(" ")
                }
                
    
                Guild.updateOne({ guildId: message.guild.id }, 
                    res._doc
                ).then((xd) => {})
    
                let embed = new Discord.MessageEmbed()
                .setDescription(`:ok_hand: Saved ${args.slice(1).join(" ")} as a new value for ${args[0]}`)
                .setColor(guild.embedColor)
                .setTimestamp()
                message.channel.send(embed)
                return;
            }
            else{
                let embed = new Discord.MessageEmbed()
                .setDescription(`:warning: Invalid key ${args[0]} provided`)
                .setColor(guild.embedColor)
                .setTimestamp()
                message.channel.send(embed)
                return;
            }
        }).catch((err) => {console.log(err)})
    }
    if(commandName === "members"){
        var arr2 = []
        //let members = message.guild.roles.fetch().then(lol => lol.cache.forEach(c=> console.log(`${c.name} : ${message.guild.roles.fetch(c.id).members}`)))
        let role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[0].toLowerCase())) ||message.guild.roles.cache.get(args[0].replace("<@&", "").replace(">", "")) || message.guild.roles.everyone
    
        let lol = message.guild.members.fetch({force: true}).then(membersfetch => {
            membersfetch.forEach((member) => {
                if(member.roles.cache.find(r=> r.id === role.id)){
                    arr2.push(member.user.tag)
                    
                }
            });
        })
        setTimeout(() => {
            let whitelisted = []
            let description = []
            let field2 = []
            let field3 = []
            
            //console.log(userObj)
            arr2.forEach(user => {
                whitelisted.push({
                    "tag": user
                })
                if (whitelisted.length === arr2.length) {
                    let sorted = whitelisted
                    sorted.forEach(person => {
                            description.push(`**${person.tag}**`)
                    })
                }
            })
            const generateEmbed = start => {
                var n = description.slice(start, start + 10)
                var embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setTitle(`Members of ${role.name} (${arr2.length})`)
                    .setColor(guild.embedColor)
                //console.log(Math.ceil(nigger.length / 10))
                if(n.length > 0){
                    embed.setDescription(n.join("\n"))
                    embed.setFooter(`Page ${Math.floor(start/10) + Math.ceil(n.length/10)}/${Math.ceil(description.length/10)}`)
                }
                else{
                    embed.setDescription(":warning: No members")
                }
    
                return embed
            }
    
            const author = message.author
            message.channel.send(generateEmbed(0)).then(message2 => {
                if (description.length <= 10) return
                message2.react('◀️')
                message2.react('▶️')
                const collector = message2.createReactionCollector(
                    (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === author.id, {
                        time: 180000
                    }
                )
    
                let currentIndex = 0
                collector.on('collect', async (reaction, user) => {
                    reaction.users.remove(message.author.id)
                    if (reaction.emoji.name === "◀️" && currentIndex > 9) {
                        currentIndex = currentIndex - 10
                    }
                    if (reaction.emoji.name === "▶️" && currentIndex + 10 < description.length) {
                        currentIndex = currentIndex + 10
                    }
    
                    message2.edit(generateEmbed(currentIndex))
    
                })
            })
        
        }, 500)
        
    }
    if(commandName === "dm"){
        if(!args[0]){
            let embed = new Discord.MessageEmbed()
            .setDescription(`:warning: Incorrect usage for the ${commandName} command. Proper usage: \`.dm <role> <message>\``)
            .setColor(guild.embedColor)
            .setTimestamp()
            return message.channel.send(embed)
        }
        let role = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(role => role.name.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args[0].toLowerCase())) ||message.guild.roles.cache.get(args[0].replace("<@&", "").replace(">", "")) || message.guild.roles.everyone

        message.guild.members.fetch({force: true}).then(membersfetch => {
            if(!role){
                miscError(guild, message, ":warning: Invalid role provided")
            }
            else{
                let arr = []


                membersfetch.forEach((member) => {
                    if(member.roles.cache.find(r=> r.id === role.id)){
                        arr.push(member)
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTitle(`Announcement in ${message.guild.name} from ${message.author.tag}`)
                        .setDescription(`\`\`\`${args.slice(1).join(" ")}\`\`\``)
                        .setFooter(`Announcement sent to all members with the ${role.name} role(${arr.length})`)
                        .setTimestamp()
                        member.send(embed).catch((err) => {
                            let embed = new Discord.MessageEmbed()
                            .setColor(guild.embedColor)
                            .setTimestamp()
                            .setDescription(`:warning: Could not send your announcement to ${member}! They have either blocked the bot or turned off DMs`)
                            message.channel.send(embed)
                        })
                    }
                });
                let embed = new Discord.MessageEmbed()
                .setColor(guild.embedColor)
                .setTimestamp()
                .setDescription(`:ok_hand: Sent the following message to ${arr.length} users with the ${role} role\n\`\`\`${args.slice(1).join(" ")}\`\`\``)
                message.channel.send(embed)
                arr = []
                
            }

        })
    }
    if(commandName === "perm"){
        if(!args[0]){
            let embed = new Discord.MessageEmbed()
            .setDescription(`:warning: Incorrect usage for the ${commandName} command. Proper usage: \`.perm <command name> [role/user/permission]\``)
            .setColor(guild.embedColor)
            .setTimestamp()
            return message.channel.send(embed)
        }
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === args.join(" ").replace("\n", ""))
        getPerms().then((p) => {
            let names = []
            p.forEach((perm)=> {
                names.push(perm.commandName)
                if(!args[1] && perm.commandName.toLowerCase() == args[0].toLowerCase()){
                    let Roles = []
                    let Users = []
                    let Permissions = []
                    perm.users.forEach(user => Users.push(`<@!${user}>`))
                    perm.roles.forEach(user => Roles.push(`<@&${user}>`))
                    perm.permissions.forEach(user => Permissions.push(user))
                    let embed = new Discord.MessageEmbed().setTitle(`Permissions for the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                    if (Roles.length !== 0) {
                        embed.addField("Roles", Roles.join(", "))
                    }
                    if (Users.length !== 0) {
                        embed.addField("Users", Users.join(", "))
                    }
                    if (Permissions.length !== 0) {
                        embed.addField("Discord Permissions", Permissions.join(", "))
                    }
                    return message.channel.send(embed)
                }
                if (args[0] && args[1] && perm.commandName.toLowerCase() == args[0].toLowerCase()) {
                    let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(member => member.user.tag === args.slice(1).join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username === args.slice(1).join(" ").replace("\n", ""))
                    if (!user) {
                        let role = message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name === args.slice(1).join(" ")) || message.guild.roles.cache.get(args[1].replace("<@&", "").replace(">", ""))  || message.guild.roles.cache.find(role => role.name.toLowerCase().substr(0,3) === args.slice(1).join(" ").toLowerCase().substr(0,3))
                        if (!role) {
                            if (perm.permissions.indexOf(args[1].toUpperCase()) == -1) {
                                Perm.updateOne({ commandName: args[0] }, {
                                    $push: {
                                        permissions: args[1].toUpperCase()
                                    }
                                }, {  safe: true, upsert: true}  ).then(a =>  {})
                                let embed = new Discord.MessageEmbed().setTitle(`Updated Discord Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Allowed the ${args[1].toUpperCase()} permission to use the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                                message.channel.send(embed)
                            } else {
                                Perm.updateOne({ commandName: args[0] }, {
                                    $pull: {
                                        permissions: args[1].toUpperCase()
                                    }
                                }, {  safe: true, upsert: true}  ).then(a =>  {})
                                let embed = new Discord.MessageEmbed().setTitle(`Updated Discord Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Disallowed the ${args[1].toUpperCase()} permission from using the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                                message.channel.send(embed)
                            }
                        } else {
                            if (perm.roles.indexOf(role.id) == -1) {
                                Perm.updateOne({ commandName: args[0] }, {
                                    $push: {
                                        roles: role.id
                                    }
                                }, {  safe: true, upsert: true}  ).then(a =>  {})
                                let embed = new Discord.MessageEmbed().setTitle(`Updated Role Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Allowed the ${role} role to use the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                                message.channel.send(embed)
                            } else {
                                Perm.updateOne({ commandName: args[0] }, {
                                    $pull: {
                                        roles: role.id
                                    }
                                }, {  safe: true, upsert: true}  ).then(a =>  {})
                                let embed = new Discord.MessageEmbed().setTitle(`Updated Role Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Disallowed the ${role} role from using the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                                message.channel.send(embed)
                            }
                        }
                    } else {
                        if (perm.users.indexOf(user.id) == -1) {
                            Perm.updateOne({ commandName: args[0] }, {
                                $push: {
                                    users: user.id
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated User Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Allowed <@!${user.id}> to use the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                            message.channel.send(embed)
                        } else {
                            Perm.updateOne({ commandName: args[0] }, {
                                $pull: {
                                    users: user.id
                                }
                            }, {  safe: true, upsert: true}  ).then(a =>  {})
                            let embed = new Discord.MessageEmbed().setTitle(`Updated User Permissions for the ${args[0].toLowerCase()} command!`).setDescription(`Denied <@!${user.id}> from using the ${args[0].toLowerCase()} command!`).setTimestamp().setColor(guild.embedColor)
                            message.channel.send(embed)
                        }
                    }
                }
            })
            if(!names.indexOf(args[0].toLowerCase)){
                let embed = new Discord.MessageEmbed().setDescription(`:warning: Invalid command! Make sure to run it at least once`).setTimestamp().setColor(guild.embedColor)
                return message.channel.send(embed)
            }
        })
    }
    if(commandName === "setign"){
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args[0].toLowerCase())
        if(!user){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor(guild.embedColor)
            .setDescription(`:warning: Invalid User provided`)
            return message.channel.send(embed)
        }
        if(!args[0]){
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor(guild.embedColor)
            .setDescription(`:warning: No IGN provided`)
            return message.channel.send(embed)
        }
        getUserByDiscord(user.id).then((res) => {
            if(res !== false){
                let xd = res.ign
                res.ign = args[1]
                res.save().then((a) => {
                    let embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setColor(guild.embedColor)
                    .setDescription(`:ok_hand: Updated ${user}'s IGN from \`${xd}\` to \`${res.ign}\``)
                    message.channel.send(embed)
                })
            }
            else{
                createUser(user.id, args[1])
                let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(guild.embedColor)
                .setDescription(`:ok_hand: Set ${user}'s IGN to \`${args[1]}\``)
                message.channel.send(embed)
            }
        })
    }
    if(commandName === "vanish" || commandName === "v"){
        let embed = new Discord.MessageEmbed()
        .setColor(guild.embedColor)
        .setTimestamp()
        .setDescription(`:ok_hand: Fetching vanish information, please wait...`)
        
        message.channel.send(embed).then((msg) => {
            for(let i=0;i<staff.length;i++){
                setTimeout(() => {
                    bot.tabComplete(`/f f ${staff[i]}`,function(matches){
                        return;
                    },false,false).then(res=>{
                        if(res.length !== 0){
                            v.push(res[0])
                        }
                    })
                    
                    if(i+1==staff.length){
                        //console.log("xd")
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setTitle(`Vanished Players on ${config.settings.host}(${v.length})`)
                        .setDescription(`Vanish(${v.length}):\n${v.length !== 0 ? v.join(", ") : "No staff online"}`)
                        msg.edit(embed)
                        v=[]
                    }
                }, i*250)
            }
        })

    }
    if(commandName === "update" || commandName === "git" && args[0] === "pull"){
        result("git pull", function(err, response){
            if(!err){
                message.channel.send(`\`\`\`${response}\`\`\``)
                setTimeout(() => {
                    process.exit(0)
                }, 1000)
            }else {
                message.channel.send(`\`\`\`${err}\`\`\``)
                setTimeout(() => {
                    process.exit(0)
                }, 1000)
            }
        });

    }
    if(commandName === "restart"){
        let embed = new Discord.MessageEmbed()
        .setColor(guild.embedColor)
        .setTimestamp()
        .setDescription(`:ok_hand: Back in 5-7 seconds`)
        message.channel.send(embed)
        process.exit(0)
    }
    if(commandName === "stats"){
        var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").replace("\n", "").toLowerCase())
        let person = "";
        if(!user){
            getUserByIGN(args[0]).then((res) => {
                if(res === false){
                    miscError(guild, message, `:warning: Invalid User`)
                }
                else{
                    person = res;
                    getUUID(person.ign).then(ress => {
                        let ntime = new Date().getTime()/1000
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setTitle(`Ingame Statistics for ${person.ign} (${person.discordId})`)
                        .addField(`Wall Checks`, person.wallchecks, true)
                        .addField(`Buffer Checks`, person.bufferchecks, true)
                        .addField(`RPost Checks`, person.rpostchecks, true)
                        .addField(`Last Wall Check`, `${ms((ntime-person.lastwallcheck)*1000, { long: true })} ago`, true)
                        .addField(`Last Buffer Check`, `${ms((ntime-person.lastbuffercheck)*1000, { long: true })} ago`, true)
                        .addField(`Last RPost Check`, `${ms((ntime-person.lastrpostcheck)*1000, { long: true })} ago`, true)
                        .setThumbnail(`https://crafatar.com/avatars/${ress.id}.png`, true)
                        message.channel.send(embed)
                    })
                }
            })
        }
        else{
            getUserByDiscord(user.id).then((res) => {
                if(res === false){
                    miscError(guild, message, `:warning: Invalid User`)
                }
                else{
                    person = res;
                    getUUID(person.ign).then(ress => {
                        let ntime = new Date().getTime()/1000
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setTitle(`Ingame Statistics for ${person.ign} (${person.discordId})`)
                        .addField(`Wall Checks`, person.wallchecks, true)
                        .addField(`Buffer Checks`, person.bufferchecks, true)
                        .addField(`RPost Checks`, person.rpostchecks, true)
                        .addField(`Last Wall Check`, `${ms((ntime-person.lastwallcheck)*1000, { long: true })} ago`, true)
                        .addField(`Last Buffer Check`, `${ms((ntime-person.lastbuffercheck)*1000, { long: true })} ago`, true)
                        .addField(`Last RPost Check`, `${ms((ntime-person.lastrpostcheck)*1000, { long: true })} ago`, true)
                        .setThumbnail(`https://crafatar.com/avatars/${ress.id}.png`, true)
                        message.channel.send(embed)
                    })
                }
            })
        }


    }
    if(commandName === "setstats"){
        var user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.tag === args.join(" ").replace("\n", "")) || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").replace("\n", "").toLowerCase())
        let person = "";
        if(!user){
            getUserByIGN(args[0]).then((res) => {
                if(res === false){
                    miscError(guild, message, `:warning: Invalid User`)
                }
                else{
                    person = res
                    if(!args[1]){
                        miscError(guild, message, `:warning: Invalid syntax, use the command like this: \`${guild.prefix}setstats <user/IGN> <walls/buffers/rpost> <number>\``)
                        return;
                    }
                    if(args[1].toLowerCase() == "walls"){
                        if(+args[2] !== NaN){
                            res.wallchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else if(args[1].toLowerCase() == "buffers"){
                        if(+args[2] !== NaN){
                            res.bufferchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else if(args[1].toLowerCase() == "rpost"){
                        if(+args[2] !== NaN){
                            res.rpostchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else{
                        miscError(guild, message, `:warning: Invalid syntax, use the command like this: \`${guild.prefix}setstats <user/IGN> <walls/buffers/rpost> <number>\``)
                    }
                }
            })
        }
        else{
            getUserByDiscord(user.id).then((res) => {
                if(res === false){
                    miscError(guild, message, `:warning: Invalid User`)
                }
                else{
                    //console.log(res)
                    person = res
                    if(!args[1]){
                        miscError(guild, message, `:warning: Invalid syntax, use the command like this: \`${guild.prefix}setstats <user/IGN> <walls/buffers/rpost> <number>\``)
                        return;
                    }
                    if(args[1].toLowerCase() == "walls"){
                        if(+args[2] !== NaN){
                            res.wallchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else if(args[1].toLowerCase() == "buffers"){
                        if(+args[2] !== NaN){
                            res.bufferchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else if(args[1].toLowerCase() == "rpost"){
                        if(+args[2] !== NaN){
                            res.rpostchecks = parseInt(args[2]) 
                            miscError(guild, message, `:ok_hand: Updated \`${person.ign}\`'s ${args[1]} checks to ${args[2]}`) 
                            res.save()
                        }
                        else{
                            miscError(guild, message, `:warning: Invalid number provided`)
                        } 
                        return;
                    }
                    else{
                        miscError(guild, message, `:warning: Invalid syntax, use the command like this: \`${guild.prefix}setstats <user/IGN> <walls/buffers/rpost> <number>\``)
                    }
                }
            })
        }
    }
    if(commandName === "ttsvoice"){
        getUserByDiscord(message.author.id).then((res) => {
            Polly.describeVoices(function(err, data){
                if(err) console.log(err)
                else{
                    if(!args[0]){
                        let out = []
                        data.Voices.forEach(v=>{
                            if(v.LanguageName.includes("English")){
                                out.push(`**Voice: ${v.Id} - Gender ${v.Gender}**`)
                            }
                        })
                        let embed = new Discord.MessageEmbed()
                        .setColor(guild.embedColor)
                        .setTimestamp()
                        .setTitle(`Your current voice: ${res.ttsVoice}`)
                        .setDescription(out.join("\n"))
                        message.channel.send(embed)
                    }
                    else{
                        let voices = []
                        data.Voices.forEach(v=>{
                            if(v.LanguageName.includes("English")){
                                voices.push(v.Name)
                            }
                        })
                        if(voices.indexOf(args[0])!== -1){
                            res.ttsVoice = args[0]
                            res.save()
                            let embed = new Discord.MessageEmbed()
                            .setColor(guild.embedColor)
                            .setTimestamp()
                            .setDescription(`:ok_hand: Successfully set your preffered TTS voice to \`${args[0]}\`!`)
                            message.channel.send(embed)
                        }
                        else{
                            let embed = new Discord.MessageEmbed()
                            .setColor(guild.embedColor)
                            .setDescription(`:warning: Invalid voice provided`)
                            .setTimestamp()
                            message.channel.send(embed)
                        }
                    }
                }
            })
        })

    }
    if(commandName === "steal"){
        if(!args[0]){
            let embed = new Discord.MessageEmbed()
            .setColor(guild.embedColor)
            .setDescription(`:warning: Include an emoji to steal`)
            .setTimestamp()
            return message.channel.send(embed)
        }
       let parsedEmoji = Discord.Util.parseEmoji(args[0])
       if(parsedEmoji.id){
           const extension = parsedEmoji.animated ? ".gif" : ".png"
           const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`
           message.guild.emojis.create(url, args[1] !== undefined ? args[1] : parsedEmoji.name)
           let embed = new Discord.MessageEmbed()
           .setColor(guild.embedColor)
           .setDescription(`:ok_hand: Added ${args[1] !== undefined ? args[1] : parsedEmoji.name}`)
           .setTimestamp()
           return message.channel.send(embed)
       }
       else{
            message.channel.send(`:warning: Invalid emoji`)
       }
    }
    if(commandName === "tts"){
        getUserByDiscord(message.author.id).then((person) => {
            if(!message.member.voice.channel){
                bot.chat("/ff [X] You aren't in a voice channel")
            }
            else if(message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id){
                bot.chat("/ff [X] You aren't in the same voice channel as I am")
            }
            else if(message.member.hasPermission("SEND_MESSAGES") && used == 0){
                const broadcast = client.voice.createBroadcast()
                
                var c = client.channels.cache.get(message.member.voice.channelID)
                c.join().then(connection=>{
                    //console.log(args)
                   // console.log(person)
                    tts(args.join(" "), person.ttsVoice).then((res) => {
                        message.channel.send(`:ok_hand: Playing ${args.join(" ")} as ${person.ttsVoice}!`)
                        //console.log(args)
                        //console.log(args.join(" "))
                        var bufferStream = new Stream.PassThrough()
                        bufferStream.end(res.AudioStream);
                        broadcast.play(bufferStream);
                        connection.play(broadcast, {volume:2})
                    })
                })
    
            }
            else{
                return bot.chat("/ff [X] Another broadcast is playing");
            }
        })
        
    }
    
})




client.login(config.token)