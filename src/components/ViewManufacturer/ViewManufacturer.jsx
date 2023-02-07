import { useEffect, useState } from 'react';
import './ViewManufacturer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faUpload, faWrench } from '@fortawesome/free-solid-svg-icons';
//import { faDownload, faStar, faTrashCan, faWrench } from '@fortawesome/free-solid-svg-icons';

function ViewManufacturer(props) {
    const [manufacturerData, setManufacturerData] = useState(undefined);
    const [manufacturerPartData, setManufacturerPartData] = useState(undefined);

    useEffect(() => {
        const manufacturerName = props.name;
        const data = props.userEngines[manufacturerName];

        let partData = {};

        data.forEach(element => {
            let partFile = "";

            fetch("http://127.0.0.1:24704/getFile?name=es/latest/assets/engines/" + props.name + "/" + element).then((data) => {
                if(data.status === 200) {
                    data.text().then((file) => {
                        partFile = file;
                        let mainLoading = partFile.includes("public node main");
                        let hasEngine = partFile.includes("engine engine");
                        
                        let nodeName = "";
                        let engineName = "";

                        partFile.replace("\r", "");
                        let lines = partFile.split("\n");
                        let i = 0;
                        lines.forEach(element => {
                            if(element.startsWith("public node")) {
                                let line = lines[i+1];
                                if(line.includes("alias output __out: engine;")) {
                                    nodeName = element.split(" ")[2];
                                }
                            }
                            else if(element.includes("name:")) {
                                engineName = element.split("\"")[1];
                            }
                            
                            i++;
                        });
                        //partFile.indexOf("public node");

                        let obj = {
                            "hasMain": mainLoading,
                            "hasEngine": hasEngine,
                            "name": element.substring(0, element.length-3),
                            "path": "engines/" + props.name + "/" + element,
                            "nodeName": nodeName,
                            "engineName": engineName,
                        };

                        // console.log(element + " => " + partFile);
                        partData[element.substring(0, element.length-3)] = obj;
                        //partData.list.push(obj);
                    });
                }
            });
        });

        setManufacturerPartData(partData);
        setManufacturerData(data);
    }, [props.name,props.userEngines]);

    const back = (e) => {
        props.setPage("home");
        document.getElementById("home").scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    let manufacturerView = (
        <h2><pre>Loading...</pre></h2>
    );

    const usePart = (e) => {
        // TODO: When ER04 or 0.1.12 releases change this
        // yes
        const parts = manufacturerPartData;
        const engineName = e.target.id;
        
        let part = parts[engineName];

        if(!part.hasEngine)
            return;

        console.log("Choosin part:");
        console.log(part);

        if(!part.hasMain) {
            const mainMr = `import "engine_sim.mr"
import "themes/default.mr"
import "${part.path}"

use_default_theme()

set_engine(${part.nodeName}())
set_transmission(transmission())
set_vehicle(vehicle())
            `;

            console.log("writin: " + mainMr);
            fetch("http://127.0.0.1:24704/saveFile?name=es/latest/assets/main.mr&data=" + btoa(mainMr));
        }
        else {
            const mainMr = `import "engine_sim.mr"
import "themes/default.mr"
import "${part.path}"

use_default_theme()

main()
`;

            console.log("writin: " + mainMr);
            fetch("http://127.0.0.1:24704/saveFile?name=es/latest/assets/main.mr&data=" + btoa(mainMr));
        }
    }

    const deletePart = (e) => {

    }

    if(manufacturerData !== undefined && manufacturerPartData !== undefined) {
        console.log("loadin parts fr\n");
        console.log(manufacturerPartData);
        //const parts = manufacturerPartData;
        
        let manufacturerMap = manufacturerData.map((item, key) => {
            let name = item;
            let engineName = name.substring(0, name.length-3);

            if (name.length > 86) {
                name = name.substring(0, 83) + "...";
            } // 104 - 18
            
            /*
            console.log(engineName);
            let part; // = parts[engineName];

            console.log("a");
            let i = 0;
            for(const value of parts.list) {
                if(value.name === engineName)
                    part = value;

                // This doesn't output anything
                // Not even a newline
                console.log(value);
                console.log("b");
                //debugger;
                i++;
            }
            console.log("c");
            console.log(i);
            // for (let index = 0; index < parts.length; index++) {
            //     const element = parts[index];
            //     console.log(element);
            //     part = element;
            // }
            console.log(part);
            */
            
            // this should be the value logged in the line above
            let mainLoading = manufacturerPartData[name.substring(0, name.length-3)];

            return (
                <div className="manEngine engine">
                    <div>
                        <h4><pre>{name}</pre></h4>
                        <h5>By <pre>{props.name}</pre></h5>
                        {mainLoading ? (<h6 className="id">Supports <code>main()</code> loading</h6>) : (<div/>) }
                    </div>
                    <div className="buttons">
                        <button id={engineName} onClick={usePart}><FontAwesomeIcon icon={faWrench}/> Use Part</button>
                        {/* <button id={engineName} onClick={uploadPart}><FontAwesomeIcon icon={faUpload}/> Upload Part</button> */}
                        <button id={engineName} onClick={deletePart}><FontAwesomeIcon icon={faTrash}/> Delete Part</button>
                    </div>
                </div>
            );
        });

        console.log(manufacturerMap);

        manufacturerView = (
            <div className="manufacturer">
                {manufacturerMap}
            </div>
        );
    }

    /*if(engineData !== undefined) {
        let usrID = "";
        let engID = "";

        let savePartText = "Save Part";
        let json = JSON.parse(props.savedPartsList);
        let starred = false;
        if(json.list.find(e => e.id === engineData.id)) {
            savePartText = "Unsave Part";
            starred = true;
        }

        json = JSON.parse(props.downloadedPartsList);
        let downloadPartText = "Download Part";
        let downloaded = false;
        if(json.list.find(e => e.id === engineData.id)) {
            downloadPartText = "Redownload Part";
            downloaded = true;
        }

        if(props.developerMode) {
            usrID = engineData.short_user.id;
            engID = engineData.id;
        }
        engineView = (
            <div className="engineData">
                <h2>
                    {starred ? (<FontAwesomeIcon icon={faStar}/>) : (<div/>)}
                    {downloaded ? (<FontAwesomeIcon icon={faDownload}/>) : (<div/>)}
                    <pre>{engineData.name}</pre><pre className="id">{engID}</pre>
                </h2>
                
                <h4>By <pre>{engineData.short_user.name}</pre><pre className="id">{usrID}</pre></h4>
                
                <img src={engineData.image_url} alt={engineData.name} width="600"/>
                
                <h4 className="desc">Description:</h4>
                <pre className="desc">{engineData.description}</pre>
                
                <div className="engineDataButtons">
                    <button onClick={usePart}><FontAwesomeIcon icon={faWrench}/> Use Part</button>
                    <button onClick={downloadPart}><FontAwesomeIcon icon={faDownload}/> {downloadPartText}</button>
                    {downloaded ? (
                        <button onClick={deletePart}><FontAwesomeIcon icon={faTrashCan}/> Delete Part</button>
                    ) : (<div/>)}
                    <button onClick={savePart}><FontAwesomeIcon icon={faStar}/> {savePartText}</button>
                </div>
            </div>
        );
    }*/

    return(
        <div className="viewEngine">
            <h1><FontAwesomeIcon icon={faArrowLeft} onClick={back}/> View Manufacturer</h1>
            <h2><pre>{props.name}</pre></h2>
            {manufacturerView}
        </div>
    );
}

export default ViewManufacturer;