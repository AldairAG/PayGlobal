package com.api.payglobal.service.kycFile;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.payglobal.dto.request.EvaluarKycFileRequest;
import com.api.payglobal.dto.request.GuardarKycFile;
import com.api.payglobal.entity.KycFile;
import com.api.payglobal.entity.Usuario;
import com.api.payglobal.entity.enums.EstadoOperacion;
import com.api.payglobal.repository.KycFileRepository;
import com.api.payglobal.repository.UsuarioRepository;

@Service
public class KycServiceImpl implements KycServicio {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private KycFileRepository kycFileRepository;

    @Override
    @Transactional
    public KycFile guardarKycFile(GuardarKycFile guardarKycFile, Long idUsuario) throws IOException {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String fileName = fileStorageService.storeFile(guardarKycFile.getFile(), usuario.getUsername(), guardarKycFile.getFileType().name());

        KycFile kycFile = KycFile.builder()
                .fileName(fileName)
                .fileType(guardarKycFile.getFileType())
                .fileSize(guardarKycFile.getFile().getSize())
                .estado(EstadoOperacion.PENDIENTE)
                .filePath("uploads/kyc/"+fileName)
                .usuario(usuario)
                .build();

        kycFileRepository.save(kycFile);
        return kycFile;
    }
 
    @Override
    @Transactional
    public void eliminarKycFile(Long id)throws IOException {
        KycFile kycFile = kycFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KYC File no encontrado"));
        fileStorageService.loadFileAsResource(kycFile.getFileName()).getFile().delete();
        kycFileRepository.delete(kycFile);

    }

    @Override
    @Transactional(readOnly = true)
    public List<KycFile> obtenerKycFilePorIdUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return kycFileRepository.findByUsuario_Id(usuario.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KycFile> obtenerKycFilesPorEstado() {
        return kycFileRepository.findByEstado(EstadoOperacion.PENDIENTE);
    }

    @Override
    @Transactional
    public KycFile actualizarEstadoKycFile(Long id, EvaluarKycFileRequest evaluarKycFileRequest) {
        KycFile kycFile = kycFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("KYC File no encontrado"));

        kycFile.setEstado(evaluarKycFileRequest.getNuevoEstado());
        kycFile.setComentarioRechazo(evaluarKycFileRequest.getComentario());
        kycFile.setRazonRechazo(evaluarKycFileRequest.getRazonRechazo());

        if (evaluarKycFileRequest.getNuevoEstado() == EstadoOperacion.APROBADA) {
            kycFile.setVerificationDate(java.time.LocalDateTime.now());
        }

        return kycFileRepository.save(kycFile);
    }

}
