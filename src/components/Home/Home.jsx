import { useEffect, useState } from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Sidebar from '../Sidebar/Sidebar';
import ViewEngine from '../ViewEngine/ViewEngine';
import Catalog from '../Catalog/Catalog';
import Launcher from '../Launcher/Launcher';
import { faDotCircle, faDownload, faSave, faStar } from '@fortawesome/free-solid-svg-icons';

function Home(props) {
    const [page, setPage] = useState("home");
    const [token, setToken] = useState("");
    const [developerMode, setDeveloperMode] = useState(false);
    const [downloadedPartsList, setDownloadedPartsList] = useState(undefined);
    const [savedPartsList, setSavedPartsList] = useState(undefined);
    const [engineList, setEngineList] = useState(undefined);
    const [selectedID, setSelectedID] = useState(0);
    const [themeCode, setThemeCode] = useState("");
    const [username, setUserName] = useState("");
    const [displayUsername, setDisplayUsername] = useState("");
    const [serverStatus, setServerStatus] = useState("");
    const [serverUptime, setServerUptime] = useState("");

    // Changes the page and scrolls to the top.
    const changePage = (page) => {
        setPage(page);

        // Scroll to the top (smoothly)
        document.getElementById("home").scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    // Loads settings from localStorage.
    useEffect(() => {
        // Get the items from localStorage
        let tok = localStorage.getItem("token");
        let devmode = localStorage.getItem("devmode");
        let savedList = localStorage.getItem("savedParts");
        let downloadedList = localStorage.getItem("downloadedParts");
        let theme = localStorage.getItem("themeCode");
        let usern = localStorage.getItem("username");
        
        // Compare them, if "null" set them to their default.
        // If not set them to the value from localStorage.
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

        if(theme === null)
            setTheme(null);
        else
            setTheme(theme);

        if(usern === null)
            setUsername("");
        else
            setUserName(usern);

        if(usern !== null && usern.trim() !== "")
            setDisplayUsername(" " + usern);
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:24704/status").then((data) => {
            data.text().then((text) => {
                setServerStatus(text);
            });
        });
        fetch("http://127.0.0.1:24704/uptime").then((data) => {
            data.text().then((text) => {
                setServerUptime(text);
            });
        });
    });

    // Loads the latest parts from the Parts Catalog.
    // WARNING: Currently broken.
    useEffect(() => {
        async function getEngines() {
            // Get the JSON from the Parts Catalog
            const response = await fetch("https://catalog.engine-sim.parts/api/parts/");
            let json = await response.json();
            
            setEngineList(json.data);
        }

        // Call the async function
        getEngines();
    }, []);

    // Element that contains the map of the latest parts.
    let engineMap = (<div className="engine">
    <h4><pre>Looks like you don't have<br/>an internet connection.<br/>Please check your connection<br/>and try again.</pre></h4>
    <h5>By <pre>No one</pre></h5>
</div>);
    
    // Element that contains the latest parts map.
    let engines = (
        <div className="engines">
            {engineMap}
        </div>
    );

    // Executed when a user clicks a part.
    const engineClicked = (e) => {
        let id = 0;

        // Check if the target element is typeof "DIV"
        if(e.target.nodeName !== "DIV") {
            id = e.target.id.substring(0, e.target.id.length - 2);
        }
        else {
            id = e.target.id;
        }

        // Set the part ID and change page to "viewEngine"
        setSelectedID(id);
        changePage("viewEngine");
    }

    // Executes when the engineList finished loading and is not empty.
    if(engineList !== undefined) {
        // Map the engineList to the engineMap element.
        engineMap = engineList.map((item, key) => {
            let name = item.name;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";

            // Trim the name to max 27 characters
            if (name.length > 27) {
                name = name.substring(0, 24) + "...";
            }

            // Check if part is starred
            let json = JSON.parse(savedPartsList);
            let starred = false;
            if(json.list.find(e => e.id === item.id)) {
                starred = true;
            }

            // Check if part is downloaded
            json = JSON.parse(downloadedPartsList);
            let downloaded = false;
            if(json.list.find(e => e.id === item.id)) {
                downloaded = true;
            }

            // Return the mapped part
            return (
                <div id={item.id} key={key} className="engine" onClick={engineClicked}>
                    <h4 id={h4id}>
                        {starred ? (<FontAwesomeIcon className="starred" icon={faStar}/>) : (<div/>)}
                        {downloaded ? (<FontAwesomeIcon className="downloaded" icon={faDownload}/>) : (<div/>)}
                        <pre id={h4preid}>{name}</pre>
                    </h4>
                    <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                </div>   
            )
        });
        
        // Set this element to the fresh engineMap
        engines = (
            <div className="engines">
                {engineMap}
            </div>
        );
    }

    // Element that contains the map of savedPartsList.
    let partsMap = (<div className="engine">
        <h4><pre>Looks like you don't have<br/>any starred parts!</pre></h4>
        <h5>By <pre>No one</pre></h5>
    </div>);

    // Element that contains the savedPartsList map.
    let savedParts = (<div className="engines">
        {partsMap}
    </div>);

    // Executes when the savedPartsList finished loading and is not empty.
    if(savedPartsList !== undefined && savedPartsList !== "{\"list\":[]}") {
        let list = JSON.parse(savedPartsList).list;
        
        // Map the savedPartsList list element to the partsMap element.
        partsMap = list.map((item, key) => {
            let name = item.name;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";

            // Trim the name to max 27 characters
            if (name.length > 27) {
                name = name.substring(0, 24) + "...";
            }

            // Don't need to check if part is starred because
            // we're mapping the starred parts list (aka. savedPartsList)

            // Check if part is downloaded
            let jsonn = JSON.parse(downloadedPartsList);
            let downloaded = false;
            if(jsonn.list.find(e => e.id === item.id)) {
                downloaded = true;
            }

            // Return the mapped part
            return (
                <div id={item.id} key={key} className="engine" onClick={engineClicked}>
                    <h4 id={h4id}>
                        <FontAwesomeIcon className="starred" icon={faStar}/>
                        {downloaded ? (<FontAwesomeIcon className="downloaded" icon={faDownload}/>) : (<div/>)}
                        <pre id={h4preid}>{name}</pre>
                        </h4>
                    <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                </div>
            );
        });

        // Set this element to the fresh partsMap
        savedParts = (
            <div className="engines">
                {partsMap}
            </div>
        );
    }

    // Element that contains the map of downloadedPartsList.
    let downloadedPartsMap = (<div className="engine">
        <h4><pre>Looks like you don't have<br/>any downloaded parts!</pre></h4>
        <h5>By <pre>No one</pre></h5>
    </div>);

    // Element that contains the downloadedPartsList map.
    let downloadedParts = (<div className="engines">
        {downloadedPartsMap}
    </div>);

    // Executes when the downloadedPartsList finished loading and is not empty.
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
                        {starred ? (<FontAwesomeIcon className="starred" icon={faStar}/>) : (<div/>)}
                        <FontAwesomeIcon className="downloaded" icon={faDownload}/>
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

    // Page content
    let content = (
        <div className="homeContent">
            <h1>Welcome back{displayUsername}!</h1>
            {engines}
            <h1>Your saved parts</h1>
            {savedParts}
            <h1>Your downloaded parts</h1>
            {downloadedParts}
        </div>
    );

    // Sets the Catalog Token and saves it to localStorage
    const setTok = (value) => {
        setToken(value);
        localStorage.setItem("token", value);
    }

    // Sets the developerMode and saves it to localStorage
    const setDevMode = (value) => {
        setDeveloperMode(value);
        localStorage.setItem("devmode", value);
    }

    // Sets the savedPartsList and saves it to localStorage
    const setSavedList = (value) => {
        setSavedPartsList(value);
        localStorage.setItem("savedParts", value);
    }

    // Sets the downloadedPartsList and saves it to localStorage
    const setDownloadedList = (value) => {
        setDownloadedPartsList(value);
        localStorage.setItem("downloadedParts", value);
    }

    const setUsername = (value) => {
        setUserName(value);
        if(value !== null && value.trim() !== "")
            setDisplayUsername(" " + value);
            
        localStorage.setItem("username", value);
    }

    const setTheme = (value) => {
        setThemeCode(value);
        localStorage.setItem("themeCode", value);

        let customTheme = document.createElement('style');
        customTheme.innerHTML = value; // change to inputted path
        customTheme.id = "theme";
    
        console.log(document.getElementById("theme"));
        // Removes the previous theme
        if(document.getElementById("theme") !== null)
            document.getElementById("theme").remove();
    
        document.head.appendChild(customTheme);

        if(document.getElementById("themeCode") !== null) {
            document.getElementById("themeCode").innerHTML = value;
        }
    }

    // Executed when a user enters something in settings.
    const inputData = (e) => {
        //console.log(e.target.id + " : " + e.target.value);
        switch (e.target.id) {
            case "apiToken":
                setTok(e.target.value);
                break;

            case "devmode":
                setDevMode(e.target.checked);
                break;

            case "themeInput":
                console.log(e.target.files[0]);
                
                fetch("http://127.0.0.1:24704/getFile?name=" + e.target.files[0].path).then((data) => {
                    data.text().then((text) => {
                        setTheme(text);
                    });
                });
                break;

            case "themeCode":
                // document.getElementById("theme").innerHTML = e.target.innerHTML;
                setTheme(e.target.innerHTML);
                break;

            case "username":
                setUsername(e.target.value);
                break;
        
            default:
                break;
        }
    }

    const saveTheme = (e) => {
        const value = document.getElementById("themeCode").innerHTML;

        let blobData = new Blob([value], {type: "text/plain"});
        let url = window.URL.createObjectURL(blobData);
        
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "theme.css";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        setTheme(value);
    }

    const loadTheme = (e) => {
        let customTheme = document.createElement('style');
        customTheme.innerHTML = themeCode; // change to inputted path
        customTheme.id = "theme";
    
        console.log(document.getElementById("theme"));
        // Removes the previous theme
        if(document.getElementById("theme") !== null)
            document.getElementById("theme").remove();
    
        document.head.appendChild(customTheme);
    
        document.getElementById("themeCode").innerHTML = themeCode;
    }

    let text = (
        <pre className="versionHome">Engine Simulator Manager v{props.currentVersion}<br/>latest</pre>
    );

    if(props.outdated) {
        text = (
            <pre className="versionHome">Engine Simulator Manager v{props.currentVersion}<br/>outdated - v{props.latestVersion}</pre>
        );
    }

    const expandThemeCode = (e) => {
        if(themeCode !== "") {
            const content = document.getElementById("themeCodeContent");

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            }
            else {
                content.style.maxHeight = content.scrollHeight + "px";
            } 

            const header = document.getElementById("themeCodeHeader");
            header.classList.toggle("active");
        }
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
                    <h1 className="settingsTitle">Settings</h1>
                    <div className="settings">
                        <div className="top">
                            <h3>Developer Mode</h3>
                            <p className="id">Enable Developer Mode</p>
                            <input type="checkbox" onChange={inputData} id="devmode" title="Developer Mode" defaultChecked={developerMode}></input>
                            {/* <select onChange={inputData} id="launch" title="Launch Behaviour" defaultValue={launchBehaviour}> */}
                                {/* <option value=""></option> */}
                            {/* </select> */}

                            <h3>Engine Simulator Catalog <a target="_blank" href="https://catalog.engine-sim.parts/user/api-tokens">API Token</a></h3>
                            <p className="id">Give Engine Simulator Manager access to your Engine Simulator Catalog account.</p>
                            <input onChange={inputData} id="apiToken" title="API Token" defaultValue={token}></input>

                            <h3>Username</h3>
                            <p className="id">Tell Engine Simulator Manager how to greet you.</p>
                            <input onChange={inputData} id="username" title="ESM Username" defaultValue={username}></input>

                            <h3>Custom theme file</h3>
                            <input className="themeInput" type="file" onChange={inputData} id="themeInput" title="Theme Path"></input>

                            <div className="themeCode">
                                <div className="top" id="themeCodeHeader" onClick={expandThemeCode}>
                                    <h2><pre>Theme</pre></h2>
                                    <div>
                                        <button onClick={loadTheme}><FontAwesomeIcon icon={faDownload}/> Load</button>
                                        <button onClick={saveTheme}><FontAwesomeIcon icon={faSave}/> Save</button>
                                    </div>
                                </div>
                                <div id="themeCodeContent" className="content">
                                    <pre onInput={inputData} id="themeCode" contentEditable autoCorrect="false" autoCapitalize="false" autoSave="false">

                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="credits">
                            <pre className="id">
                                Credits:<br/>
                                    - DDev - Main Developer<br/>
                                    - Beacrox - Theme designer<br/>
                                <br/>
                                Other credits:<br/>
                                    - AngeTheGreat - The Engine Simulator<br/>
                                    - Developers at Catppuccin - The Catppuccin Mocha theme<br/>
                                <br/>
                                Debug Info:<br/>
                                    - Version: {props.currentVersion}<br/>
                                    - Latest Version: {props.latestVersion}<br/>
                                Server Info:<br/>
                                    - {serverUptime}<br/>
                                    - Status: {serverStatus}<br/>
                            </pre>
                        </div>

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