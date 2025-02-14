const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const increasedGood = {
        ...state,
        good: state.good + 1
      }
      return increasedGood
    case 'OK':
      const increasedOk = {
        ...state,
        ok: state.ok+ 1
      }
      return increasedOk
    case 'BAD':
      const increasedBad = {
        ...state,
        bad: state.bad+ 1
      }
      return increasedBad
    case 'ZERO':
      const zeroStats = {
        good: 0,
        ok: 0,
        bad: 0
      }
      return zeroStats
    default: return state
  }

}

export default counterReducer
