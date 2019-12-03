import React, { Component } from "react";
import * as d3 from "d3";
import { Col } from "react-bootstrap";
import "../styles/Predictions.css";


function Config(width) {
    const height = width * 0.5;
    this.w = width;
    this.h = height;
    this.margin = {
        top: 15,
        bottom: 20,
        left: 0,
        right: 0
    }
    this.height = height - this.margin.top - this.margin.bottom;
    this.width = width - this.margin.left - this.margin.right;
    this.xScale = d3.scaleBand()
        .domain(d3.range(10))
        .range([0, this.width])
        .paddingInner(0.05);
    this.yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([this.height, 0]);
    this.xAxis = d3.axisBottom(this.xScale).tickSizeOuter(0);
    this.barColor = "grey";
}


class Predictions extends Component {

    constructor(props) {
        super(props);
        this.container = React.createRef();
        const width = this.getWidth();
        this.state = {config: new Config(width)};
        this.getWidth = this.getWidth.bind(this);
        this.redraw = this.redraw.bind(this);
        window.addEventListener("resize", this.redraw);
    }

    getWidth() {
        const cont = this.container.current
        return cont ? cont.offsetWidth * 0.9 : 400;
    }

    redraw() {
        const width = this.getWidth();
        const config = new Config(width);
        this.setState({config: config},
            this.plotBars)
    }

    componentDidMount() {
        this.redraw();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.estimates !== this.props.estimates) {
            this.plotBars();
        }
    }

    plotBars() {
        const cfg = this.state.config;
        const chart = d3.select(this.container.current).select(".chart");
        chart.select(".x-axis").call(cfg.xAxis);

        const estimates = this.props.estimates;
        const data = Object.keys(estimates).map(k => ({
            digit: k,
            value: this.props.estimates[k]
        }));

        const bars = chart.selectAll(".estimate")
            .data(data);
        bars.enter().append("rect")
            .attr("class", "estimate")
            .merge(bars)
            .transition(0.3)
            .attr("x", d => cfg.xScale(d.digit))
            .attr("y", d => cfg.yScale(d.value))
            .attr("width", cfg.xScale.bandwidth())
            .attr("height", d => cfg.height - cfg.yScale(d.value))
            .style("fill", cfg.barColor);

        const formatLabel = d => d > 0.005 ? d3.format("0.2p")(d) : "";

        const labels = chart.selectAll(".label")
            .data(data);
        labels.enter().append("text")
            .attr("class", "label")
            .merge(labels)
            .transition(0.3)
            .attr("x", d => cfg.xScale(d.digit) + (0.5 * cfg.xScale.bandwidth()))
            .attr("y", d => cfg.yScale(d.value) - 4)
            .attr("font-size", 10)
            .attr("text-anchor", "middle")
            .text(d => formatLabel(d.value));
    }

    render() {
        const cfg = this.state.config;
        const colStyle = {
            display: "flex",
            flexDirection: "column-reverse"
        }
        return (
            <Col sm={8} style={colStyle} ref={this.container}>
                <svg width={cfg.w} height={cfg.h}
                    ref={this.svg}>
                    <g className="chart"
                        transform={`translate(${cfg.margin.left}, ${cfg.margin.top})`}>
                        <g className="x-axis" transform={`translate(0, ${cfg.height})`}></g>
                    </g>
                </svg>
            </Col>
        )
    }
}

export default Predictions;
