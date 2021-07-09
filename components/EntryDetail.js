import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton from './TextButton'

class EntryDetail extends Component {
    componentDidMount() {
        const { navigation, route } = this.props
        const { entryId } = route.params
        const year = entryId.slice(0, 4)
        const month = entryId.slice(5, 7)
        const day = entryId.slice(8)

        navigation.setOptions({
            headerTitle: `${day}/${month}/${year}`
        })
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.metrics !== null && !nextProps.metrics.today
    }
    reset = () => {
        const { remove, goBack, entryId } = this.props

        remove()
        goBack()
        removeEntry(entryId)
    }
    render() {
        const { metrics } = this.props
        return (
            <View style={styles.container}>
                <MetricCard metrics={metrics} />
                <TextButton onPress={this.reset} style={{ margin: 20 }}>
                    RESET
                </TextButton>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: white,
        padding: 15,
    }
})
function mapStateToProps(state, { route }) {
    const { entryId } = route.params
    console.log(state[entryId])
    return {
        entryId,
        metrics: state[entryId],
    }
}

function mapDispatchToProps(dispatch, { route, navigation }) {
    const { entryId } = route.params
    return {
        remove: () => dispatch(addEntry({
            [entryId]: timeToString() === entryId
                ? getDailyReminderValue() : null
        })),
        goBack: () => navigation.goBack()
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)