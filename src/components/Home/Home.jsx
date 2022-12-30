import { useEffect, useState } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Sidebar from '../Sidebar/Sidebar';
import ViewEngine from '../ViewEngine/ViewEngine';
import Catalog from '../Catalog/Catalog';
import Launcher from '../Launcher/Launcher';
import { faDownload, faStar } from '@fortawesome/free-solid-svg-icons';

function Home(props) {
    const [page, setPage] = useState("home");
    const [token, setToken] = useState("");
    const [developerMode, setDeveloperMode] = useState(false);
    const [downloadedPartsList, setDownloadedPartsList] = useState(undefined);
    const [savedPartsList, setSavedPartsList] = useState(undefined);
    const [engineList, setEngineList] = useState(undefined);
    const [selectedID, setSelectedID] = useState(0);

    const changePage = (page) => {
        setPage(page);
        document.getElementById("home").scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        let tok = localStorage.getItem("token");
        let devmode = localStorage.getItem("devmode");
        let savedList = localStorage.getItem("savedParts");
        let downloadedList = localStorage.getItem("downloadedParts");
        
        if(tok === null)
            setTok("");
        else
            setToken(tok);

        if(devmode === null)
            setDevMode(false);
        else
            setDeveloperMode((devmode === 'true'));

        if(savedList === null)
            setSavedList("{\"list\":[]}");
        else
            setSavedPartsList(savedList);

        if(downloadedList === null)
            setDownloadedList("{\"list\":[]}");
        else
            setDownloadedPartsList(downloadedList);
    }, []);

    useEffect(() => {
        async function getEngines() {
            const response = await fetch("https://catalog.engine-sim.parts/api/parts/");
            let json = await response.json();
            setEngineList(json.data);
        }

        getEngines();
        //console.log(engineList);
    }, []);

    let engineMap = (<div></div>);
    
    let engines = (
        <div className="engines">
            {engineMap}
        </div>
    );

    const engineClicked = (e) => {
        let id = 0;
        if(e.target.nodeName !== "DIV") {
            id = e.target.id.substring(0, e.target.id.length - 2);
        }
        else {
            id = e.target.id;
        }
        //console.log(e.target);
        setSelectedID(id);
        changePage("viewEngine");
    }

    if(engineList !== undefined) {
        engineMap = engineList.map((item, key) => {
            let name = item.name;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";
            if (name.length > 27) {
                name = name.substring(0, 24) + "...";
            }

            let json = JSON.parse(savedPartsList);
            let starred = false;
            if(json.list.find(e => e.id === item.id)) {
                starred = true;
            }

            json = JSON.parse(downloadedPartsList);
            let downloaded = false;
            if(json.list.find(e => e.id === item.id)) {
                downloaded = true;
            }

            return (
                <div id={item.id} key={key} className="engine" onClick={engineClicked}>
                    <h4 id={h4id}>
                        {starred ? (<FontAwesomeIcon icon={faStar}/>) : (<div/>)}
                        {downloaded ? (<FontAwesomeIcon icon={faDownload}/>) : (<div/>)}
                        <pre id={h4preid}>{name}</pre>
                    </h4>
                    <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                </div>   
            )});
        
        engines = (
            <div className="engines">
                {engineMap}
            </div>
        );
    }

    let partsMap = (<div className="engine">
        <h4><pre>Looks like you don't have<br/>any starred parts!</pre></h4>
        <h5>By <pre>No one</pre></h5>
    </div>);

    let savedParts = (<div className="engines">
        {partsMap}
    </div>);

    if(savedPartsList !== undefined && savedPartsList !== "{\"list\":[]}") {
        //console.log(savedPartsList);
        let json = JSON.parse(savedPartsList).list;
        
        partsMap = json.map((item, key) => {
            let name = item.name;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";
            if (name.length > 27) {
                name = name.substring(0, 24) + "...";
            }

            let jsonn = JSON.parse(downloadedPartsList);
            let downloaded = false;
            if(jsonn.list.find(e => e.id === item.id)) {
                downloaded = true;
            }

            return (
                <div id={item.id} key={key} className="engine" onClick={engineClicked}>
                    <h4 id={h4id}>
                        <FontAwesomeIcon icon={faStar}/>
                        {downloaded ? (<FontAwesomeIcon icon={faDownload}/>) : (<div/>)}
                        <pre id={h4preid}>{name}</pre>
                        </h4>
                    <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                </div>
            );
        });

        savedParts = (
            <div className="engines">
                {partsMap}
            </div>
        );
    }

    let downloadedPartsMap = (<div className="engine">
        <h4><pre>Looks like you don't have<br/>any downloaded parts!</pre></h4>
        <h5>By <pre>No one</pre></h5>
    </div>);

    let downloadedParts = (<div className="engines">
        {downloadedPartsMap}
    </div>);

    if(downloadedPartsList !== undefined && downloadedPartsList !== "{\"list\":[]}") {
        //console.log(savedPartsList);
        let json = JSON.parse(downloadedPartsList).list;
        
        downloadedPartsMap = json.map((item, key) => {
            let name = item.name;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";
            if (name.length > 27) {
                name = name.substring(0, 24) + "...";
            }

            let jsonn = JSON.parse(savedPartsList);
            let starred = false;
            if(jsonn.list.find(e => e.id === item.id)) {
                starred = true;
            }

            return (
                <div id={item.id} key={key} className="engine" onClick={engineClicked}>
                    <h4 id={h4id}>
                        {starred ? (<FontAwesomeIcon icon={faStar}/>) : (<div/>)}
                        <FontAwesomeIcon icon={faDownload}/>
                        <pre id={h4preid}>{name}</pre>
                        </h4>
                    <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                </div>
            );
        });

        downloadedParts = (
            <div className="engines">
                {downloadedPartsMap}
            </div>
        );
    }

    let content = (
        <div className="homeContent">
            <h1>Welcome back!</h1>
            {engines}
            <h1>Your saved parts</h1>
            {savedParts}
            <h1>Your downloaded parts</h1>
            {downloadedParts}
        </div>
    );

    const setTok = (value) => {
        setToken(value);
        localStorage.setItem("token", value);
    }

    const setDevMode = (value) => {
        setDeveloperMode(value);
        localStorage.setItem("devmode", value);
    }

    const setSavedList = (value) => {
        setSavedPartsList(value);
        localStorage.setItem("savedParts", value);
    }

    const setDownloadedList = (value) => {
        setDownloadedPartsList(value);
        localStorage.setItem("downloadedParts", value);
    }

    const inputData = (e) => {
        //console.log(e.target.id + " : " + e.target.value);
        switch (e.target.id) {
            case "apiToken":
                setTok(e.target.value);
                break;

            case "devmode":
                setDevMode(e.target.checked);
                break;
        
            default:
                break;
        }
    }

    let text = (
        <pre className="versionHome">Engine Simulator Manager v{props.currentVersion} - latest</pre>
    );

    if(props.outdated) {
        text = (
            <pre className="versionHome">Engine Simulator Manager v{props.currentVersion} - outdated - v{props.latestVersion}</pre>
        );
    }

    switch (page) {
        case "viewEngine":
            content = (
                <div className="homeContent">
                    <ViewEngine engineID={selectedID} developerMode={developerMode} setDownloadedList={setDownloadedList} downloadedPartsList={downloadedPartsList} setSavedList={setSavedList} savedPartsList={savedPartsList}/>
                </div>
            );
            break;

        case "parts":
            content = (
                <div className="homeContent">
                    <Catalog engineClicked={engineClicked} token={token} developerMode={developerMode} setDownloadedList={setDownloadedList} downloadedPartsList={downloadedPartsList} setSavedList={setSavedList} savedPartsList={savedPartsList}/>
                </div>
            );
            break;

        case "settings":
            content = (
                <div className="homeContent">
                    <h1>Settings</h1>
                    <div>
                        <h3>Developer Mode (Enables ID showing and such)</h3>
                        <input type="checkbox" onChange={inputData} id="devmode" title="Developer Mode" defaultChecked={developerMode}></input>
                        {/* <select onChange={inputData} id="launch" title="Launch Behaviour" defaultValue={launchBehaviour}> */}
                            {/* <option value=""></option> */}
                        {/* </select> */}
                        <h3>Engine Simulator Catalog <a target="_blank" href="https://catalog.engine-sim.parts/user/api-tokens">API Token</a></h3>
                        <input onChange={inputData} id="apiToken" title="API Token" defaultValue={token}></input>
                    </div>
                    {text}
                </div>
            );
            break;

        case "launch":
            content = (
                <div className="homeContent">
                    <Launcher launchInstant={false} downloadedParts={downloadedParts} developerMode={developerMode} setDownloadedList={setDownloadedList} downloadedPartsList={downloadedPartsList} setSavedList={setSavedList} savedPartsList={savedPartsList}/>
                </div>
            );
            break;

        case "launchInstant":
            content = (
                <div className="homeContent">
                    <Launcher launchInstant={true} downloadedParts={downloadedParts} developerMode={developerMode} setDownloadedList={setDownloadedList} downloadedPartsList={downloadedPartsList} setSavedList={setSavedList} savedPartsList={savedPartsList}/>
                </div>
            );
            break;

        // case "account":
        //     content = (
        //         <div className="homeContent">
        //             <h1>Account Settings</h1>
        //             <div>
                        
        //             </div>
        //         </div>
        //     );
        //     break;
    
        default:
            break;
    }

    return (
        <div className="home" id="home">
            <Sidebar setPage={changePage}/>
            {content}
        </div>
    );
}

export default Home;