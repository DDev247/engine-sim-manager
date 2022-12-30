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
                    <FontAwesomeIcon icon={faScrewdriverWrench}/>
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