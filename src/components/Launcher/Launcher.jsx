import { useEffect, useState } from 'react';
import './Launcher.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faQuestion, faRedo, faRocket } from '@fortawesome/free-solid-svg-icons';
import es_logo from "../../es_logo.png";

function Launcher(props) {
    const [simVersion, setSimVersion] = useState("v0.1.11a");
    const [main_mr, setMain_mr] = useState();

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
        </div>
    );
}

export default Launcher;
