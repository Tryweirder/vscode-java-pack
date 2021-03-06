// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { encodeCommandUriWithTelemetry, showWelcomePage, supportedByNavigator } from "../utils";

const logoIcon = require("../../../../logo.png");
const doneIcon = require("../resources/done.svg");

export default class TourPage extends Component<{
}, {
    step: number
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            step: 0
        };

        this.steps = [
            this.getStartingPage(),
            ...this.getContentPages(),
            this.getEndingPage()
        ];

        this.timer = undefined;
    }

    private steps: JSX.Element[];
    // auto navigate to welcome page in last step
    private timer: number | undefined;

    render() {
        const { step } = this.state;

        if (this.timer !== undefined) {
            clearTimeout(this.timer);
        }

        if (step >= this.steps.length) {
            showWelcomePage(false);
            return <div>Loading...</div>;
        } else if (step === this.steps.length - 1) {
            this.timer = setTimeout(() => {
                showWelcomePage(false);
            }, 5000);
        }

        return (
            <Container fluid className="root">
                <Row className="mb-4 mt-5">
                    <Col className="text-center page-content">
                        {this.steps[step]}

                    </Col>
                </Row>
                <Row className="mb-4 footer">
                    <Col>
                        <div className="page-indicator text-center">
                            {this.steps.map((_elem, index) =>
                                <span key={index} className={index === step ? "active dot" : "dot"} onClick={() => this.showStep(index)}></span>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    showStep = (newStep: number) => {
        this.setState({
            step: newStep
        });
    }

    nextStep = () => {
        const newStep = this.state.step + 1;
        this.setState({
            step: newStep
        });
    }

    getContentPages = () => {
        /**
         * Provide 4 pages:
         * 1. open folder: for full features
         * 2. project view
         * 3. run/debug: point out the entry we want to promote
         * 4. testing
         */

        const openFolderCommand: string = encodeCommandUriWithTelemetry("open folder", supportedByNavigator("mac") ? "workbench.action.files.openFileFolder" : "workbench.action.files.openFolder");
        const showProjectExplorerCommand: string = encodeCommandUriWithTelemetry("show project explorer", "javaProjectExplorer.focus");
        const showRunAndDebugViewCommand: string = encodeCommandUriWithTelemetry("show run and debug view", "workbench.view.debug");
        const showTestExplorerViewCommand: string = encodeCommandUriWithTelemetry("show test explorer", "testExplorer.focus");

        // TODO: images are blank now
        const content = [{
            title: "Open Project Folder",
            description: <div><a href={openFolderCommand}>Open a folder</a> containing your Java project for full features.</div>,
            imageUri: require("../resources/open-project.png")
        },
        {
            title: "Project Explorer",
            description: <div>Expand <a href={showProjectExplorerCommand}>Java Project Explorer</a> to view your project structure.</div>,
            imageUri: require("../resources/project-manager.png")
        },
        {
            title: "Running and Debugging",
            description: <div>Use the <a href={showRunAndDebugViewCommand}>Run and Debug view</a> to start your project.</div>,
            imageUri: require("../resources/debugger.png")
        },
        {
            title: "Testing",
            description: <div>Use the <a href={showTestExplorerViewCommand}>Testing view</a> to run unit tests.</div>,
            imageUri: require("../resources/testing.png")
        }];

        return content.map((elem) => <div className="text-center">
            <h2>{elem.title}</h2>
            <div>{elem.description}</div>
            <img src={elem.imageUri} alt={elem.title} className="screenshot" />
            <Button onClick={this.nextStep}>Next Step</Button>
            <div><a href="#" onClick={() => showWelcomePage(false)}>skip</a></div>
        </div>, this);
    }

    getStartingPage = () => {
        return <div>
            <img src={logoIcon} alt="logo" className="logo"/>
            <h2>Welcome to use Java Tools</h2>
            <div>a lightweight and performant code editor that also supports many of the most common Java development techniques.</div>
            <div><Button onClick={this.nextStep}>Get Started</Button></div>
            <div><a href="#" onClick={() => showWelcomePage(false)}>skip</a></div>
        </div>;
    }

    getEndingPage = () => {
        return <div>
            <img src={doneIcon} alt="logo" className="logo"/>
            <h2>You’re good to go!</h2>
            <div>Next, start using Java!</div>
            <div><Button onClick={this.nextStep}>What's next?</Button></div>
        </div>;
    }
}

