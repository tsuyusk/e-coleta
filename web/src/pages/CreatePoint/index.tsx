import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";

import logo from "../../assets/logo.svg";
import api from "../../services/api";
import "./CreatePoint.css";

interface Item {
  id: number;
  item: string;
  image_url: string;
}

interface IbgeUfRes {
  sigla: string;
}

interface IbgeCityRes {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -15.8011237,
    -47.8687138,
  ]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    api
      .get("items")
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get<IbgeUfRes[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    setCities([]);
    axios
      .get<IbgeCityRes[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityNames = res.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  const handleSelectUf = (ev: ChangeEvent<HTMLSelectElement>) => {
    const uf = ev.target.value;
    setSelectedUf(uf);
  };

  const handleSelectCity = (ev: ChangeEvent<HTMLSelectElement>) => {
    const city = ev.target.value;
    setSelectedCity(city);
  };

  const handleMapClick = (ev: LeafletMouseEvent) => {
    setSelectedPosition([ev.latlng.lat, ev.latlng.lng]);
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;

    setInputData({ ...inputData, [name]: value });
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      return;
    }
    setSelectedItems([...selectedItems, id]);
  };

  const handleSubmit = async (ev: FormEvent) => {
    try {
      ev.preventDefault();

      const { name, email, whatsapp } = inputData;
      const uf = selectedUf;
      const city = selectedCity;
      const [latitude, longitude] = selectedPosition;
      const items = selectedItems;

      const data = {
        name,
        email,
        whatsapp,
        uf,
        city,
        latitude,
        longitude,
        items,
      };

      await api.post("points", data);

      alert("Ponto de coleta criado");

      history.push("/");
    } catch {
      alert("Error! Tente novamente");
    }
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Logo" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa.</span>
          </legend>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={handleSelectUf}>
                <option value="">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            {cities.length !== 0 && (
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city" onChange={handleSelectCity}>
                  <option value="">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option value={city} key={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais items abaixo.</span>
          </legend>

          <ul className="items-grid">
            {data.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.item} />
                <span>{item.item}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
