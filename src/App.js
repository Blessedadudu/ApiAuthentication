import React, { Component } from 'react';
import './App.css';
import { CartesianGrid, XAxis, YAxis, AreaChart, Tooltip, Area } from 'recharts';


// import ba from 'bitcoinaverage';
// var publicKey = 'ODcwMzVmMDljNzk2NGY2NGEyMzQ3NDllZWRkZmFlNDk';
// var secretKey = 'OGI4Njc0Mzk4NjE2NDEzM2E2ZDNjMDZmODg0OGM5Y2JjNTAzNmExZDhkMDU0YmI1YmZlNjBkMDY4OTJmYzNiNA';



class App extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{},
      price: []
    }
  }

  componentWillMount(){
    this.getChartData(); 
    fetch('https://cors-anywhere.herokuapp.com/https://apiv2.bitcoinaverage.com/websocket/v3/get_ticket', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        // I know i am not meant to send my key to the public, but this is just for testing, nothing serious 
        'x-ba-key': 'NDhmOTk4ZDhiMzg1NDE3ZGJmMDgwY2EyN2QzMTcwYTQ'
      }
      // 7bc8f5d9ca3943939f6d5ec609cc6f8e
    })
      .then(response => response.json())
      .then(console.log)
  
  }

  
 
  getChartData = () => {
    // Ajax calls here


    const ws = new WebSocket('wss://apiv2.bitcoinaverage.com/websocket/v2/streaming?ticket={}&public_key=<your public key>');

    let subscribe = {
      "type": "subscribe",
      "product_ids": [
          "ETH-USD"
      ],
      "channels": [
          "level500",
          {
              "name": "ticker",
              "product_ids": [
                  "ETH-BTC",
                  "ETH-USD"
              ]
          }
      ]
    }

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      // console.log(response);
      this.setState({
        price: [...this.state.price, response],
        
      });
      // console.log(this.state.price);
      

    };
    ws.onclose = () => {
      ws.close();
    };

  }

  

  render() {
    return (
      <div className="App">
        <h1>Bitcoin Chart (USSD)</h1>
        <AreaChart width={1300} height={500} data={this.state.price}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="price" />
          <YAxis  />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </div>
    );
  }
}

export default App;
