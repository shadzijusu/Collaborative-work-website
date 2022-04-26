let assert =chai.assert;
describe('Testovi', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();
 
    this.requests = [];
    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });
 
  afterEach(function() {
    this.xhr.restore();
  });
 
describe('Dodavanje input polja', function() {
    it('Test dodavanja ispravnog broja input polja', function() {
        var DOMelementDIVauFormi = document.createElement("div")
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, 5)
        assert.equal(DOMelementDIVauFormi.innerHTML.includes("4"), true);
      });

      it('Test dodavanja neispravnog broja input polja 1', function() {
        var DOMelementDIVauFormi = document.createElement("div")
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, 17)
        assert.equal(DOMelementDIVauFormi.innerHTML.includes("4"), false);
      });
      it('Test dodavanja neispravnog broja input polja 2', function() {
        var DOMelementDIVauFormi = document.createElement("div")
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, 20)
        assert.equal(DOMelementDIVauFormi.innerHTML.includes("Unesite broj u rasponu od 1 do 15"), true);
      });
    });
  describe('Post ruta', function() {
      it('Post - Test slanja ispravnih podataka', function() {
        var podaci = {brojVjezbi: 3, brojZadataka: [1,2,0]}
        var jsonPodaci = JSON.stringify(podaci);
        VjezbeAjax.posaljiPodatke({brojVjezbi: 3, brojZadataka: [1,2,0]}, function(error, data) {
            assert.isNull(error);
            assert.equal(data, jsonPodaci);
      });
      assert.equal(this.requests[0].requestBody, jsonPodaci)
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
    });
      it('Post - Test slanja neispravnih podataka 1', function() {
        var podaci = {status: "error", data: "Pogrešan parametar brojVjezbi,z1"}
        var jsonPodaci = JSON.stringify(podaci);

        var vjezbeObjekat = {brojVjezbi: 2, brojZadataka: [1,-1,0]}
        VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(error, data) {
            assert.isNull(data);
            assert.isNotNull(error);
            console.log(error)
            assert.equal(error, jsonPodaci)
        });
        assert.equal(this.requests[0].requestBody, JSON.stringify(vjezbeObjekat))
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      });
      it('Post - Test slanja neispravnih podataka 2', function() {
        var podaci = {status: "error", data: "Pogrešan parametar brojZadataka"}
        var jsonPodaci = JSON.stringify(podaci);

        var vjezbeObjekat = {brojVjezbi: 3, brojZadataka: [1,2,0,4]}
        VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(error, data) {
            assert.isNull(data);
            assert.isNotNull(error);
            console.log(error)
            assert.equal(error, jsonPodaci)
        });
        assert.equal(this.requests[0].requestBody, JSON.stringify(vjezbeObjekat))
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      });
      it('Post - Test slanja neispravnih podataka 3', function() {
        var podaci = {status: "error", data: "Pogrešan parametar brojVježbi"}
        var jsonPodaci = JSON.stringify(podaci);

        var vjezbeObjekat = {brojVjezbi: 2, brojZadataka: [1,2,0,4]}
        VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(error, data) {
            assert.isNull(data);
            assert.isNotNull(error);
            console.log(error)
            assert.equal(error, jsonPodaci)
        });
        assert.equal(this.requests[0].requestBody, JSON.stringify(vjezbeObjekat))
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      });
      it('Post - Test slanja neispravnih podataka 4', function() {
        var podaci = {status: "error", data: "Pogrešan parametar z0,z1,z2"}
        var jsonPodaci = JSON.stringify(podaci);

        var vjezbeObjekat = {brojVjezbi: 4, brojZadataka: [-1,200,-3,4]}
        VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(error, data) {
            assert.isNull(data);
            assert.isNotNull(error);
            console.log(error)
            assert.equal(error, jsonPodaci)
        });
        assert.equal(this.requests[0].requestBody, JSON.stringify(vjezbeObjekat))
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      });
  });
  describe('Dohvatanje podataka', function() {
      it('Get ruta - ispravni podaci', function() {
        var podaci = {brojVjezbi: 3, brojZadataka: [1,8,8]}
        var jsonPodaci = JSON.stringify(podaci)
        VjezbeAjax.dohvatiPodatke(function(error, data) {
            assert.isNull(error)
            assert.isNotNull(data)
            console.log(data)
            assert.equal(data.brojVjezbi, 3)
        });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      })
      it('Get ruta - neispravni podaci 1', function() {
        var podaci = {brojVjezbi: 2, brojZadataka: [-1,8,8]}
        var jsonPodaci = JSON.stringify(podaci)
        VjezbeAjax.dohvatiPodatke(function(error, data) {
            assert.isNull(data)
            assert.isNotNull(error)
            console.log(error)
            assert.equal(error, "Neispravan parametar brojZadataka, neispravan parametar z0")
          });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      })
      it('Get ruta - neispravni podaci 2', function() {
        var podaci = {brojVjezbi: 0, brojZadataka: []}
        var jsonPodaci = JSON.stringify(podaci)
        VjezbeAjax.dohvatiPodatke(function(error, data) {
            assert.isNull(data)
            assert.isNotNull(error)
            console.log(error)
            assert.equal(error, "U datoteci ne postoje podaci, neispravan parametar brojVjezbi")
          });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      })
      it('Get ruta - neispravni podaci 3', function() {
        var podaci = {brojVjezbi: 17, brojZadataka: []}
        var jsonPodaci = JSON.stringify(podaci)
        VjezbeAjax.dohvatiPodatke(function(error, data) {
            assert.isNull(data)
            assert.isNotNull(error)
            console.log(error)
            assert.equal(error, "Neispravan parametar brojVjezbi, neispravan parametar brojZadataka")
          });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      })
      it('Get ruta - neispravni podaci 4', function() {
        var podaci = {brojVjezbi: 3, brojZadataka: [-1,2,3]}
        var jsonPodaci = JSON.stringify(podaci)
        VjezbeAjax.dohvatiPodatke(function(error, data) {
            assert.isNull(data)
            assert.isNotNull(error)
            console.log(error)
            assert.equal(error, "Neispravan parametar z0")
          });
        this.requests[0].respond(200, { 'Content-Type': 'text/json' }, jsonPodaci);
      })
});

describe('Iscrtavanje vjezbi i zadataka', function() {
    it('Iscrtaj vjezbe - validni podaci', function() {
      var vjezbeObjekat = {brojVjezbi: 3, brojZadataka: [1,2,3]}
      var div = document.createElement("div")
      VjezbeAjax.iscrtajVjezbe(div, vjezbeObjekat)
      //6 - pošto se kreira button i div za svaku vježbu
      assert.equal(div.children.length, 6);
      assert.equal(div.innerHTML.includes("VJEŽBA 3"), true)
    })
 
    it('Iscrtaj vjezbe - nevalidni podaci 1', function() {
      var divDOMelement = document.createElement("div");
      VjezbeAjax.iscrtajVjezbe(divDOMelement, {brojVjezbi: 1, brojZadataka: [1,2,3,4,5]});
      assert.equal(divDOMelement.children.length, 0);

    })
    it('Iscrtaj vjezbe - nevalidni podaci 2', function() {
      var divDOMelement = document.createElement("div");
      VjezbeAjax.iscrtajVjezbe(divDOMelement, {brojVjezbi: 5, brojZadataka: [1,-1,3,50,5]});
      assert.equal(divDOMelement.children.length, 0);

    })
    it('Iscrtaj vjezbe - nevalidni podaci 3', function() {
      var divDOMelement = document.createElement("div");
      VjezbeAjax.iscrtajVjezbe(divDOMelement, {brojVjezbi: 16, brojZadataka: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]});
      assert.equal(divDOMelement.children.length, 0);
    })
});
});