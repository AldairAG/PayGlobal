
const TraducirEstadoOperacionEs = (estado: string): string => {
    switch (estado) {
        case "PENDIENTE":
            return "Pendiente";
        case "COMPLETADA":
            return "Completada";
        case "FALLIDA":
            return "Fallida";
        case "APROBADA":
            return "Aprobada";
        case "RECHAZADA":
            return "Rechazada";
        default:
            return estado;
    }
};

const TraducirEstadoOperacionFr = (estado: string): string => {
    switch (estado) {
        case "PENDIENTE":
            return "En attente";
        case "COMPLETADA":
            return "Terminé";
        case "FALLIDA":
            return "Échoué";
        case "APROBADA":
            return "Approuvé";
        case "RECHAZADA":
            return "Rejeté";
        default:
            return estado;
    }
}

const TraducirEstadoOperacionPt = (estado: string): string => {
    switch (estado) {
        case "PENDIENTE":
            return "Pendente";
        case "COMPLETADA":
            return "Concluída";
        case "FALLIDA":
            return "Falhou";
        case "APROBADA":
            return "Aprovada";
        case "RECHAZADA":
            return "Rejeitada";
        default:
            return estado;
    }
}

const TraducirEstadoOperacionAr = (estado: string): string => {
    switch (estado) {
        case "PENDIENTE":
            return "قيد الانتظار";
        case "COMPLETADA":
            return "مكتمل";
        case "FALLIDA":
            return "فشل";
        case "APROBADA":
            return "موافق عليه";
        case "RECHAZADA":
            return "مرفوض";
        default:
            return estado;
    }
}

const TraducirEstadoOperacionEn = (estado: string): string => {
    switch (estado) {
        case "PENDIENTE":
            return "Pending";
        case "COMPLETADA":
            return "Completed";
        case "FALLIDA":
            return "Failed";
        case "APROBADA":
            return "Approved";
        case "RECHAZADA":
            return "Rejected";
        default:
            return estado;
    }
}

export const TraducirEstadoOperacion = (estado: string, idioma: string): string => {

    switch (idioma) {
        case "es":
            return TraducirEstadoOperacionEs(estado);
        case "fr":
            return TraducirEstadoOperacionFr(estado);
        case "pt":
            return TraducirEstadoOperacionPt(estado);
        case "ar":
            return TraducirEstadoOperacionAr(estado);  
        case "en":
            return TraducirEstadoOperacionEn(estado);      
        default:
            return estado;
    }
};


const TraducirConceptoEs = (concepto: string): string => {
    switch (concepto) {
        case "BONO_REGISTRO_DIRECTO":
            return "Bono de registro directo";
        case "BONO_REGISTRO_INDIRECTO":
            return "Bono de registro indirecto";   
        case "BONO_REONOVACION_LICENCIA":
            return "Bono de renovación de licencia";
        case "BONO_UNINIVEL":
            return "Bono uninivel";
        case "BONO_RANGO":
            return "Bono de rango";
        case "INGRESO_PASIVO":
            return "Ingreso pasivo";
        case "BONO_ANUAL":
            return "Bono anual";
        case "BONO_FUNDADOR":
            return "Bono fundador";
        case "COMPRA_LICENCIA_DELEGADA":
            return "Compra de licencia delegada";
        case "COMPRA_LICENCIA":
            return "Compra de licencia";
        case "RETIRO_FONDOS":
            return "Retiro de fondos";
        case "TRANSFERENCIA_ENTRE_USUARIOS":
            return "Transferencia entre usuarios";                                        
        default:
            return concepto;
    }
};

const TraducirConceptoFr = (concepto: string): string => {
    switch (concepto) {
        case "BONO_REGISTRO_DIRECTO":  
            return "Bonus d'enregistrement direct";
        case "BONO_REGISTRO_INDIRECTO":
            return "Bonus d'enregistrement indirect";
        case "BONO_REONOVACION_LICENCIA":
            return "Bonus de renouvellement de licence";    
        case "BONO_UNINIVEL":
            return "Bonus unilevel";
        case "BONO_RANGO":
            return "Bonus de rang";
        case "INGRESO_PASIVO":            
            return "Revenu passif";
        case "BONO_ANUAL":
            return "Bonus annuel";
        case "BONO_FUNDADOR":
            return "Bonus fondateur";
        case "COMPRA_LICENCIA_DELEGADA":
            return "Achat de licence déléguée";
        case "COMPRA_LICENCIA":
            return "Achat de licence";
        case "RETIRO_FONDOS":            
            return "Retrait de fonds";
        case "TRANSFERENCIA_ENTRE_USUARIOS":
            return "Transfert entre utilisateurs";      
        default:
            return concepto;
    }
};

const TraducirConceptoPt = (concepto: string): string => {
    switch (concepto) {
        case "BONO_REGISTRO_DIRECTO":
            return "Bônus de registro direto";
        case "BONO_REGISTRO_INDIRECTO":
            return "Bônus de registro indireto";
        case "BONO_REONOVACION_LICENCIA":
            return "Bônus de renovação de licença";
        case "BONO_UNINIVEL":
            return "Bônus unilevel";
        case "BONO_RANGO":
            return "Bônus de faixa";
        case "INGRESO_PASIVO":
            return "Renda passiva";
        case "BONO_ANUAL":
            return "Bônus anual";
        case "BONO_FUNDADOR":
            return "Bônus fundador";
        case "COMPRA_LICENCIA_DELEGADA":
            return "Compra de licença delegada";
        case "COMPRA_LICENCIA":
            return "Compra de licença";    
        case "RETIRO_FONDOS":
            return "Retirada de fundos";
        case "TRANSFERENCIA_ENTRE_USUARIOS":
            return "Transferência entre usuários";                                        
        default:
            return concepto;
    }
};

const TraducirConceptoAr = (concepto: string): string => {
    switch (concepto) {
        case "BONO_REGISTRO_DIRECTO":
            return "مكافأة التسجيل المباشر";
        case "BONO_REGISTRO_INDIRECTO":
            return "مكافأة التسجيل غير المباشر";
        case "BONO_REONOVACION_LICENCIA":
            return "مكافأة تجديد الترخيص";
        case "BONO_UNINIVEL":
            return "مكافأة أحادية المستوى";
        case "BONO_RANGO":
            return "مكافأة الرتبة";
        case "INGRESO_PASIVO":
            return "دخل سلبي";
        case "BONO_ANUAL":
            return "مكافأة سنوية";
        case "BONO_FUNDADOR":   
            return "مكافأة المؤسس";
        case "COMPRA_LICENCIA_DELEGADA":
            return "شراء ترخيص مفوض";
        case "COMPRA_LICENCIA":
            return "شراء ترخيص";
        case "RETIRO_FONDOS":            
            return "سحب الأموال";
        case "TRANSFERENCIA_ENTRE_USUARIOS":
            return "تحويل بين المستخدمين";
        default:
            return concepto;
    }   
};

const TraducirConceptoEn = (concepto: string): string => {
    switch (concepto) {
        case "BONO_REGISTRO_DIRECTO":   
            return "Direct Registration Bonus";
        case "BONO_REGISTRO_INDIRECTO":
            return "Indirect Registration Bonus";
        case "BONO_REONOVACION_LICENCIA":
            return "License Renewal Bonus";
        case "BONO_UNINIVEL":
            return "Unilevel Bonus";
        case "BONO_RANGO":
            return "Rank Bonus";
        case "INGRESO_PASIVO":
            return "Passive Income";
        case "BONO_ANUAL":
            return "Annual Bonus";
        case "BONO_FUNDADOR":
            return "Founder Bonus";
        case "COMPRA_LICENCIA_DELEGADA":
            return "Delegated License Purchase";
        case "COMPRA_LICENCIA":
            return "License Purchase";
        case "RETIRO_FONDOS":            
            return "Funds Withdrawal";
        case "TRANSFERENCIA_ENTRE_USUARIOS":
            return "Transfer Between Users";
        default:
            return concepto;
    }
};

export const TraducirConcepto = (concepto: string, idioma: string): string => {
    switch (idioma) {
        case "es":
            return TraducirConceptoEs(concepto);
        case "fr":
            return TraducirConceptoFr(concepto);
        case "pt":
            return TraducirConceptoPt(concepto);
        case "ar":
            return TraducirConceptoAr(concepto);
        case "en":
            return TraducirConceptoEn(concepto);
        default:
            return concepto;
    }
}