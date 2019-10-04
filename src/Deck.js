import React, { Component } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';
const API_URL_BASE = "https://deckofcardsapi.com/api/deck";

class Deck extends Component {
  constructor(props) { // sets things for initialisation
    super(props);
    this.state = {deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount() {
    let deck = await axios.get(`${API_URL_BASE}/new/shuffle/`); // await means whatever code comes next will wait for this to finish
    this.setState({ deck: deck.data }); // data is payload, info coming from api 
  }
  async getCard() {
    let deck_id = this.state.deck.deck_id;
    try {
      let cardURL = `${API_URL_BASE}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardURL);
      if(!cardRes.data.success) {
        throw new Error("No cards remaining");
      }
      let card = cardRes.data.cards[0];
      console.log(cardRes.data);
      this.setState(st => ({ // st is old state, using callback version
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`
          }
        ]
      }));
    } catch(err) {
      alert(err);
    }


    // set state using new card info from api
  }

  render() {
    const cards = this.state.drawn.map(c => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
      <div className="Deck">
        <h1 className="Deck-title">♦ Card Dealer ♦</h1> 
        <h2 className="Deck-title subtitle">♦ A little demo made with React ♦</h2>
        <button className="Deck-btn" onClick={this.getCard}>♦ Get card ♦</button> 
        <div className="Deck-cardarea">{cards}</div>
      </div>
    );
  }
}

export default Deck;
