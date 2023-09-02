import getColors from './colors';

import {
    StyleSheet,
} from 'react-native';

export default function getStyles(mode: number) {

    const colors = getColors(mode);

    const headerContainer : any = {
        height: 100,
        backgroundColor: colors.background2,
        flexDirection: 'row', 
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    };

    switch (mode)
    {
        case 1: // light mode
            break;
        case 2: // dark mode
            break;
        default:
            break;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background
        },
        headerContainer: headerContainer,
        headingText: {
            fontSize: 25,
            fontWeight: 'bold',
            color: colors.text
        },
        subHeadingText: {
            fontSize: 17,
            fontWeight: 'bold',
            color: colors.text
        },
        buttonStyle: {
            backgroundColor: colors.primary,
            width: '65%',
            alignSelf: 'center',
            borderRadius: 5,
            margin: 20,
            height: 40,
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 1,  
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
            color: colors.text
        },
        listItemText: {
            fontSize: 25,
            // color: colors.text
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

    return styles;
}
