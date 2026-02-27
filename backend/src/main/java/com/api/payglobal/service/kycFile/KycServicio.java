package com.api.payglobal.service.kycFile;

import java.io.IOException;
import java.util.List;

import com.api.payglobal.dto.request.EvaluarKycFileRequest;
import com.api.payglobal.dto.request.GuardarKycFile;
import com.api.payglobal.entity.KycFile;

public interface KycServicio {
    KycFile guardarKycFile(GuardarKycFile guardarKycFile, Long idUsuario) throws IOException;
    void eliminarKycFile(Long id)throws IOException;
    List<KycFile> obtenerKycFilePorIdUsuario(Long id);
    List<KycFile> obtenerKycFilesPorEstado();
    KycFile actualizarEstadoKycFile(Long id, EvaluarKycFileRequest evaluarKycFileRequest);
    
}
