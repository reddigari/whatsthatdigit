import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";
import { Col, Button } from "react-bootstrap";
import "../styles/DrawingGrid.css";


const MAX_WIDTH = 280;


class DrawingGrid extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.container = React.createRef();
        this.clear = this.clear.bind(this);
        this.handleDraw = this.handleDraw.bind(this);
        const width = this.getWidth();
        this.state = {canvasSize: width};
        this.getWidth = this.getWidth.bind(this);
        this.resize = this.resize.bind(this);
        window.addEventListener("resize", this.resize);
    }

    getWidth() {
        const cont = this.container.current;
        const width = cont ? cont.offsetWidth * 0.9 : 252;
        return width > MAX_WIDTH ? MAX_WIDTH : width;
    }

    resize() {
        const width = this.getWidth();
        this.setState({canvasSize: width});
    }

    componentDidMount() {
        this.resize();
    }

    clear() {
        if (this.canvasRef.current) {
            this.canvasRef.current.clear();
        }
        this.props.onClear();
    }

    imageDataToAlphas(array) {
        const newSize = Math.floor(array.length / 4);
        var out = new Uint8Array(newSize);
        for (let i = 0; i < newSize; ++i) {
            // get alpha value scaled to 0-1
            out[i] = array[(4 * i) + 3] / 255;
        }
        return out;
    }

    idxToModelCell(idx, rowSize, cellSize) {
        const origRow = Math.floor(idx / rowSize),
            origCol = idx % rowSize,
            row = Math.floor(origRow / cellSize),
            col = Math.floor(origCol / cellSize);
        return [row, col];
    }

    imageDataToModelData(imageData, modelDim = 28) {
        const alphas = this.imageDataToAlphas(imageData); // ignore RGB values
        const rowSize = Math.floor(Math.sqrt(alphas.length)); // dimension of image data
        const cellSize = rowSize / modelDim; // number of image pixels per model pixel
        var values = Array(modelDim).fill().map(() => Array(modelDim).fill(0));
        var counts = Array(modelDim).fill().map(() => Array(modelDim).fill(0));
        alphas.forEach((d, i) => {
            const [row, col] = this.idxToModelCell(i, rowSize, cellSize); // position in model
            values[row][col] += d
            counts[row][col] += 1
        });
        for (let i = 0; i < modelDim; ++i) {
            for (let j = 0; j < modelDim; ++j) {
                values[i][j] /= counts[i][j]
            }
        }
        return values;
    }

    handleDraw() {
        const canvas = this.canvasRef.current;
        const { width, height } = canvas.canvas.drawing;
        const ctx = canvas.ctx.drawing;
        const imageData = ctx.getImageData(0, 0, width, height);
        const modelData = this.imageDataToModelData(imageData.data);
        this.props.onPixUpdate(modelData);
    }

    render() {
        const brushRadius = Math.floor(this.state.canvasSize / 30)
        return (
            <Col sm={4} className="DrawingGrid" ref={this.container}>
                <Button size="sm" variant="secondary"
                    className="mb-2" onClick={this.clear}>
                    Clear
                </Button>
                <div onMouseUp={this.handleDraw}
                    onTouchEnd={this.handleDraw}>
                    <CanvasDraw ref={this.canvasRef} lazyRadius={0}
                        brushRadius={brushRadius}
                        canvasWidth={this.state.canvasSize}
                        canvasHeight={this.state.canvasSize} />
                </div>
            </Col>
        )
    }
}

export default DrawingGrid;
