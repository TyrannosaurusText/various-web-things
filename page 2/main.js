


/*
	    Majors[d["Major Undergrad"]]++;
  	    Degree[["Formal Education"]]++;
		Hobby[["ProgramHobby"]]++;
		ParentEdu[["HighestEducationParents"]]++;
*/
var first = { //frame stats for first graph
	"width": 500,
	"height" : 500,
	"gap": 50,
	"marginRight" : 500-40,
	"marginBottom" : 500-50
}
var graph = { // frame for line graph
"width": 800,
"height": 800,
"margin": { "top": 30, "right":30, "bottom":90, "left": 90}
}
levels = [];
employdeg = []
numDeg = 0;
 Sexp = //list of years exp from data
[
  "Less than a year",
  "1 to 2 years",
  "2 to 3 years",
  "3 to 4 years",
  "4 to 5 years",
  "5 to 6 years",
  "6 to 7 years",
  "7 to 8 years",
  "8 to 9 years",
  "9 to 10 years",
  "10 to 11 years",
  "11 to 12 years",
  "12 to 13 years",
  "13 to 14 years",
  "14 to 15 years",
  "15 to 16 years",
  "16 to 17 years",
  "17 to 18 years",
  "18 to 19 years",
  "19 to 20 years",
  "20 or more years"
] 
color = ["#c2c2a3","#adad85","#999966","#7a7a52"] // colors used for vis 1 and 2
employdegmap = []
var bar = d3.csv("./surveymin.csv", function(data) { //load data and generates the graph
	level = [];
	jobseeklevel=[];
	employ=[];
	d = [];
	e = [];
	JobHunt= [];
	NoJobHunt = [];
	major = [];
	jobseek =[];
	majornames=["Computer engineering or electrical/electronics engineering", "Computer programming or Web development","Computer science or software engineering","Information technology, networking, or system administration"]
	set= [];
	jobstatuses = [ "I am not interested in new job opportunities","I'm not actively looking, but I am open to new opportunities", "I am actively looking for a job", "NA"]
	estr = "Not employed, but looking for work"
	jstr = "I am actively looking for a job"
	setnames = [
		majornames[0].concat(";",jstr), majornames[1].concat(";",jstr),
		majornames[2].concat(";",jstr),majornames[3].concat(";",jstr),
		]
	set[setnames[0]]=0
	set[setnames[1]]=0
	set[setnames[2]]=0
	set[setnames[3]]=0

	NoJobSeektotal = 0;
	JobSeektotal=0;
	index=0;
	data.forEach( function(d) { //data aggregation
		if(level[d["FormalEducation"]] == null){ //initialize
			level[d["FormalEducation"]]=0;
			levels[d["FormalEducation"]]=index++;
		}
		if(jobseeklevel[d["FormalEducation"].concat( d["JobSeekingStatus"])] == null){ //counts # of people for degree column
			jobseeklevel[d["FormalEducation"].concat( d["JobSeekingStatus"])] = 0;
		}
		if(employ[d["FormalEducation"].concat(  ";",d["JobSeekingStatus"],";", d["EmploymentStatus"])] == null) //initialize
			employ[d["FormalEducation"].concat(  ";",d["JobSeekingStatus"], ";",d["EmploymentStatus"])] = 0;
		level[d["FormalEducation"]]++;//counts # of people for degree column
		jobseeklevel[d["FormalEducation"].concat( d["JobSeekingStatus"])]++; //counts # of Job seeking per degree level
		employ[d["FormalEducation"].concat( ";",d["JobSeekingStatus"],";", d["EmploymentStatus"])]++; // counts employment
		
 		if( JobHunt[d["YearsProgram"]]==null )  JobHunt[d["YearsProgram"]] = 0; //initialize part 3
		if( NoJobHunt[d["YearsProgram"]]==null )  NoJobHunt[d["YearsProgram"]] = 0;
		if( d["EmploymentStatus"]=="Not employed, but looking for work" ||  d["JobSeekingStatus"]=="I am actively looking for a job"  )
		{
			JobHunt[d["YearsProgram"]]++;
			JobSeektotal++;
		}
		if ( d["JobSeekingStatus"]=="I am not interested in new job opportunities" ) //counts for part 3
		{
			NoJobHunt[d["YearsProgram"]]++;
			NoJobSeektotal++;
		} 
		if ( major[d["MajorUndergrad"]] == null )
		{
			major[d["MajorUndergrad"]] = 0;
		}
		major[d["MajorUndergrad"]]++;
		if ( jobseek[d["JobSeekingStatus"]] == null) jobseek[d["JobSeekingStatus"]] = 0;
		
		jobseek[d["JobSeekingStatus"]]++;
		if(d["EmploymentStatus"] == estr)
		jobseek[d[jstr]]++;
		cstr = d["MajorUndergrad"].concat(";",d["JobSeekingStatus"]) // if d matches multiple conditions increment set	
		for(var i = 0; i < 4; i++)
		if(cstr== setnames[i])
		{
			set[setnames[i]]++
		}
		else
		if(d["MajorUndergrad"]==majornames[i] &&estr == d["EmploymentStatus"]) //if not employed but seeking work and one of the 4 majors were querying fr 
		{
			set[d["MajorUndergrad"].concat(";",jstr)]++;
		}
	} );  
	for( var key in level) //creates Objects for bar
	{
		h=0
		for ( var s in jobstatuses)
		{
			e.push({"Level": key, "Status": jobstatuses[s], "count":jobseeklevel[key.concat(jobstatuses[s])], "total": level[key], "h": h });
			h += Math.pow(Math.log(jobseeklevel[key.concat(jobstatuses[s])]),2)
		}
	}
	h = []
	dictionary=[]
	employ = employ.sort(function(a,b) {if(a>b) return 1; if(a<b)return -1; return 0})//this sort doesnt actually do anything probably because the for loop reads things by the hashtable's ordering
	employdeg[9] = [];
	total2= [];
	n=[];
	for( var s in employ ) //creates objects for part 2
	{
		a = s.split(";")

		if(employdegmap[a[0]] == null){
			employdegmap[a[0]] = numDeg;
			employdeg[numDeg] = []
			employdeg[numDeg].push({"id":0}) //parent for tree
			n[numDeg]=1; //unique id for each
			total2[numDeg]=0;
			numDeg++;
		}
		if(a[1] != "I am not interested in new job opportunities" && a[1] != "I'm not actively looking, but I am open to new opportunities")
		{
			index = employdegmap[ a[0] ] // for chart 2 splits data
			total2[index]+=employ[a[0].concat(";",a[1],";",a[2])];
			employdeg[ index ].push( {"id": n[index]++, "Level": a[0], "Parent": 0,"Employ": a[2], "Status": a[1], "count":employ[a[0].concat(";",a[1],";",a[2])]} )
		}

	}
	svg=drawBars(".first", first,e)//draws first graph

	
	drawAxesBar(e,first,svg)
	drawtree(treeframe, employdeg[0], 0)

	

 	jhdata = []; // more initializing for p3
	njhdata = [];;
	for (var i = 0; i < 20; i++) //creates objects in order
	{
		s=Sexp[i]
		jhdata.push({"exp":s, "count":JobHunt[s]});
		njhdata.push({"exp":s, "count":NoJobHunt[s]});
	}

	svg = d3.select(".linegraph").append("svg")
	.attr("width", graph.width)
	.attr("height", graph.height)
	dolines(graph, jhdata, njhdata, svg) 
	
	sets = []
	for(var i in majornames)
	{
		s = majornames[i]
		sets.push({sets: [s], size: major[s]})
	}
	jstr = "I am actively looking for a job"
	sets.push({sets: [jstr], size: jobseek[jstr]})
	
	for(var s in set)
	{
		a = s.split(";")

		sets.push({sets: [a[0],a[1]], size: set[s], percentage: Math.round(set[s]/major[a[0]]*10000)/100,percentage2: Math.round(set[s]/jobseek[jstr]*10000)/100})
		
	}
	
	chart = venn.VennDiagram(); //package provided by d3 developer, benfred
	var vis = d3.select(".notabargraph")

	vis.datum(sets).call(chart)
	var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");
	vis.selectAll("g")
    .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(vis, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .9);
	
		if(d.percentage != null)
        tooltip.html("amt: " + d.size + '<br/> % in major: ' + d.percentage + "% <br/> % in jobseek status: " + d.percentage2 + "%");
        else
        tooltip.html("amt: " + d.size);
        
        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 3)
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX + 20) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    
    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 0)
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    });
	
});


function treeonclick(a)
{
	d3.select(".treeselect").selectAll("input").property("checked", false);
	d3.select('.'+a).property("checked", true);
	d3.select(".p").remove()
	drawtree(treeframe,employdeg[ parseInt(a[1]) ], parseInt(a[1]));
}

var treeframe = {
	"width":700,
	"height":700
}


function drawtree(frame,data, name)
{
	root = d3.stratify().id(function(d) { return d.id; }).parentId(function(d) { return d.Parent; })(data).sum((d) => d.count)
	//root = d3.hierarchy(root).sum((d) => d.count)
	treelayout = d3.treemap().size([treeframe.width, treeframe.height])
	node = root.descendants();
	treelayout(root)
	svg = d3.selectAll('.tree1').append("svg");
	svg.attr("width", treeframe.width)
	.attr("height", treeframe.width)
	.attr("class", 'p')
	total = 
	g = svg.append('g').selectAll('rect');
	vSlices = g.data(node).enter().append('rect');
	vSlices.attr('x', function (d) { return d.x0; }) //position
            .attr('y', function (d) { return d.y0; })
            .attr("width", (d) => d.x1 - d.x0 ) //width of rect
            .attr("height", (d) => d.y1 - d.y0) // height
			.style("fill", (d) => color[jobstatuses[d.data.Status]])
			.on('mouseover', function(d, i) {
		// select our tooltip
            var tooltip = d3.select('#myTooltip');
		
            // make sure our tooltip is going to be displayed
            tooltip.style('display', 'block');

            // set the initial position of the tooltip
            tooltip.style('left', d3.event.pageX+ 'px');
            tooltip.style('top', d3.event.pageY+10+ 'px');

            // set our tooltip to have the values for the 
            // element that we're mousing over
            tooltip.html(d.data.Level + '<br/>' + d.data.Employ +'<br/>' + d.data.Status + '<br/> Amt: ' + d.data.count);
			
		})
        .on('mousemove', function(d, i) {
            // select our tooltip
            var tooltip = d3.select('#myTooltip');

            // update the position if the user's moved the mouse 
            //in the element
            tooltip.style('left', d3.event.pageX + 'px');
            tooltip.style('top', d3.event.pageY+10 + 'px');
        })
        .on('mouseleave', function(d, i){
            // select our tooltip 
            var tooltip = d3.select('#myTooltip');

            // hide tooltip if we leave the element we've been 
            // mousing over
            tooltip.style('display', 'none');
        });	
		txt = g.data(node).enter().append('text');//display %
		txt.attr('x', function (d) { return d.x0+5 }) 
            .attr('y', function (d) { return  d.y1-Math.max(0, d.y1 - d.y0  - 1)+20  })
			.text(function (d) { 
						if(isNaN(d.data.count) == false)
						return  Math.round(d.data.count/total2[name]*1000)/10
				})
			
}

var drawBars = function(chart, overlay, data){
	/*
	* Initialization (canvas constants)
	*/

	hgap=[] 
color = ["#c2c2a3","#adad85","#999966","#7a7a52"] // colors used for vis 1 and 2
	svg = d3.select(chart).attr("width", overlay.width).attr("height",overlay.height);
	bar = svg.append("g").selectAll("rect");
	jobstatuses = { "I am not interested in new job opportunities":0,"I'm not actively looking, but I am open to new opportunities":1, "I am actively looking for a job":2, "NA":3}
	//creates the vertical bars, with given configurations, height of the bar is binded to the average annual rate from csv
	bar.data(data).enter()
	.append("rect")
	.attr("fill", function(d) {return color[jobstatuses[d.Status]] })
	.attr("width",20)
	.attr("height",function(d,i) {return Math.pow(Math.log(d.count),2)}) //height of rectangle =
	.attr("x",function(d,i) {return overlay.marginRight-levels[d.Level]*overlay.gap}) // distance between each bar
	.attr("y",function(d,i) {
		y = overlay.marginBottom-Math.pow(Math.log(d.count),2) - d.h
		
		return y
	})// distance from bottom of the canvas (rectangle grows downwards so y coordinate is shifted up to compensate.)
	.on('mouseover', function(d, i) {
            // select our tooltip
            var tooltip = d3.select('#myTooltip');
		
            // make sure our tooltip is going to be displayed
            tooltip.style('display', 'block');

            // set the initial position of the tooltip
            tooltip.style('left', d3.event.pageX+ 'px');
            tooltip.style('top', d3.event.pageY+10+ 'px');

            // set our tooltip to have the values for the 
            // element that we're mousing over
            tooltip.html(d.Level + '<br/>' + d.Status + '<br/> Amt: ' + d.count);
			
		})
        .on('mousemove', function(d, i) {
            // select our tooltip
            var tooltip = d3.select('#myTooltip');

            // update the position if the user's moved the mouse 
            //in the element
            tooltip.style('left', d3.event.pageX + 'px');
            tooltip.style('top', d3.event.pageY+10 + 'px');
        })
        .on('mouseleave', function(d, i){
            // select our tooltip 
            var tooltip = d3.select('#myTooltip');

            // hide tooltip if we leave the element we've been 
            // mousing over
            tooltip.style('display', 'none');
        });	
		bar.data(data).enter().append("text") //text display on top of bars
	.text(function(d,i) {return Math.round(d.count/d.total*100)})
	.style("text-anchor","middle")
	.attr("x",function(d,i) {return overlay.marginRight-levels[d.Level]*overlay.gap+10})
	.attr("y",function(d,i) {

		return overlay.marginBottom- Math.pow(Math.log(d.count),2) - d.h + Math.pow(Math.log(d.count),2)/2
	})
	return svg
}

var drawAxesBar = function(data,overlay, svg ){
	/*
		Sets locations for axes bar and creates title
	 */
	var titles = d3.scaleOrdinal([overlay.width-20-data.length*12.5,overlay.width-20]).domain(["",""]);	
	svg.append("g").attr("transform", "translate(0," + overlay.marginBottom + ")").call(d3.axisBottom(titles))	//adds the actual axis
	
	svg.append("text")
	.attr("transform","translate(" + ((overlay.width)/2) + " ," +  (100) + ")")
	.style("text-anchor","middle")
	.text("Degree Level vs Job Seeking Status (%)"); //  horizontal label axis


	}

	
var dolines = function(frame, data, data2, svg)
{
	width = frame.width; //set frame details
	height = frame.height;
	margin = frame.margin;
	//set the ranges & domains
	a = function(){var x = []; for(var i = 0; i < 21;i++) x[i] = margin.left + (i)*(width-margin.left)/21; return x} //gets position of labels
	xrange = a();
	var x = d3.scaleOrdinal().domain([ 0,1 ]).range(xrange); //domain = # years 
	var y = d3.scaleLinear().domain( [ 0,1 ] ).range([height-margin.bottom, margin.top]);
	
	x.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]); //x-axis labels
	var max1 = d3.max(data, function(d) { return d.count; })
	var max2 = d3.max(data2, function(d) { return d.count; })
	y.domain([0, max1 > max2? max1:max2]); //yaxis labels (since theres 2 lines, label should be the largest of the two )
	
	var line = d3.line() //draw lines
    .x(function(d,i) { return margin.left+i*(frame.width-margin.left)/21; }) //x location for lines
    .y(function(d) { return y(d.count); }); //ylocations for lines
	svg.append("g")
	  
	svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line); //draw first line
	  
	svg.append("path")
      .data([data2])
      .attr("class", "line2")
      .attr("d", line); //draw second line
	 
	svg.append("g")
		.attr("transform", "translate(0," + (height-margin.bottom) + ")")
		.call(d3.axisBottom(x)); // Create x axis 

	svg.append("g")
		.attr("color", "black")
		.attr("transform", "translate(" + (margin.left) + ",0)")
		.call(d3.axisLeft(y)); // Create y axis 

	dot = svg.selectAll(".dot");
    dot.data(data)
	.enter().append("circle") //makes a point on the linegraph for first line
    .attr("class", "dot") 
    .attr("cx", function(d, i) { return x(i) })
    .attr("cy", function(d) { return y(d.count) })
    .attr("r", 5)
		.on('mouseover', function(d, i) {
            // select our tooltip
            var tooltip = d3.select('#myTooltip');
            // make sure our tooltip is going to be displayed
            tooltip.style('display', 'block');

            // set the initial position of the tooltip
            tooltip.style('left', d3.event.pageX+ 'px');
            tooltip.style('top', d3.event.pageY+10+ 'px');

            // set our tooltip to have the values for the 
            // element that we're mousing over

            tooltip.html( "Seeking for a Job<br/>Experience:" + d.exp + '<br/> Count:' + d.count);
			
		})
        .on('mousemove', function(d, i) {
            // select our tooltip
            var tooltip = d3.select('#myTooltip');

            // update the position if the user's moved the mouse 
            //in the element
            tooltip.style('left', d3.event.pageX + 'px');
            tooltip.style('top', d3.event.pageY+10 + 'px');
        })
        .on('mouseleave', function(d, i){
            // select our tooltip 
            var tooltip = d3.select('#myTooltip');

            // hide tooltip if we leave the element we've been 
            // mousing over
            tooltip.style('display', 'none');
        });	
		// copy and pasting because im bad 
		dot.data(data2)
		.enter().append("circle") //makes a point on the linegraph for second line
		.attr("class", "dot") 
		.attr("cx", function(d, i) { return xrange[i]})
		.attr("cy", function(d) { return y(d.count) })
		.attr("r", 5)
			.on('mouseover', function(d, i) {
				// select our tooltip
				var tooltip = d3.select('#myTooltip');
				// make sure our tooltip is going to be displayed
				tooltip.style('display', 'block');

				// set the initial position of the tooltip
				tooltip.style('left', d3.event.pageX+ 'px');
				tooltip.style('top', d3.event.pageY+10+ 'px');

				// set our tooltip to have the values for the 
				// element that we're mousing over

				tooltip.html( "Not Looking for a Job<br/> Experience:" + d.exp + '<br/> Count:' + d.count);
				
			})
			.on('mousemove', function(d, i) {
				// select our tooltip
				var tooltip = d3.select('#myTooltip');

				// update the position if the user's moved the mouse 
				//in the element
				tooltip.style('left', d3.event.pageX + 'px');
				tooltip.style('top', d3.event.pageY+10 + 'px');
			})
			.on('mouseleave', function(d, i){
				// select our tooltip 
				var tooltip = d3.select('#myTooltip');

				// hide tooltip if we leave the element we've been 
				// mousing over
				tooltip.style('display', 'none');
			});	
  // text label for the y axis
	svg.append("text")
	.style("text-anchor","middle")
	.attr("transform", function(d) { return "translate(" + width/2 + "," + (height - 30)+ ")"})
	.text( "Years of Experience Programing (lower bound)")
		svg.append("text")
	.style("text-anchor","middle")
	.attr("transform","translate(" + 20 + " ," +  (height)/2 + "),rotate(270)")
	.text( "Number of people")

}