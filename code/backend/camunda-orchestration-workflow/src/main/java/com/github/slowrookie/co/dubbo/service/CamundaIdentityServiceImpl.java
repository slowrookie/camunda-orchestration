package com.github.slowrookie.co.dubbo.service;

import com.github.slowrookie.co.dubbo.api.ICamundaIdentityService;
import jakarta.annotation.Resource;
import org.apache.dubbo.config.annotation.DubboService;
import org.camunda.bpm.engine.IdentityService;
import org.camunda.bpm.engine.identity.*;
import org.camunda.bpm.engine.impl.identity.Account;
import org.camunda.bpm.engine.impl.identity.Authentication;

import java.util.List;
import java.util.Map;


@DubboService
public class CamundaIdentityServiceImpl implements ICamundaIdentityService {

    @Resource
    private IdentityService identityService;

    @Override
    public boolean isReadOnly() {
        return identityService.isReadOnly();
    }

    @Override
    public User newUser(String userId) {
        return identityService.newUser(userId);
    }

    @Override
    public void saveUser(User user) {
        identityService.saveUser(user);
    }

    @Override
    public UserQuery createUserQuery() {
        return identityService.createUserQuery();
    }

    @Override
    public void deleteUser(String userId) {
        identityService.deleteUser(userId);
    }

    @Override
    public void unlockUser(String userId) {
        identityService.unlockUser(userId);
    }

    @Override
    public Group newGroup(String groupId) {
        Group group = identityService.newGroup(groupId);
        return group;
    }

    @Override
    public NativeUserQuery createNativeUserQuery() {
        return identityService.createNativeUserQuery();
    }

    @Override
    public GroupQuery createGroupQuery() {
        return identityService.createGroupQuery();
    }

    @Override
    public void saveGroup(Group group) {
        identityService.saveGroup(group);
    }

    @Override
    public void deleteGroup(String groupId) {
        identityService.deleteGroup(groupId);
    }

    @Override
    public void createMembership(String userId, String groupId) {
        identityService.createMembership(userId, groupId);
    }

    @Override
    public void deleteMembership(String userId, String groupId) {
        identityService.deleteMembership(userId, groupId);
    }

    @Override
    public Tenant newTenant(String tenantId) {
        return identityService.newTenant(tenantId);
    }

    @Override
    public TenantQuery createTenantQuery() {
        return identityService.createTenantQuery();
    }

    @Override
    public void saveTenant(Tenant tenant) {
        identityService.saveTenant(tenant);
    }

    @Override
    public void deleteTenant(String tenantId) {
        identityService.deleteTenant(tenantId);
    }

    @Override
    public void createTenantUserMembership(String tenantId, String userId) {
        identityService.createTenantUserMembership(tenantId, userId);
    }

    @Override
    public void createTenantGroupMembership(String tenantId, String groupId) {
        identityService.createTenantGroupMembership(tenantId, groupId);
    }

    @Override
    public void deleteTenantUserMembership(String tenantId, String userId) {
        identityService.deleteTenantUserMembership(tenantId, userId);
    }

    @Override
    public void deleteTenantGroupMembership(String tenantId, String groupId) {
        identityService.deleteTenantGroupMembership(tenantId, groupId);
    }

    @Override
    public boolean checkPassword(String userId, String password) {
        return identityService.checkPassword(userId, password);
    }

    @Override
    public PasswordPolicyResult checkPasswordAgainstPolicy(String password) {
        return identityService.checkPasswordAgainstPolicy(password);
    }

    @Override
    public PasswordPolicyResult checkPasswordAgainstPolicy(String candidatePassword, User user) {
        return identityService.checkPasswordAgainstPolicy(candidatePassword, user);
    }

    @Override
    public PasswordPolicyResult checkPasswordAgainstPolicy(PasswordPolicy policy, String password) {
        return identityService.checkPasswordAgainstPolicy(policy, password);
    }

    @Override
    public PasswordPolicyResult checkPasswordAgainstPolicy(PasswordPolicy policy, String candidatePassword, User user) {
        return identityService.checkPasswordAgainstPolicy(policy, candidatePassword, user);
    }

    @Override
    public PasswordPolicy getPasswordPolicy() {
        return identityService.getPasswordPolicy();
    }

    @Override
    public void setAuthenticatedUserId(String authenticatedUserId) {
        identityService.setAuthenticatedUserId(authenticatedUserId);
    }

    @Override
    public void setAuthentication(String userId, List<String> groups) {
        identityService.setAuthentication(userId, groups);
    }

    @Override
    public void setAuthentication(String userId, List<String> groups, List<String> tenantIds) {
        identityService.setAuthentication(userId, groups, tenantIds);
    }

    @Override
    public void setAuthentication(Authentication currentAuthentication) {
        identityService.setAuthentication(currentAuthentication);
    }

    @Override
    public Authentication getCurrentAuthentication() {
        return identityService.getCurrentAuthentication();
    }

    @Override
    public void clearAuthentication() {
        identityService.clearAuthentication();
    }

    @Override
    public void setUserPicture(String userId, Picture picture) {
        identityService.setUserPicture(userId, picture);
    }

    @Override
    public Picture getUserPicture(String userId) {
        return identityService.getUserPicture(userId);
    }

    @Override
    public void deleteUserPicture(String userId) {
        identityService.deleteUserPicture(userId);
    }

    @Override
    public void setUserInfo(String userId, String key, String value) {
        identityService.setUserInfo(userId, key, value);
    }

    @Override
    public String getUserInfo(String userId, String key) {
        return identityService.getUserInfo(userId, key);
    }

    @Override
    public List<String> getUserInfoKeys(String userId) {
        return identityService.getUserInfoKeys(userId);
    }

    @Override
    public void deleteUserInfo(String userId, String key) {
        identityService.deleteUserInfo(userId, key);
    }

    @Override
    public void setUserAccount(String userId, String userPassword, String accountName, String accountUsername, String accountPassword, Map<String, String> accountDetails) {
        identityService.setUserAccount(userId, userPassword, accountName, accountUsername, accountPassword, accountDetails);
    }

    @Override
    public List<String> getUserAccountNames(String userId) {
        return identityService.getUserAccountNames(userId);
    }

    @Override
    public Account getUserAccount(String userId, String userPassword, String accountName) {
        return identityService.getUserAccount(userId, userPassword, accountName);
    }

    @Override
    public void deleteUserAccount(String userId, String accountName) {
        identityService.deleteUserAccount(userId, accountName);
    }
}
