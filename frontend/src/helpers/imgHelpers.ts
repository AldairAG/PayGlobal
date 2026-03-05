import l1 from "../assets/licencias/l1.webp";
import l2 from "../assets/licencias/l2.webp";
import l3 from "../assets/licencias/l3.webp";
import l4 from "../assets/licencias/l4.webp";
import l5 from "../assets/licencias/l5.webp";
import l6 from "../assets/licencias/l6.webp";
import l7 from "../assets/licencias/l7.webp";
import l8 from "../assets/licencias/l8.webp";
import l9 from "../assets/licencias/l9.webp";
import l10 from "../assets/licencias/l10.webp";
import l11 from "../assets/licencias/l11.webp";
import l12 from "../assets/licencias/l12.webp";
import l13 from "../assets/licencias/l13.webp";
import l14 from "../assets/licencias/l14.webp"; 

export const getLicenseImage = (licenseName: string) => {
    const licenseMap: Record<string, string> = {
        "P10": l1,
        "P25": l2,
        "P50": l3,
        "P100": l4,
        "P250": l5,
        "P500": l6,
        "P1000": l7,
        "P2500": l8,
        "P5000": l9,
        "P10000": l10,
        "P15000": l11,
        "P25000": l12,
        "P50000": l13,
        "P100000": l14
    };  
    return licenseMap[licenseName] || l1;
}    