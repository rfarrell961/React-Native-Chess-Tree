import {
    Text,
    View, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    FlatList,
    ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Board from './chessboard';

export default function CreateTree({ navigation })
{
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Please Select a Starting Position</Text>
            <Board/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        // borderWidth: 2,
        width: '100%',
    },
    headingText: {
        margin: 20,
        fontSize: 25,
        fontWeight: 'bold',
    }
});