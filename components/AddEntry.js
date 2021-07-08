import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import UdaciSlider from './UdaciSliders'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitButton({ onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <Text>Submit</Text>
        </TouchableOpacity>)
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }
    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)
        this.setState((prevState) => {
            const count = prevState[metric] + step
            return {
                ...prevState,
                [metric]: count > max ? max : count
            }
        })
    }
    decrement = (metric) => {
        this.setState((prevState) => {
            const count = prevState[metric] - getMetricMetaInfo(metric).step
            return {
                ...prevState,
                [metric]: count < 0 ? 0 : count
            }
        })
    }
    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value,
        }))
    }
    submit = () => {
        const key = timeToString()
        const entry = this.state

        this.props.dispatch(addEntry({
            [key]: entry
        }))

        this.setState({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        })
        // Navigate to home

        submitEntry({ entry, key })

        // Clear local notification
    }
    reset = () => {
        const key = timeToString()

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))

        //Route to home

        removeEntry(key)
    }
    render() {
        const metaInfo = getMetricMetaInfo()
        if (this.props.alreadyLogged) {
            return (
                <View>
                    <Ionicons name='ios-happy-outline' size={100} />
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>Reset</TextButton>
                </View>
            )
        }
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key={key} >
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />
                            }
                        </View>
                    )
                })}
                <SubmitButton onPress={this.submit} />
            </View>
        )
    }
}
function mapStateToProps(state) {
    const key = timeToString()

    return {
        alreadyLogged: state[key]
    }
}
export default connect(mapStateToProps)(AddEntry)