import React from 'react'
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native'
import AddEntry from './components/AddEntry'

export default class App extends React.Component {
  handlePress = () => {
    alert('Hello')
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.btn}
          onPress={this.handlePress}
          underlayColor="#d4271b"
        >
          <Text style={styles.btnText}>Touchable Highlight</Text>
        </TouchableHighlight>
        <AddEntry />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    backgroundColor: '#E53224',
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff'
  }
})
