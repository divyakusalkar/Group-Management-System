package com.capstone.groupmanagement.service;

import com.capstone.groupmanagement.dto.GroupDTO;
import com.capstone.groupmanagement.dto.GroupResponseDTO;
import com.capstone.groupmanagement.entity.Group;
import com.capstone.groupmanagement.exception.GroupAlreadyExistsException;
import com.capstone.groupmanagement.exception.GroupDeletionException;
import com.capstone.groupmanagement.exception.GroupNotFoundException;
import com.capstone.groupmanagement.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    public GroupResponseDTO createGroup(GroupDTO groupDTO) {
        if (groupRepository.existsByGroupName(groupDTO.getGroupName().trim())) {
            throw new GroupAlreadyExistsException(
                    "Group with name '" + groupDTO.getGroupName().trim() + "' already exists");
        }

        Group group = new Group();
        group.setGroupName(groupDTO.getGroupName().trim());
        group.setIsActive(true);

        Group savedGroup = groupRepository.save(group);
        return mapToResponseDTO(savedGroup);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupResponseDTO> getAllGroups() {
        return groupRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupResponseDTO getGroupById(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(
                        "Group not found with ID: " + groupId));
        return mapToResponseDTO(group);
    }

    @Override
    public GroupResponseDTO updateGroup(Long groupId, GroupDTO groupDTO) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(
                        "Group not found with ID: " + groupId));

        if (groupRepository.existsByGroupNameAndGroupIdNot(
                groupDTO.getGroupName().trim(), groupId)) {
            throw new GroupAlreadyExistsException(
                    "Group with name '" + groupDTO.getGroupName().trim() + "' already exists");
        }

        group.setGroupName(groupDTO.getGroupName().trim());
        Group updatedGroup = groupRepository.save(group);
        return mapToResponseDTO(updatedGroup);
    }

    @Override
    public void deleteGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(
                        "Group not found with ID: " + groupId));

        if (!group.getIsActive()) {
            throw new GroupDeletionException(
                    "Group '" + group.getGroupName() + "' is already inactive");
        }

        group.setIsActive(false);
        groupRepository.save(group);
    }

    @Override
    public GroupResponseDTO toggleGroupStatus(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException(
                        "Group not found with ID: " + groupId));

        group.setIsActive(!group.getIsActive());
        Group updatedGroup = groupRepository.save(group);
        return mapToResponseDTO(updatedGroup);
    }

    private GroupResponseDTO mapToResponseDTO(Group group) {
        return new GroupResponseDTO(
                group.getGroupId(),
                group.getGroupName(),
                group.getIsActive(),
                group.getCreatedAt(),
                group.getUpdatedAt()
        );
    }
}
