import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHome, faRocket, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

function Sidebar(props) {
    const changePage = (e) => {
        if(e.target.nodeName === "path") {
            props.setPage(e.target.parentElement.parentElement.id);
        }
        else {
            props.setPage(e.target.id);
        }
    }

    const launchES = (e) => {
        props.setPage("launchInstant");
    }

    return (
        <div className="sidebar">
            <div className="top">
                <div className="sidebarItem" title="Home" id="home" onClick={changePage}>
                    <FontAwesomeIcon icon={faHome}/>
                </div>
                <div className="sidebarItem" title="Parts Catalog" id="parts" onClick={changePage}>
                    {/* <FontAwesomeIcon icon={faScrewdriverWrench}/> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16">
                        <path d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434L8.932.727zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"></path>
                    </svg>                    
                </div>
                <div className="sidebarItem" title="Settings" id="settings" onClick={changePage}>
                    <FontAwesomeIcon icon={faGear}/>
                </div>
            </div>
            <div className="bottom">
                <div className="sidebarItem launch" title="Launch ES" id="launch" onAuxClick={launchES} onClick={changePage}>
                    <FontAwesomeIcon icon={faRocket}/>
                </div>
                {/* <div className="sidebarItem" title="Account settings" id="account" onClick={changePage}>
                    <FontAwesomeIcon icon={faUser}/>
                </div> */}
            </div>
        </div>
    );
}

export default Sidebar;