
/* =========================================================
   ALGEBRA TILES LAB
========================================================= */

const UNIT =
    parseInt(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--unit')
    );

/* =========================================================
   TILE DEFINITIONS
========================================================= */

const TILE_DEFS = {

    'pos-unit': {
        label:'1',
        cls:'pos-unit t-unit',
        w:1,
        h:1,
        val:{u:1}
    },

    'pos-x': {
        label:'x',
        cls:'pos-x t-x',
        w:3,
        h:1,
        val:{x:1}
    },

    'pos-y': {
        label:'y',
        cls:'pos-y t-y',
        w:1,
        h:4,
        val:{y:1}
    },

    'pos-x2': {
        label:'x²',
        cls:'pos-x2 t-x2',
        w:3,
        h:3,
        val:{x2:1}
    },

    'pos-xy': {
        label:'xy',
        cls:'pos-xy t-xy',
        w:3,
        h:4,
        val:{xy:1}
    },

    'pos-y2': {
        label:'y²',
        cls:'pos-y2 t-y2',
        w:4,
        h:4,
        val:{y2:1}
    },

    'neg-unit': {
        label:'−1',
        cls:'neg-unit t-unit',
        w:1,
        h:1,
        val:{u:-1}
    },

    'neg-x': {
        label:'−x',
        cls:'neg-x t-x',
        w:3,
        h:1,
        val:{x:-1}
    },

    'neg-y': {
        label:'−y',
        cls:'neg-y t-y',
        w:1,
        h:4,
        val:{y:-1}
    },

    'neg-x2': {
        label:'−x²',
        cls:'neg-x2 t-x2',
        w:3,
        h:3,
        val:{x2:-1}
    },

    'neg-xy': {
        label:'−xy',
        cls:'neg-xy t-xy',
        w:3,
        h:4,
        val:{xy:-1}
    },

    'neg-y2': {
        label:'−y²',
        cls:'neg-y2 t-y2',
        w:4,
        h:4,
        val:{y2:-1}
    }

};

/* =========================================================
   DOM
========================================================= */

const workspace =
    document.getElementById('workspace');

const exprValue =
    document.getElementById('expr-value');

const clearBtn =
    document.getElementById('clear-btn');

const trayTiles =
    document.querySelectorAll('.tray-tile');

/* =========================================================
   STATE
========================================================= */

let boardTiles = [];

let tileCounter = 0;

/* =========================================================
   HELPERS
========================================================= */

function snap(value){

    return Math.round(value / UNIT) * UNIT;

}

function clamp(value,min,max){

    return Math.max(min, Math.min(value,max));

}

/* =========================================================
   CREATE TILE
========================================================= */

function createTile(defId){

    const def = TILE_DEFS[defId];

    if(!def) return;

    const el =
        document.createElement('div');

    el.className =
        `tile-base board-tile ${def.cls}`;

    el.textContent =
        def.label;

    const startX = UNIT;
    const startY = UNIT;

    el.style.left = startX + 'px';
    el.style.top  = startY + 'px';

    workspace.appendChild(el);

    const tile = {

        id: ++tileCounter,

        el,

        def,

        x:startX,

        y:startY

    };

    boardTiles.push(tile);

    enableDrag(tile);

    updateExpression();

}

/* =========================================================
   DRAGGING
========================================================= */

function enableDrag(tile){

    const el = tile.el;

    el.addEventListener(
        'dblclick',
        () => removeTile(tile)
    );

    /* =====================================================
       MOUSE
    ===================================================== */

    el.addEventListener(
        'mousedown',
        startMouseDrag
    );

    /* =====================================================
       TOUCH
    ===================================================== */

    el.addEventListener(
        'touchstart',
        startTouchDrag,
        { passive:false }
    );

    /* =====================================================
       MOUSE DRAG
    ===================================================== */

    function startMouseDrag(event){

        if(event.button !== 0) return;

        beginDrag(
            event.clientX,
            event.clientY,
            false
        );

    }

    /* =====================================================
       TOUCH DRAG
    ===================================================== */

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

    /* =====================================================
       CORE DRAG
    ===================================================== */

    function beginDrag(startX,startY,isTouch){

        const rect =
            workspace.getBoundingClientRect();

        const offsetX =
            startX -
            rect.left -
            tile.x;

        const offsetY =
            startY -
            rect.top -
            tile.y;

        function drag(clientX,clientY){

            const r =
                workspace.getBoundingClientRect();

            let x =
                snap(
                    clientX -
                    r.left -
                    offsetX
                );

            let y =
                snap(
                    clientY -
                    r.top -
                    offsetY
                );

            x = clamp(
                x,
                0,
                workspace.clientWidth -
                el.offsetWidth
            );

            y = clamp(
                y,
                0,
                workspace.clientHeight -
                el.offsetHeight
            );

            tile.x = x;
            tile.y = y;

            el.style.left = x + 'px';
            el.style.top  = y + 'px';

        }

        function mouseMove(e){

            drag(
                e.clientX,
                e.clientY
            );

        }

        function touchMove(e){

            e.preventDefault();

            const touch =
                e.touches[0];

            drag(
                touch.clientX,
                touch.clientY
            );

        }

        function stop(){

            document.removeEventListener(
                'mousemove',
                mouseMove
            );

            document.removeEventListener(
                'mouseup',
                stop
            );

            document.removeEventListener(
                'touchmove',
                touchMove
            );

            document.removeEventListener(
                'touchend',
                stop
            );

        }

        if(isTouch){

            document.addEventListener(
                'touchmove',
                touchMove,
                { passive:false }
            );

            document.addEventListener(
                'touchend',
                stop
            );

        } else {

            document.addEventListener(
                'mousemove',
                mouseMove
            );

            document.addEventListener(
                'mouseup',
                stop
            );

        }

    }

}


/* =========================================================
   REMOVE TILE
========================================================= */

function removeTile(tile){

    tile.el.remove();

    boardTiles =
        boardTiles.filter(
            t => t !== tile
        );

    updateExpression();

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

        const [key,val] =
            Object.entries(tile.def.val)[0];

        counts[key] += val;

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
        expression.replace(/\+\s*−/g, '− ');

    exprValue.textContent =
        expression || '—';

}

function addTerm(parts,count,label){

    if(count === 0) return;

    const sign =
        count > 0 ? '+' : '−';

    const abs =
        Math.abs(count);

    const coef =
        (abs === 1 && label !== '')
            ? ''
            : abs;

    parts.push(
        `${sign} ${coef}${label}`
    );

}

/* =========================================================
   TRAY
========================================================= */

trayTiles.forEach(tile => {

    tile.addEventListener(
        'click',
        () => createTile(tile.dataset.tile)
    );

});

/* =========================================================
   CLEAR
========================================================= */

clearBtn.addEventListener(
    'click',
    () => {

        boardTiles.forEach(tile => {
            tile.el.remove();
        });

        boardTiles = [];

        updateExpression();

    }
);

/* =========================================================
   INIT
========================================================= */

updateExpression();
