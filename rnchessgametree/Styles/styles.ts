import {
    StyleSheet,
} from 'react-native';

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