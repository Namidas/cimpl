<template>
  <div
    :class="pageClassess"
    :data-name="name"
  >
    <q-layout
      :view="viewDefinition"
      class="cimpl-page-layout"
      :container="containerized"
      :style="layoutStyles"
      ref="pageLayout"
    >
      <slot name="header-pre" />
      <slot
        name="header"
        v-if="header"
      >
        <CImplPageHeader
          v-bind="headerProxyParsed"
          v-model="innerHeaderModel"
          ref="header"
        >
          <template #pre>
            <q-resize-observer @resize="onResizeHeader" />
          </template>
          <template #toolbar-extra>
            <slot name="header-toolbar-extra-before" />
            <slot name="header-toolbar-extra">
              <!--<q-btn
                                flat
                                round
                                dense
                                icon="view_week"
                                @click="$melon.cloneView(this)"
                                class="header-tool-clone-view"
                                ref="tool-clone-view"
                            >
                                <q-tooltip>{{$t('gen.actions.sideview_show_in')}}</q-tooltip>
                            </q-btn>-->

              <!--<q-btn
                                flat
                                round
                                dense
                                icon="view_in_ar"
                                @click="$melon.saveView(this)"
                                class="header-tool-save-view"
                                ref="tool-save-view"
                            >
                                <q-tooltip>{{$t('gen.actions.save_current_view')}}</q-tooltip>
                            </q-btn>

                            <q-btn
                                flat
                                round
                                dense
                                icon="share"
                                @click="$melon.shareView(this)"
                                class="header-tool-share-view"
                                ref="tool-share-view"
                            >
                                <q-tooltip>{{$t('gen.actions.share_current_view')}}</q-tooltip>
                            </q-btn>-->
            </slot>
            <slot name="header:toolbar-extra-after" />
          </template>

          <template
            v-for="slotName in headerSlots"
            :key="slotName"
            :name="slotName"
            v-slot:[slotName]
          >
            <slot
              :name="`header:${slotName}`"
              :context="instance"
            ></slot>
          </template>
        </CImplPageHeader>
      </slot>
      <slot name="header-post" />

      <slot
        name="left-drawer"
        v-if="leftDrawer"
      >
        <q-drawer
          v-model="innerLeftDrawerModel"
          side="left"
          v-bind="leftDrawerProxyParsed"
          :style="drawerStyle_FN('left')"
          :overlay="false"
          behavior="desktop"
        >
          <!--<q-scroll-area class="fit">-->
          <!--leftDrawerTabsModel: {{leftDrawerTabsModel}}<br />
                        innerLeftDrawerTabsModel: {{innerLeftDrawerTabsModel}}-->
          <slot
            name="left-drawer-tabs"
            v-if="leftDrawerTabs !== false"
          >
            <q-scroll-area class="tabs-scroll-area fit">
              <!--<q-tabs
                                    v-model="innerLeftDrawerTabsModel"
                                    @update:modelValue="(newValue) => $emit('update:leftDrawerTabsModel',newValue)"
                                    v-bind="leftDrawerTabsProxyParsed"
                                    ref="leftDrawerTabsComponent"
                                    :stretch="false"
                                    :shrink="true"
                                    outside-arrows
                                    mobile-arrows
                                    class="cimpl-page-drawer-tabs drawer-left"
                                    :style="drawerTabsStyle_FN('left')"
                                    v-life-cycle="{
                                        mounted: onWindowResize,
                                        beforeUnmount: onWindowResize,
                                    }"
                                    >
                                    <slot :name="`tab-${tabName}`" v-for="(tabData,tabName) in leftDrawerTabsParsed" :key="tabName">
                                        <q-tab v-bind="drawerTabDataProxy(tabData,tabName)">
                                            <slot :name="`left-drawer-tabs-${tabName}`"></slot>
                                        </q-tab>
                                    </slot>
                                </q-tabs>-->
              <q-list
                padding
                class="cimpl-page-drawer-tabs drawer-left tabs-as-list"
              >
                <div
                  class="cimpl-page-drawer-tabs-tab-item-wrapper"
                  :class="`${innerLeftDrawerTabsModel === tabName ? 'current' : ''}`"
                  v-for="(tabData,tabName) in leftDrawerTabsParsed"
                  :key="tabName"
                >
                  <q-item
                    clickable
                    @click="$emit('update:leftDrawerTabsModel',tabName)"
                    :style="`border-color: var(--q-${tabData.color});`"
                    class="cimpl-page-drawer-tabs-tab-item"
                    :class="`${innerLeftDrawerTabsModel === tabName ? 'current' : 'text-grey-6'}`"
                    :active="false"
                    :active-class="`text-${tabData.color}`"
                    :disable="tabData.disable"
                  >
                    <q-item-section avatar>
                      <q-icon
                        :color="innerLeftDrawerTabsModel === tabName ? tabData.color : 'grey-6'"
                        :name="tabData.icon"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ tabData.label }}</q-item-label>
                    </q-item-section>
                    <slot :name="`left-drawer-tabs-${tabName}`" />
                  </q-item>
                  <q-separator />
                </div>
              </q-list>
              <!--page - model: {{innerLeftDrawerTabsModel}}-->
              <!--<cimpl-tabs
                                    :model-value="innerLeftDrawerTabsModel"
                                    @update:model-value="newValue => $emit('update:leftDrawerTabsModel',newValue)"
                                    :map="innerLeftDrawerTabsMap"
                                    :tabs="leftDrawerTabs ? leftDrawerTabs : []"
                                    @trigger:overview="leftDrawerTabsTriggerOverview"
                                    ref="leftDrawerTabs"
                                    />-->
            </q-scroll-area>
          </slot>
          <slot name="left-drawer-inner" />
          <!--</q-scroll-area>-->
        </q-drawer>
      </slot>

      <slot
        name="right-drawer"
        v-if="rightDrawer"
      >
        <q-drawer
          v-model="innerRightDrawerModel"
          side="right"
          bordered
          v-bind="rightDrawerProxyParsed"
        >
          <slot name="right-drawer-inner">
            <h2>default right drawer content</h2>
          </slot>
        </q-drawer>
      </slot>

      <!--header<vue-json-pretty :data="header" class="col-12" />
            header options
            <vue-json-pretty :data="headerOptions" class="col-12" />
            header proxy final
            <vue-json-pretty :data="headerProxy" class="col-12" />-->

      <!-- page INNER footer
            <vue-json-pretty :data="footer" class="col-12" />

            page INNER footerOptions
            <vue-json-pretty :data="footerOptions" class="col-12" />-->

      <q-page-container
        class="cimpl-page-q-container"
        ref="qPageContainer"
      >
        <!--<q-resize-observer @resize="onResizePageContainer" />-->
        <!--<q-scroll-area class="cimpl-page-view-scroll-area" :style="mainScrollAreaStyles">-->
        <!--<q-page :style-fn="pageContentsStyle_FN">-->
        <q-page
          class="cimpl-q-page"
          :style-fn="pageContentsStyle_FN"
        >
          <!--<div class="flex row justify-between" style="border: 1px solid #dadada; padding:10px;">
                            <q-toggle label="cimpl-page toggleHeaderModel" v-model="innerHeaderModel" @update:model-value="toggleHeaderModel" />
                            <q-toggle label="cimpl-page toggleFooterModel" v-model="innerFooterModel" @update:model-value="toggleFooterModel" />
                            <q-separator spaced style="width: 100%" />
                            <q-toggle label="cimpl-page toggleLeftDrawerModel" v-model="innerLeftDrawerModel" @update:model-value="toggleLeftDrawerModel" />
                            <q-toggle label="cimpl-page toggleRightDrawerModel" v-model="innerRightDrawerModel" @update:model-value="toggleRightDrawerModel" />
                        </div>-->
          <slot name="content-pre" />
          <slot name="content">
            <slot name="content-before" />
            <slot name="content-inner">
              <div
                class="cimpl-page-content inner"
                :class="contentClass"
                ref="pageContent"
                :style="contentStyleParsed"
              >
                <slot></slot>
                <!--<span>
                                    {{viewDefinition}} // {{footer}} / {{innerFooterModel}}
                                    ///  {{contentPadding}}
                                </span>-->
                <q-resize-observer @resize="onResizePageContainer" />
              </div>
            </slot>
            <slot name="content-after" />
          </slot>
          <slot name="content-post" />
        </q-page>
        <!--</q-scroll-area>-->
      </q-page-container>

      <slot name="footer-pre" />
      <slot
        name="footer"
        v-if="footer"
      >
        <q-footer
          v-bind="footerProxyParsed"
          v-model="innerFooterModel"
        >
          <q-resize-observer @resize="onResizeFooter" />
          <slot name="footer-inner">
            <span>default footer-inner slot for cimpl-page, shouldn't be here</span>
          </slot>

          <template
            v-for="slotName in footerSlots"
            :key="slotName"
            :name="slotName"
            v-slot:[slotName]
          >
            <slot :name="`footer:${slotName}`"></slot>
          </template>
        </q-footer>
      </slot>
      <slot name="footer-post" />
    </q-layout>
  </div>
</template>

<script src="./page/component.js"></script>
