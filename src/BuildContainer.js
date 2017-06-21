import React, { Component } from 'react';
import {Row} from 'react-materialize';
import $ from 'jquery';
import Dronecard from './DroneCard.js';
import Partscard from './PartsCard.js';
var _COUNTER = 0;

class BuildContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parts: [
        {
          name: '',
          price: '',
          link: '',
          category: ''
        }
      ]
    }
    this.iteratePartsForward = this.iteratePartsForward.bind(this);
    this.iteratePartsBackward = this.iteratePartsBackward.bind(this);
    this.addParttoDrone = this.addParttoDrone.bind(this);
  }

  loadCategoriesFromServer() {
    // grabbing the categories from the database and putting them in an array and then loading the first category
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3001/api/categories'
    })
    .then((res) => {
      this.setState({
        counter: _COUNTER
      })

      this.setState({
        currentPart: res.categories[this.state.counter],
        categories: res.categories
         });
      $.ajax({
        method: 'GET',
        url: `http://localhost:3001/api/parts?category=${this.state.categories[this.state.counter]}`
      })
      .then((res) => {
        this.setState({
          parts: res.parts
        });
      }, (err) => {
        console.log('get parts error', err)
      })
    }, (err) => {
      console.log('get categories error', err)
    });
  }

  componentDidMount() {
    // grabbing the categories from the database and putting them in an array and then loading the first category as the component mounts
    this.loadCategoriesFromServer()
  }
  iteratePartsForward(e){
    // increment counter to update current category to the next part category chosen
    e.preventDefault();
    if(_COUNTER < 9){
      _COUNTER = _COUNTER + 1;
      this.setState({
        counter : _COUNTER,
        currentPart: this.state.categories[this.state.counter],
        categories: this.state.categories
      });
    $.ajax({
      method: 'GET',
      url: `http://localhost:3001/api/parts?category=${this.state.categories[this.state.counter]}`
    })
    .then((res) => {
      this.setState({
        parts: res.parts
      });
    }, (err) => {
      console.log('get parts error', err)
    })
  }
}
iteratePartsBackward(e) {
  // increment counter to update current category to the previous part category chosen
  e.preventDefault();
    if(_COUNTER >= 0){
      _COUNTER = _COUNTER - 1;
      this.setState({
        counter : _COUNTER,
        currentPart: this.state.categories[this.state.counter],
        categories: this.state.categories
      });
      $.ajax({
        method: 'GET',
        url: `http://localhost:3001/api/parts?category=${this.state.categories[this.state.counter]}`
      })
      .then((res) => {
        this.setState({
          parts: res.parts
        });
      }, (err) => {
        console.log('get parts error', err)
      })
    }
  }

  addParttoDrone(e, partID) {
    e.preventDefault();
    console.log("PARTID in add: ", partID)
    this.setState({
      counter : _COUNTER,
      currentPart: this.state.categories[this.state.counter],
      categories: this.state.categories,
      parts: this.state.parts,
      newDrone: {
        _frame: partID
      }
    });
    console.log(this.state.newDrone);
  }
  render() {
    return (
      <Row>
        <Dronecard />
        <Partscard
          addParttoDrone={this.addParttoDrone}
          iteratePartsBackward={this.iteratePartsBackward}
          iteratePartsForward={this.iteratePartsForward}
          currentPart={this.state.currentPart}
          parts={this.state.parts} />
      </Row>
    )
  }
}

export default BuildContainer;
