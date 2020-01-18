import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

function About(props) {
    const [show, setShow] = useState(props.show);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    }

    return (
        <>
            <div style={{textAlign: "center"}}><span className="btn btn-link" onClick={handleShow}>About</span></div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><b>About <code>whatsthatnumber.xyz</code></b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The application architecture is built on AWS. The model is evaluated by a Lambda function
                       triggered by calls to an API Gateway instance. The UI is built with React and served
                       over CloudFront/S3. Check out the <a href="https://s3.amazonaws.com/whatsthatnumber.xyz/architecture.png">
                       architecture diagram</a> or the <a href="https://github.com/reddigari/whatsthatnumber">React
                       app source code</a>.</p> 
                    <p>The underlying model is a convolutional neural network
                       trained on the MNIST database. The model architecture is adapted
                       from <a href="https://keras.io/examples/mnist_cnn/">this example</a> in
                       the Keras documentation.</p>
                    <p>It struggles with <b>7</b>s and <b>9</b>s.</p>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default About;
