(function () 
{

	//CANVAS
	var EVT_START = 'mousedown';
	var EVT_END= 'mouseup';
	var EVT_MOVE= 'mousemove';
	
	/*
	if ((screen.width <= 480) || (screen.height <= 480)) 
	{
		var EVT_START = 'touchstart';
		var EVT_END= 'touchend';
		var EVT_MOVE= 'touchemove';
	}

	*/
	

	
	var isDown =0;
	var modeEdition = 1;

	var dataPoint= 
	{
		mTime:0,
		mEvent:null,
		strokeStyle : '#000000',  
		lineWidth   : 1,
		typeEvent : EVT_MOVE
	};
	


	var takePicture = document.querySelector("#take-picture");
    var canvas = document.querySelector("#myCanvas");
	canvas.width= document.body.clientWidth-20;
	canvas.height= '400px';
	
		
		
	document.getElementById('rubberlitop').style.borderColor = '#dcdcdc';
	 document.getElementById('taillelitop').style.borderColor = '#000000';
   //var showPicture = document.querySelector("#show-picture");

   var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';  
    ctx.lineWidth   = 1; 


	var mPoints = [];
   var sizesChoices = [1, 6, 20];
    var mDateNow =new Date();	 
	 
	
	document.querySelector("#contactBtn").onclick=
  function()
	
	{
	
		console.log('contactBtn click')
		var activity = new MozActivity(
		{
			name:'pick',
			data:{
				type:'webcontacts/contact',
				params:{
					
				}
			}
		});
		
		
	};
	
	
	function displayLocation(latitude,longitude){
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            //document.write(address.formatted_address);
			document.getElementById('locatemeDiv').innerHTML += "<br>"+address.formatted_address;
          }
        };
        request.send();
      };
	  
	  
	  /*
	function codeLatLng(lat, lng) {

		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) 
		{
			if (status == google.maps.GeocoderStatus.OK) 
			{
				if (results[1]) 
				{
					document.getElementById('locatemeDiv').innerHTML += "<br>"+results[0].formatted_address;
				
					//find country name
					for (var i=0; i<results[0].address_components.length; i++)
					{
						for (var b=0;b<results[0].address_components[i].types.length;b++) 
						{
							//there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
							if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
								//this is the object you are looking for
								city= results[0].address_components[i];
								break;
							}
						}
					}
					//city data
					document.getElementById('locatemeDiv').innerHTML += "<br>"+city.short_name + " " + city.long_name;
				
				}

			} else 
			{
			  alert("No results found");
			}
		});
	}
	*/
  
	 function locateMe(position)
	 {
		if(navigator.geolocation)
		{
			document.getElementById('locatemeDiv').innerHTML="<a target='map' href='http://maps.google.com/?q="+position.coords.latitude+","+position.coords.longitude+"'><img width='60px' src='img/map_icon.png'/></a> ";
			
			document.getElementById('locatemeDiv').innerHTML+='Latitude : '+ position.coords.latitude+' - '+
				'Longitude : '+position.coords.longitude+' - '+
				'Altitude : '+position.coords.altitude;
				
				
				
			
			displayLocation(position.coords.latitude,position.coords.longitude);
			
			
		}
	 }

	

	function drawImage(imageObj) {
        var context = canvas.getContext('2d');
        var imageX = 0;
        var imageY = 0;
		
		var imageWidth=imageObj.width;
		var imageHeight = imageObj.height;
        var documentWidth = document.getElementById("containerDiv").clientWidth-20;
		//alert(documentWidth);
		if(imageWidth>documentWidth)
		{
			imageHeight = imageHeight/imageWidth*documentWidth;
			imageWidth=documentWidth;
		}
		canvas.width=imageWidth;
		canvas.height=imageHeight;
		
		

        context.drawImage(imageObj, imageX, imageY, imageWidth, imageHeight);

        var imageData = context.getImageData(imageX, imageY, imageWidth, imageHeight);
        var data = imageData.data;

        // quickly iterate over all pixels
        for(var i = 0, n = data.length; i < n; i += 4) {
          var red = data[i];
          var green = data[i + 1];
          var blue = data[i + 2];
          var alpha = data[i + 3];
        }

        // or iterate over all pixels based on x and y coordinates.
        // loop through each row
        for(var y = 0; y < imageHeight; y++) {
          // loop through each column
          for(var x = 0; x < imageWidth; x++) {
            var red = data[((imageWidth * y) + x) * 4];
            var green = data[((imageWidth * y) + x) * 4 + 1];
            var blue = data[((imageWidth * y) + x) * 4 + 2];
            var alpha = data[((imageWidth * y) + x) * 4 + 3];
          }
        }

        // draw the new image with the modified image data
        context.putImageData(imageData, imageX, imageY);
     }

	var imageObj = new Image();
    imageObj.onload = function() {
        drawImage(this);
		navigator.geolocation.getCurrentPosition(locateMe);
    };
	  
    
    if (takePicture) {
        // Set events
        takePicture.onchange = function (event) {
		
			
            // Get a reference to the taken picture or chosen file
            var files = event.target.files, file;
            if (files && files.length > 0) {
                file = files[0];
                try {
                    // Get window.URL object
                    var URL = window.URL || window.webkitURL;

                    // Create ObjectURL
                    var imgURL = URL.createObjectURL(file);

                    // Set img src to ObjectURL
                    //showPicture.src = imgURL;
					imageObj.src = imgURL;
					
                    // Revoke ObjectURL
                    URL.revokeObjectURL(imgURL);
                }
                catch (e) {
                    try {
                        // Fallback if createObjectURL is not supported
                        var fileReader = new FileReader();
                        fileReader.onload = function (event) {
							var img = event.target.result;
                            //showPicture.src = img;
							imageObj.src=img;
                        };
                        fileReader.readAsDataURL(file);
                    }
                    catch (e) {
                        // Display error message
                        var error = document.querySelector("#error");
                        if (error) {
                            error.innerHTML = "Neither createObjectURL or FileReader are supported";
                        }
                    }
                }
            }
        };
    }
	
	
	
	//DESSIN
	 var eventListnerStart = function (e) 
    {
       if(mPoints.length==0)
			mDateNow =new Date();
        isDown = 1;
		
		 console.log('modeEdition : '+modeEdition);
		 
		if( modeEdition==1)
		{
			ctx.beginPath();  
			ctx.moveTo(e.pageX,e.pageY); 
		}
		else
		{
			ctx.clearRect(e.pageX,e.pageY,ctx.lineWidth,ctx.lineWidth);
		}
        

        var  dataPoint= 
        {
            mTime:Date.now(),
            mEvent:e,
			strokeStyle : ctx.strokeStyle,  
			lineWidth   : ctx.lineWidth ,
			typeEvent : EVT_START,
			modeEdit : modeEdition
        };

         mPoints.push(dataPoint);
        //console.log(e.pageX, e.pageY);
        
    };
   var eventListnerMove = function (e) 
    {
		
        if(isDown==1)
         {
           
			if( modeEdition==1)
			{
				ctx.lineTo(e.pageX,e.pageY);
				ctx.stroke();
			}
			else
			{
				ctx.clearRect(e.pageX,e.pageY,ctx.lineWidth,ctx.lineWidth);
			}
             var  dataPoint= 
			{
				mTime:Date.now(),
				mEvent:e,
				strokeStyle : ctx.strokeStyle,  
				lineWidth   : ctx.lineWidth ,
				typeEvent : EVT_MOVE,
				modeEdit : modeEdition
			};

			mPoints.push(dataPoint);
            
        }
           
       // console.log(e.pageX, e.pageY);
        
    };
	
	var eventListnerStop = function (e) 
    {
         isDown = 0;
   
		  if( modeEdition==1)
			{
				ctx.lineTo(e.pageX,e.pageY);
				ctx.stroke();
			}
			else
			{
				ctx.clearRect(e.pageX,e.pageY,ctx.lineWidth,ctx.lineWidth);
			}
          var  dataPoint= 
        {
            mTime:Date.now(),
            mEvent:e,
			strokeStyle : ctx.strokeStyle,  
			lineWidth   : ctx.lineWidth ,
			typeEvent : EVT_END,
				modeEdit : modeEdition
        };

         mPoints.push(dataPoint);
       // console.log(e.pageX, e.pageY);
        
    };
	
	 canvas.addEventListener(EVT_START, eventListnerStart);
    canvas.addEventListener(EVT_END, eventListnerStop);
    canvas.addEventListener(EVT_MOVE, eventListnerMove);

    if (document.getElementById('clearbtn')) 
	{
        document.getElementById('clearbtn').onclick=function()
        {

            ctx.clearRect(0,0,canvas.width,canvas.height);
        };
    }
	
	
	 document.getElementById('colorpicker').onchange=function()
    {
        ctx.strokeStyle = '#'+this.color;
    }
    for(var i =0; i<sizesChoices.length; i++)
    {
		var idsel = 'tailleselli'+i;
		console.log('tailleselli : '+idsel);
		
		document.getElementById(idsel).onclick=function()
		{
			modeEdition=1;
		 document.getElementById('rubberlitop').style.borderColor = '#dcdcdc';
			 document.getElementById('taillelitop').style.borderColor = '#000000';
			
			var posSel = this.id.substring(this.id.length-1,this.id.length);
			var idimgsel = 'tailleselimg'+posSel;
		 console.log('idimgsel : '+idimgsel);
		
			
			ctx.lineWidth = sizesChoices[posSel];
			
			for(var i =0; i<sizesChoices.length; i++)
			{
				var idimgsel = 'tailleselimg'+i;
				if(i==posSel)
				{
					document.getElementById(idimgsel).src="img/circle"+i+"_sel.png";
				}
				else
				{
					document.getElementById(idimgsel).src="img/circle"+i+".png";
				}
			
			}
		}
		
		
		var idselrubber = 'rubberselli'+i;
		console.log('idselrubber : '+idselrubber);
		
		
		document.getElementById(idselrubber).onclick=function()
		{
			modeEdition=0;
			 document.getElementById('taillelitop').style.borderColor = '#dcdcdc';
			 document.getElementById('rubberlitop').style.borderColor = '#000000';


			var posSel = this.id.substring(this.id.length-1,this.id.length);
			var idimgsel = 'rubberselimg'+posSel;
		 console.log('idimgsel : '+idimgsel);
			
			ctx.lineWidth = sizesChoices[posSel];
			
			for(var i =0; i<sizesChoices.length; i++)
			{
				var idimgsel = 'rubberselimg'+i;
				if(i==posSel)
				{
					document.getElementById(idimgsel).src="img/circle"+i+"_sel.png";
				}
				else
				{
					document.getElementById(idimgsel).src="img/circle"+i+".png";
				}
			
			}
		}
	}
	
})();
