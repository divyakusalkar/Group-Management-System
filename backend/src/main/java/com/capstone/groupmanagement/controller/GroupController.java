package com.capstone.groupmanagement.controller;

import com.capstone.groupmanagement.dto.ApiResponse;
import com.capstone.groupmanagement.dto.GroupDTO;
import com.capstone.groupmanagement.dto.GroupResponseDTO;
import com.capstone.groupmanagement.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    /**
     * Create a new group
     */
    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponseDTO>> createGroup(
            @Valid @RequestBody GroupDTO groupDTO) {
        GroupResponseDTO createdGroup = groupService.createGroup(groupDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Group created successfully", createdGroup));
    }

    /**
     * Get all groups
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupResponseDTO>>> getAllGroups() {
        List<GroupResponseDTO> groups = groupService.getAllGroups();
        return ResponseEntity.ok(ApiResponse.success("Groups retrieved successfully", groups));
    }

    /**
     * Get a group by ID
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> getGroupById(
            @PathVariable Long groupId) {
        GroupResponseDTO group = groupService.getGroupById(groupId);
        return ResponseEntity.ok(ApiResponse.success("Group retrieved successfully", group));
    }

    /**
     * Update a group name
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody GroupDTO groupDTO) {
        GroupResponseDTO updatedGroup = groupService.updateGroup(groupId, groupDTO);
        return ResponseEntity.ok(ApiResponse.success("Group updated successfully", updatedGroup));
    }

    /**
     * Soft delete a group (set is_active to false)
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@PathVariable Long groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.ok(ApiResponse.success("Group deleted successfully", null));
    }

    /**
     * Toggle group active/inactive status
     */
    @PatchMapping("/{groupId}/toggle-status")
    public ResponseEntity<ApiResponse<GroupResponseDTO>> toggleGroupStatus(
            @PathVariable Long groupId) {
        GroupResponseDTO updatedGroup = groupService.toggleGroupStatus(groupId);
        return ResponseEntity.ok(ApiResponse.success("Group status updated successfully", updatedGroup));
    }
}
