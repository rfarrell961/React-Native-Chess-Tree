interface IPalette { 
    primary: string,
    compliment: string,
    triad: string,
    background: string,
    background2: string,
    text: string,
}

// Mode Keys
// 1: Light Mode
// 2: DarkMode
export default function getColors(mode: number) : IPalette
{
    const lightMode: IPalette = {
        primary: "#ECA049",
        compliment: "#4995EC",
        triad: "#49eca0",
        background: "#FFFAF0",
        background2: "#FFFAF0",
        text: "#000000"
    }

    const darkMode: IPalette = {
        primary: "#ECA049",
        compliment: "#4995EC",
        triad: "#49eca0",
        background: "#121212",
        background2: "#282828",
        text: "#FFFAF0"
    }


    switch (mode)
    {
        case 1:
            return lightMode;
        case 2:
            return darkMode;
        default:
            return lightMode;
    }
}