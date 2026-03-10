<template>
    <q-header class="cimpl-page-header">
        <slot name="pre" />
        <div class="cimpl-page-header-wrapper full-width">
            <q-toolbar>
                <slot name="icon"><q-btn flat round dense :icon="icon" v-if="icon !== undefined" /></slot>
                <slot name="title">
                    <q-toolbar-title class="flex no-wrap items-center" v-if="typeof title === 'string'">
                        <slot name="title-before" />
                        <slot name="title-inner" :title="title"><span class="text-weight-light">{{title}}</span></slot>
                        <slot name="title-after" />
                    </q-toolbar-title>
                </slot>
                <!--<slot name="caption">
                    <div class="cimpl-page-header-caption" v-if="typeof caption === 'string'">
                        <slot name="caption-inner" :caption="caption">{{caption}}</slot>
                    </div>
                </slot>-->
                <slot name="toolbar-extra">
                    <slot name="toolbar-extra-before" />
                    <slot name="toolbar-extra-inner" />
                    <slot name="toolbar-extra-after" />
                    <!--<q-btn v-for="(cT,cTName) in parsedTools"
                        flat
                        round
                        dense
                        :key="cT"
                        :icon="cT.icon"
                        @click="cT.click(this)"
                        :class="'header-tool-'+cTName"
                    >
                        <q-tooltip>{{cT.tooltip}}</q-tooltip>
                    </q-btn>-->
                    <!--<q-btn flat round dense icon="note_add">
                        <q-tooltip>{{$t('gen.actions.create_new_record')}}</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="filter_list_alt">
                        <q-tooltip>{{$t('gen.actions.filter')}}</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="view_week" @click="$melon.appendView(this.viewName)">
                        <q-tooltip>{{$t('gen.actions.sideview_show_in1')}}</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="view_in_ar" __icon="view_timeline">
                        <q-tooltip>{{$t('gen.actions.save_current_view')}}</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="offline_pin" __icon="view_timeline">
                        <q-tooltip>{{$t('gen.actions.save_offline_view')}}</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="delete">
                        <q-tooltip>{{$t('gen.actions.delete_selection')}}</q-tooltip>
                    </q-btn>-->
                </slot>
            </q-toolbar>
            <slot name="crumbs-pre" />
            <slot name="crumbs">
                <q-toolbar inset v-if="crumbs.length">
                    <q-breadcrumbs active-color="white" style="font-size: 16px">
                        <q-breadcrumbs-el label="Home" icon="home" />
                        <q-breadcrumbs-el label="Components" icon="widgets" />
                        <q-breadcrumbs-el label="Toolbar" />
                    </q-breadcrumbs>
                </q-toolbar>
            </slot>
            <slot name="crumbs-post" />
        </div>
    </q-header>
</template>

<script src="./page-header/component.js"></script>
