import { useEffect, useState } from 'react';
import './App.css';

import Tutorial from './components/Tutorial/Tutorial';
import Home from './components/Home/Home';
import PopupManager from './components/PopupManager/PopupManager';

function App() {
    const [tutorialDone, setTutorialDone] = useState(false);
    const [latestVersion, setLatestVersion] = useState(0.1);
    const [outdated, setOutdated] = useState(false);
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
        
        setTutorialDone(done['done']);

        // get version
        if(currentVersion < latestVersion) {
            document.title = "Engine Simulator Manager beta v" + currentVersion + " - OUTDATED";
            setOutdated(true);
        }
        else {
            document.title = "Engine Simulator Manager beta v" + currentVersion;
        }
    }, []);

    if(tutorialDone) {
        return (
            <div className="app">
                <Home/>
                <PopupManager outdated={outdated}/>
            </div>
        );
    }
    else {
        return (
            <div className="app">
                <Tutorial setTutorialDone={setTutorial}/>
                <PopupManager outdated={outdated}/>
            </div>
        );
    }
}

export default App;
