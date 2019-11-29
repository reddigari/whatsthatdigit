import React, { Component } from "react";
import DrawingGrid from "./DrawingGrid.js";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from "react-bootstrap";

class App extends Component {

    constructor() {
        super();
        const rows = 28;
        const cols = 28;
        const pixData = Array(rows).fill().map(() => 
            Array(cols).fill(0)
        );
        this.state = {rows: rows, cols: cols, pixData: pixData};
        this.updatePixel = this.updatePixel.bind(this);
        this.clearPixels = this.clearPixels.bind(this);
    }

    updatePixel(ri, ci) {
        var data = this.state.pixData;
        data[ri][ci] = 1;
        this.setState({pixData: data});
    }

    clearPixels() {
        const emptyData = Array(this.state.rows).fill().map(() => 
            Array(this.state.cols).fill(0)
        );
        this.setState({pixData: emptyData});
    }

    render() {
        return (
            <Container className="App">
                <Row><Col><h1>What's That Digit</h1></Col></Row>
                <Row>
                    <Col md={6}>
                        <p>Draw a digit (0-9) in the grid below by pressing the mouse button
                            and moving the mouse. Draw slowly.</p>
                        <DrawingGrid rows={this.state.rows} cols={this.state.cols}
                            pixData={this.state.pixData} 
                            onPixUpdate={ this.updatePixel } />
                        <Button onClick={this.clearPixels}>Clear</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default App;
