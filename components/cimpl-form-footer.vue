<template>
  <!--cimpl-form-footer notifications<br />
  <vue-json-pretty :data="notifications" class="row col-12" /><br />-->
  <div class="flex q-pa-md cimpl-form-footer" :class="`mode-${mode} ${border ? 'has-border':''}`">
    <slot>
      <div :class="`full-width flex wrapper row`" v-if="mode === 'edit' || mode === 'create'">
        <slot name="notifications" v-if="notifications.count">
          <div class="notifications-wrapper row" :class="notificationsWrapperClass">
            <slot v-for="(sourceName,sourceIndex) in notificationSources" :key="sourceIndex" :name="`notifications-${sourceName}`">
              <!--<q-separator vertical spaced v-if="sourceIndex && notifications[`${sourceName}_count`] != notifications.count" />-->
              <div class="cimpl-form-footer-notifications col-6" :class="sourceName" v-if="notifications[`${sourceName}_count`]">
                <div class="cimpl-form-footer-notifications-title">
                    <slot :name="`notifications-${sourceName}-title`"><span>{{ $t(`form.${sourceName}.list`)}}</span></slot>
                </div>
                <q-chip v-for="(chipData, chipModel) in notifications[sourceName]" :key="chipModel" size="xs" clickable @click="onNotificationClick(chipData,sourceName)" v-bind="chipData.props">
                  <q-avatar style="background: rgba(0,0,0,.3);" text-color="white" v-if="chipData.messages.length > 1">{{chipData.messages.length}}</q-avatar>
                  {{ chipData.label.toUpperCase() }}
                  <q-tooltip v-if="chipData.messages.length" :style="`${chipData.type === 'error' ? 'background: var(--q-' + chipData.props.color + ');' : ''};`">
                    <ul style="margin: 0;padding-left: 10px;" v-if="chipData.messages.length > 1">
                      <li v-for="(message,index) in chipData.messages" :key="index">
                        {{$t(message,{value:chipData.value})}}
                      </li>
                    </ul>
                    <span v-else>{{$t(chipData.messages[0],{value:chipData.value})}}</span>
                  </q-tooltip>
                </q-chip>
              </div>
            </slot>
          </div>
          <q-space />
        </slot>
        <slot name="controls">
          <div :class="`flex controls-wrapper col-${controlsCols} justify-${align}`">
          <q-btn
            :label="submitLabel_parsed"
            color="primary"
            :loading="loading || submitting" ref="submit" @click="submit"
            :disabled="!enableSubmit"
            v-if="useSubmit"
            >
            <template v-slot:loading>
              <q-spinner-hourglass />
            </template>
          </q-btn>

          <q-btn icon="restart_alt" @click="reset" style="margin-left: 20px;"
            :label="resetLabel_parsed"
            :loading="loading || submitting"
            :disabled="!enableReset"
            v-if="useReset"
            >
            <template v-slot:loading>
              <q-spinner-hourglass />
            </template>
            <q-tooltip>{{ $t('form.reset_hint') }}</q-tooltip>
          </q-btn>

          <!--<q-btn
              :label="$t('gen.actions.view_record')"
              color="primary"
              icon="more"
              @click="goto('view')"
              style="float:right"
              v-if="mode === 'edit'"
            />-->
          </div>
        </slot>
        <slot name="controls-post"></slot>
      </div>
      <div class="wrapper" v-if="mode === 'view'">
        <q-btn :label="$t('gen.actions.edit_record')" color="primary" icon="edit" @click="goto('edit')"
          style="float:right" />
      </div>
    </slot>

    <slot name="extra"></slot>
  </div>
</template>

<script src="./form-footer/component.js"></script>
