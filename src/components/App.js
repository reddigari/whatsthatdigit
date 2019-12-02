import React, { Component } from "react";
import DrawingGrid from "./DrawingGrid.js";
import Predictions from "./Predictions.js";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from "react-bootstrap";
import { ENDPOINT } from "../constants.js";


class App extends Component {


    constructor() {
        super();
        const rows = 28;
        const cols = 28;
        const pixData = Array(rows).fill().map(() =>
            Array(cols).fill(0)
        );
        this.state = {
            rows: rows,
            cols: cols,
            pixData: pixData,
            estimates: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        this.handleDrawingChange = this.handleDrawingChange.bind(this);
        this.postData = this.postData.bind(this);
        this.updateEstimates = this.updateEstimates.bind(this);
    }

    handleDrawingChange(data) {
        this.setState({pixData: data}, this.updateEstimates);
    }

    async postData() {
        try {
            const resp = await fetch(ENDPOINT, {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({
                    pixData: this.state.pixData
                })
            });
            return resp.json();
        } catch (err) {
            console.log(err);
        }
    }

    updateEstimates() {
        const resp = this.postData();
        resp.then(data => {
            Object.keys(data).forEach(k => data[k] = parseFloat(data[k]));
            this.setState({estimates: data});
        }).catch(err => { console.log(err) });
    }

    render() {
        return (
            <Container className="App">
                <Row><Col><h1>What&apos;s That Digit</h1></Col></Row>
                <Row>
                    <Col md={6}>
                        <p>Draw a digit (0-9) in the grid below by pressing the mouse button
                            and moving the mouse. Draw slowly.</p>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <DrawingGrid rows={this.state.rows} cols={this.state.cols}
                            pixData={this.state.pixData}
                            onPixUpdate={this.handleDrawingChange} />
                    </Col>
                    <Col md={6}>
                        <Predictions estimates={this.state.estimates} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default App;
