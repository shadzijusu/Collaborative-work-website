var StudentAjax = (function(){


    var dodajStudenta = function(student,fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200)
          {
            var jsonRez = JSON.parse(ajax.response)
            var stringify = JSON.stringify(jsonRez)
            fnCallback(null,stringify)
          }
        }
        ajax.open("POST","http://localhost:3000/student",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({ime : student.ime, prezime : student.prezime, index:student.index, grupa:student.grupa}));
    }
    var postaviGrupu = function(index,grupa,fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200)
          {
            var jsonRez = JSON.parse(ajax.response)
            var stringify = JSON.stringify(jsonRez)
            fnCallback(null,stringify)
          }
        }
        ajax.open("PUT","http://localhost:3000/student/"+index,true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({grupa:grupa}));
    } 
    var dodajBatch = function(csvStudenti,fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200)
          {
            var jsonRez = JSON.parse(ajax.response)
            var stringify = JSON.stringify(jsonRez)
            fnCallback(null,stringify)
          }
        }
        ajax.open("POST","http://localhost:3000/batch/student",true);
        ajax.setRequestHeader("Content-Type", "text/plain");
        ajax.send(csvStudenti);
    }
    
return {
        dodajStudenta : dodajStudenta,
        postaviGrupu : postaviGrupu,
        dodajBatch : dodajBatch,
        }
}());
