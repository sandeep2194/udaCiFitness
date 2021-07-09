import React, { Component } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, PermissionsAndroid, Animated } from 'react-native'
import Foundation from 'react-native-vector-icons/Foundation'
import { white, purple } from '../utils/colors'
import Geolocation from '@react-native-community/geolocation'
import { calculateDirection } from '../utils/helpers'

export default class Live extends Component {
    state = {
        coords: null,
        status: 'null',
        direction: '',
        watchId: 0,
        bounceValue: new Animated.Value(1)
    }
    componentDidMount() {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then((status) => {
                if (status === 'granted') {
                    return this.setLocation()
                }
                this.setState(() => ({ status, }))
            }).catch((error) => {
                console.warn('Error getting location permission: ', error)
                this.setState(() => ({ status: 'undetermined' }))
            })
    }
    askPermission = () => {
        PermissionsAndroid.askPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then((status) => {
                if (status === 'granted') {
                    return this.setLocation()
                }
                this.setState(() => ({ status, }))
            }).catch((error) => {
                console.warn('Error asking location permission: ', error)
            })
    }
    componentWillUnmount() {
        Geolocation.clearWatch(this.state.watchId)
    }
    setLocation = () => {
        const id = Geolocation.watchPosition(({ coords }) => {
            const newDirection = calculateDirection(coords.heading)
            const { direction, bounceValue } = this.state

            if (newDirection !== direction) {
                Animated.sequence([
                    Animated.timing(bounceValue, { duration: 200, toValue: 1.04 }),
                    Animated.spring(bounceValue, { toValue: 1, friction: 4 })
                ]).start()
            }

            this.setState(() => ({
                coords,
                status: 'granted',
                direction: newDirection,
            }))
        }, {
            enableHighAccuracy: true,
            timeout: 100,
            distanceFilter: 1,
        })
        this.setState(() => ({ watchId: id }))
    }
    render() {
        const { status, coords, direction, bounceValue } = this.state
        if (status === null) {
            return (
                <View>
                    <ActivityIndicator style={{ marginTop: 30 }} color={'black'} />
                </View>
            )
        }
        if (status === 'denied') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text>
                        You denied your location you ca fix this by visiting settings  and enabling location services for this app
                    </Text>
                </View>
            )
        }
        if (status === 'undetermined') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50} />
                    <Text>
                        You need enable location services for this app.
                    </Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>Enable</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Animated.Text
                        style={[styles.direction
                            , { transform: [{ scale: bounceValue }] }
                        ]}
                    >{direction}</Animated.Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, { color: white }]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, { color: white }]}>
                            {coords ? Math.round(coords.altitude * 3.2808) : 0} Feet
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, { color: white }]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, { color: white }]}>
                            {coords ? (coords.speed * 2.2369).toFixed(1) : 0} MPH
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
    },
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20,
    },
    buttonText: {
        color: white,
        fontSize: 20,
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 35,
        textAlign: 'center',
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
    },
    metric: {
        flex: 1,
        paddingVertical: 15,
        backgroundColor: 'rgba(255,255,255, 0.1)',
        marginVertical: 20,
        marginHorizontal: 10,
    },
    subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
    }
})