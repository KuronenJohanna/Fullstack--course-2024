import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <tbody>
      <tr>
      <td> {props.text}</td>
      <td> {props.value}{props.text ==="positive" && " %"}</td>
      </tr>
  </tbody>
  
  )
}




const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>

)

const Statistics = (props) => {
  return (
    <table>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={props.allTogether} />
      <StatisticLine text="average" value ={props.average} />
      <StatisticLine text="positive" value ={props.positive} />
    </table>
  )
  
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  let allTogether = good + neutral + bad
  let average = (good + (-bad))/(allTogether)
  let positive = good/allTogether*100

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={handleGoodClick}text="good"/>
      <Button handleClick={handleNeutralClick}text="neutral"/>
      <Button handleClick={handleBadClick}text="bad"/>
      <h1>Statistics</h1>
      {allTogether != 0 ?
      <Statistics 
          good={good} 
          neutral={neutral} 
          bad={bad} 
          allTogether={allTogether} 
          average={average} 
          positive={positive}/> 
          :  "No feedback given"}
    </div>
  )
}

export default App