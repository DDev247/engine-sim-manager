import { useEffect, useState } from 'react';
import './ViewManufacturer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
                        
                        // console.log(element + " => " + partFile);
                        partData[element.substring(0, element.length-3)] = mainLoading;
                    });
                }
            });
        });

        setManufacturerPartData(partData);
        setManufacturerData(data);
    }, []);

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

    if(manufacturerData !== undefined && manufacturerPartData !== undefined) {
        console.log(manufacturerPartData);
        const parts = manufacturerPartData;
        
        let manufacturerMap = manufacturerData.map((item, key) => {
            let name = item;

            if (name.length > 86) {
                name = name.substring(0, 83) + "...";
            } // 104 - 18
            
            
            console.log(name.substring(0, name.length-3));
            // this should return 'true' or 'false'
            console.log(parts[name.substring(0, name.length-3)]);
            
            // this should be the value logged in the line above
            let mainLoading = manufacturerPartData[name.substring(0, name.length-3)];

            return (
                <div className="manEngine engine">
                    <h4><pre>{name}</pre></h4>
                    <h5>By <pre>{props.name}</pre></h5>
                    {mainLoading ? (<h6 className="id">Supports <code>main()</code> loading</h6>) : (<div/>) }
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