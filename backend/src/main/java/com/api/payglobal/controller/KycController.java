package com.api.payglobal.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.payglobal.dto.request.EvaluarKycFileRequest;
import com.api.payglobal.dto.request.GuardarKycFile;
import com.api.payglobal.entity.KycFile;
import com.api.payglobal.service.kycFile.FileStorageService;
import com.api.payglobal.service.kycFile.KycServicio;

@RestController
@RequestMapping("/api/kyc")
public class KycController {
    
    @Autowired
    private KycServicio kycServicio;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Endpoint para subir un archivo KYC
     * @param guardarKycFile DTO con el archivo y tipo de archivo
     * @param idUsuario ID del usuario
     * @return KycFile guardado
     */
    @PostMapping("/upload/{idUsuario}")
    @PreAuthorize("hasRole('USUARIO')")
    public ResponseEntity<?> uploadKycFile(
            @ModelAttribute GuardarKycFile guardarKycFile,
            @PathVariable Long idUsuario) {
        try {
            KycFile kycFile = kycServicio.guardarKycFile(guardarKycFile, idUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(kycFile);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el archivo: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint para eliminar un archivo KYC
     * @param id ID del archivo KYC
     * @return Mensaje de confirmación
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('USUARIO')")
    public ResponseEntity<?> deleteKycFile(@PathVariable Long id) {
        try {
            kycServicio.eliminarKycFile(id);
            return ResponseEntity.ok("Archivo KYC eliminado exitosamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el archivo: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener todos los archivos KYC de un usuario
     * @param idUsuario ID del usuario
     * @return Lista de archivos KYC
     */
    @GetMapping("/usuario/{idUsuario}")
    @PreAuthorize("hasRole('USUARIO') or hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> getKycFilesByUsuario(@PathVariable Long idUsuario) {
        try {
            List<KycFile> kycFiles = kycServicio.obtenerKycFilePorIdUsuario(idUsuario);
            return ResponseEntity.ok(kycFiles);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint para obtener todos los archivos KYC pendientes de revisión
     * @return Lista de archivos KYC pendientes
     */
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<KycFile>> getKycFilesPendientes() {
        List<KycFile> kycFiles = kycServicio.obtenerKycFilesPorEstado();
        return ResponseEntity.ok(kycFiles);
    }

    /**
     * Endpoint para evaluar y actualizar el estado de un archivo KYC
     * @param id ID del archivo KYC
     * @param evaluarKycFileRequest DTO con el nuevo estado y comentarios
     * @return KycFile actualizado
     */
    @PutMapping("/{id}/evaluar")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> evaluarKycFile(
            @PathVariable Long id,
            @RequestBody EvaluarKycFileRequest evaluarKycFileRequest) {
        try {
            KycFile kycFile = kycServicio.actualizarEstadoKycFile(id, evaluarKycFileRequest);
            return ResponseEntity.ok(kycFile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    /**
     * Endpoint para descargar/visualizar un archivo KYC
     * @param fileName Nombre del archivo
     * @return Archivo como Resource
     */
    @GetMapping("/file/{fileName}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or hasRole('USUARIO')")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            
            String contentType = "application/octet-stream";
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
