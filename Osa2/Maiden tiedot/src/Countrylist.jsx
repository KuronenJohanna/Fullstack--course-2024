import { useState,useEffect } from "react"
import axios from "axios"

const Countrylist = ({ filteredCountries, setFilteredCountries, api_key }) => {
    const [currentWeather, setCurrentWeather] = useState([])
             
    const handleOneCountry = (name) => {
        const thecountry = filteredCountries.find(country => country.name.common === name)
        setFilteredCountries([thecountry])
         
    }

    useEffect(() => {
        if (filteredCountries.length === 1) {
            weatherHandle()
            setCurrentWeather([])
        }
    },[filteredCountries])

    const weatherHandle = () => {

    
        filteredCountries.forEach(info => {
            
        const latitude = info.capitalInfo.latlng[0]
        const longitude = info.capitalInfo.latlng[1]
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`
        axios
        .get(url)
            .then(response => {
                
            setCurrentWeather(prevWeather => [...prevWeather, response.data])
            })
        })
    }
    

    return (
        <div>
            <ul>
            {filteredCountries.length > 10 ? (
            <p>Too many matches, spesify another filter</p> 
            ): (
                <>
                {filteredCountries.length > 1 && filteredCountries.length <= 10 ? (
                    filteredCountries.map(country => (
                <li key={country.name.common}>
                {country.name.common} <button onClick={()=>handleOneCountry(country.name.common)}>show</button>
                </li>
                ))
                ) : (
                filteredCountries.length === 1 &&  (
                    <>
                {filteredCountries.map(country => (
                    <div key={country.name.common}>
                        <h1>{country.name.common}</h1>
                        capital: {country.capital} <br />
                        area: {country.area}
                        <h3>
                        languages:
                        </h3>
                        <ul>
                            {Object.values(country.languages).map(value => (
                            <li key={value}>{value}</li> 
                            ))} 
                        </ul>
                        <br />
                        <img src={`${country.flags.png}`} width={250} />
                    </div> 
                ))}
                {currentWeather.map(data => (
                    <div key={data.id}>
                        <h2>Weather in {data.name}</h2>
                        <p> temperature {data.main.temp} Celsius</p>
                        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} />
                        <p>wind {data.wind.speed} m/s</p>
                        </div>
                        ))}
                </>
                )
                )}
            </>    
            )}
            </ul>
        </div>

    )
}

export default Countrylist