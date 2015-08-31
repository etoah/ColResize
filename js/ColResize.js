/**
 * Created by Lucien on 8/30/2015.
 */

(function(window,document){

    "use strict";
    var IGNORE_TABLE_ATRR="data-col-resize";
    var RESIZE_OFFSET=12;

    function addEvent(element,event,callback)
    {
        if(element.addEventListener) //DOM 2
        {
            element.addEventListener(event,callback);

        }
        else if(element.attachEvent)//less than IE9
        {
            element.addEventListener('on'+event,callback);
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
        if (this.offsetWidth-event.offsetX<RESIZE_OFFSET)
        {
            this.IsMouseDown = true;
            this.clickX=event.x;
            this.oldWidth = this.offsetWidth;
        }

        //next col
        var previous=getPerviousElement(this);
        if(event.offsetX<RESIZE_OFFSET&&IsTableHeader(previous))
        {

            previous.IsMouseDown = true;
            previous.clickX=event.x;
            previous.oldWidth = previous.offsetWidth;
        }

    }

    function mouseupListener(event)
    {

        this.style.cursor = 'default';
    }

    function settTableStyle(table)
    {
        table.style.borderCollapse="collapse";
    }

    function mousemoveListener(event)
    {


        var previous=getPerviousElement(this);
        if ((this.offsetWidth-event.offsetX<RESIZE_OFFSET)||(event.offsetX<RESIZE_OFFSET)&&IsTableHeader(previous))//this or next col
            this.style.cursor = 'col-resize';
        else
            this.style.cursor = 'default';




        //this col
        if(this.IsMouseDown&&(this.oldWidth + (event.x - this.clickX))> 0)
        {
           this.width = this.oldWidth + (event.x - this.clickX);
           //rersize width
           this.style.width = this.width;
           this.style.cursor = 'col-resize';

        }

        //next
        var previous=getPerviousElement(this);
        if(IsTableHeader(previous)&&previous.IsMouseDown&&(previous.oldWidth + (event.x - previous.clickX))> 0)
        {
           // console.log(event.offsetX);
            previous.width = previous.oldWidth + (event.x - previous.clickX);
            //rersize width
            previous.style.width = previous.width;
            this.style.cursor = 'col-resize';

        }
    }


    //To prevent drag too fast or drag into the table, cancel all header drag
    function mouseupOnTableListener(event)
    {
        var j=0;
        for(;j<this.rows[0].cells.length;j++)
        {
            this.rows[0].cells[j].IsMouseDown&&(this.rows[0].cells[j].IsMouseDown=false);
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
            settTableStyle(tables[i]);
            addEvent(tables[i],"mouseup",mouseupOnTableListener);
            for(j=0;j<tables[i].rows[0].cells.length;j++)
            {
                currentCell=tables[i].rows[0].cells[j];
                addEvent(currentCell,"mousemove",mousemoveListener);
                addEvent(currentCell,"mousedown",mousedownListener);
                addEvent(currentCell,"mouseup",mouseupListener);


            }


        }
    }



    addEvent(window,"load",addColResizeEvent);



})(window,document);