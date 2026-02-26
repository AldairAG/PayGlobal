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
        this.fileStorageLocation = Paths.get("../../uploads/kyc")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("No se pudo crear el directorio", ex);
        }
    }

    public String storeFile(MultipartFile file, String username, String fileType) throws IOException {
        // Extraer la extensión del archivo original
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        String fileName = String.format("%s_%s_%s%s", username, System.currentTimeMillis(),
                fileType, fileExtension);
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);
        return fileName;
    }

    public Resource loadFileAsResource(String fileName) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        return resource;
    }
}
