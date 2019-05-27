import React from 'react';
import './tree.css';
import collapseIcon from './images/collapse.png';
import expandIcon from './images/expand.png';
import { flatten, identifyNodeCheckState, toogleChecked, retriveFilteredNodes } from '../../utils/tree-utils';

class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
      expanded: [],
      nodes: props.nodes,
      title: props.title,
      filterText: '',
      flatNodes: flatten(props.nodes)
    };
  }

  /*
    update nodes and title if nodes get changed
  */
  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.nodes !== prevProps.nodes) {
      this.setState({ nodes: nextProps.nodes, title: nextProps.title, flatNodes: flatten(nextProps.nodes) });
    }
  }

  /*
    filter tree nodes
  */
  inputChangeHandler = (event) => {
    const inputValue = event.target.value;
    this.setState({ filterText: inputValue }, () => {
      this.onExpandCollapseAll(inputValue ? true : false);
    });
  }

  /*
   onExpandCollapseAll function for expand/collapse all tree nodes
  */
  onExpandCollapseAll(expanded) {

    let { flatNodes } = this.state;
    Object.keys(flatNodes).forEach(node => {
      // toogle tree node expanded variables
      flatNodes[node].expanded = expanded;
    });

    this.setState({ flatNodes: flatNodes });
  }

  /*
    onExpand function for toogle expand in tree node
  */
  onExpand(node, event) {
    // prevent parent events
    event.stopPropagation();

    let { flatNodes } = this.state;
    // toogle tree node expanded variables
    flatNodes[node.value].expanded = !flatNodes[node.value].expanded;

    this.setState({ flatNodes: flatNodes });
  }

  /*
    onCheck function for select/ deselect checkbox in tree node and its children
  */
  onCheck(node, event) {
    // prevent parent events
    event.stopPropagation();

    let { flatNodes } = this.state;
    // toogle checked tree node and its children
    toogleChecked(flatNodes, node, event.target.checked);

    this.setState({ flatNodes: flatNodes });
  }

  /*
   render tree item with events
  */
  renderTreeItem = (node, children) => {
    return (
      <li className={node.class} key={node.value}>
        <div className="checkbox">
          {node.isParent &&
            <span onClick={(event) => this.onExpand(node, event)}>
              <img src={node.expanded ? expandIcon : collapseIcon} />
            </span>
          }
          <label><input type="checkbox" checked={node.checked} onChange={(event) => this.onCheck(node, event)} />{node.label}</label>
        </div>
        {node.expanded ? children : null}
      </li>
    )
  }

  /*
   render all tree nodes
  */
  renderTreeNodes(nodes, parent = {}) {
    const { flatNodes, filterText } = this.state;

    const treeNodes = nodes.map((node) => {
      // const key = node.value;
      const flatNode = flatNodes[node.value];
      const children = node.children ? this.renderTreeNodes(node.children, node) : null;

      // Determine the check state after all children check states have been determined
      flatNode.checkState = identifyNodeCheckState(flatNodes, node);

      // Determine the check state after all children check states have been determined
      flatNode.filtered = retriveFilteredNodes(flatNodes, node, filterText);

      // Render only if parent is expanded or if there is no root parent
      const parentExpanded = parent.value ? flatNodes[parent.value].expanded : true;

      if (!parentExpanded || !flatNode.filtered) {
        return null;
      }

      return this.renderTreeItem({ ...node, ...flatNode, checked: flatNode.checkState === 1 }, children);
    });

    return (
      <ul>
        {treeNodes}
      </ul>
    );
  }

  render() {
    const { title, nodes, filterText } = this.state;

    return (
      <div className={'tree'}>
        <p className={'tree-title'}>
          {title}
        </p>
        <div className={'tree-button'}>
          <button type="button" className="btn" onClick={() => this.onExpandCollapseAll(true)}>Expand All</button>
          <button type="button" className="btn" onClick={() => this.onExpandCollapseAll(false)}>Collapse All</button>
        </div>
        <div className={'tree-filter-input'}>
          <input type="text" name="filter-text" value={filterText} onChange={this.inputChangeHandler} />
        </div>
        <div className={'tree-view'}>
          {this.renderTreeNodes(nodes, {})}
        </div>
      </div>
    );
  }
}

export default Tree;
