import React from 'react';
import Tree from './components/tree/tree';
import './App.css'
import { get } from './services';
import { unflatten } from './utils/tree-utils';

const LAYER_API_URL = 'https://usa.maintstar.co/MSMap/proxy.ashx?http://g1.maintstar.com:6080/arcgis/rest/services/Pleasanton_gis1/MapServer?f=json&profile=default';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'Arcgis Pleasanton',
      nodes: [],
    };
  }

  componentWillMount() {
    this.fetchTreeData();
  }

  async fetchTreeData() {
    const response = await get(LAYER_API_URL);
    // get parent nodes 
    const parentLayers = response.layers.filter(sub => sub.parentLayerId === -1);
    // prepare data for tree nodes
    const nodes = unflatten(parentLayers, response.layers, 'id', 'parentLayerId', 'name');
    console.log(nodes);
    this.setState({ nodes });
  }

  render() {
    const { title, nodes } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <Tree nodes={nodes} title={title} />
        </header>
      </div>
    );
  }
}

export default App;

