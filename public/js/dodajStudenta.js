
        $("#dodaj").click(function(){
            var i = document.getElementById("ime")
            var ime = i.value

            var p = document.getElementById("prezime")
            var prezime = p.value

            var ind = document.getElementById("index")
            var index = ind.value

            var g = document.getElementById("grupa")
            var grupa = g.value
            var student = {
                ime:ime,
                prezime: prezime,
                index: index,
                grupa:grupa 
                       }

            StudentAjax.dodajStudenta(student, function(error, data) {
                var content = data
                document.getElementById("ajaxstatus").innerHTML = content;
            
            })
        });
    
