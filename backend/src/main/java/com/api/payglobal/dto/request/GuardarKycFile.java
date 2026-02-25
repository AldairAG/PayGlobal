package com.api.payglobal.dto.request;

import org.springframework.web.multipart.MultipartFile;

import com.api.payglobal.entity.enums.TipoKycFile;

import lombok.Data;

@Data
public class GuardarKycFile {
    private TipoKycFile fileType;
    private MultipartFile file;
}
