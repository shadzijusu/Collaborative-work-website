
        $("#postavi").click(function(){

            var ind = document.getElementById("index")
            var index = ind.value

            var g = document.getElementById("grupa")
            var grupa = g.value

            StudentAjax.postaviGrupu(index, grupa, function(error, data) {
                var content = data
                document.getElementById("ajaxstatus").innerHTML = content;
            
            
            })
        });
    
