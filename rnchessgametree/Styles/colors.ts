

interface IPalette { 
    primary: string,
    compliment: string,
    triad: string,
    backgound: string,
    text: string,
}

// Mode Keys
// 1: Light Mode
// 2: DarkMode
export default function GetColors(mode: number) : IPalette
{
    const lightMode: IPalette = {
        primary: "#ECA049",
        compliment: "#4995EC",
        triad: "#49eca0",
        backgound: "#FFFFFF",
        text: "#000000"
    }

    const darkMode: IPalette = {
        primary: "#ECA049",
        compliment: "#4995EC",
        triad: "#49eca0",
        backgound: "#FFFAF0",
        text: "#FFFFFF"
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