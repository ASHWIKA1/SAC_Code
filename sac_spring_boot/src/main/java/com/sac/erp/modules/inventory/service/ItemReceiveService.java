package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemReceive;
import java.util.List;

public interface ItemReceiveService {
    List<ItemReceive> getAll();
    ItemReceive getById(Long id);
    ItemReceive create(ItemReceive entity);
    ItemReceive update(Long id, ItemReceive entity);
    void delete(Long id);
}
