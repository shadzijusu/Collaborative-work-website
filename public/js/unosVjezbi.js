

        $("#dodatno").click(function(){
            VjezbeAjax.dodajInputPolja(document.getElementById("zadaci"), document.getElementById("brojVjezbi").value)           
        });
    

        $("#posalji").click(function(){
            var x = document.getElementById("brojVjezbi")
            
            var brojV = x.value
            var zadaci = []
            var podaciOk = true
            for(var i = 0; i < brojV; i++) {
                var y = document.getElementById("z"+i)
                var zadatak = y.value
                zadaci.push(zadatak)
                
            }
            if(podaciOk) {
            var myObj = {
                brojVjezbi: brojV,
                brojZadataka: zadaci
            }
            VjezbeAjax.posaljiPodatke(myObj, (function(error,data) {
                if(data != null && data.includes("brojZadataka")) {
                   alert("Uspješno dodani podaci: " + data)
                }
                else {
                    alert("Neuspješno dodavanje podataka: " + error)
                }
            }))
        }
        });
    
    
    