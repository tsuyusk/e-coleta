import React from "react";
import PeopleImage from "../../assets/home-background.svg";
import logo from "../../assets/logo.svg";
import { FiLogIn } from "react-icons/fi";

import "./Home.css";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <main>
          <div className="description">
            <div>
              <h1>Seu marketplace de coleta de resíduos.</h1>
              <p>
                Ajudamos pessoas a encontrarem pontos de coleta de forma
                eficiente.
              </p>
              <Link to="/create-point">
                <span>
                  <FiLogIn />
                </span>
                <strong>Cadastre um ponto de coleta</strong>
              </Link>
            </div>

            <img src={PeopleImage} alt="people" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
