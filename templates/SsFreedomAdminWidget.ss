<ss-freedom-admin-widget page-id="$ID"
                         page-class-name="$ClassName"
                         stage="$CurrentVersionedStage"
                         <% if $isLiveVersion %>is-published="true"<% end_if %>
                         <% if $canPublish %>can-publish="true"<% end_if %>
                         <% if $canAccessCMS %>cms-edit-link="$CMSEditLink"<% end_if %>>
</ss-freedom-admin-widget>
