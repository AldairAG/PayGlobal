package com.api.payglobal.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasDTO {
    private List<UsuariosNuevosDTO> usuariosNuevosMes;
    private GananciasLicenciasDTO gananciasLicencias;
    private ComisionesRetirosDTO comisionesRetiros;
    private List<UsuariosPorLicenciaDTO> usuariosPorLicencia;
}
