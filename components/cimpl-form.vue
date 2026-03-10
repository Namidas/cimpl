<template>
  <div
    class="flex cimpl-form"
    :class="formClassess"
  >
    <!--<pre>
      loading: {{loading}}
      submitting: {{submitting}}
    </pre>-->
    <div
      class="cimpl-form-blocker"
      v-if="useFormBlocker"
    />
    <slot
      name="loading"
      v-if="loadingPre && !loadingInner && loadingType !== 'none'"
    >
      <q-inner-loading
        :showing="loading"
        v-if="loadingType === 'float'"
      >
        <slot name="loading-inner">
          <q-spinner
            size="50px"
            color="primary"
          />
        </slot>
      </q-inner-loading>
      <div
        class="cimpl-form-loading-static-wrap text-center q-pa-md q-my-lg rounded-borders"
        v-if="loading && loadingType === 'static'"
      >
        <slot name="loading-inner">
          <q-spinner
            size="50px"
            color="primary"
          />
        </slot>
      </div>
    </slot>
    <q-form
      @submit="onQFormSubmit"
      @reset="onReset"
      @validation-success="onValidationSuccess"
      @validation-error="onValidationError"
      v-bind="qFormProxy"
      class="full-width"
      ref="form"
    >

      <slot
        name="loading"
        v-if="loadingPre && loadingInner && loadingType !== 'none'"
      >
        <q-inner-loading
          :showing="loading"
          v-if="loadingType === 'float'"
        >
          <slot name="loading-inner">
            <q-spinner
              size="50px"
              color="primary"
            />
          </slot>
        </q-inner-loading>
        <div
          class="cimpl-form-loading-static-wrap text-center q-pa-md q-my-lg rounded-borders"
          v-if="loading && loadingType === 'static'"
        >
          <slot name="loading-inner">
            <q-spinner
              size="50px"
              color="primary"
            />
          </slot>
        </div>
      </slot>

      <slot name="schema-default">
        <cimpl-schema
          v-if="schema !== undefined"
          :model-value="modelValue"
          :schema="schema"
          :class="schemaClass"
          :proxy="schemaProxy"
          :mode="mode"
          ref="schema"
          @update:modelValue="(payload) => onSchemaUpdateModelValue(payload)"
          @update:partialModelValue="(payload) => onSchemaUpdatePartialModelValue(payload)"
          @removeModelUpdate="onSchemaRemoveModelUpdate_"
          @modelUpdate="onSchemaModelUpdate"
          @validationError="onSchemaValidationError"
          @validationSuccess="onSchemaValidationSuccess"
        >
          <!--schemaSlots {{schemaSlots(schema.name)}}-->
          <template
            v-for="slotName in schemaSlots(schema.name)"
            :key="slotName"
            #[slotName]="scope"
          >
            <slot
              :name="`schema:${schema.name}:${slotName}`"
              v-bind="scope"
            ></slot>
          </template>
        </cimpl-schema>
      </slot>

      <slot></slot>

      <slot
        name="loading"
        v-if="!loadingPre && loadingInner && loadingType !== 'none'"
      >
        <q-inner-loading
          :showing="loading"
          v-if="loadingType === 'float'"
        >
          <slot name="loading-inner">
            <q-spinner
              size="50px"
              color="primary"
            />
          </slot>
        </q-inner-loading>
        <div
          class="cimpl-form-loading-static-wrap text-center q-pa-md q-my-lg rounded-borders"
          v-if="loading && loadingType === 'static'"
        >
          <slot name="loading-inner">
            <q-spinner
              size="50px"
              color="primary"
            />
          </slot>
        </div>
      </slot>

      <slot
        name="footer"
        v-if="footer"
        :options="footerOptions.proxy"
        :mode="mode"
        :loading="loading"
        :form="instance"
        :submitting="submitting"
        :controlsCols="footerOptions.notifications.count ? 6 : 12"
        :footerIsVisible="footerIsVisible"
        :enableSubmit="enableFooterButtonSubmit"
        :notifications="footerOptions.notifications"
      >

        <cimpl-form-footer
          class="full-width-q-padding"
          :mode="mode"
          :loading="loading"
          :submitting="submitting"
          ref="footer"
          :controls-cols="footerOptions.notifications.count ? 6 : 12"
          v-bind="footerOptions.proxy"
          v-if="footerIsVisible"
          :enableSubmit="enableFooterButtonSubmit"
          v-life-cycle="{
            mounted: footerIsMounted,
            beforeUnmount: footerIsUnmounted,
          }"
          @submit="onFooterSubmit"
          @reset="onReset"
          @notification:click="onNotificationClick"
          :notifications="footerOptions.notifications"
        >
          <template #extra>
            <div class="cimpl-form-footer-bg"></div>
          </template>
          <!--<template #controls-pre v-if="Object.keys(footerChips).length">
            <div class="cimpl-form-footer-updates flex">
              <div class="cimpl-form-footer-updates-title">
                {{ $t(Object.keys(validation_errors_by_model).length ? 'gen.form.errors_list' : 'gen.form.updates_list') }}:
              </div>
              <q-chip v-for="(chipData, chipModel) in footerChips" :key="chipModel" size="xs" clickable @click="onFooterChipClick(chipData)" v-bind="footerChipProps(chipData)">
                <q-avatar color="red-9" text-color="white" v-if="chipData.messages.length > 1">{{chipData.messages.length}}</q-avatar>
                {{ chipData.label.toUpperCase() }}

                <q-tooltip v-if="chipData.messages.length" :style="`${chipData.type === 'error' ? 'background: var(--q-negative);' : ''};`">
                  <ul style="margin: 0;padding-left: 10px;" v-if="chipData.messages.length > 1">
                    <li v-for="(message,index) in chipData.messages" :key="index">
                      {{$t(message,{value:chipData.value})}}
                    </li>
                  </ul>
                  <span v-else>{{$t(chipData.messages[0],{value:chipData.value})}}</span>
                </q-tooltip>
              </q-chip>
            </div>
            <q-space />
          </template>-->
        </cimpl-form-footer>
        <!--<div class="cimpl-form-footer-placeholder" v-else></div>-->
      </slot>
    </q-form>

    <slot
      name="loading"
      v-if="!loadingPre && !loadingInner && loadingType !== 'none'"
    >
      <q-inner-loading
        :showing="loading"
        v-if="loadingType === 'float'"
      >
        <slot name="loading-inner">
          <q-spinner
            size="50px"
            color="primary"
          />
        </slot>
      </q-inner-loading>
      <div
        class="cimpl-form-loading-static-wrap text-center q-pa-md q-my-lg rounded-borders"
        v-if="loading && loadingType === 'static'"
      >
        <slot name="loading-inner">
          <q-spinner
            size="50px"
            color="primary"
          />
        </slot>
      </div>
    </slot>
  </div>
</template>

<script src="./form/component.js"></script>
