import React, {useState} from 'react'
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag'
import { ApolloProvider, useMutation, useQuery } from '@apollo/react-hooks';


const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
});

const ADDREVIEW = gql`
  mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!){
    createReview(episode: $ep, review: $review) {
      episode
      stars
      commentary
    }
  }
`
const STARWARS = gql`
  {
    reviews(episode: JEDI){
      episode
      stars
      commentary
    }
  }`

client
  .query({
    query: STARWARS
  })
  .then(result => console.log(result.data))



const FetchStarWars = () => {

  const [ep, setEp] = useState('')
  const [review, setReview] = useState({ })

  const { loading, error, data } = useQuery(STARWARS)
  const [createReview, {result}] = useMutation(ADDREVIEW, {
    refetchQueries: [{query: STARWARS}]
  })

  return (
          <div>
            {loading && <div>Loading...</div>}
            {error && <div>ERROR</div>}
            {data && data.reviews.map((object, idx) => (
              <div key={idx}>
                <div> {object.episode} </div>
                <div> {object.stars} </div>
                <div> {object.commentary} </div>
              </div>
            ))}

            <form onSubmit={ event => {
              event.preventDefault()
              createReview({variables: {ep: ep, review: review}})
            }}>
              <input onChange = {event => {setEp(event.target.value)}} type = 'text' />
              <input onChange = {event => {setReview( {...review, stars: parseInt(event.target.value || 0)})  }} type = 'number' />
              <input onChange = {event => {setReview( {...review, commentary: event.target.value}  )}} type = 'text' />

              <button type='submit'>submit</button>

            </form>

            {result && <div>
              <div> {result.episode} </div>
              <div> {result.stars} </div>
              <div> {result.commentary} </div>
            </div> }

          </div> 
        

  )
}

const Client = () => (
  <ApolloProvider client={client}>
    <FetchStarWars></FetchStarWars>
  </ApolloProvider>
)

  

  





export default Client