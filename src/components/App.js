import React, { Component } from "react";
import DrawingGrid from "./DrawingGrid.js";
import Predictions from "./Predictions.js";
import { Container, Row, Col } from "react-bootstrap";
import { ENDPOINT } from "../constants.js";
import { max } from "d3";
import "../styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {


    constructor() {
        super();
        const rows = 28;
        const cols = 28;
        const pixData = Array(rows).fill().map(() =>
            Array(cols).fill(0)
        );
        this.state = {
            loading: true,
            rows: rows,
            cols: cols,
            pixData: pixData,
            estimates: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        this.handleDrawingChange = this.handleDrawingChange.bind(this);
        this.clearPredictions = this.clearPredictions.bind(this);
        this.postData = this.postData.bind(this);
        this.updateEstimates = this.updateEstimates.bind(this);
    }

    componentDidMount() {
        // Lambda backend needs several seconds to get going
        // if it hasn't been recently invoked, so send request
        // on mount
        const resp = this.postData();
        resp.then(() => this.setState({loading: false}));
    }

    handleDrawingChange(data) {
        // only update estimates if there are non-zero pixels drawn
        const maxVal = max(data, d => max(d));
        if (maxVal > 0) {
            this.setState({pixData: data}, this.updateEstimates);
        }
    }

    clearPredictions() {
        const zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.setState({estimates: zeros});
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
                <Row className="justify-content-center">
                    <Col md={12}>
                        <h1>Digit Recognizer</h1>
                    </Col>
                    <Col md={6}>
                        <p><b>Draw a digit (0-9) in the grid below by pressing the mouse button
                            and moving the mouse.</b> The first predictions might take several
                            seconds to appear, but should update quickly afterward.</p>
                    </Col>
                    <Col md={12} style={{display: this.state.loading ? "block" : "none", textAlign: "center"}}>
                        <b>Model is initializing. This may take 5-10 seconds. Please wait.</b>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md={7}>
                        <Row style={{visibility: this.state.loading ? "hidden" : "visible"}}>
                            <DrawingGrid rows={this.state.rows} cols={this.state.cols}
                                pixData={this.state.pixData}
                                onClear={this.clearPredictions}
                                onPixUpdate={this.handleDrawingChange} />
                            <Predictions estimates={this.state.estimates} />
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default App;
