<script src="./table/component.js">
/* eslint-disable no-trailing-spaces */
</script>

<template>
  <div class="cimpl-table-wrapper">
    <q-btn @click="getRows">{{innerLabelGet('GET ROWS',true,false)}}</q-btn>

    <!--<vue-json-pretty :data="{innerColumns}" />-->

    <!--<slot name="options-pre" />
    <cimpl-table-options
      />
    <slot name="options-post" />-->

    <!--<slot name="filters-pre" />
    <cimpl-table-filters
      :columns="qCompoPropsProxy.columns"
      :filters="currentFilters"
      @update="(payload) => columnFilterUpdate(payload.column,payload.value)"
      @clear="(payload) => columnFilterUpdate(payload)"
      />
    <slot name="filters-post" />-->

    <slot name="table-pre" />
    
    <!--<br />
    innerRows: {{innerRows}}<br />
    inner pagination: {{innerPagination}}<br />
    currentFilters: {{currentFilters}}-->

    <q-table
      v-bind="qCompoPropsProxy"
      v-model:pagination="innerPagination"
      @update:pagination="onUpdatePagination"
      @request="onTableRequest"
      class="cimpl-table"
      >

      <template #no-data="scope" v-if="$slots['no-data']">
        <slot name="no-data" v-bind="scope" />
      </template>

      <template v-slot:body-selection="scope">
        <slot name="body-selection" :scope="scope">
          <q-checkbox v-model="scope.selected" />
        </slot>
      </template>

      <template #top="scope">
        <slot v-bind="scope" name="top" />
      </template>

      <!-- this one used for "Item" view ? -->
      <template v-slot:item="props">
        <slot name="item" :props="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
            <q-card>
              <q-card-section>
                <q-checkbox dense v-model="props.selected" :label="props.row.name" />
              </q-card-section>
              <q-separator />
              <q-list dense>
                <q-item v-for="col in columnsComputed" :key="col.name">
                  <div class="q-table__grid-item-row">
                    <div class="q-table__grid-item-title">{{ col.label }}</div>
                    <div class="q-table__grid-item-value">{{ props.row[col.name] }}</div>
                  </div>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </slot>
      </template>

      <template v-slot:header-cell="props">
        <cimpl-table-th
          :props="props"
          :filter="currentFilters[props.col.name]"
          @filter:update="(payload) => columnFilterUpdate(props.col,payload)"
          @filter:clear="(payload) => columnFilterClear(props.col)"
          />
      </template>

      <template v-slot:body-cell="props">
        <slot :name="`body-cell-${props.col.name}`" :props="props">
          <cimpl-table-td
            :props="props"
            />
        </slot>
      </template>

      <!-- only used when row tools active? -->
      <template v-slot:header-cell-row_tools="props">
        <slot name="header-cell-row_tools" :props="props">
          <cimpl-table-th-row_tools
            />
          </slot>
      </template>

      <!-- only used when row tools active? -->
      <template v-slot:body-cell-row_tools="props">
        <slot name="body-cell-row_tools" :props="props">
          <cimpl-table-td-row_tools
            />
        </slot>
      </template>

      <!-- don't use the default, so we can include page numbers -->
      <template #bottom="scope">
          <div class="cimpl-table-bottom-wrapper">
            <slot name="rows-per-page">
              <div class=".q-table__control">
                recs per page? -{{rowsPerPageLabel}}-
                <q-select
                  class="q-table__select inline q-table__bottom-item"
                  :options="rowsPerPageOptions"
                  v-model="innerPagination.rowsPerPage"
                  hide-bottom-space
                  borderless
                  dense
                  options-dense
                  options-cover
                  @update:model-value="onUpdatePaginationFromQPagination"
                  />
              </div>
            </slot>

          <slot name="pagination-label" v-bind="paginationFromToValues">
            <div class="cimpl-table-pagination-label-wrapper q-table__bottom-item">
              <slot name="pagination-label:inner" v-bind="paginationFromToValues">
                {{stringPaginationLabel}}
              </slot>
              <!--<div>
                <div>{{paginationFromToValues.from}}</div>
                <div>-</div>
                <div>{{paginationFromToValues.to}}</div>
                <div>of</div>
                <div>{{paginationFromToValues.total}}</div>
              </div>-->
            </div>
          </slot>

          <slot name="pagination">
            <div class="cimpl-table-pagination-wrapper q-table__bottom-item">
              <q-pagination
                  boundary-links
                  boundary-numbers
                  direction-links
                  ellipses
                  max-pages="6"
                  input
                  :model-value="scope.pagination.page"
                  @update:model-value="onUpdatePaginationFromQPagination"
                  :max="scope.pagesNumber"
                />
            </div>
          </slot>
        </div>
      </template>
    </q-table>    
    <slot name="table-post" />
  </div>
</template>
