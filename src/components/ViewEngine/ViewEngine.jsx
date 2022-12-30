import { useEffect, useState } from 'react';
import './ViewEngine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faStar, faTrashCan, faWrench } from '@fortawesome/free-solid-svg-icons';

function ViewEngine(props) {
    const [engineData, setEngineData] = useState(undefined);

    useEffect(() => {
        async function getEngine() {
            const id = props.engineID;
            const url = "https://catalog.engine-sim.parts/api/parts/" + id;

            const response = await fetch(url);
            const json = await response.json();
            setEngineData(json);
        }

        getEngine();
    }, []);

    let engineView = (
        <h2><pre>Loading...</pre></h2>
    );

    const downloadPart = (e) => {
        const username = engineData.short_user.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const name = "es/latest/assets/engines/" + username + "/" + engineData.script_name;
        fetch("http://127.0.0.1:24704/savePart?name=" + name + "&id=" + engineData.id).then((response) => {
            response.text().then((data) => {
                console.log("Recieved: " + data);
            });
        });

        let json = JSON.parse(props.downloadedPartsList);

        if(json.list.find(e => e.id === engineData.id)) {
            //json.list.splice(json.list.indexOf(engineData), 1);
        }
        else {
            json.list.push(engineData);
        }

        props.setDownloadedList(JSON.stringify(json));
    }

    const usePart = (e) => {
        downloadPart(e);
        const name2 = "es/latest/assets/main.mr";
        fetch("http://127.0.0.1:24704/saveFile?name=" + name2 + "&data=" + btoa(engineData.main_mr)).then((response) => {
            response.text().then((data) => {
                console.log("Recieved: " + data);
            });
        });
    }

    const savePart = (e) => {
        let json = JSON.parse(props.savedPartsList);

        if(json.list.find(e => e.id === engineData.id)) {
            json.list.splice(json.list.indexOf(engineData), 1);
        }
        else {
            json.list.push(engineData);
        }

        props.setSavedList(JSON.stringify(json));
    }

    const deletePart = (e) => {
        const username = engineData.short_user.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const name = "es/latest/assets/engines/" + username + "/" + engineData.script_name;
        
        let json = JSON.parse(props.downloadedPartsList);
        if(json.list.find(e => e.id === engineData.id)) {
            json.list.splice(json.list.indexOf(engineData), 1);
        }
        
        fetch("http://127.0.0.1:24704/deleteFile?name=" + name).then((response) => {
            response.text().then((data) => {
                console.log("Recieved: " + data);
            });
        });

        props.setDownloadedList(JSON.stringify(json));
    }

    if(engineData !== undefined) {
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
    }

    return(
        <div className="viewEngine">
            <h1>View Part</h1>
            {engineView}
        </div>
    );
}

export default ViewEngine;