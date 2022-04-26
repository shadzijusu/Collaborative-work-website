
        $("#dodaj").click(function(){
            var c = document.getElementById("csv")
            var csvStudenti = c.value
            StudentAjax.dodajBatch(csvStudenti, function(error, data) {
                var content = data
                document.getElementById("ajaxstatus").innerHTML = content;
            
            })
        });
    
