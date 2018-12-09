import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'

import UdaciSlider from '../components/UdaciSlider'
import UdaciSteppers from '../components/UdaciSteppers'
import DateHeader from '../components/DateHeader'
import TextButton from './TextButton'

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Submit</Text>
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
    // todo: update redux

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    })
    // todo: navigate to home

    submitEntry(entry, key)

    // todo: clear notifications
  }

  reset = () => {
    const key = timeToString()
    // todo: update redux

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    })
    // todo: navigate to home

    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name="ios-happy" size={100} />
          <Text>You have already logged for today.</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(metric => {
          const { getIcon, type, ...rest } = metaInfo[metric]
          const value = this.state[metric]

          return (
            <View key={metric}>
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

export default AddEntry
