package com.sac.erp.modules.inventory.service;

import com.sac.erp.modules.inventory.entity.ItemReceiveChild;
import java.util.List;

public interface ItemReceiveChildService {
    List<ItemReceiveChild> getAll();
    ItemReceiveChild getById(Long id);
    ItemReceiveChild create(ItemReceiveChild entity);
    ItemReceiveChild update(Long id, ItemReceiveChild entity);
    void delete(Long id);
}
