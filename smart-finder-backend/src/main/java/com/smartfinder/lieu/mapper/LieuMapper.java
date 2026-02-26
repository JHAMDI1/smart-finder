package com.smartfinder.lieu.mapper;

import com.smartfinder.lieu.Lieu;
import com.smartfinder.lieu.dto.LieuDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LieuMapper {

    LieuMapper INSTANCE = Mappers.getMapper(LieuMapper.class);

    @Mapping(target = "criteres", ignore = true)
    LieuDTO toDto(Lieu lieu);

    List<LieuDTO> toDtoList(List<Lieu> lieux);

    Lieu toEntity(LieuDTO lieuDTO);
}
