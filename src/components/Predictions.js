import React from "react";
import "../styles/Predictions.css";


function Predictions(props) {
    const nums = Object.keys(props.estimates)
    const items = nums.map(n =>
        <tr key={`prediction-${n}`} className="prediction-row">
            <td className="prediction-num">{n}</td>
            <td className="prediction-value"
                style={{opacity: Math.max(props.estimates[n], 0.2)}}>
                {props.estimates[n].toFixed(4)}
            </td>
        </tr>
    );
    return (
        <table className="Predictions">
            <tbody>
                {items}
            </tbody>
        </table>
    )
}

export default Predictions;
