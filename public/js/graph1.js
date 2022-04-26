var xValues = [10,20,30,40,50,60,70,80,90,100];
new Chart("myChart1", {
  type: "line",
  data: {
		  labels: xValues,
		    datasets: [{ 
		      data: [86,114,106,106,107,111,133,221,783,247],
		      borderColor: "red",
		      fill: false
		    }, { 
		      data: [160,170,170,190,200,270,400,500,600,700],
		      borderColor: "green",
		      fill: false
		    }, { 
		      data: [30,70,200,500,600,400,200,100,20,10],
		      borderColor: "blue",
		      fill: false
		    }]
		  },
		  options: {
		    legend: {display: false},
		        responsive: false,
             width:500,
               height:300,
              scaleShowGridLines: false,
               showScale: false,
              maintainAspectRatio: this.maintainAspectRatio,
               barShowStroke: false,
		  }
		});
	