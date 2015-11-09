
  jsPsych['plugin-corsi'] = (function(){

    var plugin = {};

    plugin.create = function(params){
      params = jsPsych.pluginAPI.enforceArray(params, ['stimuli']);
      var trials = new Array (params.stimuli.length);

      for (i=0;i<trials.length;i++) {
        trials[i]={};
        trials[i].stimuli=params.stimuli[i];
        trials[i].choices = params.choices || [];
        trials[i].response_ends_trial = (typeof params.response_ends_trial === 'undefined') ? true : params.response_ends_trial;
        console.log(trials[i]);
        
        
      }
      

      return trials;
    }

    plugin.trial = function(display_element, trial){

      trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

      function Shape(x, y, w, h, fill) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fill = fill;
    }
        // get canvas element.
        var elem = document.getElementById('myCanvas');
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
              //display_element.append[rects[i]];
              context.fillRect(rects[i].x, rects[i].y, rects[i].w, rects[i].h);
            }

        }
      }

      //display_element.append('<p>This is the first paragraph</p>');
      //display_element.append('<p>This is the second paragraph</p>');
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

      function runTrial(rectTrial) {
        alert("Ready?");
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
          elem.removeEventListener('click',checkCol,false);
          }
        
           
         return rectstr;
      }
      // function to check collision
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
      
      
        //if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
       // elem.addEventListener('click', checkCol);

        // function that do things if collision occured.
        function checkCol(e) {
            console.log('click: ' + e.offsetX + '/' + e.offsetY);
            var rect = collides(rects, e.offsetX, e.offsetY);
            if (rect) {
                change_c(rect);
                responseSet.push(rect);
                console.log(responseSet);
                if (responseSet.length>=trial.stimuli.length) {
                end_trial();
              } else {
                responseSet=responseSet;
                console.log('collision: ' + rect.x + '/' + rect.y);
              }
            } else {
                console.log('no collision');
                //response.push(rect);
            }
        }
     
      //}

      function runBlock() {

        responseSet=[];
        rectstr = runTrial(trial.stimuli);
        elem.addEventListener('click', checkCol);
        
          
        
    }
      
      

      var response = {rt: -1, key: -1};

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
      
        // var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        //   callback_function: after_response,
        //   valid_responses: trial.choices,
        //   rt_method: 'date',
        //   persist: false,
        //   allow_held_key: false
        // });
      //}
      var end_trial = function() {
        // check if the sequence that was pressed is identical to the one that was presented
        
        rectCompare=[]
        // should put here an if statement if direction is backward the loop should be reversed
        for (i=0;i<responseSet.length;i++) {
          rectCompare.push(rects[trial.stimuli[i]]);
          
        }
        
        console.log(rectCompare);
        console.log(responseSet);
        if (JSON.stringify(responseSet) === JSON.stringify(rectCompare)) {
          var correctAns=1;
          console.log("Ok");

        } else {
          correctAns=0;

          console.log("mistake");
        }
        elem.removeEventListener('click',checkCol,false);

        // save data
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimuli,
          "correctAns": correctAns,
        };

        jsPsych.data.write(trial_data);
        jsPsych.finishTrial();
      }
      runBlock();
      console.log(trial.stimuli);
      
    }

    return plugin;

  })();
 