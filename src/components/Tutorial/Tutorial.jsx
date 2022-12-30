import { useState } from 'react';
import './Tutorial.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function Tutorial(props) {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageClassName, setPageClassName] = useState("tutorialPage");

    let page = (
        <div className={pageClassName}>
            <h1 className="page1">Welcome to Engine Simulator Manager</h1>
        </div>
    );

    const go = () => {
        setPageClassName("tutorialPage animateOut");
        setTimeout(() => { props.setTutorialDone(true); }, 500);
    }

    const next = () => {
        setPageClassName("tutorialPage animateOut");
        setTimeout(() => {
            if(pageNumber < 4) {
                setPageNumber(Number.parseInt(pageNumber + 1));
                setPageClassName("tutorialPage");
            } 
            else {
                props.setTutorialDone(true);
            }}, 500);
    }

    const clicked = (e) => {
        setPageClassName("tutorialPage animateOut");
        setTimeout(() => { setPageNumber(Number.parseInt(e.target.id)); setPageClassName("tutorialPage") }, 500);
    }

    const bullets = (
        <div className="bullets">
            <div className={ pageNumber === 1 ? 'active' : ''} id='1' onClick={clicked}> </div>
            <div className={ pageNumber === 2 ? 'active' : ''} id='2' onClick={clicked}> </div>
            <div className={ pageNumber === 3 ? 'active' : ''} id='3' onClick={clicked}> </div>
            <div className={ pageNumber === 4 ? 'active' : ''} id='4' onClick={clicked}> </div>
        </div>
    );

    switch (pageNumber) {
        case 2:
            page = (
                <div className={pageClassName}>
                    <h1>An easier way to manage your Engine Simulator</h1>
                </div>
            );
            break;

        case 3:
            page = (
                <div className={pageClassName}>
                    <h1>Created by DDev</h1>
                </div>
            );
            break;

        case 4:
            page = (
                <div className={pageClassName}>
                    <h1>Let's go!</h1>
                    <button onClick={go}>Start</button>
                </div>
            );
            break;
    
        default:
            break;
    }

    const button = (
        <div className="tutorialButton" onClick={next}>
            <FontAwesomeIcon icon={faArrowRight}/>
        </div>
    );

    return(
        <div className="tutorial">
            {page}
            <div className="tutorialButtons">
                {bullets}
                {button}
            </div>
        </div>
    );
}

export default Tutorial;
