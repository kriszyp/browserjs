// setTimeout, setInterval, clearTimeout, clearInterval

// This implementation is single-threaded (like browsers) but requires a call to serviceTimeouts()
// Also includes beginning of a multithreaded implementation (commented out)

exports.setTimeout = function(callback, delay)
{
    return _scheduleTimeout(callback, delay, false);
}

exports.setInterval = function(callback, delay)
{
    return _scheduleTimeout(callback, delay, true);
}

exports.clearTimeout = function(id)
{
    if (timeouts[id]){
        timeouts[id].task.cancel();
        timeouts[id].cancelled = true;
    }
}

exports.clearInterval = exports.clearTimeout;


var nextId = 1,
    timeouts = {},
    timer, 
    queue;

var _scheduleTimeout = function(callback, delay, repeat)
{
	if (typeof callback == "function")
		var func = callback;
	else if (typeof callback == "string")
		var func = new Function(callback);
	else
		return;

	var timeout = {
    };
	var id = nextId++;
    timeouts[id] = timeout;

    timer = timer || new java.util.Timer("JavaScript timer thread", true);
    queue = queue || require("event-queue");
	var task = timeout.task = new java.util.TimerTask({
        run: function(){
        	queue.enqueue(function(){
        		if(!timeout.cancelled){ // check to make sure it wasn't enqueued and then later cancelled
        			func();
        		}
        	});
        }
    });
    delay = Math.floor(delay);
    
    if(repeat){
    	timer.schedule(task, delay, delay);
    }
    else{
    	timer.schedule(task, delay);
    }
    
	return id;
}


