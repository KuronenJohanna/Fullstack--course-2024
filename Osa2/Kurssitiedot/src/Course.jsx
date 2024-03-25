
const Course = ({ courses }) => {

    return (
    <div>
    <Header courses={courses} />
    <Content courses={courses}/>
    <Total courses={courses}/>
    </div>
  )
}
const Header = ({ courses }) => {
  
    return (
      <>
      <h2>
      {courses.name}
      </h2>
    
    </>
    )
}

const Part = ({ courses }) => {
  
  return (
    <>
    {courses.parts.map(part => 
    <p key={part.id}>
    {part.name} {part.exercises}
    </p>
    )}
    </>
  )

}

const Content = ({ courses }) => {
  
  return (

    <div>
      <Part courses={courses}/>
    </div>
  )
}

const Total = ({ courses }) => {
  
  const sum = courses.parts.reduce((pv, part)=> pv + part.exercises, 0)
  
  return (
    <> 
    <b>
    Total of {sum} exercises
    </b>
    </>
  )

}


export default Course