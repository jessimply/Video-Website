//function skipVideo
var arraySize = 5;
var x_values = new Array(arraySize);
var video_sources = new Array(3);
var count = 0;
var intervalRewind;
var video;
var currentVideoIndex;
var changedVideo;


function skipVideo() {
	video = document.getElementById("video");
	var x_orientation_average = calculateAverage(x_values);

	//if currently not rewinding we need to clear the interval
if(!video.paused && !video.ended) {
	if(x_orientation_average <= -3)  {
		video.playbackRate = 8;
		document.querySelector("#video_stat_icon").innerHTML = "⏩";	
		document.querySelector("#video_stat_text").innerHTML = " x8";	
	}
	else if (x_orientation_average <= -2)  {
		video.playbackRate =4;
		document.querySelector("#video_stat_icon").innerHTML = "⏩";	
		document.querySelector("#video_stat_text").innerHTML =  " x4";
	}
	else if (x_orientation_average <= -1.5) {
		video.playbackRate = 2;
		document.querySelector("#video_stat_icon").innerHTML = "⏩";	
		document.querySelector("#video_stat_text").innerHTML =  " x2";
	} 
	else if(x_orientation_average >= 3) {
		video.currentTime -= 0.5;
		document.querySelector("#video_stat_icon").innerHTML = "⏪";	
		document.querySelector("#video_stat_text").innerHTML =  " x4";
	} 
	else if(x_orientation_average >= 2) {
		video.currentTime -= 0.25;
		document.querySelector("#video_stat_icon").innerHTML = "⏪";	
		document.querySelector("#video_stat_text").innerHTML =  " x2";
	}
	else if(x_orientation_average >= 1.5) {
		video.currentTime -= 0.1;
		document.querySelector("#video_stat_icon").innerHTML = "⏪";	
		document.querySelector("#video_stat_text").innerHTML =  " x1";
	}
	else  {
		video.playbackRate = 1;
		document.querySelector("#video_stat_icon").innerHTML = "▶";	
		document.querySelector("#video_stat_text").innerHTML =  "";
	}
}
	
}

function calculateAverage(array) {
	var sum = 0;
	for (var i = 0; i < array.length; i++) {
		sum += array[i];
	}
	var result = (sum/array.length);
	//document.querySelector("#x_average").innerHTML = "X Average = " + result;
	return result;
}

function rewind(speed) {
	video = document.getElementById("video");
	intervalRewind = setInterval(function(){
		video.playbackRate = 1.0;
		if(video.currentTime == 0){
			clearInterval(intervalRewind);
			video.pause();
		}
		else{
			video.currentTime += -speed;
		}
	},100);
}

window.onload = function(event) {
	video = document.getElementById("video");
	//video.width = window.innerWidth - 40;
	currentVideoIndex = 0;
	changedVideo = false;
	video_sources[0] = "videos/Coastline.mp4";
	video_sources[1] = "videos/Beach.mp4";
	video_sources[2] = "videos/Water.mp4";
	var videoSrc = document.getElementById('mp4video');
	video.onpause = function() {document.querySelector("#video_stat_icon").innerHTML = "⏸";
document.querySelector("#video_stat_text").innerHTML =  "";}
	setInterval(function(){	document.querySelector("#video_time").innerHTML = "🕑 " + Math.floor(video.currentTime) + "s";}, 50);
	//videoSrc.setAttribute('src', video_sources[currentVideoIndex]);
}


window.ondevicemotion = function(event) { //Hier Ausgabe kein Acceloremeter löschen
	if(document.getElementById("no_acc").style.display != "none")
		document.getElementById("no_acc").style.display = "none";

	var ax = 0;
	if(window.orientation == 90) { //Landscape Left
		ax = event.accelerationIncludingGravity.y;
		ax = ax * (-1);
	} else if (window.orientation == -90) { //Landscape Right
		ax = event.accelerationIncludingGravity.y;
	} else { //Portrait
		ax = event.accelerationIncludingGravity.x;
	}
	var az = event.accelerationIncludingGravity.z;

	x_values[count%arraySize] = ax;

	if (count%arraySize == 0) {
		skipVideo();
		count = 0;
	}

	if(az <= -3 && !changedVideo) {
		changeVideo();
		changedVideo = true;
	}
	if(changedVideo && az > -3) {
		changedVideo = false;
	}

/*Debug Ausgaben
	document.querySelector("#x_acc").innerHTML = "X = " + ax;
	document.querySelector("#z_acc").innerHTML = "Z = " + az; 
	*/
	count++;
}

function changeVideo() {
	var videoSrc = document.getElementById('mp4video');
	currentVideoIndex = (currentVideoIndex + 1) % 3;
	videoSrc.setAttribute('src', video_sources[currentVideoIndex]);
	//videoSrc.src = video_sources[currentVideoIndex];
	video = document.getElementById("video");
	video.load();
}

window.addEventListener("orientationchange", function() {
	for (var i = 0; i < x_values.length; i++) {
		x_values[i] = 0;
	}
});
/*
if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        // alpha: rotation around z-axis
        var rotateDegrees = event.alpha;
        // gamma: left to right
        var leftToRight = event.gamma;
        // beta: front back motion
        var frontToBack = event.beta;

        handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
    }, true);
}

var handleOrientationEvent = function(frontToBack, leftToRight, rotateDegrees) {
    // do something amazing
    document.querySelector("#gamma_orientation").innerHTML = "orientation left to right = " + LeftToRight;
    
};*/