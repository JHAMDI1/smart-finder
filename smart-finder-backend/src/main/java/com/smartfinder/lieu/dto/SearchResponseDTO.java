package com.smartfinder.lieu.dto;

import lombok.Data;

import java.util.List;

@Data
public class SearchResponseDTO {
    private List<LieuDTO> content;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer size;
}
