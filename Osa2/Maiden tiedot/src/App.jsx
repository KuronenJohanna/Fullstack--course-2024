import { useEffect, useState } from 'react'
import axios from 'axios'
import Searchbar from './Searchbar'
import Countrylist from './Countrylist'

const api_key = import.meta.env.VITE_SOME_KEY
console.log(api_key)
const App = () => {

  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  


  useEffect(()=> {
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
        setCountries(response.data)
        setFilteredCountries(response.data)
      })
    
  }, [])

  
  
  useEffect(()=> {

    const result = countries.filter(country => country.name.common.toLowerCase().startsWith(searchTerm.toLowerCase()))
      setFilteredCountries(result)
      
  },[searchTerm])



  const handleSearch= (event) =>{
    setSearchTerm(event.target.value)
  }



  return (
    <div> 
    <Searchbar handleSearch={handleSearch} searchTerm={searchTerm}/>
    <Countrylist filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} api_key={api_key}/>
    </div>
  )
}

export default App
