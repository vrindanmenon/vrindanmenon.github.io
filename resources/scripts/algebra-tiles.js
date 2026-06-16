/* =========================================================
   ALGEBRA TILES — algebra-tiles.js
   ========================================================= */

const UNIT = 40;

/* ----------------------------------------------------------
   Tile definitions
   w / h are in grid units (multiples of UNIT)
   ---------------------------------------------------------- */

const TILE_DEFS = {

    'pos-unit': { label: '1',   cls: 'pos-unit t-unit', w: 1, h: 1, val: { u:  1 } },
    'pos-x':    { label: 'x',   cls: 'pos-x t-x',       w: 3, h: 1, val: { x:  1 } },
    'pos-y':    { label: 'y',   cls: 'pos-y t-y',        w: 1, h: 3, val: { y:  1 } },
    'pos-x2':   { label: 'x²',  cls: 'pos-x2 t-x2',     w: 3, h: 3, val: { x2: 1 } },
    'pos-xy':   { label: 'xy',  cls: 'pos-xy t-xy',      w: 3, h: 3, val: { xy: 1 } },
    'pos-y2':   { label: 'y²',  cls: 'pos-y2 t-y2',      w: 3, h: 3, val: { y2: 1 } },

    'neg-unit': { label: '−1',  cls: 'neg-unit t-unit',  w: 1, h: 1, val: { u: -1 } },
    'neg-x':    { label: '−x',  cls: 'neg-x t-x',        w: 3, h: 1, val: { x: -1 } },
    'neg-y':    { label: '−y',  cls: 'neg-y t-y',        w: 1, h: 3, val: { y: -1 } },
    'neg-x2':   { label: '−x²', cls: 'neg-x2 t-x2',     w: 3, h: 3, val: { x2:-1 } },
    'neg-xy':   { label: '−xy', cls: 'neg-xy t-xy',      w: 3, h: 3, val: { xy:-1 } },
    'neg-y2':   { label: '−y²', cls: 'neg-y2 t-y2',      w: 3, h: 3, val: { y2:-1 } },

};

/* ----------------------------------------------------------
   State
   ---------------------------------------------------------- */

const workspace   = document.getElementById('workspace');
const exprDisplay = document.getElementById('expr-value');
const clearButton = document.getElementById('clear-btn');

let boardTiles = [];
let tileCounter = 0;

/* ----------------------------------------------------------
   Grid helpers
   ---------------------------------------------------------- */

function snapToGrid(value) {
    return Math.round(value / UNIT) * UNIT;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

/* ----------------------------------------------------------
   CREATE A TILE ON THE BOARD
   ---------------------------------------------------------- */

function createBoardTile(defId) {

    const def = TILE_DEFS[defId];
    if (!def) return;

    /* Build element — combine base class, size class, colour class */
    const el = document.createElement('div');
    el.className = `tile-base board-tile ${def.cls}`;
    el.textContent = def.label;

    /*
       Initial position: one unit in from top-left so the tile
       sits cleanly inside the first grid cell.
    */
    const startX = UNIT;
    const startY = UNIT;

    el.style.left = startX + 'px';
    el.style.top  = startY + 'px';

    workspace.appendChild(el);

    const tileObj = {
        id:  ++tileCounter,
        el,
        def,
        x: startX,
        y: startY,
    };

    boardTiles.push(tileObj);
    attachDragBehaviour(tileObj);
    updateExpression();
}

/* ----------------------------------------------------------
   DRAG BEHAVIOUR
   ---------------------------------------------------------- */

function attachDragBehaviour(tileObj) {

    const el = tileObj.el;

    /* Double-click removes the tile */
    el.addEventListener('dblclick', () => {
        destroyTile(tileObj);
    });

    el.addEventListener('mousedown', onMouseDown);

    function onMouseDown(e) {

        /* Only respond to left button */
        if (e.button !== 0) return;
        e.preventDefault();

        const wsRect = workspace.getBoundingClientRect();

        /*
           Offset = distance from pointer to tile's top-left corner,
           measured in workspace coordinates.
        */
        const offsetX = e.clientX - wsRect.left - tileObj.x;
        const offsetY = e.clientY - wsRect.top  - tileObj.y;

        el.style.zIndex = 20;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);

        function onMouseMove(e) {

            const wsRect2 = workspace.getBoundingClientRect();

            /* Raw position in workspace */
            let rawX = e.clientX - wsRect2.left - offsetX;
            let rawY = e.clientY - wsRect2.top  - offsetY;

            /* Snap to grid */
            let snappedX = snapToGrid(rawX);
            let snappedY = snapToGrid(rawY);

            /* Constrain inside workspace */
            const maxX = workspace.clientWidth  - tileObj.def.w * UNIT;
            const maxY = workspace.clientHeight - tileObj.def.h * UNIT;

            snappedX = clamp(snappedX, 0, maxX);
            snappedY = clamp(snappedY, 0, maxY);

            tileObj.x = snappedX;
            tileObj.y = snappedY;

            el.style.left = snappedX + 'px';
            el.style.top  = snappedY + 'px';
        }

        function onMouseUp() {
            el.style.zIndex = 1;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup',   onMouseUp);
        }
    }
}

/* ----------------------------------------------------------
   REMOVE A TILE
   ---------------------------------------------------------- */

function destroyTile(tileObj) {
    tileObj.el.remove();
    boardTiles = boardTiles.filter(t => t !== tileObj);
    updateExpression();
}

/* ----------------------------------------------------------
   EXPRESSION BUILDER
   ---------------------------------------------------------- */

function updateExpression() {

    /* Tally all tile values */
    const counts = { x2: 0, xy: 0, y2: 0, x: 0, y: 0, u: 0 };

    boardTiles.forEach(tileObj => {
        const [key, value] = Object.entries(tileObj.def.val)[0];
        counts[key] += value;
    });

    const parts = [];

    addTerm(parts, counts.x2, 'x²');
    addTerm(parts, counts.xy, 'xy');
    addTerm(parts, counts.y2, 'y²');
    addTerm(parts, counts.x,  'x');
    addTerm(parts, counts.y,  'y');
    addTerm(parts, counts.u,  '');

    /* Build readable string */
    let expression = parts.join(' ');

    /* Strip leading '+' */
    expression = expression.replace(/^\+\s*/, '');

    /* Replace '+ −' with just '−' */
    expression = expression.replace(/\+\s*−/g, '−');

    exprDisplay.textContent = expression || '—';
}

function addTerm(parts, count, label) {

    if (count === 0) return;

    const sign     = count > 0 ? '+' : '−';
    const absCount = Math.abs(count);

    /* Suppress coefficient of 1 for variable terms (not units) */
    const coef = (absCount === 1 && label !== '') ? '' : absCount;

    parts.push(`${sign} ${coef}${label}`);
}

/* ----------------------------------------------------------
   TRAY — click to add
   ---------------------------------------------------------- */

document.querySelectorAll('.tray-tile').forEach(trayEl => {
    trayEl.addEventListener('click', () => {
        createBoardTile(trayEl.dataset.tile);
    });
});

/* ----------------------------------------------------------
   CLEAR BOARD
   ---------------------------------------------------------- */

clearButton.addEventListener('click', () => {
    boardTiles.forEach(t => t.el.remove());
    boardTiles = [];
    updateExpression();
});

/* ----------------------------------------------------------
   INITIALISE
   ---------------------------------------------------------- */

updateExpression();