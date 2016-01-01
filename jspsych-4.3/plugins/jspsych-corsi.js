/**
 * jspsych-corsi
 * Or Duek
 *
 * plugin for running the corsi block task in jspsych
 *
 * documentation: docs.jspsych.org
 *
 **/

(function($) {
	jsPsych["corsi"] = (function() {

		var plugin = {};

		plugin.create = function(params) {

			params = jsPsych.pluginAPI.enforceArray(params, ['sequence', 'direction']);

			var trials = new Array(params.sequence.length);
			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].direction = params.direction || [];
				trials[i].response_ends_trial = (typeof params.response_ends_trial === 'undefined') ? true : params.response_ends_trial;
				// timing parameters
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
				// optional parameters
				trials[i].is_html = (typeof params.is_html === 'undefined') ? false : params.is_html;
				trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
			}
			return trials;
		};



		plugin.trial = function(display_element, trial) {

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];

			function collides(rects, x, y) {
			    var isCollision = false;
			    for (var i = 0, len = rects.length; i < len; i++) {
			        var left = rects[i].x, right = rects[i].x+rects[i].w;
			        var top = rects[i].y, bottom = rects[i].y+rects[i].h;
			        if (right >= x
			          && left <= x
			          && bottom >= y
			          && top <= y) {
			            isCollision = rects[i];
			        }
			    }
			    return isCollision;
			}

			// display stimulus
				function Shape(x, y, w, h, fill) {
				    this.x = x;
				    this.y = y;
				    this.w = w;
				    this.h = h;
				    this.fill = fill;
				}

				// get canvas element.
				var elem = document.getElementById('myCanvas');


				// Changing color of rectangle when needed for 1sec and then back to black (original color)
				function change_color(rect,delay1,delay2) {
				 setTimeout(function() { context.fillStyle= "Yellow";
				  context.fillRect(rect.x,rect.y,rect.w,rect.h);
				  }, delay1);
				  var myVar = setTimeout(function(){
				  context.fillStyle="Black";
				  context.fillRect(rect.x,rect.y,rect.w,rect.h);
				}, delay2); }// wait for 1000ms.

				function change_c(rect) {
				  context.fillStyle= "Yellow";
				  context.fillRect(rect.x,rect.y,rect.w,rect.h);
				  var myVar = setTimeout(function(){
				  context.fillStyle="Black";
				  context.fillRect(rect.x,rect.y,rect.w,rect.h);
				}, 1000);
				}
			if (elem && elem.getContext) {
			    // list of rectangles to render
			    var rects = [];
			    rects.push(new Shape(20, 20, 100, 100, "#333"));  //building the rectangels
			    rects.push(new Shape(400, 15, 100, 100, "#333"));
			    rects.push(new Shape(650, 50, 100, 100, "#333"));
			    rects.push(new Shape(260, 120, 100,100, "#333"));
			    rects.push(new Shape(600,300,100,100,"#333"));
			    rects.push(new Shape(150,320,100,100,"#333"));
			    rects.push(new Shape(15,400,100,100,"#333"));
			    rects.push(new Shape(200,450,100,100,"#333"));
			    rects.push(new Shape(450,400,100,100,"#333"));
			    rects.push(new Shape(660,450,100,100,"#333"));
			  // get context
			  var context = elem.getContext('2d');
			  if (context) {

			      for (var i = 0, len = rects.length; i < len; i++) {
			        context.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
			      }

			  }
			}

			function runTrial(rectTrial) {
			  var rectstr=[];
			  delay1=0;
			  delay2=1000;
			  for (var i=0; i<rectTrial.length; i++) {
			    rectangle=rectTrial[i];
			    rectstr.push(rectangle);
			    console.log(rectstr);
			    delay1= delay1 + 1000;
			    delay2= delay2 + 1000;
			    change_color(rects[rectangle],delay1,delay2);
			  }

			   //return rectstr;
			}

			// store response
			var response = {rt: -1, key: -1};

			// function to end trial when it is time
			var end_trial = function() {

				// kill any remaining setTimeout handlers
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}

				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined'){
					jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				}

				// gather the data to store for the trial
				var trial_data = {
					"rt": response.rt,
					"rectangle": trial.a_path,
					"recPress": response.key
				};

				jsPsych.data.write(trial_data);

				// clear the display
				display_element.html('');

				// move on to the next trial
				jsPsych.finishTrial();
			};

			// function to handle responses by the subject
			var after_response = function(info) {

				// after a valid response, the stimulus will have the CSS class 'responded'
				// which can be used to provide visual feedback that a response was recorded
				$("#jspsych-single-stim-stimulus").addClass('responded');

				// only record the first response
				if(response.key == -1){
					response = info;
				}

				if (trial.response_ends_trial) {
					end_trial();
				}
			};

			// start the response listener
			elem.addEventListener('click', function(e) {
		      console.log('click: ' + e.offsetX + '/' + e.offsetY);
		      var rect = collides(rects, e.offsetX, e.offsetY);
		      if (rect) {
		          change_c(rect);
		          console.log(rect);
		          response.push(rect);

		          console.log('collision: ' + rect.x + '/' + rect.y);
		      } else {
		          console.log('no collision');
		          response.push(rect);
		      }
		  }, false);
			// if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
			// 	var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
			// 		callback_function: after_response,
			// 		valid_responses: trial.choices,
			// 		rt_method: 'date',
			// 		persist: false,
			// 		allow_held_key: false
			// 	});
			// }

			// hide image if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$('#jspsych-single-stim-stimulus').css('visibility', 'hidden');
				}, trial.timing_stim);
				setTimeoutHandlers.push(t1);
			}

			// end trial if time limit is set
			if (trial.timing_response > 0) {
				var t2 = setTimeout(function() {
					end_trial();
				}, trial.timing_response);
				setTimeoutHandlers.push(t2);
			}

		};

		return plugin;
	})();
})(jQuery);
