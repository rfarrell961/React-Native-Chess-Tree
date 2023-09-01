import GetColors from './colors';

import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        width: '100%',
    },
    headingText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    subHeadingText: {
        fontSize: 17,
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
    buttonStyleRed: {
        backgroundColor: 'pink',
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
        fontWeight: 'bold',
    },
    listItemText: {
        fontSize: 25
    },
    listItem: {
        backgroundColor: "white", 
        borderTopWidth: .5, 
        borderBottomWidth: .5,
        flex: 1, 
        flexDirection: 'row',
        width: '100%', 
        height: 100,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        width: '65%',
        alignSelf: 'center',
        height: 40,
        margin: 12,
        borderWidth: .5,
        padding: 10,
    }
});

export default styles;