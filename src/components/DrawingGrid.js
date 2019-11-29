import React, { useState } from "react";
import "../styles/DrawingGrid.css";


function DrawingGrid(props) {

    const [drawing, setDrawing] = useState(false);

    const width = 500,
        height = 500,
        cellWidth = Math.floor(width / props.cols),
        cellHeight = Math.floor(height / props.rows);

    // create rows and cols of Cells
    // rows are <g> elements translated vertically
    const cells = props.pixData.map((row, ri) =>
        <g key={`row-${ri}`} transform={`translate(0, ${ri * cellHeight})`}>
            { row.map((col, ci) =>
                <Cell rowIdx={ri} colIdx={ci}
                    width={cellWidth} height={cellHeight}
                    key={`cell-${ri}-${ci}`}
                    drawing={drawing}
                    filled={row[ci] === 1}
                    onFill={ props.onPixUpdate }
                />
            )}
        </g>
    );

    return (
        <div className={`DrawingGrid ${drawing ? 'drawing': ''}`}>
            <svg width="500" height="500"
                onMouseDown={ () => setDrawing(true) }
                onMouseUp={ () => setDrawing(false) }
                onMouseLeave={ () => setDrawing(false) }>
                {cells}
            </svg>
        </div>
    )
}


function Cell(props) {

    const handleFill = () => {
        if (props.drawing) {
            props.onFill(props.rowIdx, props.colIdx);
        }
    }

    return (
        <rect className={`Cell ${props.filled ? 'filled' : null}`}
            x={props.width * props.colIdx}
            width={props.width} height={props.height}
            onMouseEnter={ handleFill }
            onMouseLeave={ handleFill }
            onMouseUp={ handleFill }
        />
    )
}

export default DrawingGrid;
