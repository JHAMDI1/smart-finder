package com.smartfinder.lieu.dto;

import lombok.Data;

import java.util.List;

@Data
public class SearchRequestDTO {
    private List<Long> critereIds;
    private Double minNote;
    private String search;
    private String sortBy;
    private Integer page;
    private Integer size;
}
