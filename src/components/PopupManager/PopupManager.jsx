import { useState } from 'react';
import './PopupManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

function PopupManager(props) {
    const [managerClasses, setManagerClasses] = useState("popupManager");
    const [closed, setClosed] = useState(false);

    const close = (e) => {
        setClosed(true);
        setManagerClasses("popupManager hidden");
    }

    let popup = (<div/>);
    
    if(props.outdated) {
        popup = (
            <div>
                <div className='top'>
                    <h2>Warning</h2>
                    <FontAwesomeIcon icon={faClose} onClick={close}/>
                </div>
                <h4>This version of Engine Simulator Manager is outdated.</h4>
            </div>
        );
    }
    else {
        if(!closed) {
            close();
        }
    }

    return (
        <div className={managerClasses}>
            {popup}
        </div>
    );
}

export default PopupManager;
