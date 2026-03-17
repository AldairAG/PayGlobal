package com.api.payglobal.helpers;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class FileHelper {
    /**
     * Determina el tipo MIME basándose en la extensión del archivo
     * 
     * @param fileName Nombre del archivo
     * @return Tipo MIME del archivo
     */
    public String determineContentType(String fileName) {
        String lowerCaseFileName = fileName.toLowerCase();

        if (lowerCaseFileName.endsWith(".pdf")) {
            return "application/pdf";
        } else if (lowerCaseFileName.endsWith(".jpg") || lowerCaseFileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerCaseFileName.endsWith(".png")) {
            return "image/png";
        } else if (lowerCaseFileName.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerCaseFileName.endsWith(".bmp")) {
            return "image/bmp";
        } else if (lowerCaseFileName.endsWith(".webp")) {
            return "image/webp";
        } else {
            return "application/octet-stream";
        }
    }
}
