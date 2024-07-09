package com.github.slowrookie.co.config;


import lombok.extern.slf4j.Slf4j;
import org.apache.dubbo.rpc.*;
import org.camunda.bpm.engine.ProcessEngineConfiguration;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.camunda.bpm.engine.impl.context.Context;
import org.camunda.bpm.engine.impl.interceptor.CommandContext;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
@Slf4j
public class CamundaContextFilter implements Filter {

    @Transactional
    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        TransactionSynchronizationManager.isSynchronizationActive();

        // 获取默认的ProcessEngine
        var processEngine = ProcessEngines.getDefaultProcessEngine();
        ProcessEngineConfiguration processEngineConfiguration = processEngine.getProcessEngineConfiguration();

        // 使用ProcessEngine获取CommandContextFactory
//        var commandContextFactory = processEngine.getProcessEngineConfiguration().get
//        // 创建一个新的CommandContext
//        CommandContext commandContext = commandContextFactory.createCommandContext();

        try {
            ProcessEngineConfigurationImpl processEngineConfigurationImpl = (ProcessEngineConfigurationImpl) processEngine.getProcessEngineConfiguration();
            Context.setProcessEngineConfiguration(processEngineConfigurationImpl);
            // 创建一个新的CommandContext
//            CommandContext commandContext = processEngineConfigurationImpl.getCommandContextFactory().createCommandContext();
//            Context.setCommandContext(commandContext);
            // 设置Camunda的Context
//            Context.setCommandContext(commandContext);
            // 调用下一个Filter或目标方法
            return invoker.invoke(invocation);
        } catch (RpcException e) {
            log.error("Dubbo调用异常", e);
            throw e;
        } catch (Exception e) {
            log.error("Dubbo调用异常", e);
            throw new RpcException(e);
        }
            // 清除Camunda的Context
        finally {
            // 清除Camunda的Context
//            Context.removeCommandContext();
        }
    }
}
