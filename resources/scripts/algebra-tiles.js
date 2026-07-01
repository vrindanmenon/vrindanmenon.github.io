/* =========================================================
   ALGEBRA TILES LAB
   Part 1
   ========================================================= */


/* =========================================================
   GRID
   ========================================================= */

const UNIT =
    parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--unit')
    );


/* =========================================================
   ROTATABLE TILES
   ========================================================= */

const ROTATABLE = [

    "pos-x",
    "pos-y",
    "pos-xy",

    "neg-x",
    "neg-y",
    "neg-xy"

];


/* =========================================================
   TILE DEFINITIONS
   ========================================================= */

const TILE_DEFS = {

    "pos-unit":{
        label:"1",
        cls:"pos-unit t-unit",
        w:1,
        h:1,
        value:{u:1}
    },

    "pos-x":{
        label:"x",
        cls:"pos-x t-x",
        w:3,
        h:1,
        value:{x:1}
    },

    "pos-y":{
        label:"y",
        cls:"pos-y t-y",
        w:1,
        h:4,
        value:{y:1}
    },

    "pos-x2":{
        label:"x²",
        cls:"pos-x2 t-x2",
        w:3,
        h:3,
        value:{x2:1}
    },

    "pos-xy":{
        label:"xy",
        cls:"pos-xy t-xy",
        w:3,
        h:4,
        value:{xy:1}
    },

    "pos-y2":{
        label:"y²",
        cls:"pos-y2 t-y2",
        w:4,
        h:4,
        value:{y2:1}
    },

    "neg-unit":{
        label:"−1",
        cls:"neg-unit t-unit",
        w:1,
        h:1,
        value:{u:-1}
    },

    "neg-x":{
        label:"−x",
        cls:"neg-x t-x",
        w:3,
        h:1,
        value:{x:-1}
    },

    "neg-y":{
        label:"−y",
        cls:"neg-y t-y",
        w:1,
        h:4,
        value:{y:-1}
    },

    "neg-x2":{
        label:"−x²",
        cls:"neg-x2 t-x2",
        w:3,
        h:3,
        value:{x2:-1}
    },

    "neg-xy":{
        label:"−xy",
        cls:"neg-xy t-xy",
        w:3,
        h:4,
        value:{xy:-1}
    },

    "neg-y2":{
        label:"−y²",
        cls:"neg-y2 t-y2",
        w:4,
        h:4,
        value:{y2:-1}
    }

};


/* =========================================================
   DOM
   ========================================================= */

const workspace =
    document.getElementById("workspace");

const expressionValue =
    document.getElementById("expr-value");

const clearButton =
    document.getElementById("clear-btn");

const trayTiles =
    document.querySelectorAll(".tray-tile");


/* =========================================================
   STATE
   ========================================================= */

let boardTiles = [];

let selectedTile = null;

let tileCounter = 0;


/* =========================================================
   CREATE TILE
   ========================================================= */

function createTile(tileID){

    const def = TILE_DEFS[tileID];

    if(!def) return;

    const tile =
        document.createElement("div");

    tile.className =
        `tile-base board-tile ${def.cls}`;

    tile.innerHTML =

        `<span class="tile-label">
            ${def.label}
        </span>`;

    tile.style.left = UNIT + "px";
    tile.style.top  = UNIT + "px";


    /* ---------------------------------------------
       ROTATE BUTTON
       --------------------------------------------- */

    if(ROTATABLE.includes(tileID)){

        const rotate =
            document.createElement("button");

        rotate.className =
            "rotate-btn";

        rotate.innerHTML = "↻";

        tile.appendChild(rotate);

    }
    else{

        tile.classList.add("no-rotate");

    }


    workspace.appendChild(tile);


    const tileObject = {

        id:++tileCounter,

        type:tileID,

        def:def,

        element:tile,

        rotated:false,

        x:UNIT,

        y:UNIT

    };

    boardTiles.push(tileObject);


    /* ---------------------------------------------
       TILE EVENTS
       --------------------------------------------- */

    tile.addEventListener(

        "click",

        event=>{

            event.stopPropagation();

            selectTile(tileObject);

        }

    );


    tile.addEventListener(

        "dblclick",

        event=>{

            event.stopPropagation();

            removeTile(tileObject);

        }

    );


    attachTileEvents(tileObject);

    updateExpression();

}


/* =========================================================
   SELECTION
   ========================================================= */

function selectTile(tileObject){

    document

        .querySelectorAll(".board-tile")

        .forEach(tile=>{

            tile.classList.remove("selected");

        });


    tileObject.element

        .classList

        .add("selected");


    selectedTile = tileObject;

}


/* =========================================================
   DESELECT
   ========================================================= */

workspace.addEventListener(

    "click",

    ()=>{

        document

            .querySelectorAll(".board-tile")

            .forEach(tile=>{

                tile.classList.remove("selected");

            });

        selectedTile = null;

    }

);


/* =========================================================
   TRAY
   ========================================================= */

trayTiles.forEach(tile=>{

    tile.addEventListener(

        "click",

        ()=>{

            createTile(

                tile.dataset.tile

            );

        }

    );

});

/* =========================================================
   TILE INTERACTION
   ========================================================= */

function attachTileEvents(tileObject){

    const tile = tileObject.element;

    const rotateButton =
        tile.querySelector(".rotate-btn");

    /* -----------------------------------------------------
       ROTATE
       ----------------------------------------------------- */

    if(rotateButton){

        rotateButton.addEventListener(

            "click",

            event=>{

                event.stopPropagation();

                rotateTile(tileObject);

            }

        );

    }

    /* -----------------------------------------------------
       MOUSE DRAG
       ----------------------------------------------------- */

    tile.addEventListener(

        "mousedown",

        startMouseDrag

    );

    /* -----------------------------------------------------
       TOUCH DRAG
       ----------------------------------------------------- */

    tile.addEventListener(

        "touchstart",

        startTouchDrag,

        {passive:false}

    );


    function startMouseDrag(event){

        if(event.button!==0) return;

        beginDrag(

            event.clientX,

            event.clientY,

            false

        );

    }


    function startTouchDrag(event){

        event.preventDefault();

        const touch =
            event.touches[0];

        beginDrag(

            touch.clientX,

            touch.clientY,

            true

        );

    }


    /* -----------------------------------------------------
       CORE DRAG
       ----------------------------------------------------- */

    function beginDrag(clientX,clientY,isTouch){

        selectTile(tileObject);

        const rect =
            workspace.getBoundingClientRect();

        const offsetX =
            clientX -
            rect.left -
            tileObject.x;

        const offsetY =
            clientY -
            rect.top -
            tileObject.y;

        tile.style.zIndex = 100;


        function move(x,y){

            const workspaceRect =
                workspace.getBoundingClientRect();

            let left =

                snap(

                    x -
                    workspaceRect.left -
                    offsetX

                );

            let top =

                snap(

                    y -
                    workspaceRect.top -
                    offsetY

                );

            left = clamp(

                left,

                0,

                workspace.clientWidth -
                tile.offsetWidth

            );

            top = clamp(

                top,

                0,

                workspace.clientHeight -
                tile.offsetHeight

            );

            tileObject.x = left;
            tileObject.y = top;

            tile.style.left =
                left + "px";

            tile.style.top =
                top + "px";

        }


        function mouseMove(event){

            move(

                event.clientX,

                event.clientY

            );

        }


        function touchMove(event){

            event.preventDefault();

            const touch =
                event.touches[0];

            move(

                touch.clientX,

                touch.clientY

            );

        }


        function stopDrag(){

            tile.style.zIndex = 2;

            document.removeEventListener(

                "mousemove",

                mouseMove

            );

            document.removeEventListener(

                "mouseup",

                stopDrag

            );

            document.removeEventListener(

                "touchmove",

                touchMove

            );

            document.removeEventListener(

                "touchend",

                stopDrag

            );

        }


        if(isTouch){

            document.addEventListener(

                "touchmove",

                touchMove,

                {passive:false}

            );

            document.addEventListener(

                "touchend",

                stopDrag

            );

        }

        else{

            document.addEventListener(

                "mousemove",

                mouseMove

            );

            document.addEventListener(

                "mouseup",

                stopDrag

            );

        }

    }

}


/* =========================================================
   ROTATE TILE
   ========================================================= */

function rotateTile(tileObject){

    const tile = tileObject.element;

    tileObject.rotated =
        !tileObject.rotated;


    /* -----------------------------------------------------
       X
       ----------------------------------------------------- */

    if(tile.classList.contains("t-x")){

        tile.classList.remove("t-x");
        tile.classList.add("t-x-rotated");

    }

    else if(tile.classList.contains("t-x-rotated")){

        tile.classList.remove("t-x-rotated");
        tile.classList.add("t-x");

    }


    /* -----------------------------------------------------
       Y
       ----------------------------------------------------- */

    else if(tile.classList.contains("t-y")){

        tile.classList.remove("t-y");
        tile.classList.add("t-y-rotated");

    }

    else if(tile.classList.contains("t-y-rotated")){

        tile.classList.remove("t-y-rotated");
        tile.classList.add("t-y");

    }


    /* -----------------------------------------------------
       XY
       ----------------------------------------------------- */

    else if(tile.classList.contains("t-xy")){

        tile.classList.remove("t-xy");
        tile.classList.add("t-xy-rotated");

    }

    else if(tile.classList.contains("t-xy-rotated")){

        tile.classList.remove("t-xy-rotated");
        tile.classList.add("t-xy");

    }


    /* -----------------------------------------------------
       KEEP TILE INSIDE BOARD
       ----------------------------------------------------- */

    tileObject.x = clamp(

        tileObject.x,

        0,

        workspace.clientWidth -
        tile.offsetWidth

    );

    tileObject.y = clamp(

        tileObject.y,

        0,

        workspace.clientHeight -
        tile.offsetHeight

    );

    tile.style.left =
        tileObject.x + "px";

    tile.style.top =
        tileObject.y + "px";

}


/* =========================================================
   REMOVE TILE
   ========================================================= */

function removeTile(tileObject){

    tileObject.element.remove();

    boardTiles =

        boardTiles.filter(

            tile =>

                tile.id !== tileObject.id

        );

    if(selectedTile &&
       selectedTile.id===tileObject.id){

        selectedTile = null;

    }

    updateExpression();

}

/* =========================================================
   UTILITIES
   ========================================================= */

function snap(value){

    return Math.round(value / UNIT) * UNIT;

}

function clamp(value,min,max){

    return Math.max(
        min,
        Math.min(value,max)
    );

}


/* =========================================================
   EXPRESSION ENGINE
   ========================================================= */

function updateExpression(){

    const counts = {

        x2:0,
        xy:0,
        y2:0,
        x:0,
        y:0,
        u:0

    };


    boardTiles.forEach(tile=>{

        const key =
            Object.keys(tile.def.value)[0];

        counts[key] +=
            tile.def.value[key];

    });


    const expression = [];

    addTerm(expression,counts.x2,"x²");
    addTerm(expression,counts.xy,"xy");
    addTerm(expression,counts.y2,"y²");
    addTerm(expression,counts.x,"x");
    addTerm(expression,counts.y,"y");
    addTerm(expression,counts.u,"");


    let result =
        expression.join(" ");

    result =
        result.replace(/^\+\s*/,"");

    result =
        result.replace(/\+\s−/g,"− ");

    expressionValue.textContent =
        result || "—";

}


/* =========================================================
   TERM BUILDER
   ========================================================= */

function addTerm(parts,count,label){

    if(count===0) return;

    const sign =
        count>0
            ? "+"
            : "−";

    const abs =
        Math.abs(count);

    const coefficient =

        abs===1 &&
        label!==""

        ? ""

        : abs;

    parts.push(

        `${sign} ${coefficient}${label}`

    );

}


/* =========================================================
   CLEAR BOARD
   ========================================================= */

clearButton.addEventListener(

    "click",

    ()=>{

        boardTiles.forEach(tile=>{

            tile.element.remove();

        });

        boardTiles=[];

        selectedTile=null;

        updateExpression();

    }

);


/* =========================================================
   OPTIONAL SHORTCUTS
   ========================================================= */

document.addEventListener(

    "keydown",

    event=>{

        if(!selectedTile) return;

        switch(event.key){

            case "Delete":

            case "Backspace":

                removeTile(selectedTile);

                break;

            case "r":

            case "R":

                if(
                    ROTATABLE.includes(
                        selectedTile.type
                    )
                ){

                    rotateTile(
                        selectedTile
                    );

                }

                break;

        }

    }

);


/* =========================================================
   INITIALISE
   ========================================================= */

updateExpression();

