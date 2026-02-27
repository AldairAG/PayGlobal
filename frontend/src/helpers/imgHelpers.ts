import l1 from "../assets/licencias/l1.png";
import l2 from "../assets/licencias/l2.png";
import l3 from "../assets/licencias/l3.png";
import l4 from "../assets/licencias/l4.png";
import l5 from "../assets/licencias/l5.png";
import l6 from "../assets/licencias/l6.png";
import l7 from "../assets/licencias/l7.png";
import l8 from "../assets/licencias/l8.png";
import l9 from "../assets/licencias/l9.png";
import l10 from "../assets/licencias/l10.png";
import l11 from "../assets/licencias/l11.png";
import l12 from "../assets/licencias/l12.png";
import l13 from "../assets/licencias/l13.png";
import l14 from "../assets/licencias/l14.png"; 

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