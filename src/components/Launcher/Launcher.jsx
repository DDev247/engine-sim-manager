import { useEffect, useState } from 'react';
import './Launcher.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faQuestion, faRedo, faRocket } from '@fortawesome/free-solid-svg-icons';
import es_logo from "../../es_logo.png";

function Launcher(props) {
    const [simVersion, setSimVersion] = useState("v0.1.11a");
    const [main_mr, setMain_mr] = useState();
    const [userEngines, setUserEngines] = useState(undefined);

    const fetchUserEngines = () => {
        let myEngineList = {};

        fetch("http://127.0.0.1:24704/getFolder?name=es/latest/assets/engines").then((response) => {
            if(response.status === 200) {
                response.text().then((text) => {
                    let json = JSON.parse(text);
                    json.forEach(element => {
                        let myMan = [];
                        fetch("http://127.0.0.1:24704/getFolder?name=es/latest/assets/engines/" + element).then((response) => {
                            if(response.status === 200) {
                                response.text().then((text2) => {
                                    let json2 = JSON.parse(text2);
                                    json2.forEach(element2 => {
                                        if(element2.endsWith(".mr")) {
                                            // console.log("Found engine: '" + element2 + "' in 'es/latest/assets/engines" + element + "'.");
                                            myMan.push(element2);
                                        }
                                    });
                                });
                            }
                        });
                        myEngineList[element] = myMan;
                    });
                });
            }
        });

        //console.log("User engines:");
        //console.log(myEngineList);
        setUserEngines(myEngineList);
    }

    useEffect(() => {
        fetchUserEngines();
    }, []);

    useEffect(() => {
        fetch("http://127.0.0.1:24704/getFile?name=es/version.txt").then((response) => {
            if(response.status === 200) {
                response.text().then((data) => {
                    console.log("ES version: " + data);
                    setSimVersion(data);
                    if(data !== "unknown") {
                        // we have a version installed
                        fetch("http://127.0.0.1:24704/getFile?name=es/latest/assets/main.mr").then((response) => {
                            response.text().then((data) => {
                                console.log("ES main.mr: " + data);
                                setMain_mr(data);
                            });
                        });
                    }
                });
            }
            else {
                //response.text().then((data) => {
                //    console.error("Server Error: " + data);
                //});
                fetch("http://127.0.0.1:24704/saveFile?name=es/version.txt&data=" + btoa("unknown")).then((response) => {
                    response.text().then((data) => {
                        console.log("Done saving unknown version: " + data);
                        setSimVersion("unknown");
                    });
                });
            }
        });
    });

    const expandMainmr = (e) => {
        if(simVersion !== "unknown") {
            const content = document.getElementById("mainmrContent");

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            }
            else {
                content.style.maxHeight = content.scrollHeight + "px";
            } 

            const header = document.getElementById("mainmrHeader");
            header.classList.toggle("active");
        }
    }

    const installLatest = (e) => {
        // get latest version from github
        fetch("https://api.github.com/repos/ange-yaghi/engine-sim/releases").then((data) => {
            data.json().then((json) => {
                const dat = json[0];
                const link = dat.assets[0].browser_download_url;
                const ver = dat.tag_name;
                console.log(dat);
                
                fetch("http://127.0.0.1:24704/downloadES?link=" + link).then((data) => {
                    fetch("http://127.0.0.1:24704/unpackES?from=es/packed/latest.zip&to=es/latest").then((data) => {
                        fetch("http://127.0.0.1:24704/saveFile?name=es/version.txt&data=" + btoa(ver)).then((response) => {
                            response.text().then((data) => {
                                console.log("Done saving version: " + data);
                                setSimVersion(ver);
                            });
                        });
                    });
                });
            });
        });
    }

    const installOther = (e) => {
        var input = document.createElement('input');
        input.type = 'file';
        // input.setAttribute("webkitdirectory", "");
        // input.setAttribute("mozdirectory", "");
        // input.setAttribute("msdirectory", "");
        // input.setAttribute("odirectory", "");
        // input.setAttribute("directory", "");

        input.onchange = e => { 
            var file = e.target.files[0]; 
            const ver = file.name.split(".")[0].replace(" ", "_");
            const path = file.path;

            // console.log(file.path);
            
            fetch("http://127.0.0.1:24704/unpackES?from=" + path + "&to=es/latest").then((data) => {
                fetch("http://127.0.0.1:24704/saveFile?name=es/version.txt&data=" + btoa(ver)).then((response) => {
                    response.text().then((data) => {
                        console.log("Done saving version: " + data);
                        setSimVersion(ver);
                    });
                });
            });
            // console.log(file.webkitRelativePath);
        }

        input.click();
    }

    const launchES = (e) => {
        fetch("http://127.0.0.1:24704/launchES");
    }

    const redownloadAll = (e) => {
        JSON.parse(props.downloadedPartsList).list.map((part, key) => {
            console.log("Redownloading: " + part.id);
            const username = part.short_user.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const name = "es/newest/assets/engines/" + username + "/" + part.script_name;
            fetch("http://127.0.0.1:24704/savePart?name=" + name + "&id=" + part.id).then((response) => {
                response.text().then((data) => {
                    console.log("Recieved: " + data);
                });
            });
            return null;
        });
        fetchUserEngines();
    }

    if(props.launchInstant) {
        if(simVersion === "unknown") {
            // install ES
            installLatest(undefined);
            launchES(undefined);
        }
        else { 
            // launch ES
            launchES(undefined);
        }
    }

    let userPartsMap = [<div className="engine">
        <h4><pre>Looks like you don't have<br/>any parts!</pre></h4>
        <h5>By <pre>No one</pre></h5>
    </div>];

    let userParts = (<div className="engines">
        {userPartsMap}
    </div>);

    if(userEngines !== undefined) {
        userPartsMap = [];
        //console.log(userEngines);
        for(var keyy in userEngines) {
            let myParts = [];
            userEngines[keyy].map((item, key) => {
                let name = item;
    
                const h4id = item.id + "h4";
                const h4preid = item.id + "4p";
                const h5id = item.id + "h5";
                const h5preid = item.id + "5p";
                if (name.length > 27) {
                    name = name.substring(0, 24) + "...";
                }
    
                myParts.push(
                    <div div id={item.id} key={key} className="engine">
                        <h4 id={h4id}><pre id={h4preid}>{name}</pre></h4>
                        <h5 id={h5id}>By <pre id={h5preid}>{keyy}</pre></h5>
                        {/* <img id={imid} src={item.image_url} alt={item.name} width="200"/> */}
                    </div>
                )
            })
            userPartsMap.push(myParts);
        }
        console.log(userPartsMap);

        userParts = (
            <div className="engines">
                {userPartsMap}
            </div>
        );
    }

    return (
        <div className="launcher">
            <h1>Engine Simulator Launcher</h1>
            <pre className="id">Tip: Right-click the icon to launch the Engine Simulator instantly.</pre>
            <h2>Your Installation</h2>
            <div className="installation">
                <img width={100} alt="logo" src={es_logo}/>
                <div className="text">
                    <h3>Engine Simulator</h3>
                    <h4>Version: <pre> {simVersion}</pre></h4>
                </div>
                    {simVersion === "unknown" ? (
                        <div className="buttons">
                            <button onClick={installLatest}><FontAwesomeIcon icon={faDownload}/> Install Latest Version</button>
                            <button onClick={installOther}><FontAwesomeIcon icon={faQuestion}/> Install Different Version</button>
                        </div>
                    ) : (
                        <div className="buttons">
                            <button onClick={launchES}><FontAwesomeIcon icon={faRocket}/> Launch</button>
                            <button onClick={installLatest}><FontAwesomeIcon icon={faRedo}/> Reinstall</button>
                            <button onClick={installOther}><FontAwesomeIcon icon={faQuestion}/> Install Different Version</button>
                        </div>
                    )}
                    
            </div>
            <div className="mainmr" onClick={expandMainmr}>
                <h2 id="mainmrHeader"><pre>main.mr</pre></h2>
                <div id="mainmrContent" className="content">
                    <pre>
                        {main_mr}
                    </pre>
                </div>
            </div>
            <div className="down">
                <h2>Downloaded Parts</h2>
                <button onClick={redownloadAll}><FontAwesomeIcon icon={faRedo}/> Redownload all</button>
            </div>
            {props.downloadedParts}
            <h2>Your Parts</h2>
            {userParts}
        </div>
    );
}

export default Launcher;
