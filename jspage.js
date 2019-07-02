	window.onload = function(){
	 
	 // Create svg canvas.
	 var svg = d3.select("svg")
		.attr("width", 960)
		.attr("height", 540); 
	 // Load json data.
	 d3.json("data.json", function(data){
		 var nodes = data.nodes;
		 var links=data.links;
	
	// Initialise map for storing trading amount for circle and line widths.
	var radiusMap = new Map();
	var radius = [0,0,0,0,0,0,0,0,0,0,0];
	for (i = 0; i < links.length; i++) {

	  if(links[i].node01 === "site01" || links[i].node02 === "site01"){
		radius[0] += links[i].amount;
		radiusMap.set("site01", radius[0])
	  }
	  if(links[i].node01 === "site02" || links[i].node02 === "site02"){
		radius[1] += links[i].amount;
		radiusMap.set("site02", radius[1])
	  }
	  if(links[i].node01 === "site03" || links[i].node02 === "site03"){
		radius[2] += links[i].amount;
		radiusMap.set("site03", radius[2])
	  }
	  if(links[i].node01 === "site04" || links[i].node02 === "site04"){
		radius[3] += links[i].amount;
		radiusMap.set("site04", radius[3])
	  }
	  if(links[i].node01 === "site05" || links[i].node02 === "site05"){
		radius[4] += links[i].amount;
		radiusMap.set("site05", radius[4])
	  }
	  if(links[i].node01 === "site06" || links[i].node02 === "site06"){
		radius[5] += links[i].amount;
		radiusMap.set("site06", radius[5])
	  }
	  if(links[i].node01 === "site07" || links[i].node02 === "site07"){
		radius[6] += links[i].amount;
		radiusMap.set("site07", radius[6])
	  }
	  if(links[i].node01 === "site08" || links[i].node02 === "site08"){
		radius[7] += links[i].amount;
		radiusMap.set("site08", radius[7])
	  }
	  if(links[i].node01 === "site09" || links[i].node02 === "site09"){
		radius[8] += links[i].amount;
		radiusMap.set("site09", radius[8])
	  }
	  if(links[i].node01 === "site10" || links[i].node02 === "site10"){
		radius[9] += links[i].amount;
		radiusMap.set("site10", radius[9])
	  }
	  if(links[i].node01 === "site11" || links[i].node02 === "site11"){
		radius[10] += links[i].amount;
		radiusMap.set("site11", radius[10])
	  }

	}

		
	// To get the connected circles to hovered circle.	 
	function findAttribute(site){
		 links_list=[]
		 for(i=0;i<links.length;i++){
			 if(links[i].node01 === site || links[i].node02=== site){
				 links_list.push(links[i])
			 } 
		  }
		 return links_list;
	 }
	 
	
	// Function to draw lines.
	function lines(){
		svg.selectAll("line")
		.data(links)
		.enter()
		 .append("line")
		 .style("stroke", "black") 
		 .attr("x1", function (d) {
			 return coordinateX(d.node01)
			 })
		 .attr("y1", function (d) {
			 return coordinateY(d.node01)
			 })
		 .attr("x2", function (d) {
			 return coordinateX(d.node02)
			 })
		 .attr("y2", function (d) {
			 return coordinateY(d.node02)
			 })
		 .attr("id",function(d,i){ 
		 return [d.node01,d.node02]
		 })
		 .attr("stroke-width", function (d) {
			 return d.amount/175
			 });
	 }
	 
	 
	// Tooltip for naming sites.	 
	var tooltip = d3.select("body")
					.append("div")
					.attr('class', 'tooltip'); 

	
	// Parameters initialisation for gaussian blur.	
	var defs = svg.append("defs");

	//Filter for the outside glow
	var filter = defs.append("filter")
		.attr("id","glow");
	filter.append("feGaussianBlur")
		.attr("stdDeviation","4")
		.attr("result","coloredBlur");
	var feMerge = filter.append("feMerge");
	feMerge.append("feMergeNode")
		.attr("in","coloredBlur");
	feMerge.append("feMergeNode")
		.attr("in","SourceGraphic");
		
	lines();
	
	// Function to draw circles and perform some interactive graphics.
	function circles(){
		 
		svg.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		 
		.attr('cx', function(d,i){ return d.x;})
		.attr('r',function(d,i){
			return radiusMap.get(d.id)/40; // Divided by 40 to reduce circle size.
			})
		.attr('cy',function(d,i){ return d.y;})
		.attr('fill','#3498DB')
		.attr("id",function(d,i){ return d.id;}) 
		.on('mouseover',function(d) {
			d3.select(this)
			  .attr('fill','#E74C3C')
			d3.select(this)
			  .style("filter", "url(#glow)");  
			svg.selectAll("circle").attr("opacity", 0.2); // grey out all circles
			d3.select(this).attr("opacity", 2); 
			var siteid=this.id;
			var filteredlist=findAttribute(siteid);
			svg.selectAll("line").remove();

			
			svg.selectAll("g")
			.data(filteredlist)
			.enter().append("line")
			 .style("stroke", "black") 
			 .attr("x1", function (d) {return coordinateX(d.node01)})
			 .attr("y1", function (d) {return coordinateY(d.node01)})
			 .attr("x2", function (d) {return coordinateX(d.node02)})
			 .attr("y2", function (d) {return coordinateY(d.node02)})
			 .attr("id", function(d){ return [d.node01,d.node02]})
			 .attr("stroke-width", function (d) {
				 
				 return d.amount/200
				 })
			 .attr("opacity", 10);
			
			return tooltip.style("visibility", "visible").text('Trading Amount : ' + radiusMap.get(siteid)
			+", Connected Locations : "+ findAttribute(siteid).length);
			})
		 // Parameter to get the espective tooltip value if cursor is placed on circle.		
		 .on("mousemove", function() {
			return tooltip.style("top", (event.pageY - 30) + "px")
			  .style("left", event.pageX + "px");
		  })	
		 .on("mouseout", function(thisElement){
			 d3.select(this)
			  .attr('fill','light blue')
				d3.selectAll("circle").attr("opacity", 1);
				svg.selectAll("line").remove();
				svg.selectAll("circle").remove();
				 
				lines();
				circles();
				tooltip.style("visibility", "hidden");
				
			});
		}

			circles();
			lines();
			
	// Parameters for tooltip.
	svg.selectAll('rect')
	.data(nodes)
	.enter()
		.append('svg:text')
		.attr('x', function (d) {return d.x+2;})
		.attr('r',5)
		.attr('y', function (d) { return d.y+50;})
		.attr('text-anchor', "middle")
		.attr('dy', '0.2em')
		.text(function(d) { return d.id; });
		 
	function coordinateX(node){
		for(var i=0;i<nodes.length;i++){
			if (node===nodes[i].id){
				return nodes[i].x}
			}
		}
	 function coordinateY(node){
		for(var i=0;i<nodes.length;i++){
			if (node===nodes[i].id){
				return nodes[i].y}}
		}
	 });
	}