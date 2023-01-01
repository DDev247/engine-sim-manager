import { useEffect, useState } from 'react';
import './Catalog.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faStar, faDownload } from '@fortawesome/free-solid-svg-icons';

function Catalog(props) {
    const [page, setPage] = useState("home");
    const [currentUrl, setCurrentUrl] = useState("https://catalog.engine-sim.parts/api/parts/");
    const [pageNumber, setPageNumber] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentResponse, setCurrentResponse] = useState(undefined);
    const [latestPartsList, setLatestPartsList] = useState(undefined);

    const loadParts = (url) => {
        console.log("getting: " + url);
        let response;
        let json;

        async function getParts() {
            response = await fetch(url);
            json = await response.json();
        }

        getParts().then(() => {
            setCurrentResponse(json);
            setPageNumber(json.current_page);
            setLatestPartsList(json.data);
        });
    }

    const search = (query) => {
        const url = "https://catalog.engine-sim.parts/api/parts/?q=" + encodeURIComponent(query);

        setSearchQuery(query);
        setCurrentUrl(url);

        loadParts(url);
        setPage("search");
    }

    const submitSearch = (e) => {
        e.preventDefault();
        let value = document.getElementById("searchInput").value;
        console.log(value);
        if(value.trim().length !== 0) {
            search(value);
        }
    }

    const next = () => {
        if(currentResponse.next_page_url !== null) {
            setCurrentUrl(currentResponse.next_page_url);
            loadParts(currentResponse.next_page_url);
            document.getElementById("home").scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    const prev = () => {
        if(currentResponse.prev_page_url !== null) {
            setCurrentUrl(currentResponse.prev_page_url);
            loadParts(currentResponse.prev_page_url);
            document.getElementById("home").scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        async function getParts() {
            const response = await fetch(currentUrl);
            let json = await response.json();
            setCurrentResponse(json);
            setPageNumber(json.current_page);
            setLatestPartsList(json.data);
        }

        getParts();
    }, []);

    let latestPartsMap = (
        <div>
            <h2>Hmm...</h2>
            <h4>Something seems wrong...</h4>
            <pre>There should be parts here but there aren't any. Please check your internet connection.</pre>
        </div>
    );

    let latestParts = (
        <div className="latestParts">
            {latestPartsMap}
        </div>
    );

    if(latestPartsList !== undefined) {
        // console.log(latestPartsList);
        latestPartsMap = latestPartsList.map((item, key) => {
            // const link = "https://catalog.engine-sim.parts/parts/" + item.id;
            let name = item.name;
            let desc = item.short_description;

            const h4id = item.id + "h4";
            const h4preid = item.id + "4p";
            const h5id = item.id + "h5";
            const h5preid = item.id + "5p";
            const imid = item.id + "im";
            if (name.length > 58) {
                name = name.substring(0, 55) + "...";
            }

            if (desc.length > 58) {
                desc = desc.substring(0, 55) + "...";
            }

            let json = JSON.parse(props.savedPartsList);
            let starred = false;
            if(json.list.find(e => e.id === item.id)) {
                starred = true;
            }

            json = JSON.parse(props.downloadedPartsList);
            let downloaded = false;
            if(json.list.find(e => e.id === item.id)) {
                downloaded = true;
            }

            return (
                <div id={item.id} key={key} className="part" onClick={props.engineClicked}>
                    <img id={imid} src={item.image_url} alt={item.name} width="200"/>
                    <div className="partData">
                        <h4 id={h4id}>
                            {starred ? (<FontAwesomeIcon className="starred" icon={faStar}/>) : (<div/>)}
                            {downloaded ? (<FontAwesomeIcon className="downloaded" icon={faDownload}/>) : (<div/>)}
                            <pre id={h4preid}>{name}</pre>
                        </h4>

                        <h5 id={h5id}>By <pre id={h5preid}>{item.short_user.name}</pre></h5>
                        <pre>{desc}</pre>
                    </div>
                </div>   
            )
        });

        latestParts = (
            <div className="latestParts">
                {latestPartsMap}
            </div>
        );
    }

    let pageContent = (
        <div className="catalogPageContent">
            <h1>The parts catalog - Home</h1>
            <pre className="id">All data comes from <a href="https://catalog.engine-sim.parts">catalog.engine-sim.parts</a>.</pre>

            <div className="latestFlex">
                <h2>Latest parts</h2>
                <form onSubmit={submitSearch}>
                    <input id="searchInput" placeholder="Search..."/>
                    <input type="submit" value="Search"/>
                </form>
            </div>
            {latestParts}

            <div className="buttons">
                <button onClick={prev}><FontAwesomeIcon icon={faArrowLeft}/> Previous</button>
                <pre>Page {pageNumber}</pre>
                <button onClick={next}>Next <FontAwesomeIcon icon={faArrowRight}/> </button>
            </div>
        </div>
    );

    switch (page) {
        case "search":
            pageContent = (
                <div className="catalogPageContent">
                    <h1>The parts catalog - Search results</h1>
                    <pre className="id">All data comes from <a href="https://catalog.engine-sim.parts">catalog.engine-sim.parts</a>.</pre>
        
                    <div className="latestFlex">
                        <h2>Search results for <i>{searchQuery}</i></h2>
                        <form onSubmit={submitSearch}>
                            <input id="searchInput" placeholder="Search..."/>
                            <input type="submit" value="Search"/>
                        </form>
                    </div>
                    {latestParts}
        
                    <div className="buttons">
                        <button onClick={prev}><FontAwesomeIcon icon={faArrowLeft}/> Previous</button>
                        <pre>Page {pageNumber}</pre>
                        <button onClick={next}>Next <FontAwesomeIcon icon={faArrowRight}/> </button>
                    </div>
                </div>
            );
            break;
    
        default:
            break;
    }

    return (
        <div className="catalog">
            <div className="catalogPage">
                {pageContent}
            </div>
        </div>
    );
}

export default Catalog;
