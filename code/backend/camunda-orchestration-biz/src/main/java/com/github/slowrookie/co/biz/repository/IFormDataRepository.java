package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface IFormDataRepository extends JpaRepository<FormData, String>, JpaSpecificationExecutor<FormData> {

    List<FormData> findByFormDefDetailIdAndBusinessId(String formDetailId, String businessId);

    List<FormData> findByBusinessId(String businessId);

}
