
var VjezbeAjax = (function(){
    var dodajInputPolja = function(DOMelementDIVauFormi,brojVjezbi) {

        const myNode = document.getElementById("zadaci");
           
        if(myNode != null && myNode.childElementCount > 0) {
           while (myNode.firstChild) {
              myNode.removeChild(myNode.lastChild);
            }
        }
                if(brojVjezbi >= 1 && brojVjezbi <=15) {
                for(let i = 0; i < brojVjezbi; i++)
                 DOMelementDIVauFormi.innerHTML += '<label style="font-size: 15px">Unesite broj zadataka za vježbu '+(i+1)+'</label><input type="number" id="z'+i+'" name="z'+i+'" value="4"><br>';
                }
                else {
                    DOMelementDIVauFormi.innerHTML += '<p style="color: red">Unesite broj u rasponu od 1 do 15</p>'
                }

  
}
    var posaljiPodatke = function(vjezbeObjekat, callbackFja) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200)
          {
            var jsonRez = JSON.parse(ajax.response)
            var stringify = JSON.stringify(jsonRez)
            if(stringify.includes("error"))
            callbackFja(stringify, null)
            else callbackFja(null, stringify)
          }
        }
        ajax.open("POST","http://localhost:3000/vjezbe",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({brojVjezbi : vjezbeObjekat.brojVjezbi, brojZadataka : vjezbeObjekat.brojZadataka}));
       
                 
    }
    var dohvatiPodatke = function(callbackFja) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                var podaciOk = true
                var greske = ""
                if(jsonRez.brojVjezbi == 0)
                {
                    greske += "U datoteci ne postoje podaci"
                    podaciOk = false
                }
                if(jsonRez.brojVjezbi < 1 || jsonRez.brojVjezbi > 15) {
                    if(greske.length != 0)
                    greske += ", neispravan parametar brojVjezbi"
                    else 
                    greske += "Neispravan parametar brojVjezbi"
                    podaciOk = false
                } 
                 if(jsonRez.brojVjezbi != jsonRez.brojZadataka.length) {
                    if(greske.length != 0)
                    greske += ", neispravan parametar brojZadataka"
                    else 
                    greske += "Neispravan parametar brojZadataka"
                    podaciOk = false
                }
                
                for(var i = 0; i < jsonRez.brojVjezbi; i++) {
                    if(jsonRez.brojZadataka[i] < 0 || jsonRez.brojZadataka[i] > 10) {
                        if(greske.length != 0)
                        greske += ", neispravan parametar z"+i
                        else 
                        greske += "Neispravan parametar z"+i           
                     podaciOk = false
                    }
                }
            console.log(greske)
            if(podaciOk)
            callbackFja(null, jsonRez)
            else callbackFja(greske, null)
            
        }
    }
     
        ajax.open("GET","http://localhost:3000/vjezbe/",true);
        ajax.send()

    }
    var iscrtajVjezbe = function(divDOMelement,vjezbeObjekat) {
        //validacija podataka
        var podaciOk = true
        if(vjezbeObjekat.brojVjezbi < 1 || vjezbeObjekat.brojVjezbi > 15) {
            podaciOk = false
        }
        if(vjezbeObjekat.brojVjezbi != vjezbeObjekat.brojZadataka.length)
            podaciOk = false
        for(let i = 0; i < vjezbeObjekat.brojZadataka.length; i++) {
            if(vjezbeObjekat.brojZadataka[i] < 0 ||vjezbeObjekat.brojZadataka[i] > 10)
            {
                podaciOk = false
                break
            }
        }
        if(podaciOk == false)  return
        else {

        for(let i = 1; i <= vjezbeObjekat.brojVjezbi; i++) {
            let button = document.createElement('input')
            button.type = "button"
            button.id = "vjezba"+i;
            button.value = "VJEŽBA "+i;
            button.style.width = "90%";
            divDOMelement.append(button)

            let zad = document.createElement('div')
            zad.id = "z"+i
            divDOMelement.append(zad)
        
           button.addEventListener("click", function() {
               iscrtajZadatke(document.getElementById("z"+i), vjezbeObjekat.brojZadataka[i-1], i)
           });
        };
    }
}
    
    var iscrtajZadatke = function(vjezbaDOMelement,brojZadataka, kojaVjezba = 1) {

        for(var i = 1; i <= brojZadataka; i++) {
    
            let element = document.getElementById(kojaVjezba+"zadatak"+i);
            if (typeof(element) != 'undefined' && element != null)
            {
                if(element.hidden == true)
                element.hidden = false
                else element.hidden = true
            }
           else {
            vjezbaDOMelement.innerHTML += '<input type="button" id="'+kojaVjezba+'zadatak'+i+'" value="ZADATAK '+i+'"  style = " background-color: #B0C4DE">';
        }
    }
}
    

return {
    dodajInputPolja : dodajInputPolja,
    posaljiPodatke : posaljiPodatke,
    dohvatiPodatke : dohvatiPodatke,
    iscrtajVjezbe : iscrtajVjezbe,
    iscrtajZadatke : iscrtajZadatke
    }
}());
