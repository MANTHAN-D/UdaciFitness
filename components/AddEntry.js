import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification
} from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { addEntry } from '../actions'

import { white, purple } from '../utils/colors'

import UdaciSlider from '../components/UdaciSlider'
import UdaciSteppers from '../components/UdaciSteppers'
import DateHeader from '../components/DateHeader'
import TextButton from './TextButton'

import { NavigationActions } from 'react-navigation'

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState(state => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = metric => {
    const { step } = getMetricMetaInfo(metric)

    this.setState(state => {
      const count = state[metric] - step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState({
      [metric]: value
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(
      addEntry({
        [key]: entry
      })
    )

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    })
    this.toHome()

    submitEntry(entry, key)

    clearLocalNotification().then(setLocalNotification)
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    )

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    })

    this.toHome()

    removeEntry(key)
  }

  toHome = () => {
    this.props.navigation.dispatch(
      NavigationActions.back({
        key: 'AddEntry'
      })
    )
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
            size={100}
          />
          <Text>You have already logged for today.</Text>
          <TextButton onPress={this.reset} style={{ padding: 20 }}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(metric => {
          const { getIcon, type, ...rest } = metaInfo[metric]
          const value = this.state[metric]

          return (
            <View key={metric} style={styles.row}>
              {getIcon()}
              {type === 'steppers' ? (
                <UdaciSteppers
                  value={value}
                  onIncrement={() => this.increment(metric)}
                  onDecrement={() => this.decrement(metric)}
                  {...rest}
                />
              ) : (
                <UdaciSlider
                  value={value}
                  onChange={value => this.slide(metric, value)}
                  {...rest}
                />
              )}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
})

const mapStateToProps = state => {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
