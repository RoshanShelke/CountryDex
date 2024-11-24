import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Error from "../Components/Error";
import Spinner from "../Components/Spinner";
import { findCountryName } from "../Components/CountryCodes";
import "../Styles/CountryDetails.css";

function CountryDetails() {
  const navigate = useNavigate();
  const { country } = useParams();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNativeNames = (name) =>
    Object.values(name.nativeName).map((language) => language.common);

  const fetchCurrencies = (currencies) =>
    Object.values(currencies).map(
      (currency) => `${currency.name} (${currency.symbol})`
    );

  useEffect(() => {
    // Start loading and clear previous errors
    setLoading(true);
    setError(null);

    let isMounted = true;
    const fetchUrl =
      country.length === 3
        ? `https://restcountries.com/v3.1/alpha/${country}`
        : `https://restcountries.com/v3.1/name/${country}?fullText=true`;

    const fetchData = async () => {
      try {
        const response = await axios.get(fetchUrl);
        if (isMounted) {
          setApiData(response.data[0]);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message === "Network Error"
              ? "No internet connection. Please check your network."
              : "An error occurred while fetching data from the API."
          );
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [country]);

  return (
    <section className="country-details-section">
      <div className="back-btn-container" data-aos="fade-right">
        <button
          type="button"
          onClick={() => {
            navigate("/");
          }}
        >
          <IoArrowBack /> Back
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Error error={error} />
      ) : (
        <div className="countryInfoSection">
          <div className="countryFlag-container" data-aos="fade-right">
            <img
              src={apiData.flags.png}
              alt={`${apiData.name.common} Flag`}
              title={`${apiData.name.common} Flag`}
            />
          </div>

          <div className="countryStats-container" data-aos="fade-left">
            <p className="country-title">{apiData.name.common}</p>

            <div className="country-details">
              <div>
                <p>
                  <strong>Native Names: </strong>
                  {apiData.name ? (
                    fetchNativeNames(apiData.name)
                      .map((name) => name)
                      .join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Population: </strong>
                  {apiData.population ? (
                    apiData.population.toLocaleString()
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Region: </strong>
                  {apiData.region || <span>--</span>}
                </p>
                <p>
                  <strong>Sub Region: </strong>
                  {apiData.subregion || <span>--</span>}
                </p>
                <p>
                  <strong>Capital: </strong>
                  {apiData.capital ? (
                    apiData.capital.join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
              </div>

              <div>
                <p>
                  <strong>Top Level Domain: </strong>
                  {apiData.tld ? apiData.tld.join(", ") : <span>--</span>}
                </p>
                <p>
                  <strong>Currencies: </strong>
                  {apiData.currencies ? (
                    fetchCurrencies(apiData.currencies).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
                <p>
                  <strong>Languages: </strong>
                  {apiData.languages ? (
                    Object.values(apiData.languages).join(", ")
                  ) : (
                    <span>--</span>
                  )}
                </p>
              </div>
            </div>

            <div className="country-border">
              {apiData.borders && (
                <p>
                  <strong>Border Countries: </strong>
                </p>
              )}
              {apiData.borders ? (
                apiData.borders.map((border, index) => {
                  const countryName = findCountryName(border);
                  return (
                    <Link to={`/${border}`} key={index} title={countryName}>
                      <span className="country-border-name">{countryName}</span>
                    </Link>
                  );
                })
              ) : (
                <span className="no-countries">
                  There are no neighboring countries sharing a border with it.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CountryDetails;
