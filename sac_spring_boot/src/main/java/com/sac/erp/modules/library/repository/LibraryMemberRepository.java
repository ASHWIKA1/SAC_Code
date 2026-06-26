package com.sac.erp.modules.library.repository;

import com.sac.erp.modules.library.entity.LibraryMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibraryMemberRepository extends JpaRepository<LibraryMember, Long> {
    Optional<LibraryMember> findByMemberUniqueId(String memberUniqueId);
}
