import { useEffect, useState } from 'react';
import './App.css';

import Tutorial from './components/Tutorial/Tutorial';
import Home from './components/Home/Home';
import PopupManager from './components/PopupManager/PopupManager';

import "./themes/themes.css";
import "./themes/ManagerDark.css";

function App() {
    const [tutorialDone, setTutorialDone] = useState(false);
    const [latestVersion, setLatestVersion] = useState(0);
    const [outdated, setOutdated] = useState(false);
    const [sizeError, setSizeError] = useState(false);
    const [sizeX, setSizeX] = useState(0);
    const [sizeY, setSizeY] = useState(0);
    const currentVersion = 0.1;

    const setTutorial = () => {
        localStorage.setItem("tutorialDone", `{ "done": true }`);
        setTutorialDone(true);
    }

    useEffect(() => {
        let done = JSON.parse(localStorage.getItem("tutorialDone"));
        if(done === null) {
            localStorage.setItem("tutorialDone", `{ "done": false }`);
            done = JSON.parse(localStorage.getItem("tutorialDone"));
        }

        fetch("https://raw.githubusercontent.com/DDev247/engine-sim-manager/master/version").then((data) => {
            data.text().then((text) => {
                if(data.ok) {
                    setLatestVersion(Number.parseFloat(text));
                }
            });
        });
        
        setTutorialDone(done['done']);

        // get version
        if(currentVersion < latestVersion) {
            document.title = "Engine Simulator Manager v" + currentVersion + " - OUTDATED";
            setOutdated(true);
        }
        else {
            document.title = "Engine Simulator Manager v" + currentVersion;
        }

        setSizeX(window.innerWidth);
        setSizeY(window.innerHeight);
        if(window.innerWidth < 800) {
            setSizeError(true);
        }
        if(window.innerHeight < 600) {
            setSizeError(true);
        }
    }, []);

    let sizeErrorDiv = (<div/>);

    window.onresize = () => {
        setSizeX(window.innerWidth);
        setSizeY(window.innerHeight);
        let error = false;
        if(window.innerWidth < 800) {
            setSizeError(true);
            error = true;
        }
        if(window.innerHeight < 600) {
            setSizeError(true);
            error = true;
        }

        // console.log(error);
        if(error) {
            sizeErrorDiv = (<div className="errors">
                <h3>Warning:</h3>
                <p>Window size is smaller than 800x600 (currently: {sizeX}x{sizeY})</p>
            </div>);
        }
        else {
            sizeErrorDiv = (<div></div>);
        }
    }

    if(tutorialDone) {
        return (
            <div className="app">
                {sizeErrorDiv}
                <Home latestVersion={latestVersion} currentVersion={currentVersion} outdated={outdated}/>
                <PopupManager outdated={outdated}/>
            </div>
        );
    }
    else {
        return (
            <div className="app">
                <Tutorial currentVersion={currentVersion} latestVersion={latestVersion} outdated={outdated} setTutorialDone={setTutorial}/>
                <PopupManager outdated={outdated}/>
            </div>
        );
    }
}

export default App;
