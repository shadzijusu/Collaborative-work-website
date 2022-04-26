      $(document).ready(function(){ 

        VjezbeAjax.dohvatiPodatke(function(error,data) {
            if(data != null && error == null) {
                VjezbeAjax.iscrtajVjezbe(document.getElementById("odabirVjezbe"), data)
            }
            if(data == null && error != null) alert(error)
        
        })
       
     });