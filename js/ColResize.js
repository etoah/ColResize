/**
 * Created by Lucien on 8/30/2015.
 */

(function(window,document){

    "use strict";
    var IGNORE_TABLE_ATRR="data-col-resize";
    var RESIZE_OFFSET=10;

    var RUN_DELAY=15;
    var MUST_RUN_DELAY=30;


    var throttle = function(fn, delay, mustRunDelay){
        var timer = null;
        var t_start;
        return function(){
            var context = this, args = arguments, t_curr = +new Date();
            clearTimeout(timer);
            if(!t_start){
                t_start = t_curr;
            }
            if(t_curr - t_start >= mustRunDelay){  //当超过了必须执时的时间，
                fn.apply(context, args);
                t_start = t_curr;
            }
            else {
                timer = setTimeout(function(){
                    fn.apply(context, args);
                }, delay);
            }
        };
    };

    function addEvent(element,event,callback)
    {
        if(element.addEventListener) //DOM 2
        {
            element.addEventListener(event,callback);

        }
        else if(element.attachEvent)//less than IE9
        {
            element.attachEvent('on'+event,callback);
        }
        else//dom 0
        {
            element['on'+event]=callback;
        }
    }

    function getPerviousElement(ele)
    {
        var previous=ele.previousSibling;
        while ( previous && previous.nodeType !== 1 ){ previous=previous.previousSibling; }
        return previous;
    }

    function getTableArray()
    {
        return document.getElementsByTagName("table");
    }

    function IsTableHeader(ele)
    {
        return ele&&(ele.nodeName==="TD"||ele.nodeName==="TH")
    }


    function mousedownListener(event)
    {

        var sender=this,
            previous=getPerviousElement(sender);
        event.x||(event.x=event.pageX);//Firefox
        if(this===window)//less than ie8
        {
            sender=event.srcElement;
        }

        if (sender.offsetWidth-event.offsetX<=RESIZE_OFFSET)
        {
            sender.IsMouseDown = true;
            sender.clickX=event.x;
            sender.oldWidth = sender.offsetWidth;
        }
        else if(event.offsetX<=RESIZE_OFFSET&&IsTableHeader(previous))//next col
        {

            previous.IsMouseDown = true;
            previous.clickX=event.x;
            previous.oldWidth = previous.offsetWidth;
        }

    }

    function mouseupListener(event)
    {

        var sender=this,
            previous=getPerviousElement(sender);
        if(this===window)//less than ie8
        {
            sender=event.srcElement;
        }
        sender.style.cursor = 'default';
        if (sender.offsetWidth-event.offsetX<=sender.offsetWidth/2)
        {
            sender.IsMouseDown = false;
        }
        else if(event.offsetX<=sender.offsetWidth/2&&IsTableHeader(previous))//next col
        {

            previous.IsMouseDown = false;
        }
    }

    function setTableStyle(table)
    {
        table.style.borderCollapse="collapse";
    }

    function mousemoveListener(event)
    {
        var sender=this,
            previous=getPerviousElement(sender);
        event.x||(event.x=event.pageX);//Firefox
        if(this===window)//less than ie9
        {
            sender=event.srcElement;
        }

        if ((sender.offsetWidth-event.offsetX<=RESIZE_OFFSET)||(event.offsetX<=RESIZE_OFFSET)&&IsTableHeader(previous))//this or next col
            sender.style.cursor = 'col-resize';
        else
            sender.style.cursor = 'default';

        //this col
        if(sender.IsMouseDown&&(sender.oldWidth + (event.x - sender.clickX))> 0)
        {
            sender.width = sender.oldWidth + (event.x - sender.clickX);
           //rersize width
            sender.style.width = sender.width;
            sender.style.cursor = 'col-resize';

        }
        else if(IsTableHeader(previous)&&previous.IsMouseDown&&(previous.oldWidth + (event.x - previous.clickX))> 0)//next
        {
            previous.width = previous.oldWidth + (event.x - previous.clickX);
            //rersize width
            previous.style.width = previous.width;
            sender.style.cursor = 'col-resize';

        }
    }



    function mouseupOnTableListener(event)
    {
        var sender=this,
            j=0;
        if(this===window)//less than ie9
        {
            sender=event.srcElement;
        }

        if(sender.nodeName==="TABLE")//To prevent drag too fast or drag into the table, cancel all header drag
        {
            for(;j<sender.rows[0].cells.length;j++)
            {
                sender.rows[0].cells[j].IsMouseDown&&(sender.rows[0].cells[j].IsMouseDown=false);
            }


        }



    }

    function addColResizeEvent()
    {
        var tables=getTableArray(),
            i= 0,
            j= 0,
            currentCell=null;
        for(;i<tables.length;i++)
        {
            if(tables[i].getAttribute(IGNORE_TABLE_ATRR)==="false") {
            continue;
            }
            setTableStyle(tables[i]);
            addEvent(tables[i],"mouseup",mouseupOnTableListener);
            for(j=0;j<tables[i].rows[0].cells.length;j++)
            {
                currentCell=tables[i].rows[0].cells[j];
                addEvent(currentCell,"mousemove",throttle(mousemoveListener,RUN_DELAY,MUST_RUN_DELAY));
                //addEvent(currentCell,"mousemove",mousemoveListener);
                addEvent(currentCell,"mousedown",mousedownListener);
                addEvent(currentCell,"mouseup",mouseupListener);


            }


        }
    }



    addEvent(window,"load",addColResizeEvent);



})(window,document);