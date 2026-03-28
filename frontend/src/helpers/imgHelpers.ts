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
import l15 from "../assets/licencias/l15.webp";


//Imagenes de rangos
import rango1 from "../assets/rangos/rango1.png";
import rango2 from "../assets/rangos/rango2.png";
import rango3 from "../assets/rangos/rango3.png";
import rango4 from "../assets/rangos/rango4.png";
import rango5 from "../assets/rangos/rango5.png";
import rango6 from "../assets/rangos/rango6.png";
import rango7 from "../assets/rangos/rango7.png";
import rango8 from "../assets/rangos/rango8.png";
import rango9 from "../assets/rangos/rango9.png";
import rango10 from "../assets/rangos/rango10.png";

const RANKS = {
    rango0: {nombre:"SIN RANGO",imagen:rango1},
    rango1: {nombre:"SENIOR MANAGER",imagen:rango1},
    rango2: {nombre:"EXECUTIVE DIRECTOR",imagen:rango2},
    rango3: {nombre:"DIAMOND TEAM",imagen:rango3},
    rango4: {nombre:"DOUBLE_DIAMOND",imagen:rango4},
    rango5: {nombre:"TRIPLE_DIAMOND",imagen:rango5},
    rango6: {nombre:"PRESIDENT TEAM",imagen:rango6},
    rango7: {nombre:"PRESIDENT BLACK DIAMOND",imagen:rango7},
    rango8: {nombre:"CROWN BLACK DIAMOND",imagen:rango8},
    rango9: {nombre:"AMBASSADOR",imagen:rango9},
    rango10: {nombre:"GLOBAL AMBASSADOR",imagen:rango10},
};

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
        "P15000": l14,
        "P25000": l11,
        "P50000": l12,
        "P100000": l13,
        "P7500": l15
    };  
    return licenseMap[licenseName] || l1;
}    


export const getRankImage = (rankName: string) => {
    // Primero intentar buscar directamente por clave (rango0, rango1, etc.)
    const directMatch = RANKS[rankName as keyof typeof RANKS];
    if (directMatch) return directMatch.imagen;
    
    // Si no encuentra, buscar por nombre (convirtiendo guiones bajos a espacios)
    const normalizedName = rankName.replace(/_/g, ' ').toUpperCase();
    const matchByName = Object.values(RANKS).find(
        rank => rank.nombre.toUpperCase() === normalizedName
    );
    
    return matchByName?.imagen || rango1;
}