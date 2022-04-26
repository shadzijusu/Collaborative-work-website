//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../wt21p18461/index');
let should = chai.should();
const sequelize = require('./baza.js');
let Student = require('./models/Student.js')(sequelize)
let Grupa = require('./models/Grupa.js')(sequelize)
let assert = chai.assert
chai.use(chaiHttp);



//Our parent block
describe('Testovi', () => {
  beforeEach(async() => {
    await Student.destroy({
      where: {},
      truncate: false
    })
  await Grupa.destroy({
      where: {},
      truncate: false
    })
  })
describe('POST /student', () => {
  it('it should post a student', (done) => {
      let student = {
         ime: "Selma",
         prezime: "Hadžijusufović",
         index: "18461",
         grupa: "GR1"
      }
    chai.request(server)
        .post('/student')
        .send(student)
        .end((err, res) => {
              res.body.status.should.equal("Kreiran student!")
          done();
        });
  });
 
  it('it should not post a student', (done) => {
   let student1 = {
       ime: "Selma",
       prezime: "Hadžijusufović",
       index: "18461",
       grupa: "GR1"
    }
  chai.request(server)
  .post('/student')
  .send(student1)
  .end((err, res) => {
    chai.request(server)
    .post('/student')
    .send(student1)
    .end((err, res) => {
        res.body.status.should.equal("Student sa indexom {18461} već postoji!")
        done();

    });
    });
});
  it('it should post a student - check database', (done) => {
  let student = {
     ime: "Selma",
     prezime: "Hadžijusufović",
     index: "18461",
     grupa: "GR1"
  }
  chai.request(server)
    .post('/student')
    .send(student)
    .end((err, res) => {
          res.body.status.should.equal("Kreiran student!")
          Student.findAll({where: {index: student.index}}).then((stud) => {
              assert.equal(stud.index, student.index)
          })
      done();
    });
});
});

describe('PUT /student:index', () => {
  it('it should not change the group', (done) => {
      let student = {
         grupa: "GR3"
      }
    chai.request(server)
        .put('/student/11234')
        .send(student)
        .end((err, res) => {
              res.body.status.should.equal("Student sa indexom {11234} ne postoji")
          done();
        });
  });
  it('it should change the group', (done) => {
    let student = {
      ime: "Selma",
      prezime: "Hadžijusufović",
      index: "18461",
      grupa: "GR1"
   }
   chai.request(server)
     .post('/student')
     .send(student)
     .end((err,res) => {
      let promjena = {
        grupa: "GR3"
     }
      chai.request(server)
       .put('/student/18461')
       .send(promjena)
       .end((err, res) => {
             res.body.status.should.equal("Promjenjena grupa studentu {18461}")
             //check database
             Student.findOne({where: {index: student.index}}).then(stud => {
               Grupa.findOne({where: {naziv: promjena.grupa}}).then(grup => {
                 assert.equal(stud.GrupaId, grup.id)
               })
             })
         done();
       });
     })
     })

});

  describe('POST /batch/student', () => {
    it('should not post all students', (done) => {
      var csv = "Meho,Mehic,112,GR1\nDarko,Daric,33,GR3\nMeho,Mehic,112,GR3"
      chai.request(server)
     .post('/batch/student')
     .set('content-type', 'text/plain')
     .send(csv)
     .end((err, res) => {
           res.body.status.should.equal("Dodano {2} studenata, a studenti {112} već postoje!")
       done();
     });
    })
    it('should post all students', (done) => {
      var csv = "Meho,Mehic,112,GR1\r\nLana,Lanic,227,GR3"
      chai.request(server)
     .post('/batch/student')
     .set('content-type', 'text/plain')
     .send(csv)
     .end((err, res) => {
           res.body.status.should.equal("Dodano {2} studenata!")
           Student.findAll({where: {ime: "Meho"}}).then(meho => {
               assert.equal(meho.index, "112")
           })
       done();
     });
   })
   it('should not post all students', (done) => {
    var csv = "AA,BB,556,GR1\r\nAA,BB,556,GR1,\r\nAA,BB,331,GR3"
    chai.request(server)
   .post('/batch/student')
   .set('content-type', 'text/plain')
   .send(csv)
   .end((err, res) => {
         res.body.status.should.equal("Dodano {2} studenata, a studenti {556} već postoje!")
     done();
   });
 })
it('should not post all students because they are already added', (done) => {
  Grupa.findOrCreate({where: {naziv: "GR1"}}).then(grupa => {
    Student.create({ime: "AA", prezime: "BB", index: "113", GrupaId: grupa.id}).then(() => {
      Student.create({ime: "CC", prezime: "DD", index: "883", GrupaId: grupa.id}).then(() => {
        var csv = "AA,BB,113,GR1\nCC,DD,883,GR1"
        chai.request(server)
       .post('/batch/student')
       .set('content-type', 'text/plain')
       .send(csv)
       .end((err, res) => {
              res.body.status.should.equal("Dodano {0} studenata, a studenti {113,883} već postoje!")
              done();
       });
      })
    })

  })
})
it('should not post any students', (done) => {
  var csv = "ime,prezime,index,grupa\r\nAA,BB,556,GR1\r\nAA,BB,333,GR1,\r\nAA,BB,556,GR3"
  chai.request(server)
 .post('/batch/student')
 .set('content-type', 'text/plain')
 .send(csv)
 .end((err, res) => {
       res.body.status.should.equal("Nemojte navoditi nazive kolona")
   done();
 });
})
  })
})
