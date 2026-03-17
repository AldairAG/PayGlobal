package com.api.payglobal.service.kycFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;

    public FileStorageService() {
        this.fileStorageLocation = Paths.get("../../uploads")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio", ex);
        }
    }

    public String storeFile(MultipartFile file, String username, String fileType, String dir) throws IOException {
        // Extraer la extensión del archivo original
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String fileName = String.format("%s_%s_%s%s", username, System.currentTimeMillis(),
                fileType, fileExtension);
        
        // Crear subdirectorio basado en el tipo (kyc, user-images, etc)
        Path dirPath = this.fileStorageLocation.resolve(dir).normalize();
        Files.createDirectories(dirPath);
        
        Path targetLocation = dirPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);
        return fileName;
    }

    public Resource loadFileAsResource(String filePath) throws IOException {
        Path path = this.fileStorageLocation.resolve(filePath).normalize();
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists()) {
            throw new RuntimeException("Archivo no encontrado: " + filePath);
        }
        return resource;
    }
}
