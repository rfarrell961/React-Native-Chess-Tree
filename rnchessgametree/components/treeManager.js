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
import * as data from '../testData/userData.json';

// Item for trees flatlist
const Item = ({item}) => (
    <TouchableOpacity style={styles.listItem}>
        <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
);

export default function TreeManager({ navigation })
{   
    // console.log(data.trees[0].name)
    const [trees, setTrees] = useState(data.trees);

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.headingText}>Your Trees:</Text>

            <ScrollView style={{flexGrow: 0, maxHeight: "50%"}}>
                {
                    trees.map((item) => <Item item={item} key={item.name}/>)
                }
            </ScrollView>
            
            <TouchableOpacity style={styles.buttonStyle} onPress={() => navigation.push("Create")}>
                <Text style={styles.buttonText}>Create a New Game Tree!</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

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
    },
    buttonStyle: {
        backgroundColor: 'lightblue',
        width: '65%',
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: .5,
        margin: 20,
        height: 40,
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    listItem: {
        backgroundColor: "pink", 
        borderWidth: .5, 
        flex:1, 
        width: '50%', 
        alignSelf: 'center',
        borderRadius: 5,
        marginVertical: 10
    },
    listItemText: {

    }
});