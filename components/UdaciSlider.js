import React from 'react'
import { View, Slider, Text } from 'react-native'

const UdaciSlider = ({ value, onChange, step, max, unit }) => {
  return (
    <View>
      <Slider
        value={value}
        step={step}
        maximumValue={max}
        minimumValue={0}
        onValueChange={onChange}
      />
      <View>
        <Text>{value}</Text>
        <Text>{unit}</Text>
      </View>
    </View>
  )
}

export default UdaciSlider
