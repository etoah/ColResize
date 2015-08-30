/**
 * Created by Lucien on 8/30/2015.
 */
"use strict";
(function(window,document){


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

    function getTableArray()
    {
        return document.getElementsByTagName("table");
    }

    function mousedownListener(event)
    {
        if (this.offsetWidth-event.offsetX<RESIZE_OFFSET)
        {
            this.IsMouseDown = true;
            this.clickX=event.x;
            this.oldWidth = this.offsetWidth;
        }

    }

    function mouseupListener(event)
    {
        this.IsMouseDown = false;
        this.style.cursor = 'default';
    }

    function mousemoveListener(event)
    {
       // alert("adfasdf");
        var j,table;
        //更改鼠标样式
        if (this.offsetWidth-event.offsetX<RESIZE_OFFSET)
            this.style.cursor = 'col-resize';
        else
            this.style.cursor = 'default';

        if(this.IsMouseDown&&(this.oldWidth + (event.x - this.clickX))> 0)
        {

           this.width = this.oldWidth + (event.x - this.clickX);
           //调整列宽
           this.style.width = this.width;
           this.style.cursor = 'col-resize';

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
            if(tables[i].getAttribute(IGNORE_TABLE_ATRR)==false) {
            continue;
            }
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