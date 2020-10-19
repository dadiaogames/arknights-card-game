import React from 'react';
import { Tabs, TabList, Tab } from 'react-tabs';

import './InversedTabs.css';

export const InversedTabs = (props) => (
  <Tabs
    onSelect = {props.onSelect}
    selectedIndex = {props.selectedIndex}
    style={{margin: "2%", width: "75%", display: "inline-block"}}
  >
    <TabList>
      {props.selections.map(selection => <Tab>{selection}</Tab>)}
    </TabList>
  </Tabs>
);