package com.smartfinder.lieu;

import com.smartfinder.lieu.dto.LieuDTO;
import com.smartfinder.lieu.dto.SearchRequestDTO;
import com.smartfinder.lieu.dto.SearchResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LieuSearchService {

    private final LieuRepository lieuRepository;

    public SearchResponseDTO search(SearchRequestDTO request) {
        Specification<Lieu> spec = LieuSpecifications.buildSearchSpecification(
                request.getCritereIds(),
                request.getMinNote(),
                request.getSearch()
        );

        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 20;
        Pageable pageable = PageRequest.of(page, size);

        Page<Lieu> resultPage = lieuRepository.findAll(spec, pageable);

        SearchResponseDTO response = new SearchResponseDTO();
        response.setContent(resultPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList()));
        response.setTotalElements(resultPage.getTotalElements());
        response.setTotalPages(resultPage.getTotalPages());
        response.setCurrentPage(resultPage.getNumber());
        response.setSize(resultPage.getSize());

        return response;
    }

    private LieuDTO mapToDTO(Lieu lieu) {
        LieuDTO dto = new LieuDTO();
        dto.setId(lieu.getId());
        dto.setNom(lieu.getNom());
        dto.setAdresse(lieu.getAdresse());
        dto.setDescription(lieu.getDescription());
        dto.setLatitude(lieu.getLatitude());
        dto.setLongitude(lieu.getLongitude());
        dto.setHoraires(lieu.getHoraires());
        dto.setNoteMoyenne(lieu.getNoteMoyenne());
        dto.setCreatedAt(lieu.getCreatedAt());

        if (lieu.getLieuCriteres() != null) {
            dto.setCriteres(lieu.getLieuCriteres().stream()
                    .map(lc -> {
                        com.smartfinder.critere.dto.CritereDTO cdto = new com.smartfinder.critere.dto.CritereDTO();
                        cdto.setId(lc.getCritere().getId());
                        cdto.setNom(lc.getCritere().getNom());
                        cdto.setDescription(lc.getCritere().getDescription());
                        cdto.setCategorie(lc.getCritere().getCategorie());
                        cdto.setIcon(lc.getCritere().getIcon());
                        return cdto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
