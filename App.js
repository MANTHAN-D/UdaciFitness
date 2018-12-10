import React from 'react'
import { View, Platform } from 'react-native'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

import AddEntry from './components/AddEntry'
import History from './components/History'

const store = createStore(reducer)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS === 'ios' ? 15 : 0
          }}
        >
          {/* <AddEntry /> */}
          <History />
        </View>
      </Provider>
    )
  }
}
