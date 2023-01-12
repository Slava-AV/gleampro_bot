<template>
  <b-dropdown position="is-bottom-left" :triggers="['hover']" aria-role="list">
    <template #trigger>
      <b-button
        label="Export"
        type="is-success"
        icon-right="menu-down"
        icon-left="file-excel"
      />
    </template>
    <b-dropdown-item aria-role="listitem">
      <download-excel
        :data="data"
        type="csv"
        :export-fields="fields"
        :name="'GleamPro-export' + fileName + '-' + $moment().format() + '.csv'"
        class=""
      >
        <i class="fas fa-download fa-sm has-text-gray mr-2"></i> Export to CSV
      </download-excel>
    </b-dropdown-item>
    <b-dropdown-item aria-role="listitem">
      <download-excel
        :data="data"
        type="xls"
        :export-fields="fields"
        worksheet="GleamPro export"
        :name="'GleamPro-export' + fileName + '-' + $moment().format() + '.xls'"
        class=""
      >
        <i class="fas fa-download fa-sm has-text-gray mr-2"></i> Export to XLS
      </download-excel>
    </b-dropdown-item>
  </b-dropdown>
</template>
<script>
export default {
  name: "export",
  props: ["data", "fields", "fileName"],
};
</script>

<style>
</style>
