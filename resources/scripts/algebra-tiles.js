/* =========================================================
   ALGEBRA TILES — algebra-tiles.js

   Grid unit = 40px
   x = 3 units = 120px  (horizontal)
   y = 4 units = 160px  (vertical)

   Tile pixel sizes:
     unit  →  40 ×  40
     x     → 120 ×  40
     y     →  40 × 160
     x²    → 120 × 120   (3×3)
     xy    → 120 × 160   (3×4)
     y²    → 160 × 160   (4×4)
   ========================================================= */

const UNIT = 40;

/* ----------------------------------------------------------
   Tile definitions
   w / h in grid units so dragging stays on the 40px grid
   ---------------------------------------------------------- */

const TILE_DEFS = {

    'pos-unit': { label: '1',   cls: 'pos-unit t-unit', w: 1, h: 1, val: { u:  1 } },
    'pos-x':    { label: 'x',   cls: 'pos-x    t-x',   w: 3, h: 1, val: { x:  1 } },
    'pos-y':    { label: 'y',   cls: 'pos-y    t-y',   w: 1, h: 4, val: { y:  1 } },
    'pos-x2':   { label: 'x²',  cls: 'pos-x2   t-x2',  w: 3, h: 3, val: { x2: 1 } },
    'pos-xy':   { label: 'xy',  cls: 'pos-xy   t-xy',  w: 3, h: 4, val: { xy: 1 } },
    'pos-y2':   { label: 'y²',  cls: 'pos-y2   t-y2',  w: 4, h: 4, val: { y2: 1 } },

    'neg-unit': { label: '−1',  cls: 'neg-unit t-unit', w: 1, h: 1, val: { u: -1 } },
    'neg-x':    { label: '−x',  cls: 'neg-x    t-x',   w: 3, h: 1, val: { x: -1 } },
    'neg-y':    { label: '−y',  cls: 'neg-y    t-y',   w: 1, h: 4, val: { y: -1 } },
    'neg-x2':   { label: '−x²', cls: 'neg-x2   t-x2',  w: 3, h: 3, val: { x2:-1 } },
    'neg-xy':   { label: '−xy', cls: 'neg-xy   t-xy',  w: 3, h: 4, val: { xy:-1 } },
    'neg-y2':   { label: '−y²', cls: 'neg-y2   t-y2',  w: 4, h: 4, val: { y2:-1 } },

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
   Helpers
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

    const el = document.createElement('div');
    // tile-base gives shared styles; board-tile gives position:absolute + drag cursor
    el.className = `tile-base board-tile ${def.cls}`;
    el.textContent = def.label;

    // Place at (1, 1) grid cell by default
    const startX = UNIT;
    const startY = UNIT;
    el.style.left = startX + 'px';
    el.style.top  = startY + 'px';

    workspace.appendChild(el);

    const tileObj = { id: ++tileCounter, el, def, x: startX, y: startY };

    boardTiles.push(tileObj);
    attachDrag(tileObj);
    updateExpression();
}

/* ----------------------------------------------------------
   DRAG
   ---------------------------------------------------------- */

function attachDrag(tileObj) {

    const el = tileObj.el;

    el.addEventListener('dblclick', () => destroyTile(tileObj));

    el.addEventListener('mousedown', e => {

        if (e.button !== 0) return;
        e.preventDefault();

        const wsRect = workspace.getBoundingClientRect();
        const offsetX = e.clientX - wsRect.left - tileObj.x;
        const offsetY = e.clientY - wsRect.top  - tileObj.y;

        el.style.zIndex = 20;

        const onMove = e => {
            const r = workspace.getBoundingClientRect();
            let nx = snapToGrid(e.clientX - r.left - offsetX);
            let ny = snapToGrid(e.clientY - r.top  - offsetY);
            nx = clamp(nx, 0, workspace.clientWidth  - tileObj.def.w * UNIT);
            ny = clamp(ny, 0, workspace.clientHeight - tileObj.def.h * UNIT);
            tileObj.x = nx;
            tileObj.y = ny;
            el.style.left = nx + 'px';
            el.style.top  = ny + 'px';
        };

        const onUp = () => {
            el.style.zIndex = 1;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup',   onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
    });
}

/* ----------------------------------------------------------
   REMOVE
   ---------------------------------------------------------- */

function destroyTile(tileObj) {
    tileObj.el.remove();
    boardTiles = boardTiles.filter(t => t !== tileObj);
    updateExpression();
}

/* ----------------------------------------------------------
   EXPRESSION
   ---------------------------------------------------------- */

function updateExpression() {

    const counts = { x2: 0, xy: 0, y2: 0, x: 0, y: 0, u: 0 };

    boardTiles.forEach(t => {
        const [key, val] = Object.entries(t.def.val)[0];
        counts[key] += val;
    });

    const parts = [];
    addTerm(parts, counts.x2, 'x²');
    addTerm(parts, counts.xy, 'xy');
    addTerm(parts, counts.y2, 'y²');
    addTerm(parts, counts.x,  'x');
    addTerm(parts, counts.y,  'y');
    addTerm(parts, counts.u,  '');

    let expr = parts.join(' ')
        .replace(/^\+\s*/, '')
        .replace(/\+\s*−/g, '−');

    exprDisplay.textContent = expr || '—';
}

function addTerm(parts, count, label) {
    if (count === 0) return;
    const sign = count > 0 ? '+' : '−';
    const abs  = Math.abs(count);
    const coef = (abs === 1 && label !== '') ? '' : abs;
    parts.push(`${sign} ${coef}${label}`);
}

/* ----------------------------------------------------------
   TRAY — click to add
   ---------------------------------------------------------- */

document.querySelectorAll('.tray-tile').forEach(el => {
    el.addEventListener('click', () => createBoardTile(el.dataset.tile));
});

/* ----------------------------------------------------------
   CLEAR
   ---------------------------------------------------------- */

clearButton.addEventListener('click', () => {
    boardTiles.forEach(t => t.el.remove());
    boardTiles = [];
    updateExpression();
});

/* ----------------------------------------------------------
   INIT
   ---------------------------------------------------------- */

updateExpression();