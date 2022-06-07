
/* ---------------------------------------------------------------------------
 * iframe bust prevent code taken from:
 * http://stackoverflow.com/questions/369498/how-to-prevent-iframe-from-redirecting-top-level-window
 * ---------------------------------------------------------------------------
*/

var prevent_bust = false ;
var from_loading_204 = false;
var frame_loading = false;
var prevent_bust_timer = 0;
var  primer = true;

window.onbeforeunload = function(event)
{
    prevent_bust = !from_loading_204 && frame_loading;
    if(from_loading_204) from_loading_204 = false;
    if(prevent_bust){
        prevent_bust_timer=500;
    }
}

function frameLoad()
{
    if(!primer){
        from_loading_204 = true;
        //window.top.location = '/?204';
        prevent_bust = false;
        frame_loading = true;
        prevent_bust_timer=1000;
    }else{
        primer = false;
    }
}

setInterval(function()
    {
        if (prevent_bust_timer>0) {
        if(prevent_bust){
            from_loading_204 = true;
            //window.top.location = '/?204';
            prevent_bust = false;
            }else if(prevent_bust_timer == 1){
                frame_loading = false;
                prevent_bust = false;
                from_loading_204 = false;
                prevent_bust_timer == 0;
            }
        }
        prevent_bust_timer--;
        if(prevent_bust_timer==-100) {
            prevent_bust_timer = 0;
        }
    },
    1
);
