
const GRID_SIZE = 44;

const TILES = [

    {
        id:'pos-unit',
        label:'1',
        classes:'tile tile-unit pos-unit',
        value:{u:1},
        size:[44,44]
    },

    {
        id:'pos-x',
        label:'x',
        classes:'tile tile-x pos-x',
        value:{x:1},
        size:[132,44]
    },

    {
        id:'pos-y',
        label:'y',
        classes:'tile tile-y pos-y',
        value:{y:1},
        size:[132,44]
    },

    {
        id:'pos-x2',
        label:'x²',
        classes:'tile tile-square-x pos-x2',
        value:{x2:1},
        size:[132,132]
    },

    {
        id:'pos-xy',
        label:'xy',
        classes:'tile tile-rect pos-xy',
        value:{xy:1},
        size:[132,132]
    },

    {
        id:'pos-y2',
        label:'y²',
        classes:'tile tile-square-y pos-y2',
        value:{y2:1},
        size:[132,132]
    },

    {
        id:'neg-unit',
        label:'−1',
        classes:'tile tile-unit neg-unit',
        value:{u:-1},
        size:[44,44]
    },

    {
        id:'neg-x',
        label:'−x',
        classes:'tile tile-x neg-x',
        value:{x:-1},
        size:[132,44]
    },

    {
        id:'neg-y',
        label:'−y',
        classes:'tile tile-y neg-y',
        value:{y:-1},
        size:[132,44]
    },

    {
        id:'neg-x2',
        label:'−x²',
        classes:'tile tile-square-x neg-x2',
        value:{x2:-1},
        size:[132,132]
    },

    {
        id:'neg-xy',
        label:'−xy',
        classes:'tile tile-rect neg-xy',
        value:{xy:-1},
        size:[132,132]
    },

    {
        id:'neg-y2',
        label:'−y²',
        classes:'tile tile-square-y neg-y2',
        value:{y2:-1},
        size:[132,132]
    }

];

const workspace =
    document.getElementById('workspace');

const expressionValue =
    document.querySelector('.expression-value');

const clearButton =
    document.querySelector('.action-btn');

const trayTiles =
    document.querySelectorAll('.tray-tile');

let boardTiles = [];
let tileCounter = 0;

let draggingTile = null;

let offsetX = 0;
let offsetY = 0;

/* =========================================================
   CREATE TILES
   ========================================================= */

trayTiles.forEach(trayTile => {

    trayTile.addEventListener('click', () => {

        const tileId =
            trayTile.dataset.tile;

        const tileData =
            TILES.find(
                tile => tile.id === tileId
            );

        createTile(tileData);

    });

});

function createTile(tileData){

    if(!tileData) return;

    const tileElement =
        document.createElement('div');

    tileElement.className =
        tileData.classes;

    tileElement.innerHTML =
        tileData.label;

    tileElement.style.left = '44px';
    tileElement.style.top = '44px';

    workspace.appendChild(tileElement);

    const tileObject = {

        id: ++tileCounter,

        element: tileElement,

        data: tileData,

        x:44,
        y:44

    };

    boardTiles.push(tileObject);

    enableDragging(tileObject);

    updateExpression();

}

/* =========================================================
   DRAGGING
   ========================================================= */

function enableDragging(tileObject){

    const tile =
        tileObject.element;

    tile.addEventListener(
        'mousedown',
        startDrag
    );

    function startDrag(event){

        draggingTile = tileObject;

        const rect =
            workspace.getBoundingClientRect();

        offsetX =
            event.clientX -
            rect.left -
            tileObject.x;

        offsetY =
            event.clientY -
            rect.top -
            tileObject.y;

        document.addEventListener(
            'mousemove',
            dragTile
        );

        document.addEventListener(
            'mouseup',
            stopDrag
        );

    }

    function dragTile(event){

        if(!draggingTile) return;

        const rect =
            workspace.getBoundingClientRect();

        let x =
            event.clientX -
            rect.left -
            offsetX;

        let y =
            event.clientY -
            rect.top -
            offsetY;

        x = snapToGrid(x);
        y = snapToGrid(y);

        x = Math.max(
            0,
            Math.min(
                x,
                workspace.clientWidth -
                tileObject.data.size[0]
            )
        );

        y = Math.max(
            0,
            Math.min(
                y,
                workspace.clientHeight -
                tileObject.data.size[1]
            )
        );

        tileObject.x = x;
        tileObject.y = y;

        tile.style.left = x + 'px';
        tile.style.top = y + 'px';

    }

    function stopDrag(){

        draggingTile = null;

        document.removeEventListener(
            'mousemove',
            dragTile
        );

        document.removeEventListener(
            'mouseup',
            stopDrag
        );

    }

}

/* =========================================================
   GRID
   ========================================================= */

function snapToGrid(value){

    return (
        Math.round(value / GRID_SIZE)
        * GRID_SIZE
    );

}

/* =========================================================
   EXPRESSION
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

    boardTiles.forEach(tile => {

        const [key,value] =
            Object.entries(
                tile.data.value
            )[0];

        counts[key] += value;

    });

    const parts = [];

    addTerm(parts, counts.x2, 'x²');
    addTerm(parts, counts.xy, 'xy');
    addTerm(parts, counts.y2, 'y²');
    addTerm(parts, counts.x, 'x');
    addTerm(parts, counts.y, 'y');
    addTerm(parts, counts.u, '');

    let expression =
        parts.join(' ');

    expression =
        expression.replace(/^\+\s*/, '');

    expression =
        expression.replace(/\+\−/g, '−');

    expressionValue.innerHTML =
        expression || '—';

}

function addTerm(parts,count,label){

    if(count === 0) return;

    const sign =
        count > 0 ? '+' : '−';

    const absolute =
        Math.abs(count);

    const coefficient =
        absolute === 1 && label !== ''
            ? ''
            : absolute;

    parts.push(
        `${sign}${coefficient}${label}`
    );

}

/* =========================================================
   CLEAR BOARD
   ========================================================= */

clearButton.addEventListener('click', () => {

    boardTiles.forEach(tile => {
        tile.element.remove();
    });

    boardTiles = [];

    updateExpression();

});

updateExpression();
