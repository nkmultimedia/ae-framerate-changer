/*******************************
*   FrameRate Changer v1.1
*
* This is an After Effects script to change the framerate of the footages & compositions in you AE project.
* If the user selects files before running the script, the framrerate will be changed only for those items.
* This script only changes the INTERPRET FOOTAGE fps value. It does NOT CONVERT the footage to a new fps
* Feel free to edit and customize to suit your needs
*
* License: Open Sounrce (MIT)
* Created by: NK Multimedia
*
*/





(function(){					//IIFE	
	var length = app.project.numItems;		//Number of items (footages) in current AE Project
	var userInput = null;
    var objectsChanged = 0; 			//Number of footages that have changed framerate
    var objectsUnchanged = 0;		//Number of footages that are already at the target framerate
	
	//Exception Handling ========================================================================================
	while(true){
		userInput = prompt("Enter the new frame rate\n(1 - 99):", "");	//AE only supports upto 99 fps
		
		if(userInput === null){       //User cancelled the script
			break;
		}
        userInput = userInput.replace(/ /g, "");     //RegExp; Find and remove all whitespaces
		if (userInput === "") { continue; }       //No input; Ask again
		else if (isNaN (userInput)) {
				alert("That's not a number");
				continue;
		}
	
		try{
			var newFrameRate = Number (userInput);
			if(newFrameRate<1){
				alert("That's less than 1. Framerates must be between 1 and 99");
				continue;
			}else if(newFrameRate>99){
				alert("That's higer than 99. Framerates must be between 1 and 99");
				continue;
			}
			runScript();     //Start the core functionality
			break;
			
		}catch(err){      //Display any other error as they are
			throw err;
		}
	}	
    
	//Change Framerate ========================================================================================
    function changeFramerate(avItem){
        avItemType = avItem.typeName;
        if( avItemType === 'Folder'){        //Skip folders
            return;
        }
        
        if(avItem.frameRate != newFrameRate){
            if( avItemType === 'Composition'){       //composition
                avItem.frameRate = newFrameRate;
            } else {                                    //footage
                
                if(avItem.frameRate === 0 && avItem.frameDuration === 1){     //Skip images
                    return;   
                }
                avItem.mainSource.conformFrameRate = newFrameRate;
                avItem.mainSource.proxyFrameRate = newFrameRate;
            }
            
            objectsChanged++;
        }else{
            objectsUnchanged++;
        }
    }
    
    
	//Core Functionality ========================================================================================
	function runScript(){
        var userSelection = false;
		var  currentObject = new Object();
        var  currentObjectType = '';
        
        //If user has selected items, only change framerates for those footages
        for(var i=1; i<=length; i++){
            if(!app.project.item(i).selected){
                continue
            };
            userSelection = true;
            currentObject = app.project.item(i);
            changeFramerate(currentObject);
        }
        
        //If user hasn't selected anything, change framerates for all footages
        if(!userSelection){
            for (var i=1; i<=length; i++){
                currentObject = app.project.item(i);
                changeFramerate(currentObject);
            }
            
        }
	
		//Final status alert ========================================================================================
        var message = "Frame rate changed for "+objectsChanged
		if(objectsChanged === 1){
            message += " footage\n";
        }else{
            message += " footages\n";
        }
		if(objectsUnchanged){
            if(objectsUnchanged === 1){
                message += objectsUnchanged + " footage was aleready at "+newFrameRate+" fps";    
            }else{
                message += objectsUnchanged + " footages were aleready at "+newFrameRate+" fps";    
            }	
		}
		alert(message);
	}
})();


/*******************************
*   Version Log
*
* v1.0 - Changes framerate for all compositions in the bin
* v1.1 - Script now supports fps changes for footages. User selection enabled
*
*/