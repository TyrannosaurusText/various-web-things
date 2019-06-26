
var title= [];
var rate= [];
var xlabelLocations = [];
var annualrate = ["120K", "110K", "90K", "80K", "70K", "60K", "50K", "40K", "30K", "20K", "10K", "0K"]
var ylabelLocations = [];
var width=1820;
var height=750;


d3.csv("./Book1.csv", function(data) { //load data and generates the graph

    data.forEach(function(d, i) { //reading data into arrays
	    rate[i] = d["Avg. Annual Rate"];
  	    title[i] = d["Job Title"];
    });
	/*
	* Initialization (canvas constants)
	*/
	var gap = 25; //gap between bars
	var marginRight = width-40; 
	var marginBottom = 525
	svg = d3.select("svg");
	bar = svg.append("g").selectAll("rect");
	console.log(rate)
	//creates the vertical bars, with given configurations, height of the bar is binded to the average annual rate from csv
	bar.data(rate).enter()
	.append("rect")
	.attr("fill","steelblue")
	.attr("width",20)
	.attr("height",function(d,i) {return 4*rate[i]}) //height of rectangle = 4 * annual rate to make the differences more noticable
	.attr("x",function(d,i) {return marginRight-i*gap}) // distance between each bar
	.attr("y",function(d,i) {return marginBottom-4*rate[i]}); // distance from bottom of the canvas (rectangle grows downwards so y coordinate is shifted up to compensate.)

	/*
		Sets locations for axes labels
	 */
	title.forEach(function(d,i) {
		xlabelLocations[i] = 90 + 25*(i); //spacing for the xaxis labels
	});

	for( i = 0; i < 12; i++)
	{
		ylabelLocations[i]=525-i*475/11; //spacing for yaxis
	};

	var titles = d3.scaleOrdinal(xlabelLocations).domain(title.reverse());
	svg.append("g").attr("transform", "translate(0," + marginBottom + ")").call(d3.axisBottom(titles))	//adds the actual axis
	svg.selectAll("g.tick").select("text")
	.style('text-anchor', 'end')
	.attr("y","-5")//moves the x axis because rotation
	.attr("x","-10")//
	.attr("transform","rotate(270)"); //rotate 270 degree to make it look more like the image

	var annual = d3.scaleOrdinal(ylabelLocations).domain(annualrate.reverse());
	svg.append("g").attr("transform", "translate(" +70 + ", 0)").call(d3.axisLeft(annual)) // add y axis

	svg.append("text")
	.attr("transform","translate(" + ((width-100)/2) + " ," +  (height + 20) + ")")
	svg.append("text")
	.text("Job Title"); //  horizontal label axis
	.attr("transform","translate(" + 20 + " ," +  (height)/2 + "),rotate(270)")
	.text("Average Annual Rate"); // vertical label axis

});
