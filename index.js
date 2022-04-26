const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const sequelize = require('./baza.js');
const express = require("express");
const app = express();
const router = express.Router()
app.use("/",router);

app.use(express.static('public'))
app.use(express.static('./public/html'))
app.use(express.static('./public/css'))
app.use(express.static('./public/js'))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())
router.use(bodyParser.text());



const Vjezba = require('./models/Vjezba.js')(sequelize);
const Zadatak = require('./models/Zadatak.js')(sequelize);
const Grupa = require('./models/Grupa.js')(sequelize);
const Student = require('./models/Student.js')(sequelize);

Vjezba.hasMany(Zadatak, {as:'idVjezbe', onDelete:'CASCADE'})
Grupa.hasMany(Student, {as:'studenti'})
Vjezba.sync();
Zadatak.sync();
Grupa.sync();
Student.sync();


router.get('/vjezbe/',function(req, res) {
   var nizPromisea = [];
   Vjezba.findAll({raw:true})
  .then(data => {
    var vjezbe = data
    var zadaci = []
    vjezbe.forEach(element => {
        nizPromisea.push(Zadatak.findAll({raw: true, where: {
            VjezbaId:  element.id
          }})
        .then(zad => {
            zadaci.push(zad.length)
        }))
    }); 
    Promise.all(nizPromisea).then(() =>{ 
        var myObj = 
        {
            brojVjezbi: vjezbe.length,
            brojZadataka: zadaci
        }
        res.json(myObj)
    })

  })
});

router.post('/vjezbe', function(req, res)  {
    let tijelo = req.body
    let brojV = parseInt(tijelo.brojVjezbi)
    let zad = tijelo.brojZadataka

    var stringGresaka = ""
    if(brojV < 1 || brojV > 15 || Number.isInteger(brojV) == false)
    stringGresaka += "Pogrešan parametar brojVjezbi"

    var brojZ = 0
    zad.forEach(el => brojZ++)
    if(brojZ != brojV ||Number.isInteger(brojZ) == false) {
    if(stringGresaka.length == 0)
    stringGresaka += "Pogrešan parametar brojZadataka"
    else stringGresaka += ",brojZadataka"
    }
    for(var i = 0; i < brojZ; i++) {
        if(zad[i] < 0 || zad[i] > 10)
            {
                if(stringGresaka.length == 0)
                stringGresaka += "Pogrešan parametar z"+i
                else stringGresaka += ",z"+i
            }
    }
    if(stringGresaka.length != 0) {
    res.json({status:"error", data:stringGresaka})
    res.end()
    }
    else {
        Zadatak.destroy({
            where: {},
            truncate: false
          })
        Vjezba.destroy({
            where: {},
            truncate: false
          })

        var nizPromisea = [];
        var nizIdeva = []
        for(var i = 0; i < brojV; i++) {
           nizPromisea.push(Vjezba.create({naziv: "VJEŽBA " + (i+1)}).then(vjz => {nizIdeva.push(vjz.id)}))
        }
        
        Promise.all(nizPromisea).then(() => {
            nizIdeva.sort((a,b) => {return a-b})
            for(var j = 0; j < zad.length; j++) {
                    for(var k = 1; k <= zad[j]; k++) {
                        Zadatak.create({naziv: "ZADATAK "+k, VjezbaId: nizIdeva[j]})
                    }
                    
            }
        })
        res.json({brojVjezbi: brojV, brojZadataka: zad})
        
    }
    
});


router.post('/student', function(req, res)  {
        Student.count({where: {index: req.body.index}}).then(count => {
            if(count == 0) {
                Grupa.findOrCreate({
                    where: { naziv: req.body.grupa},
                    defaults: {
                      termin: Date(Date.now())
                    }
                  }).then(() => { 
                    Grupa.findOne({where: {naziv: req.body}.grupa}).then(grup => {
                        Student.create({ime: req.body.ime, prezime: req.body.prezime, index: req.body.index, GrupaId: grup.id}).then(() => {
                            res.json({status: "Kreiran student!"})
                    })
                })})
            }
            else {
                res.json({status: "Student sa indexom {" + req.body.index + "} već postoji!"})
            }
        })
    })
router.put('/student/:index', function(req, res)  {
        Student.count({where: {index: req.params.index}}).then(count => {
            if(count != 0) {
                Grupa.findOrCreate({
                    where: { naziv: req.body.grupa},
                    defaults: {
                      termin: Date(Date.now())
                    }
                  }).then(() => { 
                    Grupa.findOne({where: {naziv: req.body.grupa}}).then(grup => {
                        Student.update({GrupaId: grup.id}, {where: {index:req.params.index}}).then(() => {
                            res.json({status: "Promjenjena grupa studentu {" + req.params.index + "}"})
                        })
                    })
                })}
            else {
                res.json({status: "Student sa indexom {" + req.params.index + "} ne postoji"})
            }
    })
});
router.post('/batch/student', function(req, res)  {
    var csv = req.body
    var pojedinacneLinije = csv.split("\n")
    pojedinacneLinije.forEach(linija => {
        if(linija.includes("\r")) {
            pojedinacneLinije = csv.split("\r\n")
        }
    })

    if(pojedinacneLinije[0].includes("ime,prezime,index,grupa"))
    res.json({status: "Nemojte navoditi nazive kolona"})
    else {
    let dodano = 0
    var filtriraniString = []
    var vecpostoje = []
   for(var i = 0; i < pojedinacneLinije.length; i++) {
        var s1 = pojedinacneLinije[i].split(",")
        var ok = true
        for(var j = i+1; j < pojedinacneLinije.length; j++) {
            var s2 = pojedinacneLinije[j].split(",")
            if(parseInt(s1[2]) == parseInt(s2[2])) {
                ok = false
                vecpostoje.push(s2[2])
            }
        }

            if(ok && !filtriraniString.includes(pojedinacneLinije[i])) {
                filtriraniString.push(pojedinacneLinije[i])
            }
        
    }
    if(filtriraniString.length == 0)
        filtriraniString = pojedinacneLinije
    var nizPromisea = []
    filtriraniString.forEach(string => {
        var student = string.split(",")
        var name = student[0]
        var surname = student[1]
        var brojIndeksa = student[2]
        var group = student[3]
        nizPromisea.push(Student.count({where: {index:brojIndeksa}}).then(count => {
            if(count == 0) {
                Grupa.findOrCreate({
                    where: {naziv: group},
                    defaults: {
                      termin: Date(Date.now())
                    }
                  }).then(() => { 
                Grupa.findOne({where: {naziv: group}}).then(grup => {
                Student.create({ime : name, prezime : surname, index: brojIndeksa, GrupaId: grup.id})
                })
         }
         )
                    dodano += 1
        }     
            else {
                vecpostoje.push(brojIndeksa)
            }
        }))
    
    })
   
       
    
    Promise.all(nizPromisea).then(() => {
        if(vecpostoje.length == 0) {
            res.json({status: "Dodano {"+dodano+"} studenata!"})
        }
        else {
            var stringMsg =  "Dodano {"+dodano+"} studenata, a studenti {"
            for(var j = 0; j < vecpostoje.length; j++) {
                if(j < vecpostoje.length - 1)
                stringMsg += vecpostoje[j]+ ","
                else stringMsg += vecpostoje[j] + "}"
            }
            stringMsg += " već postoje!"
            res.json({status: stringMsg})
        }
    })
}
});
  app.listen(3000,() => {
    console.log("Started on PORT 3000");
})
module.exports = app;