import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faGithub, faLinkedin, faGoogle, faFacebook, faYoutube } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    return (
        <footer className="container-fluid">
            <div className="container flex flex-col lg:flex-row justify-center pt-4 text-center">
                <div className="all_right lg:col-4">© Bat Sheva shachar | 2023  </div>
                <div className="lg:col-4 tel ml-4">
                   📞   +972-55-67-96-515
                </div>

                {/* <div className="lg:col-4 text-light flex gap-3">
                    <a href="https://google.com" target="_blank">
                        <FontAwesomeIcon icon={faGoogle} />
                    </a>
                    <a href="https://facebook.com" target="_blank">
                        <FontAwesomeIcon icon={ faFacebook} />
                    </a>
                    <a href="https://youtube.com" target="_blank">
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                    <a href="https://il.linkedin.com" target="_blank">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href="https://github.com/BatshevaYakovson/" target="_blank">
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div> */}
            </div>
        </footer>
    );
};

export default Footer;
