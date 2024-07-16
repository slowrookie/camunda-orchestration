package com.github.slowrookie.co.biz.repository;

import com.github.slowrookie.co.biz.model.FormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface IFormDataRepository extends JpaRepository<FormData, String>, JpaSpecificationExecutor<FormData> {

    List<FormData> findByBusinessId(String businessId);

    List<FormData> findByProcessInstanceIdAndTaskId(String processInstanceId, String taskId);

    boolean existsByBusinessIdAndFormDefDetailId(String businessId, String formDefDetailId);

    boolean existsByBusinessIdAndTaskIdAndFormDefDetailId(String businessId, String taskId, String formDefDetailId);

}
