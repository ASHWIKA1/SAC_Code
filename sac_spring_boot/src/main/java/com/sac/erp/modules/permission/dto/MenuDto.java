package com.sac.erp.modules.permission.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class MenuDto {
    private Long id;
    private String name;
    private String route;
    private String icon;
    private Integer position;
    private Long parentId;
    private List<MenuDto> children = new ArrayList<>();
}
