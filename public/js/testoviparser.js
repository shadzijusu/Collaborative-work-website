var TestoviParser = (function(){
	var dajTacnost = function(rezultatTesta) {
        try {
        var rezultat = JSON.parse(rezultatTesta);
        }
        catch(e) {
            var greske = [];
            greske[0] = "Testovi se ne mogu izvršiti";
            var myObj = {
                tacnost: "0%",
                greske: "["  + greske + "]"
            }
            return myObj;
        }
   
           
        var brojTestova = rezultat.stats.tests;
        var passes = rezultat.stats.passes;
        var tacnost = ((passes * 20)/(brojTestova * 20))*100;
        var greske = [];

        //Testovi se ne mogu pokrenuti (greska u njima)
        if(rezultat.stats.tests == 0) {
            tacnost = 0;
            greske[0] = "Testovi se ne mogu izvršiti";
        }
        else {
        if(tacnost < 100) {
            var j = 0;
            for(var i = 0; i < rezultat.tests.length; i++) {
                if(rezultat.tests[i].err.message != null) {
                greske[j] = rezultat.tests[i].fullTitle;
                j++;
                }
            }
        }
    }
    var rounded = Math.round(tacnost * 10) / 10
    
        var myObj = {
            tacnost: rounded + "%",
            greske: "["  + greske + "]"
         }
         return myObj;
	}
    var porediRezultate = function(rezultat1, rezultat2) {
        var r1 = JSON.parse(rezultat1);
        var r2 = JSON.parse(rezultat2);
        var naziviTestovaR1 = [];
        var naziviTestovaR2 = [];
        var j = 0;
        for(var i = 0; i < r1.tests.length; i++) {
            naziviTestovaR1[j] = r1.tests[i].fullTitle;
            j++;
        }
        j = 0;
        for(var i = 0; i < r2.tests.length; i++) {
            naziviTestovaR2[j] = r2.tests[i].fullTitle;
            j++;
        }
        var x;
        var greske = [];
        if(are_equal(naziviTestovaR1, naziviTestovaR2)) {
            x = dajTacnost(rezultat2).tacnost;
            var pomocna = niz_gresaka(rezultat2)

            pomocna.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })
            greske = "[" + pomocna + "]"
        }
        else {
            var padajuR1 = r1.failures;
            var padajuR2 = r2.failures;

            var naziviTestovaKojiPadajuR1 = [];
            var k = 0;
            //Testovi koji padaju u rezultatu1, a ne pojavljuju se u rezultatu2
            var testoviR1 = 0;
            for(var i = 0; i < padajuR1.length; i++) {
                var ima = false;
                for(var j = 0; j < padajuR2.length; j++) {
                    if(padajuR1[i].fullTitle === padajuR2[j].fullTitle) {
                        ima = true;
                        break;
                    }
                }
                    if(!ima) {
                         testoviR1++;
                         naziviTestovaKojiPadajuR1[k] = padajuR1[i].fullTitle
                         k++;
                }
        }
            x = (testoviR1 + padajuR2.length)/(testoviR1 + r2.tests.length)*100;
            var rounded = Math.round(x * 10) / 10
            x = rounded + "%"
       
            greske = naziviTestovaKojiPadajuR1;
            greske.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            })

          
            k = greske.length

            var l = 0
            var naziviTestovaKojiPadajuR2 = [];
            for(var i = 0; i < padajuR2.length; i++) {
                var ima = false;
                for(var j = 0; j < padajuR1.length; j++) {
                    if(padajuR1[j].fullTitle === padajuR2[i].fullTitle) {
                        ima = true;
                        break;
                    }
                }
                    if(!ima) {
                         naziviTestovaKojiPadajuR2[l] = padajuR2[i].fullTitle
                         l++
                }
        }   
       
        naziviTestovaKojiPadajuR2.sort(function(a, b){
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        })

        for(var j = 0; j < l; j++) {
             greske[k] = naziviTestovaKojiPadajuR2[j];
             k++;
        }
        greske = "[" + greske + "]"
        }
            var myObj = {
            promjena: x,
            greske:  greske 
            }
       
        return myObj
    }
    var are_equal = function(r1, r2)  {
        if((r1.length == r2.length) && r1.every(function(element, index) {return element === r2[index]}))
        return true
        else return false
    }
    var niz_gresaka = function(rezultatTesta) {
        try {
            var rezultat = JSON.parse(rezultatTesta);
            }
            catch(e) {
                var greske = [];
                greske[0] = "Testovi se ne mogu izvršiti";
                return greske;
            }
       
            var brojTestova = rezultat.stats.tests;
            var passes = rezultat.stats.passes;
            var tacnost = ((passes * 20)/(brojTestova * 20))*100;
            var greske = [];
    
            //Testovi se ne mogu pokrenuti (greska u njima)
            if(rezultat.stats.tests == 0) {
                tacnost = 0;
                greske[0] = "Testovi se ne mogu izvršiti";
            }
            else {
            if(tacnost < 100) {
                var j = 0;
                for(var i = 0; i < rezultat.tests.length; i++) {
                    if(rezultat.tests[i].err.message != null) {
                    greske[j] = rezultat.tests[i].fullTitle;
                    j++;
                    }
                }
            }
        }
           return greske;

    }
	return {
         dajTacnost: dajTacnost,
         porediRezultate: porediRezultate,
         are_equal: are_equal,
        niz_gresaka: niz_gresaka   }
    }());
