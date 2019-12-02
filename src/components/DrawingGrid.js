import React, { Component, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { Button } from "react-bootstrap";
import { mean } from "d3-array";
import "../styles/DrawingGrid.css";

window.d3mean = mean;

class DrawingGrid extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.clear = this.clear.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
    }

    clear() {
        if (this.canvasRef.current) {
            this.canvasRef.current.clear();
        }
    }

    getAlphaValues(array) {
        const newSize = Math.floor(array.length / 4);
        var out = new Uint8Array(newSize);
        for (let i = 0; i < newSize; ++i) {
            out[i] = array[(4 * i) + 3];
        }
        return out;
    }

    posIn1DArray(rowSize, x, y) {
        return (y * rowSize) + x;
    }

    valueFromBigArray(array, ri, ci, cellSize, origSize) {
        const rowStart = ri * cellSize,
            rowEnd = rowStart + cellSize - 1,
            colStart = ci * cellSize;
        var values = [];
        for (let i = rowStart; i <= rowEnd; ++i) {
            let pos = this.posIn1DArray(origSize, colStart, i);
            values = [values, ...array.slice(pos, pos + cellSize)]; 
        }
        return mean(values) / 255;
    }

    getModelInput(alphas) {
        const origSize = Math.floor(Math.sqrt(alphas.length));
        const cellSize = origSize / 28;
        // initialize our 28x28 output to feed into model
        var out = Array(28).fill().map(() => Array(28).fill(0));
        // fill each entry of the 28x28 by finding the correspoinding
        // hi-res pixels and averaging
        out.forEach((row, ri) => {
            row.forEach((col, ci) => {
                out[ri][ci] = this.valueFromBigArray(alphas, ri, ci, cellSize, origSize);
            })
        });
        return out;
    }

    handleDraw() {
        const canvas = this.canvasRef.current; 
        const { width, height } = canvas.canvas.drawing;
        const ctx = canvas.ctx.drawing;
        const imageData = ctx.getImageData(0, 0, width, height);
        const alphas = this.getAlphaValues(imageData.data);
        const out = this.getModelInput(alphas);
        this.props.onPixUpdate(out);
    }

    render() {
        return (
            <div className="DrawingGrid" onMouseUp={this.handleDraw}
                onTouchEnd={this.handleDraw}>
                <CanvasDraw ref={this.canvasRef} lazyRadius={0}
                    canvasWidth={280} canvasHeight={280} />
                <Button size="sm" variant="secondary" 
                    onClick={this.clear}>Clear</Button>
            </div>
        )
    }
}

export default DrawingGrid;
